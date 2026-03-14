import React, { useState, useEffect, useCallback } from "react";

/**
 * Props that every devUI plugin panel receives.
 *
 * Copy this interface into your plugin — it matches the host's PanelViewProps.
 */
interface PanelViewProps {
  panel: {
    id: string;
    kind?: string;
    title?: string;
    config?: Record<string, unknown>;
  };
  workspaceId: string;
  send: (event: string, payload?: Record<string, unknown>) => void;
  request: (event: string, payload?: Record<string, unknown>) => Promise<Record<string, unknown>>;
  onUpdatePanelConfig: (nextConfig: Record<string, unknown>) => void;
}

function CountdownPanel({ panel, onUpdatePanelConfig }: PanelViewProps) {
  const savedSeconds =
    typeof panel.config?.seconds === "number" ? panel.config.seconds : 60;

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

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.display,
          color: seconds === 0 ? "#ff6b6b" : "#7fdbca",
        }}
      >
        {display}
      </div>

      <div style={styles.row}>
        <button
          onClick={() => setRunning((r) => !r)}
          style={btnStyle(running ? "#e74c3c" : "#2ecc71")}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setSeconds(savedSeconds);
            setRunning(false);
          }}
          style={btnStyle("#3498db")}
        >
          Reset
        </button>
      </div>

      <div style={{ ...styles.row, marginTop: 8 }}>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSet();
          }}
          style={styles.input}
        />
        <span style={{ fontSize: 13, opacity: 0.7 }}>seconds</span>
        <button onClick={handleSet} style={btnStyle("#8e44ad")}>
          Set
        </button>
      </div>
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    padding: "8px 18px",
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "bold",
  };
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 16,
    fontFamily: "monospace",
    color: "#e0e0e0",
    background: "#1a1a2e",
    padding: 20,
  },
  display: {
    fontSize: 64,
    fontWeight: "bold",
  },
  row: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  input: {
    width: 80,
    padding: "6px 10px",
    background: "#16213e",
    color: "#e0e0e0",
    border: "1px solid #444",
    borderRadius: 4,
    fontSize: 14,
    textAlign: "center" as const,
  },
};

export default CountdownPanel;
