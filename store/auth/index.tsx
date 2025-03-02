import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { CreateUserDTO, ReadUserDTO } from "@/types/user.types";
import { encodeEmail, firebaseUserService } from "@/services/auth";

const secureStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

// User store state interface
interface UserState {
  // User data
  user: ReadUserDTO | null;
  isAuthenticated: boolean;
  sessionId: string | null;
  authToken: string | null;

  // Actions
  createUser: (userData: CreateUserDTO) => Promise<ReadUserDTO>;
  setUser: (user: ReadUserDTO) => void;
  updateUser: (userData: Partial<ReadUserDTO>) => Promise<void>;
  fetchUser: (userId: string) => Promise<ReadUserDTO | null>;
  login: (authToken: string, user: ReadUserDTO) => void;
  logout: () => Promise<void>;
  clearStorage: () => Promise<void>;
  setSessionId: (sessionId: string) => void;
  getUser: () => ReadUserDTO | null;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      sessionId: null,
      authToken: null,

      createUser: async (userData: CreateUserDTO): Promise<ReadUserDTO> => {
        try {
          const newUser = await firebaseUserService.createUser(userData);
          set({ user: newUser });
          return newUser;
        } catch (error) {
          console.error("Failed to create user:", error);
          throw error;
        }
      },

      setUser: (user: ReadUserDTO) => {
        set({ user, isAuthenticated: !!user });
      },

      updateUser: async (userData: Partial<ReadUserDTO>) => {
        const currentUser = get().user;
        const encodedEmail = encodeEmail(currentUser?.email || "");

        if (currentUser) {
          try {
            const updatedUser = await firebaseUserService.updateUser(
              encodedEmail,
              userData
            );
            set({ user: updatedUser });
          } catch (error) {
            console.error("Failed to update user:", error);
            throw error;
          }
        }
      },

      fetchUser: async (email: string): Promise<ReadUserDTO | null> => {
        try {
          const userData = await firebaseUserService.fetchUser(email);
          if (userData) {
            set({ user: userData, isAuthenticated: true });
          }
          return userData;
        } catch (error) {
          console.error("Failed to fetch user:", error);
          throw error;
        }
      },

      login: (authToken: string, user: ReadUserDTO) => {
        set({
          user,
          authToken,
          isAuthenticated: true,
          sessionId: `session_${Date.now()}`,
        });
      },

      logout: async () => {
        try {
          await get().clearStorage();
          set({
            user: null,
            authToken: null,
            isAuthenticated: false,
            sessionId: null,
          });
        } catch (error) {
          console.error("Failed to logout:", error);
          throw error;
        }
      },

      clearStorage: async () => {
        try {
          await SecureStore.deleteItemAsync("user-state");
        } catch (error) {
          console.error("Failed to clear storage:", error);
          throw error;
        }
      },

      setSessionId: (sessionId: string) => {
        set({ sessionId });
      },

      getUser: () => get().user,
    }),
    {
      name: "user-state",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        authToken: state.authToken,
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId,
      }),
    }
  )
);
