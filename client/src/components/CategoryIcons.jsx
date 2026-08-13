import {
  ShoppingCart,
  Home,
  Tv,
  Film,
  Smartphone,
  Car,
  HeartPulse,
  GraduationCap,
  Zap,
  Dumbbell,
  Gift,
  ShieldCheck,
  PiggyBank,
  TrendingUp,
  ShoppingBag,
  Wallet,
  Tag,
} from "lucide-react";

// Maps a category name to a fitting icon by keyword. Falls back to a
// generic icon based on type when nothing matches, so every category gets
// an icon even if it's not one of the recognized keywords.
const iconRules = [
  {
    keywords: ["grocery", "groceries", "food", "dining", "restaurant"],
    Icon: ShoppingCart,
  },
  { keywords: ["rent", "housing", "hostel"], Icon: Home },
  { keywords: ["netflix", "subscription", "streaming", "prime"], Icon: Tv },
  { keywords: ["movie", "cinema", "entertainment"], Icon: Film },
  { keywords: ["recharge", "mobile", "phone"], Icon: Smartphone },
  {
    keywords: ["fuel", "petrol", "transport", "travel", "uber", "taxi", "cab"],
    Icon: Car,
  },
  {
    keywords: ["medical", "health", "hospital", "doctor", "pharmacy"],
    Icon: HeartPulse,
  },
  {
    keywords: ["education", "school", "college", "course", "tuition"],
    Icon: GraduationCap,
  },
  {
    keywords: ["electricity", "utility", "utilities", "water", "bill"],
    Icon: Zap,
  },
  { keywords: ["gym", "fitness", "workout"], Icon: Dumbbell },
  { keywords: ["gift"], Icon: Gift },
  { keywords: ["insurance"], Icon: ShieldCheck },
  { keywords: ["saving", "savings"], Icon: PiggyBank },
  { keywords: ["invest", "stock", "mutual fund"], Icon: TrendingUp },
  { keywords: ["shopping", "clothes", "clothing"], Icon: ShoppingBag },
  { keywords: ["salary", "wage", "paycheck", "income"], Icon: Wallet },
];

export function getCategoryIcon(name = "", type) {
  const lower = name.toLowerCase();
  const match = iconRules.find((rule) =>
    rule.keywords.some((keyword) => lower.includes(keyword)),
  );
  const Icon = match ? match.Icon : type === "income" ? Wallet : Tag;
  return <Icon size={18} />;
}

// Same palette used on Dashboard's pie chart, kept within the app's
// existing gold/rust/forest/brown tones. Colored by category id (not by
// list position) so a category keeps the same color everywhere in the
// app, regardless of sort/filter order.
export const categoryColors = [
  "#c9a15a",
  "#a6512f",
  "#1f6f4f",
  "#8b5e3c",
  "#7a6f61",
  "#94402a",
  "#5c7d6b",
  "#b98d46",
];

export function getCategoryColor(id) {
  return categoryColors[id % categoryColors.length];
}
