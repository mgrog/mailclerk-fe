export const DEFAULT_EMAIL_RULE_NAMES = [
  "Ads",
  "Political",
  "Finances",
  "Notices",
  "Security Alerts",
  "Newsletters",
  "Flights",
  "Orders",
  "Social Media",
  "Career Networking",
] as const;

// const DEFAULT_EMAIL_RULE_LABELS = [
//   "ads",
//   "political",
//   "finances",
//   "notices",
//   "security alerts",
//   "newsletters",
//   "flights",
//   "orders",
//   "social media",
//   "career networking",
// ] as const;

export const DEFAULT_EMAIL_RULES = [
  {
    name: "Ads",
    label: "ads",
    description: "Advertisements and promotions",
    color: "#f2c960",
  },
  {
    name: "Political",
    label: "political",
    description: "Political emails",
    color: "#b99aff",
  },
  {
    name: "Finances",
    label: "finances",
    description: "Bills, receipts, and bank statements",
    color: "#0b4f30",
  },
  {
    name: "Notices",
    label: "notices",
    description: "Reminders, terms of service updates",
    color: "#ffc8af",
  },
  {
    name: "Security Alerts",
    label: "security alerts",
    description: "Password resets, login alerts, etc.",
    color: "#ff7537",
  },
  {
    name: "Newsletters",
    label: "newsletters",
    description: "Weekly updates, blog posts, and digests",
    color: "#0d3472",
  },
  {
    name: "Flights",
    label: "flights",
    description: "Flight confirmations, boarding passes, check-in reminders",
    color: "#3c78d8",
  },

  {
    name: "Orders",
    label: "orders",
    description: "Order confirmations and shipping updates",
    color: "#2da2bb",
  },
  {
    name: "Social Media",
    label: "social media",
    description: "Notifications from social media platforms",
    color: "#68dfa9",
  },
  {
    name: "Career Networking",
    label: "career networking",
    description: "Job board postings, LinkedIn updates, etc.",
    color: "#ffad46",
  },
] as const;

export type DefaultRuleName = (typeof DEFAULT_EMAIL_RULE_NAMES)[number];

export const DEFAULT_EMAIL_RULES_MAP = Object.fromEntries(
  DEFAULT_EMAIL_RULES.map((rule) => [rule.name, rule]),
) as Record<DefaultRuleName, (typeof DEFAULT_EMAIL_RULES)[number]>;
