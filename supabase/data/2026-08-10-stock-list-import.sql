-- House of Chairs, stock list import.
-- Source: Copy_of_House_of_Chairs_Stock_List.xlsx, Sheet1 rows 5 to 27.
-- 19 pieces. Rows 11, 13, 19 and 20 are already in the collection with
-- fuller owner-written content and are deliberately not touched here.
-- Everything lands as draft (hidden from the public site) and price on
-- request, because the sheet carries no photography and no prices.
--
-- Run once against the shared database. Both inserts are guarded by the slug
-- unique constraint and the specs insert skips pieces that already have rows,
-- so a second run is a no-op rather than a duplicate.
--
-- Points for the owner to settle before any of these go live. Each one is a
-- disagreement inside the sheet itself, so it is left as found and flagged
-- rather than guessed at:
--   row 9  the chair is titled black, the material cell describes a "glossy
--          orange lacquer finish". The colour word is left out of materials.
--   row 18 the title says Emeco 111, the attribution text says 1006 Navy.
--          Both are kept as written; they are different Emeco models.
--   row 24 the period cell repeats row 23's text ("created in 2008"), while
--          the attribution dates La Marie to 1998. The label follows the
--          attribution and the year columns are left empty.
--   row 24 the story cell also repeats row 23's Thalya text word for word.
--   rows 26, 27 the material cell ends mid-sentence, "Polished Aluminium,
--          Steel and ". Recorded as aluminium and steel only.
--   row 25 has no material cell at all, so materials is empty.
-- Rows 15 and 16 date this version only as "late 2000s", too loose for the
-- year columns, so it stays in the period label.
begin;

-- Categories named by the sheet, in house style. Existing categories are
-- left alone by the conflict clause.
insert into modern_categories (slug, name, position, story, hint, facts, placeholder) values
  ('mid-century-modern', 'Mid century modern', 6, 'The years when moulded shells, bent steel and fibreglass replaced the cabinetmaker''s frame. Chairs from this era were drawn for volume production and still outlast most furniture made since. Each one is checked, honestly photographed and ready for daily use.', 'The era most people picture when they say vintage', '[{"term": "Periods", "detail": "1945 to 1975"}, {"term": "Materials", "detail": "Fibreglass, moulded plastic, chromed steel, aluminium"}, {"term": "What to expect", "detail": "Shell seats, slim metal bases, strong colour"}]'::jsonb, true),
  ('retro-modern', 'Retro modern', 7, 'Pop forms from the designers who defined the sixties, made in the decades after. Bold shapes, hard-wearing materials and colour used without apology. Each one is checked, honestly photographed and ready for daily use.', 'Sixties shapes, later production, everyday durability', '[{"term": "Periods", "detail": "1969 to 2000"}, {"term": "Materials", "detail": "Moulded resin, heavy grade plastics"}, {"term": "What to expect", "detail": "Stackable forms, glossy finishes, original maker labels"}]'::jsonb, true),
  ('scandinavian-modern', 'Scandinavian modern', 8, 'Functionalist design from the north, where a chair is solved before it is styled. Bentwood legs, honest joints and finishes that wear in rather than out. Each one is checked, honestly photographed and ready for daily use.', 'Built to be used daily, for decades', '[{"term": "Periods", "detail": "1935 to today"}, {"term": "Materials", "detail": "Birch, bentwood, lacquer, veneer"}, {"term": "What to expect", "detail": "L-shaped legs, round seats, quiet detailing"}]'::jsonb, true),
  ('late-20th-century', 'Late 20th century', 9, 'Designs from the closing decades of the century, when industrial materials were used with a lighter hand. Aluminium, thermoplastics and folding frames, made for public rooms and just as suited to private ones. Each one is checked, honestly photographed and ready for daily use.', 'Hard-wearing pieces originally specified for public rooms', '[{"term": "Periods", "detail": "1980 to 1999"}, {"term": "Materials", "detail": "Aluminium, thermoplastic, steel"}, {"term": "What to expect", "detail": "Folding frames, welded aluminium, indoor and outdoor use"}]'::jsonb, true),
  ('21st-century-modern', '21st century modern', 10, 'Chairs from the last twenty five years by designers whose earlier work is already collected. Made in numbers, made well, and still in the rooms they were drawn for. Each one is checked, honestly photographed and ready for daily use.', 'Recent design, already collected', '[{"term": "Periods", "detail": "2000 to today"}, {"term": "Materials", "detail": "Recycled aluminium, polypropylene, polycarbonate"}, {"term": "What to expect", "detail": "Single mouldings, hand finished metal, robust daily use"}]'::jsonb, true),
  ('contemporary-modern', 'Contemporary modern', 11, 'Current design in transparent and moulded plastics, where the manufacturing is the ornament. Light to move, easy to live with, and finished to a standard that survives a dining room. Each one is checked, honestly photographed and ready for daily use.', 'Light, stackable and easy to place', '[{"term": "Periods", "detail": "1998 to today"}, {"term": "Materials", "detail": "Polycarbonate, gas-injected plastics"}, {"term": "What to expect", "detail": "Transparent and smoked finishes, hollow legs, stackable"}]'::jsonb, true)
on conflict (slug) do nothing;

-- Pieces.
insert into modern_pieces (slug, category_id, title, attribution, period_label,
  year_from, year_to, origin, materials, status, price_on_request, price_pence,
  story, restoration_notes, catalogue_number, placeholder, featured,
  featured_position, provenance_verified, section_toggles) values
  -- sheet row 5
  ('philippe-starck-louis-20-chair-for-vitra-orange',
   (select id from modern_categories where slug = 'modern-classics'),
   'Philippe Starck Louis 20 chair for Vitra, orange',
   'The Louis 20 chair designed by French creator Philippe Starck in 1991 and manufactured by Swiss design company Vitra. Then collected over a period of twelve years.',
   'Design year 1991. Production period 1990 to 1999, these chairs dated 1991',
   1991, 1991,
   'Purchased as new with labels.',
   array['Polypropylene seat and front legs', 'Polished aluminium back legs']::text[],
   'draft'::modern_piece_status, true, null,
   'Named "Louis 20" (Louis XX) as a playful nod to the French king-naming tradition.',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 6
  ('philippe-starck-louis-20-chair-for-vitra-blue',
   (select id from modern_categories where slug = 'modern-classics'),
   'Philippe Starck Louis 20 chair for Vitra, blue',
   'The Louis 20 chair designed by French creator Philippe Starck in 1991 and manufactured by Swiss design company Vitra. Then collected over a period of twelve years.',
   'Design year 1991. Production period 1990 to 1999, these chairs dated 1991',
   1991, 1991,
   'Purchased as new with labels.',
   array['Polypropylene seat and front legs', 'Polished aluminium back legs']::text[],
   'draft'::modern_piece_status, true, null,
   'Named "Louis 20" (Louis XX) as a playful nod to the French king-naming tradition.',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 7
  ('philippe-starck-louis-20-chair-for-vitra-ox-blood',
   (select id from modern_categories where slug = 'modern-classics'),
   'Philippe Starck Louis 20 chair for Vitra, ox blood',
   'The Louis 20 chair designed by French creator Philippe Starck in 1991 and manufactured by Swiss design company Vitra. Then collected over a period of twelve years.',
   'Design year 1991. Production period 1990 to 1999, these chairs dated 1991',
   1991, 1991,
   'Purchased as new with labels.',
   array['Polypropylene seat and front legs', 'Polished aluminium back legs']::text[],
   'draft'::modern_piece_status, true, null,
   'Named "Louis 20" (Louis XX) as a playful nod to the French king-naming tradition.',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 8
  ('vitra-verner-panton-chair-sky-blue',
   (select id from modern_categories where slug = 'modern-classics'),
   'Vitra Verner Panton chair, sky blue',
   'Attributed to Verner Panton, edition unconfirmed, year 2000 onwards.',
   'First conceived in 1959, final launch in 1999. These chairs circa 2018',
   2018, 2018,
   'Purchased as new with labels.',
   array['Dyed-through polypropylene, strong and flexible', 'Matte finish']::text[],
   'draft'::modern_piece_status, true, null,
   'It was inspired by a stacked pile of plastic buckets. It became the world''s first all-plastic, single-piece cantilever chair.',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 9
  ('vitra-verner-panton-chair-black',
   (select id from modern_categories where slug = 'modern-classics'),
   'Vitra Verner Panton chair, black',
   'Attributed to Verner Panton, edition unconfirmed, year 2000 onwards.',
   'First conceived in 1959, final launch in 1999. These chairs circa 2014',
   2014, 2014,
   'Purchased as new with labels.',
   array['Rigid polyurethane foam', 'Rich gloss lacquer finish']::text[],
   'draft'::modern_piece_status, true, null,
   'It was inspired by a stacked pile of plastic buckets. It became the world''s first all-plastic, single-piece cantilever chair.',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 10
  ('kartell-uncle-jim-armchair-black',
   (select id from modern_categories where slug = 'modern-classics'),
   'Kartell Uncle Jim armchair, black',
   'Designed by Philippe Starck and introduced in 2014 as part of the "Aunts and Uncles" collection for Kartell.',
   '2014, new and never used',
   2014, 2014,
   'Purchased as new with labels.',
   array['High-quality thermoplastic polycarbonate', 'Solid black finish']::text[],
   'draft'::modern_piece_status, true, null,
   'Starck based the collection on childhood memories of his own aunts and uncles sitting by the fireplace in old-fashioned armchairs.',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 12
  ('vintage-panto-pop-lounge-chair-verner-panton',
   (select id from modern_categories where slug = 'retro-modern'),
   'Vintage Panto Pop lounge chair, Verner Panton for Innovation Design Studio',
   'This stackable Panto Pop lounge chair was designed in 1969 by Verner Panton and manufactured circa 1999 by Innovation Design Studio in Denmark.',
   '1999, both chairs',
   1999, 1999,
   'Purchased as new with labels.',
   array['Heavy-grade moulded plastic resin', 'Glossy grey pigment']::text[],
   'draft'::modern_piece_status, true, null,
   'Iconic space age design.',
   'Outside is bright and still glossy with minor surface wear. Inside shows some wear commensurate with age and stacking of this chair design. There are no cracks or loss to the rim or chair itself.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 14
  ('artek-bar-stool-65',
   (select id from modern_categories where slug = 'scandinavian-modern'),
   'Artek bar stool 65',
   'This is a Stool 65, originally designed by the Finnish designers Aino and Alvar Aalto for Artek in 1935. A staple of Scandinavian modernism, characterised by its iconic L-shaped legs and circular seat.',
   'Designed in 1935. These seats dated 2010 to 2015',
   2010, 2015,
   'Purchased as new with labels.',
   array['Bentwood legs', 'Round seat', 'Ebonised wood finish']::text[],
   'draft'::modern_piece_status, true, null,
   '',
   'These pieces do show wear consistent with previous use including light scuffs and scratches throughout. Overall, the stools are in very good condition. Please see photos.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 15
  ('modernica-for-eames-fibreglass-bar-stool-black',
   (select id from modern_categories where slug = 'mid-century-modern'),
   'Modernica for Eames fibreglass bar stool in black',
   'The concept of this chair was conceived in the United States by the designers Charles and Ray Eames and then manufactured in Germany, Switzerland and the USA. This version created by Modernica for Eames in Los Angeles, USA.',
   'Designed in 1948, in the collection since 2020. This version for Eames created in the late 2000s',
   null, null,
   'Purchased as new with labels.',
   array['Dyed-through glass-fibre reinforced polyester seat shell', 'Chrome-plated tubular steel base']::text[],
   'draft'::modern_piece_status, true, null,
   'It was created for the Museum of Modern Art''s International Competition for Low-Cost Furniture Design.',
   'Untouched original, some signs of ageing patina on the legs.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 16
  ('modernica-for-eames-fibreglass-stool-orange-red',
   (select id from modern_categories where slug = 'mid-century-modern'),
   'Modernica for Eames fibreglass stool in orange red',
   'The concept of this chair was conceived in the United States by the designers Charles and Ray Eames and then manufactured in Germany, Switzerland and the USA. This version created by Modernica for Eames in Los Angeles, USA.',
   'Designed in 1948, in the collection since 2020. This version for Eames created in the late 2000s',
   null, null,
   'Purchased as new with labels.',
   array['Dyed-through glass-fibre reinforced polyester seat shell', 'Chrome-plated tubular steel base']::text[],
   'draft'::modern_piece_status, true, null,
   'It was created for the Museum of Modern Art''s International Competition for Low-Cost Furniture Design.',
   'Untouched original, some signs of ageing patina on the legs.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 17
  ('emeco-1006-navy-backless-stool',
   (select id from modern_categories where slug = 'late-20th-century'),
   'Emeco 1006 Navy series backless stool',
   'These are genuine Emeco 1006 Navy series backless stools. Hand made in the USA from lightweight aluminium. Stools designed for all-round indoor or outdoor use.',
   'Modernist, vintage, post modern',
   null, null,
   'Purchased as new with labels.',
   array['Aluminium']::text[],
   'draft'::modern_piece_status, true, null,
   '',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 18
  ('emeco-111-brushed-aluminium-counter-bar-stool',
   (select id from modern_categories where slug = 'late-20th-century'),
   'Emeco 111 counter bar stool in brushed aluminium',
   'These are genuine Emeco 1006 Navy series bar stools. Hand made in the USA from lightweight aluminium. Stools designed for all-round indoor or outdoor use.',
   'Modernist, vintage, post modern',
   null, null,
   'Purchased as new with labels.',
   array['Aluminium']::text[],
   'draft'::modern_piece_status, true, null,
   '',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 21
  ('kartell-masters-chair-white',
   (select id from modern_categories where slug = '21st-century-modern'),
   'Kartell Masters chair in white',
   'A thought provoking design, the Masters chair by Philippe Starck is a hybrid of three iconic chairs by the 20th century designers Arne Jacobsen, Eero Saarinen and Charles Eames. Reminiscent of the classic Thonet bentwood chairs commonly found in the cafes of Paris, branch like loops exhibit all the innovative construction and quirky features one expects from a Starck design.',
   '2020 onwards',
   2020, null,
   'Purchased as new with labels.',
   array['Moulded ultra-strong polypropylene']::text[],
   'draft'::modern_piece_status, true, null,
   '',
   'As new, untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 22
  ('philippe-starck-miss-coco-folding-side-chair',
   (select id from modern_categories where slug = 'late-20th-century'),
   'Philippe Starck Miss C.O.C.O. folding side chair',
   'Set of four Miss Coco folding chairs by Cassina designed by Philippe Starck, with seat and back in yellow matt thermoplastic material and an aluminium structure painted in aluminium grey. Original Cassina, in excellent condition.',
   '1998',
   1998, 1998,
   'Purchased as new with labels.',
   array['Yellow matt thermoplastic seat and back', 'Aluminium structure painted aluminium grey']::text[],
   'draft'::modern_piece_status, true, null,
   '',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 23
  ('kartell-thalya-chair-transparent-brown',
   (select id from modern_categories where slug = 'contemporary-modern'),
   'Kartell Thalya chair, transparent brown',
   'The Kartell Thalya chair in transparent brown (smoked polycarbonate) is a discontinued contemporary dining chair designed by Patrick Jouin. It features a unique diamond "reticular" pattern on the seat and backrest, hollow legs, and curved, lightweight lines produced via gas-injection technology.',
   'Created in 2008, in the collection since 2010',
   2008, 2008,
   'Originated in 2008 in Italy. Collected as part of a personal collection.',
   array['Smoked polycarbonate']::text[],
   'draft'::modern_piece_status, true, null,
   'This chair offers a modern, graphic remake of a classic dining chair that combines soft, feminine lines with advanced plastic manufacturing technology.',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 24
  ('kartell-starck-la-marie-chair',
   (select id from modern_categories where slug = 'contemporary-modern'),
   'Kartell Starck La Marie chair',
   'The La Marie chair is an iconic, completely transparent dining chair designed by French creator Philippe Starck and produced by the Italian design brand Kartell in 1998. It is globally recognised as the first chair in the world to be moulded from a single piece of transparent polycarbonate.',
   'Designed in 1998',
   null, null,
   'Collected as part of a personal collection, 2012.',
   array['Transparent polycarbonate']::text[],
   'draft'::modern_piece_status, true, null,
   'This chair offers a modern, graphic remake of a classic dining chair that combines soft, feminine lines with advanced plastic manufacturing technology.',
   'Untouched original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 25
  ('herman-miller-for-verner-panton-1970s-set-of-4',
   (select id from modern_categories where slug = 'mid-century-modern'),
   'Herman Miller for Verner Panton, 1970s, set of four',
   'This Panton chair was manufactured by Verner Panton for Herman Miller in 1971 and is made of S-shaped plastic. Panton designed the first ever chair consisting of a single element, formed from plastic, available in different colours. The S chair became Panton''s best-known and most widely produced design.',
   'All chairs dated 1974 and 1975',
   1974, 1975,
   '',
   '{}'::text[],
   'draft'::modern_piece_status, true, null,
   '',
   'Untouched, original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 26
  ('herman-miller-airport-bench-four-seats-with-table',
   (select id from modern_categories where slug = 'mid-century-modern'),
   'Herman Miller airport bench, four seats with table',
   '',
   '1970s',
   1970, 1979,
   'Chicago Airport',
   array['Polished aluminium', 'Steel']::text[],
   'draft'::modern_piece_status, true, null,
   '',
   'Untouched, original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb),
  -- sheet row 27
  ('herman-miller-airport-bench-three-seats',
   (select id from modern_categories where slug = 'mid-century-modern'),
   'Herman Miller airport bench, three seats',
   '',
   '1990s',
   1990, 1999,
   '',
   array['Polished aluminium', 'Steel']::text[],
   'draft'::modern_piece_status, true, null,
   '',
   'Untouched, original.',
   '', true, false, null, false, '{"features": true, "record": true, "included": true, "condition": true, "provenance": true, "care": true, "faq": true, "words": true, "related": true}'::jsonb)
on conflict (slug) do nothing;

-- Specimen record rows. Quantity has no column of its own, so the number
-- of examples available is recorded here where the piece page shows it.
insert into modern_piece_specs (piece_id, position, grouping, term, detail)
select p.id, v.position, v.grouping, v.term, v.detail
from (values
  ('philippe-starck-louis-20-chair-for-vitra-orange', 1, 'Availability', 'Examples available', '4'),
  ('philippe-starck-louis-20-chair-for-vitra-blue', 1, 'Availability', 'Examples available', '4'),
  ('philippe-starck-louis-20-chair-for-vitra-ox-blood', 1, 'Availability', 'Examples available', '4'),
  ('vitra-verner-panton-chair-sky-blue', 1, 'Availability', 'Examples available', '4'),
  ('vitra-verner-panton-chair-black', 1, 'Availability', 'Examples available', '4'),
  ('kartell-uncle-jim-armchair-black', 1, 'Availability', 'Examples available', '1'),
  ('kartell-uncle-jim-armchair-black', 2, 'Materials', 'Construction', 'Produced in a single injection mould for a seamless, fluid structure.'),
  ('vintage-panto-pop-lounge-chair-verner-panton', 1, 'Availability', 'Examples available', '2'),
  ('vintage-panto-pop-lounge-chair-verner-panton', 2, 'Materials', 'Construction', 'The low-profile spherical vessel is constructed from heavy-grade moulded plastic resin finished in a glossy grey pigment. Structurally engineered without a central drainage aperture or an outer drainage rim, this early variant features a fully enclosed interior seat pan. This is a heavy grade reinforced plastic resin, unlike the later ABS plastic with drilled hole versions.'),
  ('vintage-panto-pop-lounge-chair-verner-panton', 3, 'Marks', 'Label', 'The manufacturer''s original adhesive label is affixed to the base, containing the designer''s signature and production series data.'),
  ('artek-bar-stool-65', 1, 'Availability', 'Examples available', '20'),
  ('artek-bar-stool-65', 2, 'Materials', 'Production', 'These particular examples were produced in Finland in the 2010s.'),
  ('modernica-for-eames-fibreglass-bar-stool-black', 1, 'Availability', 'Examples available', '2'),
  ('modernica-for-eames-fibreglass-stool-orange-red', 1, 'Availability', 'Examples available', '3'),
  ('emeco-1006-navy-backless-stool', 1, 'Availability', 'Examples available', '6'),
  ('emeco-111-brushed-aluminium-counter-bar-stool', 1, 'Availability', 'Examples available', '6'),
  ('kartell-masters-chair-white', 1, 'Availability', 'Examples available', '2'),
  ('kartell-masters-chair-white', 2, 'Materials', 'Construction', 'The succession of unbroken curves has no awkward joins.'),
  ('philippe-starck-miss-coco-folding-side-chair', 1, 'Availability', 'Examples available', '4'),
  ('philippe-starck-miss-coco-folding-side-chair', 2, 'Materials', 'Construction', 'Made from a recycled material, with mineral filler and a soft-touch treatment.'),
  ('kartell-thalya-chair-transparent-brown', 1, 'Availability', 'Examples available', '1'),
  ('kartell-thalya-chair-transparent-brown', 2, 'Use', 'Suitability', 'Suitable for indoor or outdoor use, easily stackable.'),
  ('kartell-starck-la-marie-chair', 1, 'Availability', 'Examples available', '12'),
  ('kartell-starck-la-marie-chair', 2, 'Materials', 'Construction', 'Gas-injection moulding technology allows the frame to be hollow, with a diamond pattern across the seat.'),
  ('herman-miller-for-verner-panton-1970s-set-of-4', 1, 'Availability', 'Examples available', '4'),
  ('herman-miller-airport-bench-four-seats-with-table', 1, 'Availability', 'Examples available', '1'),
  ('herman-miller-airport-bench-three-seats', 1, 'Availability', 'Examples available', '1')
) as v(slug, position, grouping, term, detail)
join modern_pieces p on p.slug = v.slug
where not exists (select 1 from modern_piece_specs s where s.piece_id = p.id);

commit;
