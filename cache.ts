import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"
import { TokenCache } from "@clerk/clerk-expo/dist/cache"

const createTokenCache = (): TokenCache => {
    return {
        getToken: async (key: string) => {
            try {
                const cachedToken = await SecureStore.getItemAsync(key)
                if (cachedToken) {
                    return cachedToken
                } else {
                    console.log('No cached token found for key:', key)
                }
            } catch (error) {
                console.error('Error retrieving cached token:', error)
            }
        },
        saveToken: async (key: string, token: string) => {
            return SecureStore.setItemAsync(key, token)
        }
    }
}

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined