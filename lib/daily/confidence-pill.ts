import type { CSSProperties } from "react";

export function getConfidencePillStyles(
  level: string | null,
  disabled = false,
): CSSProperties {
  if (disabled) {
    return {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      color: "rgba(0, 0, 0, 0.45)",
    };
  }

  switch (level?.trim().toLowerCase()) {
    case "high":
      return {
        backgroundColor: "#E8FFEF",
        color: "#146B2E",
      };
    case "medium":
      return {
        backgroundColor: "#FCE7C8",
        color: "#8A4B08",
      };
    case "low":
      return {
        backgroundColor: "#FFE3E8",
        color: "#B42318",
      };
    default:
      return {
        backgroundColor: "#FFFFFF",
        color: "rgba(0, 0, 0, 0.7)",
      };
  }
}
