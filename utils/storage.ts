
/**
 * Storage key for the Gemini API Key.
 * Scoped to avoid collisions with other apps on localhost.
 */
const STORAGE_KEY = 'cypress_selector_gen_api_key';

export const storage = {
  /**
   * Retrieves the API key from local storage.
   */
  getApiKey: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY);
  },

  /**
   * Saves the API key to local storage.
   * @param key The API key to save
   */
  setApiKey: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, key.trim());
  },

  /**
   * Removes the API key from local storage.
   */
  removeApiKey: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Checks if an API key exists.
   */
  hasApiKey: (): boolean => {
    return !!storage.getApiKey();
  }
};
