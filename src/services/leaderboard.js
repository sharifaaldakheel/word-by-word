import { db } from "../lib/firebase.js";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getCountFromServer,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const COLLECTION = "leaderboard";

export async function computeRank(score) {
  const q = query(collection(db, COLLECTION), where("score", ">", score));
  const snap = await getCountFromServer(q);
  return snap.data().count + 1;
}


// Top 5 players leaderboard based on score
export const subscribeLeaderboard = (callback) => {
  const q = query(
    collection(db, COLLECTION),
    orderBy("score", "desc"),
    limit(5),
  );

  return onSnapshot(q, (snapshot) => {
    const players = snapshot.docs.map((doc, i) => ({
      id: doc.id,
      ...doc.data(),
      rank: i + 1,
    }));
    callback(players);
  });
};

export async function saveScore({ name, score, avatarUrl }) {
  const auth = getAuth();
  const uid = auth.currentUser?.uid ?? null;

  const rank = await computeRank(score);

  const docRef = await addDoc(collection(db, COLLECTION), {
    name,
    score,
    avatarUrl,
    rank,
    uid,
    timestamp: serverTimestamp(),
  });

  return { docId: docRef.id, rank };
}
