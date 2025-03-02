import { getDatabase, ref, set } from "firebase/database";

export const useCreateUser = async (uid: string) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${uid}`);
  await set(userRef, { uid });
};
