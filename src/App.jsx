import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import GameHeader from "./components/GameHeader.jsx";
import LobbyScreen from "./components/LobbyScreen.jsx";
import InstructionScreen from "./components/InstructionScreen.jsx";
import QuestionScreen from "./components/QuestionScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { fetchQuestions } from "./services/questions.js";

import DotLottie from "./assets/dotLottie.jsx";
import "./index.css";

const SCREENS = {
  HOME: "home",
  LOBBY: "lobby",
  INSTRUCTION: "instruction",
  QUESTION: "question",
  RESULT: "result",
};

export default function App() {
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState(i18n.language || "en");
  const [stack, setStack] = useState([SCREENS.HOME]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQ, setTotalQ] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [player, setPlayer] = useState({ name: "", avatarUrl: "" });

  const current = stack[stack.length - 1];

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  const push = (screen) => setStack((s) => [...s, screen]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const canGoBack = stack.length > 1;
  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));

  const handleLobby = async ({ name, avatarUrl }) => {
    setPlayer({ name, avatarUrl });

    try {
      const qs = await fetchQuestions(lang);
      setQuestions(qs);
      push(SCREENS.INSTRUCTION);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      push(SCREENS.INSTRUCTION);
    }
  };

  return (
    <>
      <GameHeader
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        onBack={canGoBack ? pop : undefined}
        lang={lang}
        // onToggleLang={toggleLang}
      />

      <div className="page-wrapper">
        {current === SCREENS.HOME && (
          <section id="center">
            <div className="card card-centered">
              <span className="home-label">{i18n.t("gameGuessing")}</span>
              <h1 className="home-title">{i18n.t("wordByword")}</h1>
              <DotLottie />
            </div>

            <button className="btn-primary" onClick={() => push(SCREENS.LOBBY)}>
              {i18n.t("joinGame")}
            </button>

            <button
              className="change-lang-btn"
              onClick={toggleLang}
              style={{
                marginTop: "0.75rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                color: "var(--accent, #da7422)",
                fontFamily: "IBM Plex Sans Arabic, sans-serif",
              }}
            >
              {lang === "en"
                ? "تغيير اللغة إلى العربية"
                : "Change Language to English"}
            </button>
          </section>
        )}

        {current === SCREENS.LOBBY && <LobbyScreen onNext={handleLobby} />}

        {current === SCREENS.INSTRUCTION && (
          <InstructionScreen onNext={() => push(SCREENS.QUESTION)} />
        )}

        {current === SCREENS.QUESTION && (
          <QuestionScreen
            questions={questions}
            onFinish={(finalScore, finalCorrect, questionCount) => {
              setScore(finalScore);
              setCorrectCount(finalCorrect);
              setTotalQ(questionCount);
              push(SCREENS.RESULT);
            }}
          />
        )}

        {current === SCREENS.RESULT && (
          <ResultScreen
            player={player}
            score={score}
            correctCount={correctCount}
            totalQ={totalQ}
            onPlayAgain={() => {
              setStack([SCREENS.HOME]);
              setScore(0);
              setCorrectCount(0);
              setTotalQ(0);
              setQuestions([]);
              setPlayer({ name: "", avatarUrl: "" });
            }}
          />
        )}
      </div>
    </>
  );
}
