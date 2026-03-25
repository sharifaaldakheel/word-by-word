import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { updatePlayerScore } from "../services/player.js";

const WORD_INTERVAL_MS = 800;
const FEEDBACK_DELAY_MS = 1500;

function calcPoints(wordsRevealed, totalWords) {
  if (totalWords <= 1) return 10;
  return Math.round((1 - (wordsRevealed - 1) / (totalWords - 1)) * 9) + 1;
}

function difficultyBadgeStyle(label = "") {
  const l = label.toLowerCase().trim();
  if (l === "easy" || l === "سهل") {
    return { background: "#d1fae5", color: "#065f46" }; 
  }
  if (l === "medium" || l === "متوسط") {
    return { background: "#fef9c3", color: "#854d0e" }; 
  }

  return { background: "#fee2e2", color: "#991b1b" }; 
}

export default function QuestionScreen({ questions = [], onFinish }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [qIndex, setQIndex] = useState(0);
  const [wordsRevealed, setWordsRevealed] = useState(1);
  const [frozenWords, setFrozenWords] = useState(null);
  const [isRevealing, setIsRevealing] = useState(true);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const revealRef = useRef(null);
  const advanceRef = useRef(null);
  const totalPointsRef = useRef(0);
  const correctCountRef = useRef(0);

  const question = questions[qIndex];

  // Revealing words 
  useEffect(() => {
    if (!question) return;
    setWordsRevealed(1);
    setFrozenWords(null);
    setIsRevealing(true);
    setSelected(null);
    setAnswered(false);
    clearInterval(revealRef.current);
    clearTimeout(advanceRef.current);

    revealRef.current = setInterval(() => {
      setWordsRevealed((w) => {
        if (w >= question.words.length) {
          clearInterval(revealRef.current);
          setIsRevealing(false);
          return w;
        }
        return w + 1;
      });
    }, WORD_INTERVAL_MS);

    return () => {
      clearInterval(revealRef.current);
      clearTimeout(advanceRef.current);
    };
  }, [qIndex, question]);

  // if timer finished but user hansn't answered
  useEffect(() => {
    if (!isRevealing && !answered) {
      setFrozenWords(question?.words.length ?? 0);
      setAnswered(true);
      setSelected(null);
      scheduleAdvance(totalPointsRef.current, correctCountRef.current);
    }
  }, [isRevealing]);

  function scheduleAdvance(pts, correct) {
    advanceRef.current = setTimeout(
      () => goNext(pts, correct),
      FEEDBACK_DELAY_MS,
    );
  }

  // answer selection
  function handleSelect(idx) {
    if (answered) return;
    //stop the timer and freeze the words if answered
    clearInterval(revealRef.current);

    const frozen = wordsRevealed;
    setFrozenWords(frozen);
    setIsRevealing(false);
    setSelected(idx);
    setAnswered(true);

    let newPoints = totalPointsRef.current;
    let newCorrect = correctCountRef.current;

    if (idx === question.correctIndex) {
      const pts = calcPoints(frozen, question.words.length);
      newPoints = totalPointsRef.current + pts;
      newCorrect = correctCountRef.current + 1;
      setTotalPoints(newPoints);
      setCorrectCount(newCorrect);
      totalPointsRef.current = newPoints;
      correctCountRef.current = newCorrect;
    }

    scheduleAdvance(newPoints, newCorrect);
  }

  async function goNext(pts, correct) {
    if (qIndex + 1 >= questions.length) {
      const playerId = localStorage.getItem("playerId");
      if (playerId) {
        try {
          await updatePlayerScore(playerId, pts);
        } catch (err) {
          console.error("Failed to update score:", err);
        }
      }
      onFinish(pts, correct, questions.length);
    } else {
      setQIndex((i) => i + 1);
    }
  }

  if (!question) {
    return (
      <div
        className="screen-card"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <p>No questions available.</p>
      </div>
    );
  }

  const displayWords =
    frozenWords !== null
      ? question.words.slice(0, frozenWords)
      : question.words.slice(0, wordsRevealed);
  const isCorrect = selected === question.correctIndex;
  const pointsEarned =
    answered && isCorrect && frozenWords !== null
      ? calcPoints(frozenWords, question.words.length)
      : 0;
  const progressPct =
    ((frozenWords ?? wordsRevealed) / question.words.length) * 100;
  const badgeStyle = difficultyBadgeStyle(question.difficultyLabel);

  // answer options statuses
  function optionClass(idx) {
    if (!answered) return "option-btn";
    if (idx === question.correctIndex) return "option-btn reveal-correct";
    if (idx === selected && !isCorrect) return "option-btn selected-wrong";
    return "option-btn";
  }

  return (
    <div
      className="screen-card"
      style={
        isArabic ? { fontFamily: "'IBM Plex Sans Arabic', sans-serif" } : {}
      }
    >
      <div className="card">
        <div className="question-header">
          <span
            className="question-label"
            style={{
              fontFamily: "Pixelify Sans",
              fontSize: "2rem",
              color: "#da7422",
            }}
          >
            {t("question")} {qIndex + 1}
          </span>
          <div className="question-indicator">
            {qIndex + 1}/{questions.length}
          </div>
        </div>

        <div
          className="timer-bar-wrap"
          role="progressbar"
          aria-valuenow={frozenWords ?? wordsRevealed}
          aria-valuemax={question.words.length}
        >
          <div
            className="timer-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Difficulty badge + word counter */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0.35rem 0 0.6rem",
          }}
        >
          {question.difficultyLabel ? (
            <span
              style={{
                ...badgeStyle,
                fontSize: "0.72rem",
                fontWeight: 600,
                padding: "0.2rem 0.65rem",
                borderRadius: "999px",
                letterSpacing: "0.03em",
              }}
            >
              {question.difficultyLabel}
            </span>
          ) : (
            <span />
          )}
          <span style={{ fontSize: "0.75rem", opacity: 0.55 }}>
            {frozenWords ?? wordsRevealed} / {question.words.length}{" "}
            {t("words")}
          </span>
        </div>

        <p className="question-text" style={{ minHeight: "3.5rem" }}>
          {displayWords.join(" ")}
          {frozenWords === null && wordsRevealed < question.words.length && (
            <span style={{ opacity: 0.3 }}> …</span>
          )}
        </p>

        <div className="options-grid">
          {question.choices.map((choice, idx) => (
            <button
              key={idx}
              className={optionClass(idx)}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            >
              {choice}
            </button>
          ))}
        </div>

        {answered && (
          <div className={`feedback-bar ${isCorrect ? "correct" : "wrong"}`}>
            {isCorrect
              ? `${t("correct")} +${pointsEarned} ${t("pts")}`
              : `${t("wrong")} ${t("answer")}: ${question.choices[question.correctIndex]}`}
          </div>
        )}
      </div>
    </div>
  );
}
