export type Badge = "best" | "new" | "limited" | "expert" | "today";

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  priceYer?: number;
  oldPriceYer?: number;
  image: string;
  badge?: Badge;
  freeShipping?: boolean;
  category: string;
  brand?: string;
  shortDescription?: string;
}

const unsplashImages = [
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600",
  "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600",
  "https://images.unsplash.com/photo-1615486171448-4fdcbab2069b?q=80&w=600",
  "https://images.unsplash.com/photo-1587401305785-ce1a719af1e6?q=80&w=600",
  "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=600",
  "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=600",
  "https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?q=80&w=600",
  "https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?q=80&w=600",
  "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=600",
];

const PH = (label: string, bg?: string, fg?: string) => {
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash += label.charCodeAt(i);
  return unsplashImages[hash % unsplashImages.length];
};

export const categories = [
  { id: "all-view", name: "عرض الكل", icon: PH("عرض الكل") },
  { id: "today", name: "عروض اليوم", icon: PH("عروض اليوم") },
  { id: "bakhoor", name: "البخور", icon: PH("البخور") },
  { id: "unisex", name: "للجنسين", icon: PH("للجنسين") },
  { id: "all", name: "جميع العطور", icon: PH("جميع العطور") },
  { id: "women", name: "عطور للنساء", icon: PH("النساء") },
  { id: "men", name: "عطور للرجال", icon: PH("الرجال") },
];

export const bestSellers: Product[] = [
  {
    id: "ch-hc",
    name: "عطر سي اتش من كارولينا هيريرا للرجال، او دي توواليت، 100 مل",
    price: 270,
    oldPrice: 320,
    image: PH("CH"),
    badge: "best",
    category: "men",
  },
  {
    id: "sauvage",
    name: "عطر ديور سوفاج بارفيوم رجالي 100 مل",
    price: 420,
    oldPrice: 800,
    image: PH("Sauvage"),
    badge: "best",
    category: "men",
  },
  {
    id: "century",
    name: "عطر دنهل سنتشري بلو للرجال - 100 مل",
    price: 115,
    oldPrice: 161,
    image: PH("Century"),
    badge: "best",
    category: "men",
  },
  {
    id: "nishan",
    name: "عطر نيشان توبيروزا إكس للجنسين 100 مل",
    price: 710,
    oldPrice: 900,
    image: PH("Nishane"),
    badge: "best",
    category: "unisex",
  },
];

export const todayDeals: Product[] = [
  {
    id: "bvlgari-man",
    name: "عطر بولغاري مان فور من أو دو بارفيم 100 مل",
    price: 250,
    oldPrice: 580,
    image: PH("BVLGARI"),
    badge: "today",
    category: "men",
  },
  {
    id: "212-sexy",
    name: "عطر كارولينا هيريرا 212 سكسي أو دو تواليت - للرجال - 100 مل",
    price: 160,
    oldPrice: 320,
    image: PH("212"),
    badge: "today",
    category: "men",
  },
  {
    id: "bentley",
    name: "بنتلي فور مين إنتنس 100 مل للرجال",
    price: 150,
    oldPrice: 300,
    image: PH("Bentley"),
    badge: "today",
    category: "men",
  },
  {
    id: "ferrari",
    name: "عطر فيراري سكوديريا أو دو تواليت - 100 مل",
    price: 90,
    oldPrice: 180,
    image: PH("Ferrari"),
    badge: "today",
    category: "men",
  },
];

export const newest: Product[] = [
  {
    id: "nishane-tu",
    name: "عطر نيشان توبيروزا إكس للجنسين 100 مل",
    price: 710,
    oldPrice: 900,
    image: PH("Tuberose"),
    badge: "new",
    freeShipping: true,
    category: "unisex",
  },
  {
    id: "amouage-imit",
    name: "عطر أمواج إيميتيشن للنساء 100 مل",
    price: 1425,
    oldPrice: 1780,
    image: PH("Amouage"),
    badge: "new",
    category: "women",
  },
  {
    id: "elie-saab",
    name: "عطر ايلي صعب لي بارفيم ابسولو أو دي بارفيم 90 مل نسائي",
    price: 475,
    oldPrice: 590,
    image: PH("Elie Saab"),
    badge: "new",
    freeShipping: true,
    category: "women",
  },
  {
    id: "victor-rolf",
    name: "عطر فيكتور آند رولف فلاور بومب نكتار للنساء - 90 مل",
    price: 420,
    oldPrice: 590,
    image: PH("Flowerbomb"),
    badge: "new",
    category: "women",
  },
];

export const menPerfumes: Product[] = [
  {
    id: "imperial-set",
    name: "المجموعة العطرية الإمبراطورية للرجال",
    price: 550,
    oldPrice: 750,
    image: PH("Imperial Set"),
    badge: "best",
    category: "men",
  },
  {
    id: "ferrari-sc",
    name: "عطر فيراري سكوديريا أو دو تواليت - 100 مل",
    price: 90,
    oldPrice: 180,
    image: PH("Ferrari"),
    badge: "best",
    category: "men",
  },
  {
    id: "dior-sauv",
    name: "عطر ديور سوفاج بارفيوم رجالي 100 مل",
    price: 420,
    oldPrice: 800,
    image: PH("Sauvage"),
    badge: "best",
    category: "men",
  },
  {
    id: "azzaro",
    name: "عطر أزارو كروم أو دو تواليت للرجال - 200 مل",
    price: 200,
    oldPrice: 300,
    image: PH("Azzaro"),
    badge: "limited",
    category: "men",
  },
];

export const giftSets: Product[] = [
  {
    id: "oud-azraq",
    name: "عطر طقم العود الازرق من العربية للعود للجنسين",
    price: 1047,
    oldPrice: 1361,
    image: PH("Oud Azraq"),
    badge: "limited",
    category: "unisex",
  },
  {
    id: "afnan-9pm",
    name: "عطر افنان جيفت ست 9 بي إم بور فام 100 مل طقم نسائي",
    price: 175,
    oldPrice: 220,
    image: PH("9pm"),
    badge: "limited",
    category: "women",
  },
  {
    id: "dukhoon",
    name: "طقم عطور سدو من دخون الاماراتية",
    price: 400,
    oldPrice: 530,
    image: PH("Dukhoon"),
    badge: "limited",
    category: "unisex",
  },
];

export const expertPicks: Product[] = [
  {
    id: "amouage-purpose",
    name: "عطر أمواج بيربوس للرجال 100 مل",
    price: 1420,
    oldPrice: 1990,
    image: PH("Purpose"),
    badge: "expert",
    category: "men",
  },
  {
    id: "amouage-reason",
    name: "عطر أمواج ريزنز للنساء 100 مل",
    price: 1600,
    oldPrice: 1880,
    image: PH("Reasons"),
    badge: "expert",
    category: "women",
  },
  {
    id: "amouage-interlude",
    name: "عطر أمواج إنترلود للنساء 100 مل",
    price: 1425,
    oldPrice: 1780,
    image: PH("Interlude"),
    badge: "expert",
    category: "women",
  },
];

export const womenPerfumes: Product[] = [
  {
    id: "modern-set",
    name: "المجموعة العطرية المودرن للنساء",
    price: 570,
    oldPrice: 800,
    image: PH("Modern Set"),
    badge: "limited",
    category: "women",
  },
  {
    id: "vr-flowerbomb",
    name: "عطر فيكتور آند رولف فلاور بومب نكتار للنساء - 90 مل",
    price: 420,
    oldPrice: 590,
    image: PH("Flowerbomb"),
    badge: "limited",
    category: "women",
  },
  {
    id: "cool-water",
    name: "عطر كول ووتر وومن سي روز باسيفيك سمر إديشن - 100 مل - نسائي - دافيدوف",
    price: 145,
    oldPrice: 260,
    image: PH("Cool Water"),
    badge: "best",
    category: "women",
  },
];

export const unisex: Product[] = [
  {
    id: "ajmal-oud",
    name: "عطر أجمل او د عود للجنسين",
    price: 675,
    oldPrice: 878,
    image: PH("Eau d'Oud"),
    badge: "limited",
    category: "unisex",
  },
  {
    id: "ajmal-5",
    name: "عطر أجمل الفصل 5 بواسطة كورالي سبايشر وفابريس بيلفرين نسائي",
    price: 347,
    oldPrice: 451,
    image: PH("Chapter 5"),
    badge: "limited",
    category: "unisex",
  },
  {
    id: "ajmal-kids",
    name: "عطر أجمل للأطفال الأمير الصغير 50 مل",
    price: 135,
    oldPrice: 176,
    image: PH("Little Prince"),
    badge: "limited",
    category: "unisex",
  },
];

export const luxurySets: Product[] = [
  {
    id: "guerlain-royal",
    name: "المجموعة العطرية لجيرلان رويال للجنسين",
    price: 1870,
    oldPrice: 2100,
    image: PH("Guerlain"),
    badge: "limited",
    category: "unisex",
  },
  {
    id: "bohemian",
    name: "المجموعة العطرية البوهيمية للرجال",
    price: 680,
    oldPrice: 850,
    image: PH("Bohemian"),
    badge: "limited",
    category: "men",
  },
  {
    id: "emotional",
    name: "المجموعة العطرية العاطفية للرجال",
    price: 650,
    oldPrice: 850,
    image: PH("Emotional"),
    badge: "limited",
    category: "men",
  },
];

export const bakhoor: Product[] = [
  {
    id: "haramain-1",
    name: "بخور الحرمين نواة 75 جم (علبة 12 قطعة)",
    price: 280,
    oldPrice: 350,
    image: PH("Nawah"),
    badge: "limited",
    category: "bakhoor",
  },
  {
    id: "haramain-2",
    name: "بخور الحرمين سيدرا (علبة 12 قطعة)",
    price: 130,
    oldPrice: 163,
    image: PH("Sidra"),
    badge: "limited",
    category: "bakhoor",
  },
  {
    id: "haramain-3",
    name: "بخور الحرمين جمان 75 جم (علبة 12 قطعة)",
    price: 280,
    oldPrice: 350,
    image: PH("Juman"),
    badge: "limited",
    category: "bakhoor",
  },
];

export const brands = [
  { id: "chopard", name: "شوبارد", en: "chopard", logo: PH("chopard", "fff", "111") },
  {
    id: "mfk",
    name: "مايسون فرانسيس كركدجيان",
    en: "maison francis kurkdjian",
    logo: PH("Maison\nFrancis\nKurkdjian", "fff", "111"),
  },
  { id: "cartier", name: "كارتير - cartier", en: "cartier", logo: PH("Cartier", "fff", "111") },
  {
    id: "rabanne",
    name: "باكو روبان paco rabanne",
    en: "paco rabanne",
    logo: PH("rabanne", "fff", "111"),
  },
  {
    id: "dkhoon",
    name: "دخون الإماراتية dkhoon emirates",
    en: "dkhoon emirates",
    logo: PH("Dkhoon\nAlEmiratia", "fff", "111"),
  },
];

export const featuredSections = [
  { id: "all", name: "عرض الكل", icon: PH("عرض الكل") },
  { id: "1plus1", name: "عرض 1+1 / 2+1", icon: PH("1+1") },
  { id: "gifts", name: "الهدايا", icon: PH("هدايا") },
  { id: "newest", name: "أحدث العطور", icon: PH("أحدث") },
  { id: "today", name: "عروض اليوم", icon: PH("اليوم") },
  { id: "best", name: "الأكثر مبيعا", icon: PH("الأكثر") },
];

// Combined master list for products page / details
export const allProducts: Product[] = [
  ...bestSellers,
  ...todayDeals,
  ...newest,
  ...menPerfumes,
  ...giftSets,
  ...expertPicks,
  ...womenPerfumes,
  ...unisex,
  ...luxurySets,
  ...bakhoor,
];

// Featured product for detail page
export const featuredProduct: Product = {
  id: "amouage-guidance",
  name: "عطر أمواج جايدنس للنساء 100 مل",
  price: 1050,
  oldPrice: 1450,
  image: PH("Amouage\nGuidance", "f5e6d8", "8c521a"),
  badge: "best",
  category: "women",
  brand: "amouage-أمواج",
  shortDescription:
    "جايدنس للنساء، عطر شرقي زهري يمزج اللوز والبخور، يجسد الحكمة والأناقة الساحرة التي تقود الطريق.",
};
