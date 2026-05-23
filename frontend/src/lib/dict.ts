import type { Locale } from './i18n';

export interface Dict {
  dir: 'ltr' | 'rtl';
  nav: {
    catalog: string; collections: string; story: string; journal: string;
    wishlist: string; cart: string; account: string; admin: string; logout: string;
  };
  home: {
    eyebrow: string; heroTitle: string; heroSub: string; heroCta: string; heroSecondary: string;
    marquee: string; featured: string; featuredSub: string; seeAll: string;
    story: string; storyP1: string; storyP2: string; storyCta: string;
    categories: string; newArrivals: string; newArrivalsSub: string;
    newsletter: string; newsletterSub: string; newsletterCta: string; emailPlaceholder: string;
    footerTagline: string; footerShop: string; footerHelp: string; footerFollow: string;
  };
  catalog: {
    title: string; subtitle: string; filters: string; sort: string;
    sortNewest: string; sortPriceAsc: string; sortPriceDesc: string;
    category: string; family: string; price: string;
    inStock: string; clearAll: string; results: string; noResults: string;
  };
  product: {
    addToCart: string; addToWishlist: string; addedToCart: string;
    topNotes: string; heartNotes: string; baseNotes: string; pyramid: string; composition: string;
    concentration: string; size: string; longevity: string; sillage: string;
    occasions: string; seasons: string; quantity: string;
    inStock: string; lowStock: string; outOfStock: string;
    delivery: string; payment: string; related: string; back: string;
  };
  cart: {
    title: string; empty: string; emptyCta: string;
    subtotal: string; shipping: string; toBeConfirmed: string;
    total: string; checkout: string; remove: string; continueShopping: string;
    items: string; item: string;
  };
  checkout: {
    title: string;
    step1: string; step2: string; step3: string; step4: string;
    fullName: string; phone: string; city: string; neighborhood: string; details: string;
    mapHint: string; useMap: string; useText: string; coordsSaved: string;
    gpsButton: string; gpsRequesting: string; gpsDenied: string; gpsUnavailable: string;
    gpsDetected: string; gpsViewMaps: string;
    next: string; back: string;
    paymentTitle: string; paymentInstruction: string; amountToSend: string;
    proofTitle: string; proofHint: string; uploadCta: string; orDrop: string; proofUploaded: string;
    reviewTitle: string; placeOrder: string;
    confirmedTitle: string; confirmedSub: string;
    orderNumber: string; backHome: string; viewOrder: string;
    summary: string;
  };
  account: {
    title: string; profile: string; orders: string; addresses: string;
    notifications: string; logout: string;
    orderNumber: string; orderDate: string; orderItems: string; orderTotal: string;
    orderStatus: string; viewOrder: string;
  };
  admin: {
    title: string;
    dashboard: string; products: string; orders: string; customers: string;
    categories: string; settings: string;
    totalSales: string; totalSalesSub: string;
    newOrders: string; newOrdersSub: string;
    customersStat: string; customersStatSub: string;
    lowStock: string; lowStockSub: string;
    recentOrders: string;
    filterAll: string; filterPending: string; filterConfirmed: string;
    filterPreparing: string; filterShipped: string; filterDelivered: string; filterRejected: string;
    orderDetail: string; customer: string; deliveryAddress: string;
    paymentMethod: string; paymentProof: string; items: string; total: string;
    confirmPayment: string; rejectPayment: string;
    rejectReason: string; cancel: string; submit: string;
    statusTimeline: string; goShop: string;
    lang: string;
    viewAll: string; verifying: string;
    greeting: string; pendingMsg: string;
    lowStockTitle: string;
    quickActionEyebrow: string; addPerfume: string; addPerfumeSub: string; newProductCta: string;
    salesChart: string; salesChartTrend: string;
    searchPlaceholder: string;
    allOrders: string; placedOn: string;
    markPreparing: string; markShipped: string; markDelivered: string;
    founder: string;
    newProduct: string;
    colName: string; colSku: string; colCategory: string; colPrice: string; colStock: string; colStatus: string;
    active: string; edit: string; view: string;
    productsLc: string; newCategory: string;
    identity: string; paymentNumbers: string;
    shopName: string; phoneLabel: string; emailLabel: string; addressLabel: string; whatsappOfficial: string;
    save: string;
    formAddTitle: string; formCancel: string; formSave: string;
    formNameFr: string; formNameAr: string; formNameEn: string;
    formPrice: string; formStock: string; formCategory: string;
    formConcentration: string; formSize: string; formFamily: string;
    formDescription: string;
    formTopNotes: string; formHeartNotes: string; formBaseNotes: string;
    formImages: string; formImagesHint: string; formImagesMax: string;
    formSuccess: string;
  };
  status: {
    PENDING: string; CONFIRMED: string; PREPARING: string;
    SHIPPED: string; DELIVERED: string; REJECTED: string; CANCELLED: string;
  };
  common: { close: string; loading: string; currency: string };
}

const fr: Dict = {
  dir: 'ltr',
  nav: { catalog: 'Catalogue', collections: 'Collections', story: "L'Atelier", journal: 'Journal', wishlist: 'Favoris', cart: 'Panier', account: 'Mon Compte', admin: 'Administration', logout: 'Déconnexion' },
  home: {
    eyebrow: 'Maison de Parfum • Nouakchott',
    heroTitle: "L'art du parfum,\nné du désert",
    heroSub: "Douze fragrances rares composées entre l'Atlantique et l'Adrar — pour celles et ceux qui font de la sobriété un luxe.",
    heroCta: 'Découvrir la collection',
    heroSecondary: "L'histoire de la maison",
    marquee: 'LIVRAISON À NOUAKCHOTT • PAIEMENT BANKILY • SEDAD • MASRVI • COMMANDES VÉRIFIÉES SOUS 24H • LIVRAISON À NOUAKCHOTT',
    featured: 'Nouveautés',
    featuredSub: "Les compositions les plus récentes de l'atelier.",
    seeAll: 'Voir toute la collection',
    story: "L'atelier A&M",
    storyP1: "Fondée à Nouakchott en 2024 par Ammar El‑Maghevry, A&M Perfume puise dans la mémoire olfactive de la Mauritanie — le bois de l'Adrar, le sel atlantique, l'encens des veillées.",
    storyP2: 'Chaque parfum est composé en petites séries, conditionné à la main, et numéroté.',
    storyCta: "Lire l'histoire",
    categories: 'Univers olfactifs',
    newArrivals: 'Édition Limitée',
    newArrivalsSub: "Or et Encens — une composition d'orfèvre, numérotée à 200 exemplaires.",
    newsletter: 'Recevez nos compositions en avant‑première',
    newsletterSub: 'Une lettre tous les deux mois. Pas de bruit.',
    newsletterCta: "S'abonner",
    emailPlaceholder: 'Votre adresse e‑mail',
    footerTagline: 'Maison de parfum indépendante.\nNouakchott — Mauritanie.',
    footerShop: 'Boutique', footerHelp: 'Aide', footerFollow: 'Suivre',
  },
  catalog: { title: 'La collection', subtitle: 'Douze fragrances, composées en petites séries.', filters: 'Filtres', sort: 'Trier', sortNewest: 'Nouveautés', sortPriceAsc: 'Prix croissant', sortPriceDesc: 'Prix décroissant', category: 'Catégorie', family: 'Famille olfactive', price: 'Prix', inStock: 'En stock uniquement', clearAll: 'Tout effacer', results: 'résultats', noResults: 'Aucun parfum ne correspond.' },
  product: { addToCart: 'Ajouter au panier', addToWishlist: 'Ajouter aux favoris', addedToCart: 'Ajouté au panier', topNotes: 'Tête', heartNotes: 'Cœur', baseNotes: 'Fond', pyramid: 'Pyramide olfactive', composition: 'Composition', concentration: 'Concentration', size: 'Contenance', longevity: 'Longévité', sillage: 'Sillage', occasions: 'Occasions', seasons: 'Saisons', quantity: 'Quantité', inStock: 'En stock', lowStock: 'Stock limité', outOfStock: 'Épuisé', delivery: 'Livraison à Nouakchott sous 48h', payment: 'Bankily • Sedad • Masrvi', related: 'Vous aimerez aussi', back: 'Retour à la collection' },
  cart: { title: 'Votre panier', empty: 'Votre panier est vide.', emptyCta: 'Découvrir la collection', subtotal: 'Sous‑total', shipping: 'Livraison', toBeConfirmed: 'À confirmer', total: 'Total', checkout: 'Passer la commande', remove: 'Retirer', continueShopping: 'Continuer mes achats', items: 'articles', item: 'article' },
  checkout: {
    title: 'Finaliser la commande',
    step1: 'Livraison', step2: 'Paiement', step3: 'Justificatif', step4: 'Confirmation',
    fullName: 'Nom complet', phone: 'Téléphone', city: 'Ville', neighborhood: 'Quartier', details: 'Précisions (point de repère, étage…)',
    mapHint: 'Cliquez sur la carte pour épingler votre position exacte.',
    useMap: 'Épingler sur la carte', useText: 'Saisir manuellement',
    coordsSaved: 'Position enregistrée',
    gpsButton: '📍 Utiliser ma position actuelle',
    gpsRequesting: 'Détection en cours…',
    gpsDenied: 'Localisation refusée. Veuillez saisir votre adresse manuellement.',
    gpsUnavailable: 'Localisation non disponible, veuillez saisir votre adresse.',
    gpsDetected: 'Position détectée',
    gpsViewMaps: 'Voir sur Google Maps →',
    next: 'Continuer', back: 'Retour',
    paymentTitle: 'Méthode de paiement',
    paymentInstruction: "Envoyez le montant exact ci‑dessous au numéro correspondant, puis téléchargez la capture d'écran à l'étape suivante.",
    amountToSend: 'Montant exact à envoyer',
    proofTitle: 'Justificatif de paiement',
    proofHint: "Une capture d'écran de la transaction (JPG ou PNG, max 5 Mo).",
    uploadCta: 'Choisir un fichier', orDrop: 'ou glissez‑déposez',
    proofUploaded: 'Justificatif téléchargé',
    reviewTitle: 'Vérifiez votre commande',
    placeOrder: 'Confirmer la commande',
    confirmedTitle: 'Commande confirmée',
    confirmedSub: 'Notre équipe vérifiera votre paiement sous 24 heures. Vous serez notifié dès la validation.',
    orderNumber: 'Numéro de commande',
    backHome: "Retour à l'accueil", viewOrder: 'Suivre ma commande',
    summary: 'Récapitulatif',
  },
  account: { title: 'Mon compte', profile: 'Profil', orders: 'Commandes', addresses: 'Adresses', notifications: 'Notifications', logout: 'Déconnexion', orderNumber: 'N°', orderDate: 'Date', orderItems: 'Articles', orderTotal: 'Total', orderStatus: 'Statut', viewOrder: 'Voir' },
  admin: {
    title: 'Administration',
    dashboard: 'Tableau de bord', products: 'Produits', orders: 'Commandes', customers: 'Clientèle', categories: 'Catégories', settings: 'Paramètres',
    totalSales: "Chiffre d'affaires", totalSalesSub: 'sur 30 jours',
    newOrders: 'Commandes', newOrdersSub: 'à vérifier',
    customersStat: 'Clients', customersStatSub: 'ce mois',
    lowStock: 'Stock faible', lowStockSub: 'sous 5 unités',
    recentOrders: 'Commandes récentes',
    filterAll: 'Toutes', filterPending: 'À vérifier', filterConfirmed: 'Confirmées', filterPreparing: 'En préparation', filterShipped: 'Expédiées', filterDelivered: 'Livrées', filterRejected: 'Rejetées',
    orderDetail: 'Détail de la commande', customer: 'Client', deliveryAddress: 'Adresse de livraison', paymentMethod: 'Mode de paiement', paymentProof: 'Justificatif', items: 'Articles', total: 'Total',
    confirmPayment: 'Confirmer le paiement', rejectPayment: 'Rejeter',
    rejectReason: 'Motif du refus', cancel: 'Annuler', submit: 'Envoyer',
    statusTimeline: 'Historique du statut',
    goShop: '← Retour au site',
    lang: 'Langue',
    viewAll: 'Voir tout →', verifying: 'Vérification…',
    greeting: 'Bonjour', pendingMsg: 'commande(s) en attente de vérification.',
    lowStockTitle: 'Stock faible',
    quickActionEyebrow: 'Action rapide', addPerfume: 'Ajouter un parfum',
    addPerfumeSub: 'Composition, notes, prix, stock — en 3 minutes.',
    newProductCta: 'Nouveau produit →',
    salesChart: 'Ventes sur 30 jours', salesChartTrend: '+12,4% vs mois précédent',
    searchPlaceholder: 'Rechercher une commande, un produit…',
    allOrders: 'Toutes les commandes', placedOn: 'Passée le',
    markPreparing: 'Marquer en préparation →', markShipped: 'Marquer expédiée →', markDelivered: 'Marquer livrée ✓',
    founder: 'Fondateur',
    newProduct: '+ Nouveau produit',
    colName: 'Nom', colSku: 'SKU', colCategory: 'Catégorie', colPrice: 'Prix', colStock: 'Stock', colStatus: 'Statut',
    active: 'Actif', edit: 'Éditer', view: 'Voir',
    productsLc: 'produits', newCategory: '+ Nouvelle catégorie',
    identity: 'Identité', paymentNumbers: 'Numéros de paiement',
    shopName: 'Nom de la boutique', phoneLabel: 'Téléphone', emailLabel: 'E-mail', addressLabel: 'Adresse', whatsappOfficial: 'WhatsApp (lien officiel)',
    save: 'Enregistrer',
    formAddTitle: 'Nouveau produit', formCancel: 'Annuler', formSave: 'Enregistrer',
    formNameFr: 'Nom (FR)', formNameAr: 'Nom (AR)', formNameEn: 'Nom (EN)',
    formPrice: 'Prix (MRU)', formStock: 'Stock', formCategory: 'Catégorie',
    formConcentration: 'Concentration', formSize: 'Contenance', formFamily: 'Famille',
    formDescription: 'Description',
    formTopNotes: 'Notes de tête (séparées par virgule)', formHeartNotes: 'Notes de cœur (séparées par virgule)', formBaseNotes: 'Notes de fond (séparées par virgule)',
    formImages: 'Photos du produit (max 4)', formImagesHint: 'Glissez-déposez ou cliquez pour ajouter', formImagesMax: 'JPG · PNG · max 5 Mo · 1ère photo = image principale',
    formSuccess: 'Produit ajouté avec succès !',
  },
  status: { PENDING: 'À vérifier', CONFIRMED: 'Confirmée', PREPARING: 'En préparation', SHIPPED: 'Expédiée', DELIVERED: 'Livrée', REJECTED: 'Rejetée', CANCELLED: 'Annulée' },
  common: { close: 'Fermer', loading: 'Chargement…', currency: 'MRU' },
};

const en: Dict = {
  dir: 'ltr',
  nav: { catalog: 'Catalog', collections: 'Collections', story: 'The Atelier', journal: 'Journal', wishlist: 'Wishlist', cart: 'Cart', account: 'Account', admin: 'Admin', logout: 'Sign out' },
  home: {
    eyebrow: 'Perfume House • Nouakchott',
    heroTitle: 'The art of perfume,\nborn of the desert',
    heroSub: 'Twelve rare fragrances composed between the Atlantic and the Adrar — for those who treat restraint as a luxury.',
    heroCta: 'Discover the collection',
    heroSecondary: 'About the house',
    marquee: 'DELIVERY TO NOUAKCHOTT • PAY WITH BANKILY • SEDAD • MASRVI • ORDERS VERIFIED WITHIN 24H • DELIVERY TO NOUAKCHOTT',
    featured: 'New arrivals',
    featuredSub: "The atelier's most recent compositions.",
    seeAll: 'See the entire collection',
    story: 'The A&M atelier',
    storyP1: 'Founded in Nouakchott in 2024 by Ammar El‑Maghevry, A&M Perfume draws on the olfactive memory of Mauritania — the wood of the Adrar, Atlantic salt, the incense of long evenings.',
    storyP2: 'Each scent is composed in small batches, bottled by hand, and numbered.',
    storyCta: 'Read the story',
    categories: 'Olfactive universes',
    newArrivals: 'Limited Edition',
    newArrivalsSub: "Or et Encens — a master goldsmith's composition, numbered to 200.",
    newsletter: 'Receive our compositions in preview',
    newsletterSub: 'A letter every two months. No noise.',
    newsletterCta: 'Subscribe',
    emailPlaceholder: 'Your email address',
    footerTagline: 'Independent perfume house.\nNouakchott — Mauritania.',
    footerShop: 'Shop', footerHelp: 'Help', footerFollow: 'Follow',
  },
  catalog: { title: 'The collection', subtitle: 'Twelve fragrances, composed in small batches.', filters: 'Filters', sort: 'Sort', sortNewest: 'Newest', sortPriceAsc: 'Price low to high', sortPriceDesc: 'Price high to low', category: 'Category', family: 'Olfactive family', price: 'Price', inStock: 'In stock only', clearAll: 'Clear all', results: 'results', noResults: 'No fragrance matches.' },
  product: { addToCart: 'Add to cart', addToWishlist: 'Add to wishlist', addedToCart: 'Added to cart', topNotes: 'Top', heartNotes: 'Heart', baseNotes: 'Base', pyramid: 'Fragrance pyramid', composition: 'Composition', concentration: 'Concentration', size: 'Size', longevity: 'Longevity', sillage: 'Sillage', occasions: 'Occasions', seasons: 'Seasons', quantity: 'Quantity', inStock: 'In stock', lowStock: 'Low stock', outOfStock: 'Sold out', delivery: 'Delivered in Nouakchott within 48h', payment: 'Bankily • Sedad • Masrvi', related: 'You may also like', back: 'Back to collection' },
  cart: { title: 'Your bag', empty: 'Your bag is empty.', emptyCta: 'Discover the collection', subtotal: 'Subtotal', shipping: 'Shipping', toBeConfirmed: 'To be confirmed', total: 'Total', checkout: 'Checkout', remove: 'Remove', continueShopping: 'Continue shopping', items: 'items', item: 'item' },
  checkout: {
    title: 'Checkout',
    step1: 'Delivery', step2: 'Payment', step3: 'Proof', step4: 'Confirmation',
    fullName: 'Full name', phone: 'Phone', city: 'City', neighborhood: 'Neighborhood', details: 'Details (landmark, floor…)',
    mapHint: 'Click on the map to pin your exact location.',
    useMap: 'Pin on map', useText: 'Enter manually',
    coordsSaved: 'Location saved',
    gpsButton: '📍 Use my current location',
    gpsRequesting: 'Detecting…',
    gpsDenied: 'Location permission denied. Please enter your address manually.',
    gpsUnavailable: 'Location unavailable, please enter your address.',
    gpsDetected: 'Location detected',
    gpsViewMaps: 'View on Google Maps →',
    next: 'Continue', back: 'Back',
    paymentTitle: 'Payment method',
    paymentInstruction: 'Send the exact amount below to the corresponding number, then upload the screenshot in the next step.',
    amountToSend: 'Exact amount',
    proofTitle: 'Payment proof',
    proofHint: 'A screenshot of the transaction (JPG or PNG, max 5MB).',
    uploadCta: 'Choose a file', orDrop: 'or drag and drop',
    proofUploaded: 'Proof uploaded',
    reviewTitle: 'Review your order',
    placeOrder: 'Place order',
    confirmedTitle: 'Order confirmed',
    confirmedSub: 'Our team will verify your payment within 24 hours. You will be notified upon validation.',
    orderNumber: 'Order number',
    backHome: 'Back to home', viewOrder: 'Track my order',
    summary: 'Summary',
  },
  account: { title: 'My account', profile: 'Profile', orders: 'Orders', addresses: 'Addresses', notifications: 'Notifications', logout: 'Sign out', orderNumber: '#', orderDate: 'Date', orderItems: 'Items', orderTotal: 'Total', orderStatus: 'Status', viewOrder: 'View' },
  admin: {
    title: 'Admin',
    dashboard: 'Dashboard', products: 'Products', orders: 'Orders', customers: 'Customers', categories: 'Categories', settings: 'Settings',
    totalSales: 'Revenue', totalSalesSub: '30 days',
    newOrders: 'Orders', newOrdersSub: 'to verify',
    customersStat: 'Customers', customersStatSub: 'this month',
    lowStock: 'Low stock', lowStockSub: 'under 5 units',
    recentOrders: 'Recent orders',
    filterAll: 'All', filterPending: 'To verify', filterConfirmed: 'Confirmed', filterPreparing: 'Preparing', filterShipped: 'Shipped', filterDelivered: 'Delivered', filterRejected: 'Rejected',
    orderDetail: 'Order detail', customer: 'Customer', deliveryAddress: 'Delivery address', paymentMethod: 'Payment method', paymentProof: 'Proof of payment', items: 'Items', total: 'Total',
    confirmPayment: 'Confirm payment', rejectPayment: 'Reject',
    rejectReason: 'Rejection reason', cancel: 'Cancel', submit: 'Send',
    statusTimeline: 'Status history',
    goShop: '← Back to site',
    lang: 'Language',
    viewAll: 'See all →', verifying: 'Verifying…',
    greeting: 'Hello', pendingMsg: 'order(s) pending verification.',
    lowStockTitle: 'Low stock',
    quickActionEyebrow: 'Quick action', addPerfume: 'Add a fragrance',
    addPerfumeSub: 'Composition, notes, price, stock — in 3 minutes.',
    newProductCta: 'New product →',
    salesChart: 'Sales over 30 days', salesChartTrend: '+12.4% vs previous month',
    searchPlaceholder: 'Search an order, a product…',
    allOrders: 'All orders', placedOn: 'Placed on',
    markPreparing: 'Mark as preparing →', markShipped: 'Mark as shipped →', markDelivered: 'Mark as delivered ✓',
    founder: 'Founder',
    newProduct: '+ New product',
    colName: 'Name', colSku: 'SKU', colCategory: 'Category', colPrice: 'Price', colStock: 'Stock', colStatus: 'Status',
    active: 'Active', edit: 'Edit', view: 'View',
    productsLc: 'products', newCategory: '+ New category',
    identity: 'Identity', paymentNumbers: 'Payment numbers',
    shopName: 'Shop name', phoneLabel: 'Phone', emailLabel: 'E-mail', addressLabel: 'Address', whatsappOfficial: 'WhatsApp (official link)',
    save: 'Save',
    formAddTitle: 'New product', formCancel: 'Cancel', formSave: 'Save',
    formNameFr: 'Name (FR)', formNameAr: 'Name (AR)', formNameEn: 'Name (EN)',
    formPrice: 'Price (MRU)', formStock: 'Stock', formCategory: 'Category',
    formConcentration: 'Concentration', formSize: 'Size', formFamily: 'Family',
    formDescription: 'Description',
    formTopNotes: 'Top notes (comma separated)', formHeartNotes: 'Heart notes (comma separated)', formBaseNotes: 'Base notes (comma separated)',
    formImages: 'Product photos (max 4)', formImagesHint: 'Drag & drop or click to add', formImagesMax: 'JPG · PNG · max 5 MB · 1st photo = main image',
    formSuccess: 'Product added successfully!',
  },
  status: { PENDING: 'To verify', CONFIRMED: 'Confirmed', PREPARING: 'Preparing', SHIPPED: 'Shipped', DELIVERED: 'Delivered', REJECTED: 'Rejected', CANCELLED: 'Cancelled' },
  common: { close: 'Close', loading: 'Loading…', currency: 'MRU' },
};

const ar: Dict = {
  dir: 'rtl',
  nav: { catalog: 'المتجر', collections: 'المجموعات', story: 'الورشة', journal: 'المدوّنة', wishlist: 'المفضلة', cart: 'السلة', account: 'حسابي', admin: 'لوحة التحكم', logout: 'تسجيل الخروج' },
  home: {
    eyebrow: 'ماسون دو بارفان — نواكشوط',
    heroTitle: 'فن العطر،\nمن قلب الصحراء',
    heroSub: 'عطور استثنائية من قلب الصحراء — لمن يجد في الرقي طريقة حياة.',
    heroCta: 'اكتشف التشكيلة',
    heroSecondary: 'حكاية الدار',
    marquee: 'توصيل داخل نواكشوط • الدفع عبر بنكيلي • سداد • مصرفي • التحقق من الطلبات خلال 24 ساعة • توصيل داخل نواكشوط',
    featured: 'وصل حديثاً',
    featuredSub: 'أحدث إبداعات الورشة.',
    seeAll: 'استعراض كامل التشكيلة',
    story: 'ورشة A&M',
    storyP1: 'تأسست في نواكشوط عام 2024 على يد عمار المغفري، تستلهم A&M Perfume ذاكرة موريتانيا العطرية — خشب آدرار، ملح المحيط الأطلسي، وبخور السهرات الطويلة.',
    storyP2: 'كل عطر يُصنع بكميات محدودة، يُعبَّأ باليد، ويُرقَّم.',
    storyCta: 'اقرأ الحكاية',
    categories: 'عوالم عطرية',
    newArrivals: 'إصدار محدود',
    newArrivalsSub: 'ذهب وبخور — تركيبة نادرة، مرقّمة في 200 نسخة فقط.',
    newsletter: 'كن أول من يكتشف تركيباتنا',
    newsletterSub: 'رسالة كل شهرين. بلا ضجيج.',
    newsletterCta: 'اشترك الآن',
    emailPlaceholder: 'بريدك الإلكتروني',
    footerTagline: 'دار عطور مستقلة.\nنواكشوط — موريتانيا.',
    footerShop: 'المتجر', footerHelp: 'المساعدة', footerFollow: 'تابعنا',
  },
  catalog: { title: 'المتجر', subtitle: 'عطور استثنائية، تُصنع على دفعات محدودة.', filters: 'تصفية', sort: 'ترتيب', sortNewest: 'الأحدث', sortPriceAsc: 'السعر من الأقل', sortPriceDesc: 'السعر من الأعلى', category: 'الفئة', family: 'العائلة العطرية', price: 'السعر', inStock: 'المتوفر فقط', clearAll: 'مسح التصفية', results: 'نتيجة', noResults: 'لا توجد عطور مطابقة.' },
  product: { addToCart: 'أضف إلى السلة', addToWishlist: 'أضف إلى المفضلة', addedToCart: 'أُضيف إلى السلة', topNotes: 'نوتات القمة', heartNotes: 'نوتات القلب', baseNotes: 'نوتات القاعدة', pyramid: 'الهرم العطري', composition: 'التركيبة', concentration: 'التركيز', size: 'الحجم', longevity: 'مدة الثبات', sillage: 'مدى الانتشار', occasions: 'المناسبات', seasons: 'الفصول', quantity: 'الكمية', inStock: 'متوفر', lowStock: 'كميات محدودة', outOfStock: 'نفد المخزون', delivery: 'توصيل إلى نواكشوط خلال 48 ساعة', payment: 'بنكيلي • سداد • مصرفي', related: 'قد يعجبك أيضاً', back: 'العودة إلى المتجر' },
  cart: { title: 'سلّتي', empty: 'سلتك فارغة', emptyCta: 'اكتشف المتجر', subtotal: 'المجموع الجزئي', shipping: 'التوصيل', toBeConfirmed: 'يُحدَّد لاحقاً', total: 'الإجمالي', checkout: 'إتمام الطلب', remove: 'إزالة', continueShopping: 'مواصلة التسوق', items: 'منتجات', item: 'منتج' },
  checkout: {
    title: 'إتمام الطلب',
    step1: 'التوصيل', step2: 'الدفع', step3: 'إثبات الدفع', step4: 'تأكيد الطلب',
    fullName: 'الاسم الكامل', phone: 'رقم الهاتف', city: 'المدينة', neighborhood: 'الحي', details: 'تفاصيل إضافية (معلم قريب، الطابق…)',
    mapHint: 'انقر على الخريطة لتحديد موقعك بدقة.',
    useMap: 'تحديد على الخريطة', useText: 'إدخال يدوي',
    coordsSaved: 'تم حفظ الموقع',
    gpsButton: '📍 استخدم موقعي الحالي',
    gpsRequesting: 'جارٍ تحديد الموقع…',
    gpsDenied: 'تم رفض إذن الموقع. يرجى إدخال عنوانك يدوياً.',
    gpsUnavailable: 'تحديد الموقع غير متاح، يرجى إدخال عنوانك.',
    gpsDetected: 'تم تحديد الموقع',
    gpsViewMaps: 'عرض على خرائط Google ←',
    next: 'متابعة', back: 'رجوع',
    paymentTitle: 'طريقة الدفع',
    paymentInstruction: 'حوّل المبلغ المحدد إلى الرقم المناسب، ثم ارفع لقطة الشاشة في الخطوة التالية.',
    amountToSend: 'المبلغ الواجب تحويله',
    proofTitle: 'إثبات الدفع',
    proofHint: 'لقطة شاشة لعملية التحويل (JPG أو PNG، بحد أقصى 5 ميغابايت).',
    uploadCta: 'اختر ملفاً', orDrop: 'أو اسحب وأفلت',
    proofUploaded: 'تم رفع الإثبات بنجاح',
    reviewTitle: 'مراجعة طلبك',
    placeOrder: 'تأكيد الطلب',
    confirmedTitle: 'تم تأكيد طلبك',
    confirmedSub: 'سيتحقق فريقنا من الدفع خلال 24 ساعة وستصلك إشعار بالموافقة.',
    orderNumber: 'رقم الطلب',
    backHome: 'العودة إلى الرئيسية', viewOrder: 'تتبع طلبي',
    summary: 'ملخص الطلب',
  },
  account: { title: 'حسابي', profile: 'الملف الشخصي', orders: 'طلباتي', addresses: 'عناويني', notifications: 'الإشعارات', logout: 'تسجيل الخروج', orderNumber: 'رقم الطلب', orderDate: 'التاريخ', orderItems: 'المنتجات', orderTotal: 'الإجمالي', orderStatus: 'الحالة', viewOrder: 'عرض' },
  admin: {
    title: 'لوحة الإدارة',
    dashboard: 'الرئيسية', products: 'المنتجات', orders: 'الطلبات', customers: 'العملاء', categories: 'الفئات', settings: 'الإعدادات',
    totalSales: 'الإيرادات', totalSalesSub: 'آخر 30 يوماً',
    newOrders: 'الطلبات', newOrdersSub: 'بانتظار التحقق',
    customersStat: 'العملاء', customersStatSub: 'هذا الشهر',
    lowStock: 'مخزون منخفض', lowStockSub: 'أقل من 5 قطع',
    recentOrders: 'أحدث الطلبات',
    filterAll: 'الكل', filterPending: 'بانتظار التحقق', filterConfirmed: 'مؤكدة', filterPreparing: 'قيد التحضير', filterShipped: 'تم الشحن', filterDelivered: 'تم التسليم', filterRejected: 'مرفوضة',
    orderDetail: 'تفاصيل الطلب', customer: 'العميل', deliveryAddress: 'عنوان التوصيل', paymentMethod: 'طريقة الدفع', paymentProof: 'إثبات الدفع', items: 'المنتجات', total: 'الإجمالي',
    confirmPayment: 'تأكيد الدفع', rejectPayment: 'رفض الطلب',
    rejectReason: 'سبب الرفض', cancel: 'إلغاء', submit: 'إرسال',
    statusTimeline: 'سجل الحالة',
    goShop: '← العودة إلى المتجر',
    lang: 'اللغة',
    viewAll: 'عرض الكل ←', verifying: 'جارٍ التحقق…',
    greeting: 'مرحباً', pendingMsg: 'طلب بانتظار التحقق.',
    lowStockTitle: 'مخزون منخفض',
    quickActionEyebrow: 'إجراء سريع', addPerfume: 'إضافة عطر جديد',
    addPerfumeSub: 'تركيبة، نوتات، سعر، مخزون — في دقائق.',
    newProductCta: 'منتج جديد ←',
    salesChart: 'المبيعات خلال 30 يوماً', salesChartTrend: '+12.4% مقارنة بالشهر الماضي',
    searchPlaceholder: 'ابحث عن طلب أو منتج…',
    allOrders: 'جميع الطلبات', placedOn: 'بتاريخ',
    markPreparing: 'تحويل إلى قيد التحضير ←', markShipped: 'تحويل إلى مشحون ←', markDelivered: 'تأكيد التسليم ✓',
    founder: 'المؤسس',
    newProduct: '+ منتج جديد',
    colName: 'اسم المنتج', colSku: 'الرمز', colCategory: 'الفئة', colPrice: 'السعر', colStock: 'المخزون', colStatus: 'الحالة',
    active: 'نشط', edit: 'تعديل', view: 'عرض',
    productsLc: 'منتجات', newCategory: '+ فئة جديدة',
    identity: 'هوية المتجر', paymentNumbers: 'أرقام الدفع',
    shopName: 'اسم المتجر', phoneLabel: 'رقم الهاتف', emailLabel: 'البريد الإلكتروني', addressLabel: 'العنوان', whatsappOfficial: 'واتساب (الرابط الرسمي)',
    save: 'حفظ التغييرات',
    formAddTitle: 'إضافة منتج جديد', formCancel: 'إلغاء', formSave: 'حفظ',
    formNameFr: 'الاسم بالفرنسية', formNameAr: 'الاسم بالعربية', formNameEn: 'الاسم بالإنجليزية',
    formPrice: 'السعر (أوقية موريتانية)', formStock: 'الكمية المتوفرة', formCategory: 'الفئة',
    formConcentration: 'التركيز', formSize: 'الحجم', formFamily: 'العائلة العطرية',
    formDescription: 'الوصف',
    formTopNotes: 'نوتات القمة (مفصولة بفاصلة)', formHeartNotes: 'نوتات القلب (مفصولة بفاصلة)', formBaseNotes: 'نوتات القاعدة (مفصولة بفاصلة)',
    formImages: 'صور المنتج (بحد أقصى 4)', formImagesHint: 'اسحب الصور هنا أو انقر للإضافة', formImagesMax: 'JPG · PNG · حد أقصى 5 ميغابايت · الصورة الأولى = الصورة الرئيسية',
    formSuccess: 'تمت إضافة المنتج بنجاح!',
  },
  status: { PENDING: 'بانتظار التحقق', CONFIRMED: 'مؤكدة', PREPARING: 'قيد التحضير', SHIPPED: 'تم الشحن', DELIVERED: 'تم التسليم', REJECTED: 'مرفوضة', CANCELLED: 'ملغاة' },
  common: { close: 'إغلاق', loading: 'جارٍ التحميل…', currency: 'أوقية موريتانية' },
};

const dicts: Record<Locale, Dict> = { fr, ar, en };

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}
