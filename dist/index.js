// react-shim:react
var react_default = window.__DEVUI_REACT__;
var { useState, useEffect, useCallback, useRef, useMemo, useContext, useReducer, Fragment, createElement, createContext } = window.__DEVUI_REACT__;

// react-shim:react/jsx-runtime
var React = window.__DEVUI_REACT__;
var jsx = React.createElement;
var jsxs = React.createElement;
var jsxDEV = React.createElement;
var Fragment2 = React.Fragment;

// src/index.tsx
function CountdownPanel({ panel, onUpdatePanelConfig }) {
  const savedSeconds = typeof panel.config?.seconds === "number" ? panel.config.seconds : 60;
  const [seconds, setSeconds] = useState(savedSeconds);
  const [running, setRunning] = useState(false);
  const [input, setInput] = useState(String(savedSeconds));
  useEffect(() => {
    if (!running || seconds <= 0)
      return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1e3);
    return () => clearInterval(id);
  }, [running, seconds]);
  const handleSet = useCallback(() => {
    const n = parseInt(input, 10);
    if (!Number.isFinite(n) || n < 1)
      return;
    setSeconds(n);
    setRunning(false);
    onUpdatePanelConfig({ ...panel.config, seconds: n });
  }, [input, panel.config, onUpdatePanelConfig]);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return /* @__PURE__ */ jsxs("div", { style: styles.container, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          ...styles.display,
          color: seconds === 0 ? "#ff6b6b" : "#7fdbca"
        },
        children: display
      }
    ),
    /* @__PURE__ */ jsxs("div", { style: styles.row, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setRunning((r) => !r),
          style: btnStyle(running ? "#e74c3c" : "#2ecc71"),
          children: running ? "Pause" : "Start"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setSeconds(savedSeconds);
            setRunning(false);
          },
          style: btnStyle("#3498db"),
          children: "Reset"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { ...styles.row, marginTop: 8 }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter")
              handleSet();
          },
          style: styles.input
        }
      ),
      /* @__PURE__ */ jsx("span", { style: { fontSize: 13, opacity: 0.7 }, children: "seconds" }),
      /* @__PURE__ */ jsx("button", { onClick: handleSet, style: btnStyle("#8e44ad"), children: "Set" })
    ] })
  ] });
}
function btnStyle(bg) {
  return {
    padding: "8px 18px",
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "bold"
  };
}
var styles = {
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
    padding: 20
  },
  display: {
    fontSize: 64,
    fontWeight: "bold"
  },
  row: {
    display: "flex",
    gap: 8,
    alignItems: "center"
  },
  input: {
    width: 80,
    padding: "6px 10px",
    background: "#16213e",
    color: "#e0e0e0",
    border: "1px solid #444",
    borderRadius: 4,
    fontSize: 14,
    textAlign: "center"
  }
};
var src_default = CountdownPanel;
export {
  src_default as default
};
