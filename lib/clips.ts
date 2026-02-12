import { supabase, Clip, TABLES } from './supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UploadClipParams {
  file: File;
  userId: string;
  title?: string;
  description?: string;
  isPublic?: boolean;
  onProgress?: (stage: string, progress: number) => void;
}

export interface UploadClipResult {
  success: boolean;
  clipId?: string;
  error?: string;
}

interface S3UploadResponse {
  success: boolean;
  videoUploadUrl?: string;
  thumbnailUploadUrl?: string;
  videoKey?: string;
  thumbnailKey?: string;
  error?: string;
}

const MAX_DURATION_SECONDS = 45;
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
const S3_BUCKET = 'gamerplug-gameplay-videos';
const S3_REGION = 'us-east-2';

// ─── Video Helpers ───────────────────────────────────────────────────────────

/**
 * Get video duration using HTML5 Video element
 */
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(Math.round(video.duration));
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Generate a thumbnail from a video file using Canvas
 * Captures a frame at 1.5 seconds into the video
 */
export function generateThumbnail(file: File, timeSeconds = 1.5): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      // Clamp seek time to video duration
      const seekTime = Math.min(timeSeconds, video.duration * 0.5);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            resolve(blob);
          },
          'image/jpeg',
          0.8
        );
      } catch {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };

    video.src = objectUrl;
  });
}

// ─── S3 Upload ───────────────────────────────────────────────────────────────

/**
 * Get presigned upload URLs from the Supabase edge function
 */
async function getPresignedUrls(params: {
  clipId: string;
  userId: string;
  fileType: string;
  fileSize: number;
}): Promise<S3UploadResponse> {
  const { data, error } = await supabase.functions.invoke('s3-presigned-urls', {
    body: {
      action: 'upload',
      clipId: params.clipId,
      userId: params.userId,
      fileType: params.fileType,
      fileSize: params.fileSize,
    },
  });

  if (error) {
    return { success: false, error: `Failed to get upload URLs: ${error.message}` };
  }

  if (!data.success) {
    return { success: false, error: data.error || 'Failed to generate presigned URLs' };
  }

  return {
    success: true,
    videoUploadUrl: data.videoUploadUrl,
    thumbnailUploadUrl: data.thumbnailUploadUrl,
    videoKey: data.videoKey,
    thumbnailKey: data.thumbnailKey,
  };
}

/**
 * Upload a file to S3 using a presigned URL
 */
async function uploadToPresignedUrl(
  data: Blob,
  presignedUrl: string,
  contentType: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(presignedUrl, {
      method: 'PUT',
      body: data,
      headers: { 'Content-Type': contentType },
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: `Upload failed: ${res.status} ${text}` };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: `Upload failed: ${message}` };
  }
}

/**
 * Generate public S3 URL from key
 */
function getPublicUrl(key: string): string {
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

// ─── Main Upload Function ────────────────────────────────────────────────────

/**
 * Full clip upload flow:
 * 1. Validate video (duration, size)
 * 2. Generate thumbnail from video
 * 3. Create DB record
 * 4. Get presigned URLs
 * 5. Upload video + thumbnail to S3
 * 6. Update DB with final URLs
 */
export async function uploadClip(params: UploadClipParams): Promise<UploadClipResult> {
  const {
    file,
    userId,
    title = 'Gameplay Clip',
    description = 'Uploaded clip',
    isPublic = true,
    onProgress,
  } = params;

  try {
    // ── Validate ──────────────────────────────────────────────────────────
    onProgress?.('Validating video...', 0);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { success: false, error: 'File size exceeds 100MB limit.' };
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';

    let duration: number | null = null;
    try {
      duration = await getVideoDuration(file);
      if (duration > MAX_DURATION_SECONDS) {
        return {
          success: false,
          error: `Video duration (${duration}s) exceeds the ${MAX_DURATION_SECONDS}-second limit.`,
        };
      }
    } catch {
      // Duration check failed — continue without it
    }

    // ── Generate thumbnail ────────────────────────────────────────────────
    onProgress?.('Generating thumbnail...', 15);

    const thumbnailBlob = await generateThumbnail(file);

    // ── Create DB record ──────────────────────────────────────────────────
    onProgress?.('Preparing upload...', 25);

    const { data: clipData, error: clipError } = await supabase
      .from(TABLES.CLIPS)
      .insert({
        user_id: userId,
        title,
        description,
        video_url: '',
        thumbnail_url: '',
        duration,
        file_size: file.size,
        file_type: fileExt,
        is_public: isPublic,
      })
      .select()
      .single();

    if (clipError || !clipData) {
      return { success: false, error: `Database error: ${clipError?.message}` };
    }

    const clipId = clipData.id;

    // ── Get presigned URLs ────────────────────────────────────────────────
    onProgress?.('Getting upload URLs...', 35);

    const urlsResponse = await getPresignedUrls({
      clipId,
      userId,
      fileType: fileExt,
      fileSize: file.size,
    });

    if (!urlsResponse.success || !urlsResponse.videoUploadUrl || !urlsResponse.videoKey) {
      // Clean up DB record
      await supabase.from(TABLES.CLIPS).delete().eq('id', clipId);
      return { success: false, error: urlsResponse.error || 'Failed to get upload URLs' };
    }

    // ── Upload video ──────────────────────────────────────────────────────
    onProgress?.('Uploading video...', 45);

    const videoResult = await uploadToPresignedUrl(
      file,
      urlsResponse.videoUploadUrl,
      `video/${fileExt}`
    );

    if (!videoResult.success) {
      await supabase.from(TABLES.CLIPS).delete().eq('id', clipId);
      return { success: false, error: videoResult.error };
    }

    // ── Upload thumbnail ──────────────────────────────────────────────────
    onProgress?.('Uploading thumbnail...', 80);

    let thumbnailUploaded = false;
    if (thumbnailBlob && urlsResponse.thumbnailUploadUrl) {
      const thumbResult = await uploadToPresignedUrl(
        thumbnailBlob,
        urlsResponse.thumbnailUploadUrl,
        'image/jpeg'
      );
      thumbnailUploaded = thumbResult.success;
    }

    // ── Update DB with URLs ───────────────────────────────────────────────
    onProgress?.('Finalizing...', 95);

    const videoUrl = getPublicUrl(urlsResponse.videoKey);
    const thumbnailUrl =
      thumbnailUploaded && urlsResponse.thumbnailKey
        ? getPublicUrl(urlsResponse.thumbnailKey)
        : '';

    const { error: updateError } = await supabase
      .from(TABLES.CLIPS)
      .update({ video_url: videoUrl, thumbnail_url: thumbnailUrl })
      .eq('id', clipId);

    if (updateError) {
      return { success: false, error: `Failed to update clip URLs: ${updateError.message}` };
    }

    onProgress?.('Complete!', 100);

    return { success: true, clipId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: `Upload failed: ${message}` };
  }
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteClip(clipId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from(TABLES.CLIPS).delete().eq('id', clipId);

    if (error) {
      return { success: false, error: `Failed to delete clip: ${error.message}` };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: `Failed to delete clip: ${message}` };
  }
}

// ─── Fetch ───────────────────────────────────────────────────────────────────

export async function getUserClips(userId: string): Promise<{ success: boolean; clips?: Clip[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from(TABLES.CLIPS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, clips: data || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
