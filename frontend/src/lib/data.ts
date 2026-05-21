export type CategorySlug = 'women' | 'men' | 'unisex' | 'oriental' | 'limited';

export interface Category {
  id: number;
  slug: CategorySlug;
  fr: string;
  ar: string;
  en: string;
}

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export type Hue =
  | 'midnight' | 'rose' | 'sand' | 'oud' | 'water' | 'amber'
  | 'cedar' | 'bloom' | 'noir' | 'sun' | 'gold' | 'vanilla';

export interface Product {
  id: number;
  slug: string;
  sku: string;
  categorySlug: CategorySlug;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  tagline: string;
  description: string;
  family: string;
  price: number;
  stock: number;
  concentration: string;
  size: string;
  longevity: string;
  sillage: string;
  seasons: string[];
  occasions: string[];
  notes: FragranceNotes;
  hue: Hue;
  accent: string;
  limited?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: 1, slug: 'women',    fr: 'Pour Femme',      ar: 'نسائي',          en: 'Women' },
  { id: 2, slug: 'men',      fr: 'Pour Homme',      ar: 'رجالي',          en: 'Men' },
  { id: 3, slug: 'unisex',   fr: 'Unisexe',         ar: 'مشترك',          en: 'Unisex' },
  { id: 4, slug: 'oriental', fr: 'Oriental',        ar: 'شرقي',           en: 'Oriental' },
  { id: 5, slug: 'limited',  fr: 'Édition Limitée', ar: 'إصدارات محدودة', en: 'Limited Edition' },
];

export const FAMILIES = [
  'Floral', 'Boisé', 'Oriental', 'Hespéridé', 'Frais',
  'Épicé', 'Gourmand', 'Aquatique', 'Musqué', 'Aromatique',
];

export const PRODUCTS: Product[] = [
  {
    id: 1, slug: 'nuit-datlas', sku: 'AMP-001', categorySlug: 'men',
    nameFr: "Nuit d'Atlas", nameAr: 'ليل الأطلس', nameEn: 'Atlas Night',
    tagline: "Un voyage olfactif dans les montagnes mauresques",
    description: "Une fragrance audacieuse qui capture l'essence mystérieuse de la nuit saharienne. Notes de cèdre, ambre, et une touche de musc pour un sillage inoubliable.",
    family: 'Oriental Boisé', price: 8500, stock: 24,
    concentration: 'Eau de Parfum', size: '100ml',
    longevity: '8–10 heures', sillage: 'Modéré à fort',
    seasons: ['Automne', 'Hiver'], occasions: ['Soirée', 'Événement spécial'],
    notes: { top: ['Bergamote', 'Poivre Noir', 'Cardamome'], heart: ['Rose de Damas', 'Cèdre', 'Cuir'], base: ['Ambre', 'Musc Blanc', 'Vanille'] },
    hue: 'midnight', accent: '#2a2520',
  },
  {
    id: 2, slug: 'rose-de-chinguetti', sku: 'AMP-002', categorySlug: 'women',
    nameFr: 'Rose de Chinguetti', nameAr: 'وردة شنقيط', nameEn: 'Chinguetti Rose',
    tagline: "L'éclat délicat des oasis anciennes",
    description: "Un bouquet floral lumineux puisant son inspiration dans les jardins de Chinguetti. La rose centifolia s'épanouit sur un fond de muscs poudrés et de cèdre blanc.",
    family: 'Floral', price: 9200, stock: 18,
    concentration: 'Eau de Parfum', size: '100ml',
    longevity: '6–8 heures', sillage: 'Modéré',
    seasons: ['Printemps', 'Été'], occasions: ['Quotidien', 'Romance'],
    notes: { top: ['Bergamote', 'Mandarine', 'Rose'], heart: ['Jasmin', 'Muguet', 'Pivoine'], base: ['Musc Blanc', 'Cèdre', 'Iris'] },
    hue: 'rose', accent: '#a87f74',
  },
  {
    id: 3, slug: 'sahara-blanc', sku: 'AMP-003', categorySlug: 'unisex',
    nameFr: 'Sahara Blanc', nameAr: 'الصحراء البيضاء', nameEn: 'White Sahara',
    tagline: "L'épure d'un horizon à perte de vue",
    description: "Une composition limpide où le bois flotté rencontre les muscs blancs. Un voile transparent, sec et solaire, comme une dune au lever du jour.",
    family: 'Boisé Musqué', price: 7800, stock: 30,
    concentration: 'Eau de Parfum', size: '100ml',
    longevity: '6–8 heures', sillage: 'Discret',
    seasons: ['Toutes saisons'], occasions: ['Quotidien', 'Bureau'],
    notes: { top: ['Aldéhydes', 'Citron', 'Mandarine'], heart: ['Iris', 'Coton', 'Lavande'], base: ['Musc Blanc', 'Bois de Cachemire', 'Ambrette'] },
    hue: 'sand', accent: '#c6b292',
  },
  {
    id: 4, slug: 'oud-royal', sku: 'AMP-004', categorySlug: 'oriental',
    nameFr: 'Oud Royal', nameAr: 'عود ملكي', nameEn: 'Royal Oud',
    tagline: "L'or noir des forêts d'Asie centrale",
    description: "Le oud, joyau sacré, sublimé par le safran et la rose de Taïf. Une étreinte chaleureuse, profonde, magistrale.",
    family: 'Oriental', price: 12500, stock: 12,
    concentration: 'Extrait de Parfum', size: '100ml',
    longevity: '10–12 heures', sillage: 'Fort',
    seasons: ['Automne', 'Hiver'], occasions: ['Soirée', 'Événement spécial'],
    notes: { top: ['Safran', 'Bergamote', 'Poivre Rose'], heart: ['Rose de Taïf', 'Patchouli', 'Cuir'], base: ['Oud', 'Ambre Gris', 'Santal'] },
    hue: 'oud', accent: '#5c3a26',
  },
  {
    id: 5, slug: 'brise-du-desert', sku: 'AMP-005', categorySlug: 'unisex',
    nameFr: 'Brise du Désert', nameAr: 'نسيم الصحراء', nameEn: 'Desert Breeze',
    tagline: "Un souffle marin sur les dunes",
    description: "L'air vif de l'océan Atlantique qui caresse les côtes mauritaniennes. Fraîcheur saline, agrumes et notes vertes pour une signature lumineuse.",
    family: 'Frais Aquatique', price: 6900, stock: 35,
    concentration: 'Eau de Toilette', size: '100ml',
    longevity: '4–6 heures', sillage: 'Léger',
    seasons: ['Printemps', 'Été'], occasions: ['Quotidien', 'Sport'],
    notes: { top: ['Citron Vert', 'Pamplemousse', 'Menthe'], heart: ['Notes Marines', 'Sel', 'Thé Vert'], base: ['Vétiver', 'Ambrette', 'Bois Clair'] },
    hue: 'water', accent: '#6f8895',
  },
  {
    id: 6, slug: 'ambre-mystique', sku: 'AMP-006', categorySlug: 'women',
    nameFr: 'Ambre Mystique', nameAr: 'عنبر الغموض', nameEn: 'Mystic Amber',
    tagline: "Une caresse de soie et de miel",
    description: "L'ambre se love dans la vanille et le benjoin pour révéler une fragrance enveloppante, sensuelle, presque hypnotique.",
    family: 'Oriental Gourmand', price: 10400, stock: 15,
    concentration: 'Eau de Parfum', size: '100ml',
    longevity: '8–10 heures', sillage: 'Modéré',
    seasons: ['Automne', 'Hiver'], occasions: ['Soirée', 'Romance'],
    notes: { top: ['Bergamote', 'Poire', 'Cassis'], heart: ['Jasmin Sambac', 'Tubéreuse', 'Cannelle'], base: ['Ambre', 'Vanille de Madagascar', 'Benjoin'] },
    hue: 'amber', accent: '#a07642',
  },
  {
    id: 7, slug: 'cedre-de-ladrar', sku: 'AMP-007', categorySlug: 'men',
    nameFr: "Cèdre de l'Adrar", nameAr: 'أرز آدرار', nameEn: 'Adrar Cedar',
    tagline: "La force tranquille du bois ancien",
    description: "Une ode au cèdre majestueux du massif de l'Adrar. Vétiver fumé, encens et cuir doux pour une silhouette racée.",
    family: 'Boisé', price: 7500, stock: 22,
    concentration: 'Eau de Parfum', size: '100ml',
    longevity: '6–8 heures', sillage: 'Modéré',
    seasons: ['Automne', 'Hiver'], occasions: ['Bureau', 'Soirée'],
    notes: { top: ['Bergamote', 'Élémi', 'Genièvre'], heart: ['Cèdre', 'Encens', 'Iris'], base: ['Vétiver', 'Cuir', 'Patchouli'] },
    hue: 'cedar', accent: '#7d6147',
  },
  {
    id: 8, slug: 'fleur-de-nouakchott', sku: 'AMP-008', categorySlug: 'women',
    nameFr: 'Fleur de Nouakchott', nameAr: 'زهرة نواكشوط', nameEn: 'Nouakchott Bloom',
    tagline: "L'élégance d'une capitale de sable",
    description: "Frangipanier et jasmin caressés par la brise atlantique. Une floralité aérée, lumineuse, contemporaine.",
    family: 'Floral Frais', price: 8800, stock: 20,
    concentration: 'Eau de Parfum', size: '100ml',
    longevity: '6–8 heures', sillage: 'Modéré',
    seasons: ['Printemps', 'Été'], occasions: ['Quotidien', 'Cocktail'],
    notes: { top: ['Néroli', 'Bergamote', 'Poivre Rose'], heart: ['Frangipanier', 'Jasmin', 'Magnolia'], base: ['Musc', 'Bois Blanc', 'Ambrette'] },
    hue: 'bloom', accent: '#bca08b',
  },
  {
    id: 9, slug: 'mystere-noir', sku: 'AMP-009', categorySlug: 'men',
    nameFr: 'Mystère Noir', nameAr: 'السر الأسود', nameEn: 'Black Mystery',
    tagline: "L'ombre dense d'une nuit sans lune",
    description: "Encens noir, oud léger et tabac blond. Une fragrance d'apparat, secrète et magnétique.",
    family: 'Oriental Épicé', price: 11200, stock: 10,
    concentration: 'Eau de Parfum', size: '100ml',
    longevity: '10–12 heures', sillage: 'Fort',
    seasons: ['Automne', 'Hiver'], occasions: ['Soirée', 'Événement spécial'],
    notes: { top: ['Poivre Noir', 'Cardamome', 'Élémi'], heart: ['Encens', 'Cuir', 'Tabac'], base: ['Oud', 'Patchouli', 'Ambre Noir'] },
    hue: 'noir', accent: '#272422',
  },
  {
    id: 10, slug: 'lumiere-du-sud', sku: 'AMP-010', categorySlug: 'unisex',
    nameFr: 'Lumière du Sud', nameAr: 'نور الجنوب', nameEn: 'Southern Light',
    tagline: "Un soleil zénithal sur la peau",
    description: "Citrons de Sicile, néroli et thé matcha. Une eau solaire, gaie, infiniment portable.",
    family: 'Hespéridé Aromatique', price: 6500, stock: 40,
    concentration: 'Eau de Toilette', size: '100ml',
    longevity: '4–6 heures', sillage: 'Léger',
    seasons: ['Printemps', 'Été'], occasions: ['Quotidien', 'Bureau'],
    notes: { top: ['Citron', 'Bergamote', 'Petitgrain'], heart: ['Néroli', 'Thé Vert', 'Romarin'], base: ['Bois Blond', 'Musc', 'Mousse de Chêne'] },
    hue: 'sun', accent: '#c2a04a',
  },
  {
    id: 11, slug: 'or-et-encens', sku: 'AMP-011', categorySlug: 'limited',
    nameFr: 'Or et Encens', nameAr: 'ذهب وبخور', nameEn: 'Gold & Frankincense',
    tagline: "La fragrance des cérémonies sacrées",
    description: "Édition rare, numérotée. Encens d'Oman, myrrhe et safran sur un cœur d'oud cambodgien. Un parfum d'orfèvre.",
    family: 'Oriental', price: 18500, stock: 5,
    concentration: 'Extrait de Parfum', size: '50ml',
    longevity: '12+ heures', sillage: 'Très fort',
    seasons: ['Automne', 'Hiver'], occasions: ['Cérémonie', 'Collection'],
    notes: { top: ['Encens', 'Safran', 'Élémi'], heart: ['Myrrhe', 'Rose Noire', 'Cuir'], base: ['Oud Cambodgien', 'Ambre Gris', 'Or liquide'] },
    hue: 'gold', accent: '#8a6d33', limited: true,
  },
  {
    id: 12, slug: 'vanille-de-tichitt', sku: 'AMP-012', categorySlug: 'women',
    nameFr: 'Vanille de Tichitt', nameAr: 'فانيليا تيشيت', nameEn: 'Tichitt Vanilla',
    tagline: "Une gourmandise au cœur du désert",
    description: "La vanille Bourbon adoucit le bois de gaïac et le bois de santal. Une signature chaleureuse et délicatement sucrée.",
    family: 'Gourmand', price: 9500, stock: 25,
    concentration: 'Eau de Parfum', size: '100ml',
    longevity: '8–10 heures', sillage: 'Modéré',
    seasons: ['Automne', 'Hiver'], occasions: ['Quotidien', 'Romance'],
    notes: { top: ['Poire', 'Bergamote', 'Cassis'], heart: ['Fève Tonka', 'Coumarine', 'Iris'], base: ['Vanille Bourbon', 'Santal', 'Gaïac'] },
    hue: 'vanilla', accent: '#a78f64',
  },
];

export const HUE_BG: Record<Hue, string> = {
  midnight: 'linear-gradient(180deg, #1f1c1a 0%, #2d2925 100%)',
  rose:     'linear-gradient(180deg, #efe1da 0%, #d9c2b8 100%)',
  sand:     'linear-gradient(180deg, #ece1cb 0%, #d4c4a4 100%)',
  oud:      'linear-gradient(180deg, #4a3022 0%, #6b4729 100%)',
  water:    'linear-gradient(180deg, #d6dde2 0%, #b2bfc6 100%)',
  amber:    'linear-gradient(180deg, #e9cba0 0%, #c89c5e 100%)',
  cedar:    'linear-gradient(180deg, #d4c5b0 0%, #ad8e6c 100%)',
  bloom:    'linear-gradient(180deg, #ece5d8 0%, #cfbfa8 100%)',
  noir:     'linear-gradient(180deg, #1c1a18 0%, #2c2926 100%)',
  sun:      'linear-gradient(180deg, #f0e0a8 0%, #cfa852 100%)',
  gold:     'linear-gradient(180deg, #3b2f16 0%, #6b5224 100%)',
  vanilla:  'linear-gradient(180deg, #e8dcc1 0%, #c5ab7d 100%)',
};

export const HUE_BOTTLE: Record<Hue, { liquid: string; label: string; cap: string }> = {
  midnight: { liquid: '#0e0d0c', label: '#f5efe6', cap: '#0b0a09' },
  rose:     { liquid: '#a87f74', label: '#3a2a25', cap: '#2c2622' },
  sand:     { liquid: '#c6b292', label: '#3a3024', cap: '#2c2622' },
  oud:      { liquid: '#2b160a', label: '#f5efe6', cap: '#0e0805' },
  water:    { liquid: '#6f8895', label: '#1a1f24', cap: '#23272b' },
  amber:    { liquid: '#a07642', label: '#3a2a14', cap: '#2c2014' },
  cedar:    { liquid: '#7d6147', label: '#3a2c1a', cap: '#2c2014' },
  bloom:    { liquid: '#bca08b', label: '#3a2c20', cap: '#2c2622' },
  noir:     { liquid: '#0a0908', label: '#f5efe6', cap: '#0b0a09' },
  sun:      { liquid: '#c2a04a', label: '#3a2e0e', cap: '#2c2208' },
  gold:     { liquid: '#8a6d33', label: '#f5efe6', cap: '#1a1308' },
  vanilla:  { liquid: '#a78f64', label: '#3a2c1a', cap: '#2c2014' },
};

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';
export type PaymentMethod = 'BANKILY' | 'SEDAD' | 'MASRVI' | 'WHATSAPP';

export interface DemoOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  neighborhood: string;
  details: string;
  lat: number;
  lng: number;
  items: { productId: number; quantity: number }[];
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  proofNote: string;
  history: { status: OrderStatus; at: string }[];
  rejectionReason?: string;
}

export const DEMO_ORDERS: DemoOrder[] = [
  { id: 1, orderNumber: 'AM-2026-0042', customerName: 'Fatima Diallo', customerPhone: '+222 22 33 44 55', city: 'Nouakchott', neighborhood: 'Tevragh-Zeina', details: "Près de la mosquée centrale, 2e étage", lat: 18.0790, lng: -15.9650, items: [{ productId: 2, quantity: 1 }, { productId: 12, quantity: 1 }], paymentMethod: 'BANKILY', status: 'PENDING', createdAt: '2026-05-19T14:22:00', proofNote: 'Capture Bankily — réf. TXN8842710', history: [{ status: 'PENDING', at: '2026-05-19T14:22:00' }] },
  { id: 2, orderNumber: 'AM-2026-0041', customerName: 'Ahmed Ould Salem', customerPhone: '+222 26 55 77 11', city: 'Nouakchott', neighborhood: 'Ksar', details: 'En face de la pharmacie El-Wafa', lat: 18.0860, lng: -15.9540, items: [{ productId: 4, quantity: 1 }], paymentMethod: 'SEDAD', status: 'CONFIRMED', createdAt: '2026-05-18T09:11:00', proofNote: 'Capture Sedad — réf. SD-22118', history: [{ status: 'PENDING', at: '2026-05-18T09:11:00' }, { status: 'CONFIRMED', at: '2026-05-18T15:40:00' }] },
  { id: 3, orderNumber: 'AM-2026-0040', customerName: 'Mariem Bint Ely', customerPhone: '+222 36 22 88 14', city: 'Nouakchott', neighborhood: 'Sebkha', details: '', lat: 18.0660, lng: -15.9760, items: [{ productId: 8, quantity: 2 }], paymentMethod: 'MASRVI', status: 'SHIPPED', createdAt: '2026-05-16T18:05:00', proofNote: 'Capture Masrvi', history: [{ status: 'PENDING', at: '2026-05-16T18:05:00' }, { status: 'CONFIRMED', at: '2026-05-17T10:00:00' }, { status: 'PREPARING', at: '2026-05-17T16:00:00' }, { status: 'SHIPPED', at: '2026-05-18T08:30:00' }] },
  { id: 4, orderNumber: 'AM-2026-0039', customerName: 'Yacoub Camara', customerPhone: '+222 41 09 33 28', city: 'Nouakchott', neighborhood: 'Riyad', details: 'Bloc B, villa 14', lat: 18.0560, lng: -15.9120, items: [{ productId: 11, quantity: 1 }, { productId: 9, quantity: 1 }], paymentMethod: 'BANKILY', status: 'DELIVERED', createdAt: '2026-05-12T11:00:00', proofNote: 'Bankily TXN8841402', history: [{ status: 'PENDING', at: '2026-05-12T11:00:00' }, { status: 'CONFIRMED', at: '2026-05-12T17:00:00' }, { status: 'PREPARING', at: '2026-05-13T09:00:00' }, { status: 'SHIPPED', at: '2026-05-13T15:00:00' }, { status: 'DELIVERED', at: '2026-05-14T11:00:00' }] },
  { id: 5, orderNumber: 'AM-2026-0038', customerName: 'Aïcha Wane', customerPhone: '+222 22 44 66 88', city: 'Nouakchott', neighborhood: 'Tevragh-Zeina', details: '', lat: 18.0810, lng: -15.9710, items: [{ productId: 3, quantity: 1 }], paymentMethod: 'WHATSAPP', status: 'PENDING', createdAt: '2026-05-19T19:48:00', proofNote: 'Capture WhatsApp', history: [{ status: 'PENDING', at: '2026-05-19T19:48:00' }] },
];

export const WHATSAPP_LINK =
  'https://www.tiktok.com/link/v2?aid=1988&lang=fr&scene=bio_url&target=https%3A%2F%2Fwa.me%2Fmessage%2FRKG2ZIH3O7XHL1';

export const PAYMENT_METHODS = [
  { key: 'BANKILY' as const,  name: 'Bankily',  number: '22 33 44 55',     sub: 'Banque Mauritanienne · Mobile Money', initials: 'B', link: null as string | null },
  { key: 'SEDAD' as const,    name: 'Sedad',    number: '36 11 88 22',     sub: 'Sedad Banque · Mobile',               initials: 'S', link: null as string | null },
  { key: 'MASRVI' as const,   name: 'Masrvi',   number: '42 09 77 14',     sub: 'Société Générale Mauritanie',          initials: 'M', link: null as string | null },
  { key: 'WHATSAPP' as const, name: 'WhatsApp', number: 'Cliquer pour ouvrir le chat', sub: "Paiement assisté par l'équipe", initials: 'W', link: WHATSAPP_LINK as string | null },
];

export function findProduct(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function findProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
