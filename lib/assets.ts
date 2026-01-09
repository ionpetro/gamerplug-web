/**
 * Asset URL utilities for CloudFront CDN
 * Generates URLs for game and platform assets hosted on S3/CloudFront
 */

const CLOUDFRONT_DOMAIN = 'd11fcxbq4rxmpu.cloudfront.net';

/**
 * Map game display names to S3 filenames
 * Some games have different filenames in S3 than their normalized display names
 */
const getGameFileName = (gameName: string): string => {
  // Normalize input for case-insensitive matching
  const normalizedInput = gameName.trim();
  
  // Map display names to actual S3 filenames (case-insensitive)
  const gameMap: { [key: string]: string } = {
    'apex legends': 'apex.png',
    'overwatch 2': 'overwatch.png',
    'overwatch2': 'overwatch.png',
    'battlefield 6': 'battle-field-6.png',
    'battlefield-6': 'battle-field-6.png',
    'battle-field-6': 'battle-field-6.png',
    'league of legends': 'league-of-legends.png',
    'pubg': 'pubg.png',
    'fortnite': 'fortnite.png',
    'call of duty': 'call-of-duty.png',
    'marvel rivals': 'marvel-rivals.png',
    'rocket league': 'rocket-league.png',
    'counter-strike-2': 'cs2.png',
    'cs2': 'cs2.png',
    'valorant': 'valorant.png',
  };
  
  // Check direct mapping first (case-insensitive)
  const lowerInput = normalizedInput.toLowerCase();
  if (gameMap[lowerInput]) {
    return gameMap[lowerInput];
  }
  
  // Fallback to normalized name
  const normalizedName = normalizedInput.toLowerCase().replace(/\s+/g, '-');
  return `${normalizedName}.png`;
};

/**
 * Get CloudFront URL for a game asset
 * @param gameName - Display name of the game (e.g., "Apex Legends", "Overwatch 2")
 * @returns CloudFront URL for the game icon
 */
export const getGameAssetUrl = (gameName: string): string => {
  const fileName = getGameFileName(gameName);
  return `https://${CLOUDFRONT_DOMAIN}/assets/${fileName}`;
};

/**
 * Map platform display names to S3 filenames
 */
const getPlatformFileName = (platformName: string): string => {
  const platformMap: { [key: string]: string } = {
    'PC': 'PC.png',
    'PS5': 'PS.png',
    'Xbox': 'Xbox.png',
    'Nintendo Switch': 'Nitendo.png', // Note: typo in S3 filename
  };
  
  return platformMap[platformName] || `${platformName}.png`;
};

/**
 * Get CloudFront URL for a platform asset
 * @param platformName - Display name of the platform (e.g., "PC", "PS5", "Xbox", "Nintendo Switch")
 * @returns CloudFront URL for the platform icon
 */
export const getPlatformAssetUrl = (platformName: string): string => {
  const fileName = getPlatformFileName(platformName);
  return `https://${CLOUDFRONT_DOMAIN}/assets/${fileName}`;
};




