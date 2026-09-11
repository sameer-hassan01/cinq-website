import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { brand, seo } from "@/lib/content";
import { MARK, markSegments } from "@/lib/mark";

export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The link preview. Drawn from the same tokens and the same mark geometry as
 * the site, so it cannot drift from it.
 */
export default async function OpenGraphImage() {
  const display = await readFile(
    path.join(process.cwd(), "brand/fonts/BricolageGrotesque-ExtraBold.woff"),
  );
  const body = await readFile(path.join(process.cwd(), "brand/fonts/Geist-Regular.woff"));
  const segments = markSegments();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0c0b0a",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Geist",
        }}
      >
        {/* Ribbons of light, drawn as soft gradients. */}
        <div
          style={{
            position: "absolute",
            right: -220,
            top: -160,
            width: 900,
            height: 700,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(249,99,58,0.55), rgba(255,176,32,0.25) 55%, rgba(12,11,10,0) 100%)",
            transform: "rotate(-18deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 180,
            width: 700,
            height: 420,
            borderRadius: 9999,
            background:
              "radial-gradient(closest-side, rgba(255,176,32,0.35), rgba(12,11,10,0) 100%)",
            transform: "rotate(-18deg)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 72,
            top: 72,
            right: 72,
            bottom: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <svg
            width="88"
            height="88"
            viewBox={`0 0 ${MARK.size} ${MARK.size}`}
            fill="none"
          >
            {segments.map((d, i) => (
              <path key={i} d={d} stroke="#f9633a" strokeWidth={MARK.stroke} />
            ))}
          </svg>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                fontFamily: "Bricolage",
                fontSize: 92,
                lineHeight: 0.95,
                letterSpacing: -4,
                color: "#f3efe7",
                maxWidth: 820,
              }}
            >
              {brand.tagline}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  fontFamily: "Bricolage",
                  fontSize: 44,
                  letterSpacing: -2,
                  color: "#f3efe7",
                }}
              >
                {brand.wordmark}
              </div>
              <div style={{ fontSize: 24, color: "#aca69b" }}>
                Five founders. Islamabad, Pakistan.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display, weight: 800, style: "normal" },
        { name: "Geist", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
