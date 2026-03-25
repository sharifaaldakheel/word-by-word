import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        gameGuessing: "Game Guessing",
        wordByword: "Word-by-Word",

        joinGame: "Join Game",

        lobbyTitle: "Game Lobby",
        enterName: "Enter your name",
        leaderboard: "LeaderBoard",
        noScores: "No scores yet — be the first!",
        moveToInstructions: "Move to Instructions",
        loading: "Loading…",
        pts: "pts",
        st: "1st",
        nd: "2nd",
        rd: "3rd",
        th4: "4th",
        th5: "5th",

        instructionsTitle: "Instructions",
        instruction1:
          "The question reveals itself word by word — read carefully as each word appears.",
        instruction2:
          "You can answer at any time — the earlier you answer correctly, the more points you earn.",
        instruction3:
          "Wrong answers score 0. You cannot change your answer once submitted.",
        instruction4:
          "The leaderboard updates live — compete with others for the top spot!",
        startGame: "Start the Game",

        question: "QUESTION",
        words: "words",
        correct: "Correct!",
        wrong: "Wrong!",
        answer: "Answer",

        gameStar: "Game Star",
        almostThere: "Almost There",
        tryAgain: "Try Again",
        youAnswered: "You answered",
        correctly: "correctly",
        outOf: "out of",
        backHome: "Back Home",
        yourScore: "Your Score",
      },
    },
    ar: {
      translation: {
        gameGuessing: "لعبة التخمين",
        wordByword: "كلمة بكلمة",
        joinGame: "انضم إلى اللعبة",

        lobbyTitle: "غرفة اللعب",
        enterName: "أدخل اسمك",
        leaderboard: "لوحة المتصدرين",
        noScores: "لا توجد نقاط بعد — كن الأول!",
        moveToInstructions: "انتقل إلى التعليمات",
        loading: "جارٍ التحميل…",
        pts: "نقطة",
        st: "الأول",
        nd: "الثاني",
        rd: "الثالث",
        th4: "الرابع",
        th5: "الخامس",

        instructionsTitle: "التعليمات",
        instruction1: "يُكشف السؤال كلمةً بكلمة — اقرأ بعناية مع ظهور كل كلمة.",
        instruction2:
          "يمكنك الإجابة في أي وقت — كلما أجبت مبكراً بشكل صحيح، زادت نقاطك.",
        instruction3:
          "الإجابات الخاطئة تحصل على 0 نقطة. لا يمكنك تغيير إجابتك بعد تقديمها.",
        instruction4:
          "تتحدث لوحة المتصدرين مباشرةً — تنافس مع الآخرين للوصول إلى القمة!",
        startGame: "ابدأ اللعبة",

        question: "السؤال",
        words: "كلمات",
        correct: "صحيح!",
        wrong: "خطأ!",
        answer: "الإجابة",

        gameStar: "نجم اللعبة",
        almostThere: "قربت!",
        tryAgain: "حاول مجددًا",
        youAnswered: "لقد أجبت على",
        correctly: "بشكل صحيح",
        outOf: "من أصل",
        backHome: "العودة للرئيسية",
        yourScore: "نقاطك",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
