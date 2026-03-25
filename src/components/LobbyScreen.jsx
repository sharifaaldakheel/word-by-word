import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createPlayer } from "../services/player.js";
import { subscribeLeaderboard } from "../services/leaderboard.js";

const AVATARS_URLS = [
  "https://firebasestorage.googleapis.com/v0/b/word-by-word-b3bcb.firebasestorage.app/o/Avatars%2FAvatar1.png?alt=media&token=3245f31d-13c9-42de-85a3-b9a4070fbd59",
  "https://firebasestorage.googleapis.com/v0/b/word-by-word-b3bcb.firebasestorage.app/o/Avatars%2FAvatar2.png?alt=media&token=98d970d1-3a09-409e-a346-d1d4761ecd9c",
  "https://firebasestorage.googleapis.com/v0/b/word-by-word-b3bcb.firebasestorage.app/o/Avatars%2FAvatar3.png?alt=media&token=daf736ad-b984-49e1-9a49-7b63c0cf8367",
  "https://firebasestorage.googleapis.com/v0/b/word-by-word-b3bcb.firebasestorage.app/o/Avatars%2FAvatar4.png?alt=media&token=a67a5f4f-42da-4e5c-9d20-e64bc6ed78d4",
  "https://firebasestorage.googleapis.com/v0/b/word-by-word-b3bcb.firebasestorage.app/o/Avatars%2FAvatar5.png?alt=media&token=21f883f1-d6d2-43c9-acbf-953a18577692",
];

function getRandomAvatar() {
  return AVATARS_URLS[Math.floor(Math.random() * AVATARS_URLS.length)];
}

function ordinal(rank) {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";
  return `${rank}th`;
}

export default function LobbyScreen({ onNext }) {
  const { t } = useTranslation();
  const [playerName, setPlayerName] = useState("");
  const [playerAvatar] = useState(() => getRandomAvatar());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const unsub = subscribeLeaderboard(setLeaderboard);
    return unsub;
  }, []);

  const podium = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const handleStart = async () => {
    if (!playerName.trim() || loading) return;
    setError(null);
    setLoading(true);
    try {
      const id = await createPlayer({
        name: playerName.trim(),
        avatarUrl: playerAvatar,
        score: 0,
        createdAt: new Date(),
      });
      localStorage.setItem("playerId", id);
      onNext({ name: playerName.trim(), avatarUrl: playerAvatar });
    } catch (err) {
      console.error("Failed to create player:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="screen-card">
      <div className="card">
        <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>
          <h1
            className="screen-title"
            style={{
              marginBottom: "1rem",
              fontFamily: "Pixelify Sans",
              fontSize: "2rem",
              color: "#da7422",
            }}
          >
            {t("lobbyTitle")}
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div className="avatar-circle" style={{ marginBottom: "1rem" }}>
              <img src={playerAvatar} alt="Your avatar" />
            </div>
          </div>

          <input
            className="input-field"
            type="text"
            placeholder={t("enterName")}
            value={playerName}
            maxLength={20}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />

          {error && (
            <p
              style={{
                color: "var(--error, red)",
                fontSize: "0.85rem",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
        </div>

        <p className="leaderboard-title">{t("leaderboard")}</p>

        {/* Podium */}
        {podium.length > 0 && (
          <div className="leaderboard-podium" style={{ marginTop: "0.75rem" }}>
            {[podium[1], podium[0], podium[2]].filter(Boolean).map((p) => (
              <div key={p.id} className="podium-player">
                <img
                  src={p.avatarUrl || p.avatar}
                  alt={p.name}
                  className={`podium-avatar ${p.rank === 1 ? "first" : p.rank === 2 ? "second" : "third"}`}
                />
                <span className="podium-name">{p.name}</span>
                <span className="podium-rank">{ordinal(p.rank)}</span>
                <span className="podium-pts">
                  {p.score} {t("pts")}
                </span>
              </div>
            ))}
          </div>
        )}

        {podium.length > 0 && rest.length > 0 && (
          <div className="divider" style={{ margin: "0.85rem 0 0.6rem" }} />
        )}

        {/* 4th & 5th */}
        {rest.length > 0 && (
          <div className="leaderboard-list">
            {rest.map((p) => (
              <div key={p.id} className="leaderboard-row">
                <span className="leaderboard-row-rank">{ordinal(p.rank)}</span>
                <span className="leaderboard-row-name">{p.name}</span>
                <span className="leaderboard-row-pts">
                  {p.score} {t("pts")}
                </span>
              </div>
            ))}
          </div>
        )}

        {leaderboard.length === 0 && (
          <p
            style={{
              textAlign: "center",
              opacity: 0.45,
              fontSize: "0.85rem",
              padding: "0.75rem 0",
            }}
          >
            {t("noScores")}
          </p>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={handleStart}
        disabled={!playerName.trim() || loading}
        style={{ opacity: playerName.trim() && !loading ? 1 : 0.5 }}
      >
        {loading ? t("loading") : t("moveToInstructions")}
      </button>
    </div>
  );
}
