// Example devUI plugin — Countdown Timer
// Uses the host app's React via window.__DEVUI_REACT__

const React = window.__DEVUI_REACT__;
const { useState, useEffect, useCallback } = React;
const h = React.createElement;

function CountdownPanel({ panel, onUpdatePanelConfig }) {
  const savedSeconds = typeof panel.config?.seconds === "number" ? panel.config.seconds : 60;
  const [seconds, setSeconds] = useState(savedSeconds);
  const [running, setRunning] = useState(false);
  const [input, setInput] = useState(String(savedSeconds));

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, seconds]);

  const handleSet = useCallback(() => {
    const n = parseInt(input, 10);
    if (!Number.isFinite(n) || n < 1) return;
    setSeconds(n);
    setRunning(false);
    onUpdatePanelConfig({ ...panel.config, seconds: n });
  }, [input, panel.config, onUpdatePanelConfig]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: "16px",
      fontFamily: "monospace",
      color: "#e0e0e0",
      background: "#1a1a2e",
      padding: "20px",
    }
  },
    h("div", {
      style: { fontSize: "64px", fontWeight: "bold", color: seconds === 0 ? "#ff6b6b" : "#7fdbca" }
    }, display),

    h("div", { style: { display: "flex", gap: "8px" } },
      h("button", {
        onClick: () => setRunning((r) => !r),
        style: btnStyle(running ? "#e74c3c" : "#2ecc71"),
      }, running ? "Pause" : "Start"),

      h("button", {
        onClick: () => { setSeconds(savedSeconds); setRunning(false); },
        style: btnStyle("#3498db"),
      }, "Reset"),
    ),

    h("div", { style: { display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" } },
      h("input", {
        type: "number",
        value: input,
        onChange: (e) => setInput(e.target.value),
        onKeyDown: (e) => { if (e.key === "Enter") handleSet(); },
        style: {
          width: "80px",
          padding: "6px 10px",
          background: "#16213e",
          color: "#e0e0e0",
          border: "1px solid #444",
          borderRadius: "4px",
          fontSize: "14px",
          textAlign: "center",
        },
      }),
      h("span", { style: { fontSize: "13px", opacity: 0.7 } }, "seconds"),
      h("button", {
        onClick: handleSet,
        style: btnStyle("#8e44ad"),
      }, "Set"),
    ),
  );
}

function btnStyle(bg) {
  return {
    padding: "8px 18px",
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  };
}

export default CountdownPanel;
