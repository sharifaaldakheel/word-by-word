import { useTranslation } from "react-i18next";

export default function InstructionScreen({ onNext }) {
  const { t } = useTranslation();

  const INSTRUCTION_KEYS = ["instruction1", "instruction2", "instruction3", "instruction4"];

  return (
    <div className="screen-card">
      <div className="card">
        <h2
          className="screen-title"
          style={{ marginBottom: "1rem", fontFamily: "Pixelify Sans", fontSize: "2rem", color: "#da7422" }}
        >
          {t("instructionsTitle")}
        </h2>

        <div className="instruction-list">
          {INSTRUCTION_KEYS.map((key, i) => (
            <div key={key} className="instruction-item">
              <span className="instruction-num">{i + 1}</span>
              <p className="instruction-text">{t(key)}</p>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={onNext}>
        {t("startGame")}
      </button>
    </div>
  );
}