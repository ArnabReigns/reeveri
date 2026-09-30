import { ImageResponse } from "next/og";

export const alt = "Reeveri — We make brands impossible to ignore.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0a",
          color: "#efeee8",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#6d6d68" }}>
          <span>REEVERI</span>
          <span>CREATIVE MARKETING FOR AMBITIOUS BRANDS</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4 }}>
          <span>We make brands</span>
          <span>impossible to</span>
          <span style={{ display: "flex" }}>
            <span style={{ border: "5px solid #f2452d", borderRadius: 999, padding: "0 28px", marginLeft: -28 }}>ignore.</span>
          </span>
        </div>
      </div>
    ),
    size,
  );
}
