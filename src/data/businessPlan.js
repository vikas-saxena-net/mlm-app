export const idActivation = {
  enrollment: 600,
  activation: 1200,
};

export const incomeTypes = [
  {
    key: "retail",
    title: "Retail Profit",
    range: "25% - 50%",
    icon: "storefront",
    description: "Earn instantly by selling HIO Health products directly to customers at MRP.",
  },
  {
    key: "matching",
    title: "Matching Income",
    range: "₹200 / pair",
    icon: "pair",
    description: "Grow your team in a 1:1 binary (Left / Right) and earn every time both legs match.",
  },
  {
    key: "repurchase",
    title: "Repurchase Income",
    range: "12% - 22%",
    icon: "refresh",
    description: "Recurring monthly income based on your self and team repurchase business volume.",
  },
  {
    key: "monthly-bonus",
    title: "Monthly Bonus",
    range: "8% - 18%",
    icon: "bonus",
    description: "Extra payout on combined self and sponsor repurchase billing every month.",
  },
  {
    key: "car",
    title: "Car Fund",
    range: "₹200 - ₹500 / pt",
    icon: "car",
    description: "Unlocked after Red Cross rank. Drive home your dream car on the company.",
  },
  {
    key: "travel",
    title: "Travel Fund",
    range: "₹1,000 - ₹2,000 / pt",
    icon: "plane",
    description: "Unlocked after Blue Cross rank. Explore the world with fully sponsored trips.",
  },
  {
    key: "leadership",
    title: "Leadership Fund",
    range: "₹2,500 - ₹4,000 / pt",
    icon: "flag",
    description: "Unlocked after Lead Lord rank, rewarding leaders who build strong teams.",
  },
  {
    key: "grahini",
    title: "Grahini Fund",
    range: "₹3,000 - ₹4,000 / pt",
    icon: "heart",
    description: "Unlocked after Begum rank — a special reward fund celebrating home-makers.",
  },
  {
    key: "house",
    title: "House Fund",
    range: "2% of turnover",
    icon: "home",
    description: "Unlocked after Badshah rank. 2% of company repurchase turnover toward your dream home.",
  },
  {
    key: "royalty",
    title: "Royalty Income",
    range: "2% of turnover",
    icon: "crown",
    description: "The top-most reward, unlocked after Diamond rank — 2% royalty on total company turnover.",
  },
];

export const repurchaseIncomeTable = [
  { selfBv: 2400, teamBv: 10000, rate: "12%" },
  { selfBv: 7200, teamBv: 30000, rate: "14%" },
  { selfBv: 12000, teamBv: 50000, rate: "16%" },
  { selfBv: 16800, teamBv: 80000, rate: "18%" },
  { selfBv: 24000, teamBv: 100000, rate: "20%" },
  { selfBv: 28000, teamBv: 120000, rate: "22%" },
];

export const monthlyBonusTable = [
  { combined: 8500, rate: "08%" },
  { combined: 14500, rate: "10%" },
  { combined: 23000, rate: "12%" },
  { combined: 38000, rate: "14%" },
  { combined: 61500, rate: "16%" },
  { combined: 99500, rate: "18%" },
];

export const rankFunds = [
  {
    key: "car",
    title: "Car Fund",
    icon: "car",
    unlockedAfter: "Red Cross",
    selfBv: "30,000",
    teamBv: "1,50,000",
    pointRule: "1,000 : 1,000 = 1 CF Point",
    pointValue: "₹200 - ₹500 per point",
    note: "Maximum earning: 30 point distribution CTO BV",
  },
  {
    key: "travel",
    title: "Travel Fund",
    icon: "plane",
    unlockedAfter: "Blue Cross",
    selfBv: "6,000",
    teamBv: "6,00,000",
    pointRule: "6,000 : 6,000 = 1 TF Point",
    pointValue: "₹1,000 - ₹2,000 per point",
    note: "Maximum earning: 30 point distribution CTO BV",
  },
  {
    key: "leadership",
    title: "Leadership Fund",
    icon: "flag",
    unlockedAfter: "Lead Lord",
    selfBv: "1,20,000",
    teamBv: "24,00,000",
    pointRule: "16,000 : 16,000 = 1 LF Point",
    pointValue: "₹2,500 - ₹4,000 per point",
    note: "Maximum earning: 30 point distribution CTO BV",
  },
  {
    key: "grahini",
    title: "Grahini Fund",
    icon: "heart",
    unlockedAfter: "Begum",
    selfBv: "2,40,000",
    teamBv: "96,00,000",
    pointRule: "20,000 : 20,000 = 1 GF Point",
    pointValue: "₹3,000 - ₹4,000 per point",
    note: "Maximum earning: 30 point distribution CTO BV",
  },
  {
    key: "house",
    title: "House Fund",
    icon: "home",
    unlockedAfter: "Badshah",
    selfBv: "4,80,000",
    teamBv: "3,84,00,000",
    pointRule: "2% of repurchase turnover",
    pointValue: null,
    note: null,
  },
  {
    key: "royalty",
    title: "Royalty Income",
    icon: "crown",
    unlockedAfter: "Diamond",
    selfBv: "5,00,000",
    teamBv: "15,36,00,000",
    pointRule: "2% of company turnover",
    pointValue: null,
    note: null,
  },
];

export const extraRewards = [
  {
    title: "Consistency Income",
    description: "Maintain 1,000 BV continuously for 5 months and get a 6th month free product of the same BV.",
  },
  {
    title: "Monthly Single ID Billing Rewards",
    description: "₹10,000 purchase = 5% extra product · ₹1,00,000 purchase = 10% extra product · ₹5,00,000 purchase = 20% extra product.",
  },
  {
    title: "Bulk Purchase Reward",
    description: "Buy 7 quantities of the same product in one bill and get 1 product FREE — once a month.",
  },
  {
    title: "Self Business Vehicle Support",
    description: "₹2.5 Lakh self business = ₹50,000 down payment support for an OLA Electric Scooter. ₹5 Lakh self business = ₹1.25 Lakh down payment support for an Alto CNG.",
  },
];

export const termsAndConditions = [
  "Monthly closing on the 28th of every month.",
  "Payout on the 2nd of every month.",
  "Minimum withdrawal amount ₹500/-.",
  "TDS 3.75% & Admin Charge 3.75% applicable on payouts.",
];

export const productCategories = [
  {
    key: "health",
    title: "Health Care",
    description: "Ayurvedic and wellness formulations crafted to support everyday vitality and long-term health.",
  },
  {
    key: "personal",
    title: "Personal Care",
    description: "Natural personal care essentials for skin, hair and daily grooming.",
  },
  {
    key: "agri",
    title: "Agri Care",
    description: "Organic agri-inputs that help farmers grow healthier, more sustainable crops.",
  },
];
