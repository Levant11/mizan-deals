import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
          border: "1px solid #e2e8f0",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: 800,
            color: "#1e3a8a",
            marginBottom: "16px",
          }}
        >
          MIZAN
        </h1>

        <h2
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "16px",
          }}
        >
          منصة الأصول المتعثرة في العراق
        </h2>

        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.8,
            color: "#475569",
            marginBottom: "28px",
          }}
        >
          إذا كنت ترى هذه الصفحة، فهذا يعني أن الـ Preview يعمل وأن مشكلة البناء
          ليست من Lovable نفسه.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              background: "#eff6ff",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <strong style={{ color: "#1e40af" }}>Frontend</strong>
            <p style={{ color: "#64748b", marginTop: "8px" }}>يعمل</p>
          </div>

          <div
            style={{
              background: "#ecfdf5",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <strong style={{ color: "#047857" }}>Build</strong>
            <p style={{ color: "#64748b", marginTop: "8px" }}>ناجح</p>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <strong style={{ color: "#334155" }}>Next</strong>
            <p style={{ color: "#64748b", marginTop: "8px" }}>نضيف الميزات</p>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
