export type Messages = Record<string, any>;

export async function loadMessages(locale: string): Promise<Messages> {
  const messages = await import(`../messages/${locale}.json`).then(m => m.default);
  return messages as Messages;
}


