import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#071b2d",
          color: "#e6e6dd",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "20px",
              background: "rgba(230,230,221,0.08)",
              border: "1px solid rgba(230,230,221,0.14)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "20px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                opacity: 0.65,
              }}
            >
              Xandec
            </div>
            <div style={{ fontSize: "24px", marginTop: "6px" }}>Case study</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "980px" }}>
          <div
            style={{
              fontSize: "68px",
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Organization-wide AI deployment across The Dominion Group
          </div>
          <div style={{ fontSize: "26px", lineHeight: 1.4, maxWidth: "900px", opacity: 0.82 }}>
            Property management and financial services unified on PostgreSQL and Claude.
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px", fontSize: "24px", opacity: 0.8 }}>
          <div>1,000+ units managed</div>
          <div>10+ portals unified</div>
        </div>
      </div>
    ),
    size
  );
}
