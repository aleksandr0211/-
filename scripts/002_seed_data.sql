-- Добавляем категории
insert into public.categories (name, slug, description, sort_order) values
  ('Женская парфюмерия', 'women', 'Изысканные ароматы для женщин', 1),
  ('Мужская парфюмерия', 'men', 'Стильные ароматы для мужчин', 2),
  ('Унисекс', 'unisex', 'Универсальные ароматы', 3),
  ('Нишевая парфюмерия', 'niche', 'Эксклюзивные нишевые ароматы', 4)
on conflict (slug) do nothing;

-- Добавляем товары
insert into public.products (name, slug, description, short_description, price, old_price, volume, brand, category_id, is_featured, is_new) values
  ('Chanel No. 5', 'chanel-no-5', 'Легендарный аромат, воплощающий женственность и элегантность. Букет из цветочных нот с альдегидными акцентами создает неповторимый шлейф.', 'Классический женский аромат', 12500, 15000, '100 мл', 'Chanel', (select id from public.categories where slug = 'women'), true, false),
  ('Dior Sauvage', 'dior-sauvage', 'Дикий и благородный аромат для современного мужчины. Сочетание бергамота, перца и амбровых нот создает магнетический образ.', 'Свежий мужской аромат', 9800, null, '100 мл', 'Dior', (select id from public.categories where slug = 'men'), true, false),
  ('Tom Ford Black Orchid', 'tom-ford-black-orchid', 'Роскошный и загадочный аромат с нотами черной орхидеи, трюфеля и пачули. Идеален для особых случаев.', 'Роскошный унисекс аромат', 18500, 21000, '50 мл', 'Tom Ford', (select id from public.categories where slug = 'unisex'), true, true),
  ('Byredo Gypsy Water', 'byredo-gypsy-water', 'Романтичный аромат с нотами бергамота, лимона, сосновой хвои и сандала. Вдохновлен свободой и путешествиями.', 'Нишевый аромат свободы', 22000, null, '50 мл', 'Byredo', (select id from public.categories where slug = 'niche'), true, true),
  ('Versace Bright Crystal', 'versace-bright-crystal', 'Свежий и чувственный аромат с нотами граната, пиона и магнолии. Идеален для повседневного использования.', 'Свежий цветочный аромат', 6500, 7800, '90 мл', 'Versace', (select id from public.categories where slug = 'women'), false, false),
  ('Bleu de Chanel', 'bleu-de-chanel', 'Элегантный древесно-ароматический аромат для современного мужчины. Ноты цитрусовых, мяты и кедра.', 'Элегантный мужской аромат', 11500, null, '100 мл', 'Chanel', (select id from public.categories where slug = 'men'), true, false),
  ('Maison Francis Kurkdjian Baccarat Rouge 540', 'mfk-baccarat-rouge-540', 'Легендарный нишевый аромат с нотами жасмина, шафрана и кедра. Создает уникальный, узнаваемый шлейф.', 'Культовый нишевый аромат', 35000, null, '70 мл', 'MFK', (select id from public.categories where slug = 'niche'), true, true),
  ('Gucci Bloom', 'gucci-bloom', 'Богатый белоцветочный аромат с нотами туберозы, жасмина и рангунской лианы. Женственный и современный.', 'Цветочный женский аромат', 8900, 10500, '100 мл', 'Gucci', (select id from public.categories where slug = 'women'), false, false)
on conflict (slug) do nothing;

-- Добавляем настройки сайта
insert into public.site_settings (key, value) values
  ('site_name', 'AROMATIC'),
  ('site_description', 'Интернет-магазин элитной парфюмерии'),
  ('phone', '+7 (999) 123-45-67'),
  ('email', 'info@aromatic.su'),
  ('telegram_bot', '@aromatic_bot'),
  ('telegram_channel', '@aromatic_channel'),
  ('address', 'г. Москва, ул. Тверская, д. 1'),
  ('working_hours', 'Пн-Пт: 10:00-20:00, Сб-Вс: 11:00-19:00')
on conflict (key) do nothing;

-- Добавляем баннеры
insert into public.banners (title, subtitle, is_active, sort_order) values
  ('Новая коллекция 2026', 'Откройте для себя ароматы нового сезона', true, 1),
  ('Скидки до 30%', 'На избранные ароматы мировых брендов', true, 2)
on conflict do nothing;

-- Добавляем страницы
insert into public.pages (slug, title, content, meta_title, meta_description) values
  ('about', 'О нас', 'AROMATIC - это интернет-магазин элитной парфюмерии, где вы найдете лучшие ароматы от мировых брендов. Мы работаем напрямую с официальными дистрибьюторами, гарантируя подлинность каждого флакона.', 'О магазине AROMATIC', 'Узнайте больше о магазине элитной парфюмерии AROMATIC'),
  ('delivery', 'Доставка', 'Мы осуществляем доставку по всей России. Бесплатная доставка при заказе от 10 000 рублей. Срок доставки: Москва - 1-2 дня, регионы - 3-7 дней.', 'Доставка парфюмерии', 'Условия доставки парфюмерии по России'),
  ('contacts', 'Контакты', 'Свяжитесь с нами любым удобным способом. Наши консультанты помогут подобрать идеальный аромат.', 'Контакты AROMATIC', 'Контактная информация магазина AROMATIC')
on conflict (slug) do nothing;
