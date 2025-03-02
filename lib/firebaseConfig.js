import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAY2pl4yvRC9Agy1GqIl6JMQs3qCMiUbyc",
  authDomain: "jooevent-50e2d.firebaseapp.com",
  databaseURL: "https://jooevent-50e2d-default-rtdb.firebaseio.com",
  projectId: "jooevent-50e2d",
  storageBucket: "jooevent-50e2d.firebasestorage.app",
  messagingSenderId: "178081888166",
  appId: "1:178081888166:web:5b1d4cf400ae7ed70dc167",
  measurementId: "G-BZB1LKRF1H",
  databaseURL: "https://jooevent-50e2d-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database, app };
