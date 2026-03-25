import { db } from "../lib/firebase.js";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

export const createPlayer = async (player) => {
  const docRef = await addDoc(collection(db, "players"), {
    ...player,
    avatarUrl: player.avatarUrl ?? player.avatar ?? "",
  });
  return docRef.id;
};

export const getPlayer = async (playerId) => {
  const docRef = doc(db, "players", playerId);
  const snap   = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updatePlayerScore = async (playerId, score) => {
  const docRef = doc(db, "players", playerId);
  await updateDoc(docRef, { score });
};