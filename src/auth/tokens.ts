import * as SecureStore from "expo-secure-store";
export interface TokenPair { accessToken: string; refreshToken: string }
const ACCESS = "manarythu.access"; const REFRESH = "manarythu.refresh";
export const tokenStore = {
  async get(): Promise<TokenPair | null> { const [accessToken, refreshToken] = await Promise.all([SecureStore.getItemAsync(ACCESS), SecureStore.getItemAsync(REFRESH)]); return accessToken && refreshToken ? { accessToken, refreshToken } : null; },
  async set(tokens: TokenPair) { await Promise.all([SecureStore.setItemAsync(ACCESS, tokens.accessToken), SecureStore.setItemAsync(REFRESH, tokens.refreshToken)]); },
  async clear() { await Promise.all([SecureStore.deleteItemAsync(ACCESS), SecureStore.deleteItemAsync(REFRESH)]); },
};
