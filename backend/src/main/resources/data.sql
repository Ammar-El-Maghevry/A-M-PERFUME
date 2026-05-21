-- Idempotent seed for settings + categories.
-- Admin user and products are seeded in DataSeeder.java (bcrypt is computed at runtime).

INSERT INTO categories (slug, name_fr, name_ar, name_en, position, active, created_at, updated_at) VALUES
  ('women',    'Pour Femme',      'نسائي',          'Women',           1, true, NOW(), NOW()),
  ('men',      'Pour Homme',      'رجالي',          'Men',             2, true, NOW(), NOW()),
  ('unisex',   'Unisexe',         'مشترك',          'Unisex',          3, true, NOW(), NOW()),
  ('oriental', 'Oriental',        'شرقي',           'Oriental',        4, true, NOW(), NOW()),
  ('limited',  'Édition Limitée', 'إصدارات محدودة', 'Limited Edition', 5, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO site_settings (setting_key, "value", description, updated_at) VALUES
  ('shop.name',         'A&M Perfume',                 'Display name of the boutique',             NOW()),
  ('shop.phone',        '+222 38 12 04 04',            'Primary contact phone',                    NOW()),
  ('shop.email',        'contact@amperfume.mr',        'Primary contact e-mail',                   NOW()),
  ('shop.address',      'Nouakchott, Mauritanie',      'Physical address',                         NOW()),
  ('shop.currency',     'MRU',                         'Default display currency',                 NOW()),
  ('payment.bankily',   '22 33 44 55',                 'Bankily merchant number',                  NOW()),
  ('payment.sedad',     '36 11 88 22',                 'Sedad merchant number',                    NOW()),
  ('payment.masrvi',    '42 09 77 14',                 'Masrvi merchant number',                   NOW()),
  ('payment.whatsapp',  'https://www.tiktok.com/link/v2?aid=1988&lang=fr&scene=bio_url&target=https%3A%2F%2Fwa.me%2Fmessage%2FRKG2ZIH3O7XHL1', 'Official WhatsApp link (use this URL only)', NOW()),
  ('shipping.fee',      '0',                           'Default shipping fee in MRU',              NOW()),
  ('shipping.eta',      '48h',                         'Delivery promise for Nouakchott',          NOW())
ON CONFLICT DO NOTHING;
