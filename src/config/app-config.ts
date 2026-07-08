import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Black Ridge Terminal",
  version: packageJson.version,
  copyright: `© ${currentYear}, Black Ridge Terminal.`,
  meta: {
    title: "Black Ridge Terminal — Institutional Wealth Intelligence",
    description:
      "Black Ridge Terminal is a free, browser-based institutional wealth, valuation, and capital strategy command center. Model capital, risk, valuation, allocation, and scenario outcomes locally in your browser — no login, no bank connection, no data leaves your device.",
  },
};
