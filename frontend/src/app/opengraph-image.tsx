import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Albert Sama — Développeur web full-stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f3f4f1", color: "#172731", padding: "64px 72px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, letterSpacing: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontWeight: 700 }}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 999, background: "#172731", color: "#f3f4f1", fontSize: 16 }}>AS</span> Albert Sama</div>
        <span style={{ color: "#17627d", fontSize: 18 }}>PORTFOLIO · OUAGADOUGOU</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 650 }}>
          <div style={{ color: "#17627d", fontSize: 19, fontWeight: 700, letterSpacing: 3, marginBottom: 24 }}>DÉVELOPPEUR WEB FULL-STACK</div>
          <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 700, letterSpacing: -2 }}>Des produits clairs, solides et maintenables.</div>
          <div style={{ color: "#687983", fontSize: 24, marginTop: 28 }}>De l’interface jusqu’aux données.</div>
        </div>
        <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 12, padding: 24, border: "1px solid #d2d9d7", background: "#ffffff" }}>
          <div style={{ color: "#17627d", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>RÉALISATIONS</div>
          {["Gestion de Stock", "Plateforme d’Emploi", "E-commerce"].map((project, index) => <div key={project} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderTop: "1px solid #d2d9d7", fontSize: 19 }}><span style={{ color: "#17627d", fontSize: 13 }}>0{index + 1}</span>{project}</div>)}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #d2d9d7", paddingTop: 22, color: "#687983", fontSize: 18 }}><span>Next.js · React · TypeScript · Node.js</span><span>albert-sama.dev</span></div>
    </div>,
    { ...size },
  );
}
