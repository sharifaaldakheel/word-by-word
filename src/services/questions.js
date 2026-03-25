import { db } from "../lib/firebase.js";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const fetchQuestions = async (lang = "en") => {
  const q = query(collection(db, "questions"), orderBy("difficulty"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("No questions found in the database.");
  }

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    let locale = data[lang];
    if (!locale || !locale.words || locale.words.length === 0) {
      console.warn(
        `[questions] doc ${docSnap.id}: "${lang}" locale missing or has no words — falling back to "ar"`,
      );
      locale = data["ar"];
    }

    if (!locale) {
      throw new Error(
        `Document ${docSnap.id} is missing both "${lang}" and "ar" maps.`,
      );
    }

    const question = locale.question ?? "";
    const difficultyLabel = locale.difficultyLabel ?? "";
    const answer = (locale.answer ?? "").trim();
    const words = (locale.words ?? []).map((w) => w.trim()).filter(Boolean);

    const rawChoices = (locale.choices ?? []).map((c) => c.trim());
    const correctIndex = rawChoices.findIndex((c) => c === answer);

    if (correctIndex === -1) {
      console.warn(
        `[questions] doc ${docSnap.id}: answer "${answer}" not found in choices`,
        rawChoices,
      );
    }

    // Shuffle choices and update correctIndex to match new position
    const indices = rawChoices.map((_, i) => i);
    const shuffledIndices = shuffle(indices);
    const choices = shuffledIndices.map((i) => rawChoices[i]);
    const newCorrectIndex = shuffledIndices.indexOf(correctIndex);

    return {
      id: docSnap.id,
      question,
      choices,
      correctIndex: newCorrectIndex,
      difficultyLabel,
      words,
      wordCount: data.wordCount ? Number(data.wordCount) : words.length,
      difficulty: data.difficulty ?? 0,
    };
  });
};
