import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Black Ridge Realty Terminal",
  version: packageJson.version,
  copyright: `© ${currentYear}, Black Ridge Realty Terminal.`,
  meta: {
    title: "Black Ridge Realty Terminal — Buyer Operations Intelligence",
    description:
      "A private real-estate operations command center for tracking buyer readiness, financing gaps, target markets, and pipeline movement with durable records.",
  },
};
