import { database } from "@/lib/firebaseConfig";
import {
  ref,
  set,
  get,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  DataSnapshot,
} from "firebase/database";
import { CreateUserDTO, ReadUserDTO } from "@/types/user.types";

// Firebase paths
const USERS_PATH = "users";

// Helper function to encode email for Firebase path
export function encodeEmail(email: string) {
  return email.replace(/\./g, ",");
}

// Helper function to decode Firebase path to email
function decodeEmail(encodedEmail: string) {
  return encodedEmail.replace(/,/g, ".");
}

export class FirebaseUserService {
  /**
   * Creates a new user in Firebase
   * @param userData User data to create
   * @returns The created user data
   */
  async createUser(userData: CreateUserDTO): Promise<ReadUserDTO> {
    try {
      const userId = `user-${Date.now()}`;
      const newUser: ReadUserDTO = {
        ...userData,
        id: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        bookmarkedEvents: [],
        recentlyViewed: [],
        ticketsPurchased: [],
        bookmarkedEventsCount: 0,
        recentlyViewedCount: 0,
        ticketsPurchasedCount: 0,
      };

      const email = userData.email;
      const encodedEmail = encodeEmail(email);

      const userRef = ref(database, `${USERS_PATH}/${encodedEmail}`);
      await set(userRef, newUser);

      return newUser;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }

  /**
   * Updates an existing user in Firebase
   * @param email User email to update
   * @param userData Partial user data to update
   * @returns The updated user data
   */
  async updateUser(
    email: string,
    userData: Partial<ReadUserDTO>
  ): Promise<ReadUserDTO> {
    try {
      // First get the current user data
      const currentUser = await this.fetchUser(email);

      if (!currentUser) {
        throw new Error(`User with email ${email} not found`);
      }

      const updatedUser = {
        ...currentUser,
        ...userData,
        updatedAt: new Date(),
      };

      const encodedEmail = encodeEmail(email);
      const userRef = ref(database, `${USERS_PATH}/${encodedEmail}`);
      await update(userRef, updatedUser);

      return updatedUser;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }

  /**
   * Fetches a user by email from Firebase
   * @param email Email to fetch
   * @returns The user data or null if not found
   */
  async fetchUser(email: string): Promise<ReadUserDTO | null> {
    try {
      const encodedEmail = encodeEmail(email);
      const userRef = ref(database, `${USERS_PATH}/${encodedEmail}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return snapshot.val() as ReadUserDTO;
      } else {
        console.log("No user found with email:", email);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  }

  /**
   * Fetches a user by email from Firebase using a query
   * @param email Email to search for
   * @returns The user data or null if not found
   */
  async fetchUserByEmail(email: string): Promise<ReadUserDTO | null> {
    try {
      const usersRef = ref(database, USERS_PATH);
      const userQuery = query(usersRef, orderByChild("email"), equalTo(email));
      const snapshot = await get(userQuery);

      if (snapshot.exists()) {
        // Get the first user with this email
        const users = snapshot.val();
        const userId = Object.keys(users)[0];
        return users[userId] as ReadUserDTO;
      } else {
        console.log("No user found with email:", email);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch user by email:", error);
      throw error;
    }
  }

  /**
   * Deletes a user from Firebase
   * @param email User email to delete
   */
  async deleteUser(email: string): Promise<void> {
    try {
      const encodedEmail = encodeEmail(email);
      const userRef = ref(database, `${USERS_PATH}/${encodedEmail}`);
      await remove(userRef);
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  }
}

export const firebaseUserService = new FirebaseUserService();
