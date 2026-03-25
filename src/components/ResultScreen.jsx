import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { saveScore, subscribeLeaderboard } from "../services/leaderboard.js";

const STATUS = [
  {
    minPct: 0.75,
    labelKey: "Game Star",
    variant: "ace",
    url: "https://firebasestorage.googleapis.com/v0/b/word-by-word-b3bcb.firebasestorage.app/o/Status%2Fstar1.png?alt=media&token=fea47a4b-01f4-46ff-8574-4d80bb2e8269",
  },
  {
    minPct: 0.4,
    labelKey: "AlmostThere",
    variant: "keep",
    url: "https://firebasestorage.googleapis.com/v0/b/word-by-word-b3bcb.firebasestorage.app/o/Status%2Falmost1.png?alt=media&token=767b0593-af40-4764-8df2-681a48fbc744",
  },
  {
    minPct: 0,
    labelKey: "Try Again",
    variant: "oops",
    url: "https://firebasestorage.googleapis.com/v0/b/word-by-word-b3bcb.firebasestorage.app/o/Status%2Fsad1.png?alt=media&token=ac8efe9d-80a2-4dec-a3a4-361412b2bfe1",
  },
];

function getResult(correctCount, totalQ) {
  const pct = totalQ > 0 ? correctCount / totalQ : 0;
  return STATUS.find((s) => pct >= s.minPct);
}

export default function ResultScreen({ player, score, correctCount, totalQ, onPlayAgain }) {
  const { t }  = useTranslation();
  const result = getResult(correctCount, totalQ);

  const [saving,      setSaving]      = useState(true);
  const [myDocId,     setMyDocId]     = useState(null);
  const [myRank,      setMyRank]      = useState(null);
  // const [leaderboard, setLeaderboard] = useState([]);


  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    if (!player?.name) {
      setSaving(false);
      return;
    }

    saveScore({
      name:      player.name,
      score,
      avatarUrl: player.avatarUrl,
    })
      .then(({ docId, rank }) => {
        setMyDocId(docId);
        setMyRank(rank);
      })
      .catch((err) => console.error("Failed to save score:", err))
      .finally(() => setSaving(false));
  }, []);

  // Real-time leaderboard
  // useEffect(() => {
  //   const unsub = subscribeLeaderboard(setLeaderboard);
  //   return unsub;
  // }, []);


  return (
    <div className="screen-card">

      <div className="card result-screen">
        <img
          src={result.url}
          alt={t(result.labelKey)}
          style={{ width: 120, height: 120, objectFit: "contain", marginBottom: "0.5rem" }}
        />

        <h2 className={`result-title ${result.variant}`}>{t(result.labelKey)}</h2>


        <p className="result-sub">
          {t("youAnswered")} <strong>{correctCount}</strong> {t("outOf")} <strong>{totalQ}</strong> {t("correctly")}
        </p>

        <p style={{ fontSize: "1.5rem", fontFamily: "monospace", color: "var(--accent)", fontWeight: 400 }}>
          {score} {t("pts")}
        </p>

        {saving && (
          <p style={{ fontSize: "0.78rem", opacity: 0.5, marginTop: "0.25rem" }}>
            {t("savingScore") ?? "Saving score…"}
          </p>
        )}
        {!saving && myRank && (
          <p style={{ fontSize: "0.85rem", color: "#da7422", fontWeight: 600, marginTop: "0.25rem" }}>
            #{myRank} {t("onLeaderboard") ?? "on the leaderboard"}
          </p>
        )}
      </div>

      <button className="btn-primary" onClick={onPlayAgain} style={{ marginTop: "1rem" }}>
        {t("backHome")}
      </button>
    </div>
  );
}