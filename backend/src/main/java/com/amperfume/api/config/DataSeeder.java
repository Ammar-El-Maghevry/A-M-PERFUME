package com.amperfume.api.config;

import com.amperfume.api.entity.Category;
import com.amperfume.api.entity.Product;
import com.amperfume.api.entity.User;
import com.amperfume.api.enums.Role;
import com.amperfume.api.repository.CategoryRepository;
import com.amperfume.api.repository.ProductRepository;
import com.amperfume.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@amperfume.mr";
    private static final String ADMIN_PASSWORD = "Admin@2024";

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedProducts();
    }

    private void seedAdmin() {
        if (userRepository.findByEmailIgnoreCase(ADMIN_EMAIL).isPresent()) return;
        User admin = User.builder()
                .fullName("A&M Admin")
                .email(ADMIN_EMAIL)
                .phone("+222 38 12 04 04")
                .passwordHash(passwordEncoder.encode(ADMIN_PASSWORD))
                .role(Role.ADMIN)
                .active(true)
                .build();
        userRepository.save(admin);
        log.info("Seeded admin user {} (default password: {})", ADMIN_EMAIL, ADMIN_PASSWORD);
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        Map<String, Category> cats = loadCategoriesBySlug();
        if (cats.isEmpty()) {
            log.warn("No categories present — skipping product seed (rerun after categories are loaded)");
            return;
        }

        List<Product> products = List.of(
                build("nuit-datlas",         "AMP-001", cats.get("men"),
                        "Nuit d'Atlas", "ليل الأطلس", "Atlas Night",
                        "Un voyage olfactif dans les montagnes mauresques",
                        "Une fragrance audacieuse qui capture l'essence mystérieuse de la nuit saharienne. " +
                                "Notes de cèdre, ambre, et une touche de musc pour un sillage inoubliable.",
                        "Oriental Boisé", "8500", 24,
                        "Eau de Parfum", "100ml", "8–10 heures", "Modéré à fort",
                        "Automne,Hiver", "Soirée,Événement spécial",
                        "Bergamote,Poivre Noir,Cardamome",
                        "Rose de Damas,Cèdre,Cuir",
                        "Ambre,Musc Blanc,Vanille",
                        "midnight", "#2a2520", false),
                build("rose-de-chinguetti",  "AMP-002", cats.get("women"),
                        "Rose de Chinguetti", "وردة شنقيط", "Chinguetti Rose",
                        "L'éclat délicat des oasis anciennes",
                        "Un bouquet floral lumineux puisant son inspiration dans les jardins de Chinguetti. " +
                                "La rose centifolia s'épanouit sur un fond de muscs poudrés et de cèdre blanc.",
                        "Floral", "9200", 18,
                        "Eau de Parfum", "100ml", "6–8 heures", "Modéré",
                        "Printemps,Été", "Quotidien,Romance",
                        "Bergamote,Mandarine,Rose",
                        "Jasmin,Muguet,Pivoine",
                        "Musc Blanc,Cèdre,Iris",
                        "rose", "#a87f74", false),
                build("sahara-blanc",        "AMP-003", cats.get("unisex"),
                        "Sahara Blanc", "الصحراء البيضاء", "White Sahara",
                        "L'épure d'un horizon à perte de vue",
                        "Une composition limpide où le bois flotté rencontre les muscs blancs. " +
                                "Un voile transparent, sec et solaire, comme une dune au lever du jour.",
                        "Boisé Musqué", "7800", 30,
                        "Eau de Parfum", "100ml", "6–8 heures", "Discret",
                        "Toutes saisons", "Quotidien,Bureau",
                        "Aldéhydes,Citron,Mandarine",
                        "Iris,Coton,Lavande",
                        "Musc Blanc,Bois de Cachemire,Ambrette",
                        "sand", "#c6b292", false),
                build("oud-royal",           "AMP-004", cats.get("oriental"),
                        "Oud Royal", "عود ملكي", "Royal Oud",
                        "L'or noir des forêts d'Asie centrale",
                        "Le oud, joyau sacré, sublimé par le safran et la rose de Taïf. " +
                                "Une étreinte chaleureuse, profonde, magistrale.",
                        "Oriental", "12500", 12,
                        "Extrait de Parfum", "100ml", "10–12 heures", "Fort",
                        "Automne,Hiver", "Soirée,Événement spécial",
                        "Safran,Bergamote,Poivre Rose",
                        "Rose de Taïf,Patchouli,Cuir",
                        "Oud,Ambre Gris,Santal",
                        "oud", "#5c3a26", false),
                build("brise-du-desert",     "AMP-005", cats.get("unisex"),
                        "Brise du Désert", "نسيم الصحراء", "Desert Breeze",
                        "Un souffle marin sur les dunes",
                        "L'air vif de l'océan Atlantique qui caresse les côtes mauritaniennes. " +
                                "Fraîcheur saline, agrumes et notes vertes pour une signature lumineuse.",
                        "Frais Aquatique", "6900", 35,
                        "Eau de Toilette", "100ml", "4–6 heures", "Léger",
                        "Printemps,Été", "Quotidien,Sport",
                        "Citron Vert,Pamplemousse,Menthe",
                        "Notes Marines,Sel,Thé Vert",
                        "Vétiver,Ambrette,Bois Clair",
                        "water", "#6f8895", false),
                build("ambre-mystique",      "AMP-006", cats.get("women"),
                        "Ambre Mystique", "عنبر الغموض", "Mystic Amber",
                        "Une caresse de soie et de miel",
                        "L'ambre se love dans la vanille et le benjoin pour révéler une fragrance enveloppante, " +
                                "sensuelle, presque hypnotique.",
                        "Oriental Gourmand", "10400", 15,
                        "Eau de Parfum", "100ml", "8–10 heures", "Modéré",
                        "Automne,Hiver", "Soirée,Romance",
                        "Bergamote,Poire,Cassis",
                        "Jasmin Sambac,Tubéreuse,Cannelle",
                        "Ambre,Vanille de Madagascar,Benjoin",
                        "amber", "#a07642", false),
                build("cedre-de-ladrar",     "AMP-007", cats.get("men"),
                        "Cèdre de l'Adrar", "أرز آدرار", "Adrar Cedar",
                        "La force tranquille du bois ancien",
                        "Une ode au cèdre majestueux du massif de l'Adrar. " +
                                "Vétiver fumé, encens et cuir doux pour une silhouette racée.",
                        "Boisé", "7500", 22,
                        "Eau de Parfum", "100ml", "6–8 heures", "Modéré",
                        "Automne,Hiver", "Bureau,Soirée",
                        "Bergamote,Élémi,Genièvre",
                        "Cèdre,Encens,Iris",
                        "Vétiver,Cuir,Patchouli",
                        "cedar", "#7d6147", false),
                build("fleur-de-nouakchott", "AMP-008", cats.get("women"),
                        "Fleur de Nouakchott", "زهرة نواكشوط", "Nouakchott Bloom",
                        "L'élégance d'une capitale de sable",
                        "Frangipanier et jasmin caressés par la brise atlantique. " +
                                "Une floralité aérée, lumineuse, contemporaine.",
                        "Floral Frais", "8800", 20,
                        "Eau de Parfum", "100ml", "6–8 heures", "Modéré",
                        "Printemps,Été", "Quotidien,Cocktail",
                        "Néroli,Bergamote,Poivre Rose",
                        "Frangipanier,Jasmin,Magnolia",
                        "Musc,Bois Blanc,Ambrette",
                        "bloom", "#bca08b", false),
                build("mystere-noir",        "AMP-009", cats.get("men"),
                        "Mystère Noir", "السر الأسود", "Black Mystery",
                        "L'ombre dense d'une nuit sans lune",
                        "Encens noir, oud léger et tabac blond. " +
                                "Une fragrance d'apparat, secrète et magnétique.",
                        "Oriental Épicé", "11200", 10,
                        "Eau de Parfum", "100ml", "10–12 heures", "Fort",
                        "Automne,Hiver", "Soirée,Événement spécial",
                        "Poivre Noir,Cardamome,Élémi",
                        "Encens,Cuir,Tabac",
                        "Oud,Patchouli,Ambre Noir",
                        "noir", "#272422", false),
                build("lumiere-du-sud",      "AMP-010", cats.get("unisex"),
                        "Lumière du Sud", "نور الجنوب", "Southern Light",
                        "Un soleil zénithal sur la peau",
                        "Citrons de Sicile, néroli et thé matcha. " +
                                "Une eau solaire, gaie, infiniment portable.",
                        "Hespéridé Aromatique", "6500", 40,
                        "Eau de Toilette", "100ml", "4–6 heures", "Léger",
                        "Printemps,Été", "Quotidien,Bureau",
                        "Citron,Bergamote,Petitgrain",
                        "Néroli,Thé Vert,Romarin",
                        "Bois Blond,Musc,Mousse de Chêne",
                        "sun", "#c2a04a", false),
                build("or-et-encens",        "AMP-011", cats.get("limited"),
                        "Or et Encens", "ذهب وبخور", "Gold & Frankincense",
                        "La fragrance des cérémonies sacrées",
                        "Édition rare, numérotée. Encens d'Oman, myrrhe et safran " +
                                "sur un cœur d'oud cambodgien. Un parfum d'orfèvre.",
                        "Oriental", "18500", 5,
                        "Extrait de Parfum", "50ml", "12+ heures", "Très fort",
                        "Automne,Hiver", "Cérémonie,Collection",
                        "Encens,Safran,Élémi",
                        "Myrrhe,Rose Noire,Cuir",
                        "Oud Cambodgien,Ambre Gris,Or liquide",
                        "gold", "#8a6d33", true),
                build("vanille-de-tichitt",  "AMP-012", cats.get("women"),
                        "Vanille de Tichitt", "فانيليا تيشيت", "Tichitt Vanilla",
                        "Une gourmandise au cœur du désert",
                        "La vanille Bourbon adoucit le bois de gaïac et le bois de santal. " +
                                "Une signature chaleureuse et délicatement sucrée.",
                        "Gourmand", "9500", 25,
                        "Eau de Parfum", "100ml", "8–10 heures", "Modéré",
                        "Automne,Hiver", "Quotidien,Romance",
                        "Poire,Bergamote,Cassis",
                        "Fève Tonka,Coumarine,Iris",
                        "Vanille Bourbon,Santal,Gaïac",
                        "vanilla", "#a78f64", false)
        );
        productRepository.saveAll(products);
        log.info("Seeded {} products", products.size());
    }

    private Map<String, Category> loadCategoriesBySlug() {
        return categoryRepository.findAll().stream()
                .collect(java.util.stream.Collectors.toMap(
                        c -> c.getSlug().toLowerCase(),
                        c -> c,
                        (a, b) -> a
                ));
    }

    private Product build(String slug, String sku, Category category,
                          String nameFr, String nameAr, String nameEn,
                          String tagline, String description,
                          String family, String price, int stock,
                          String concentration, String size,
                          String longevity, String sillage,
                          String seasons, String occasions,
                          String top, String heart, String base,
                          String hue, String accent, boolean limited) {
        return Product.builder()
                .slug(slug).sku(sku).category(category)
                .nameFr(nameFr).nameAr(nameAr).nameEn(nameEn)
                .tagline(tagline).description(description)
                .family(family).price(new BigDecimal(price)).stock(stock)
                .concentration(concentration).size(size)
                .longevity(longevity).sillage(sillage)
                .seasons(seasons).occasions(occasions)
                .topNotes(top).heartNotes(heart).baseNotes(base)
                .hue(hue).accent(accent)
                .limitedEdition(limited).active(true)
                .build();
    }
}
