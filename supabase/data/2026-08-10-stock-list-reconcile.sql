-- House of Chairs, reconciling the four pieces the stock list import skipped.
-- Source: Copy_of_House_of_Chairs_Stock_List.xlsx, Sheet1 rows 11, 13, 19, 20.
--
-- The import left these four alone because they already carried dashboard
-- content. Where the sheet and the stored copy disagree on a fact, the sheet
-- now wins. Where the stored copy holds something the sheet simply does not
-- have, it is kept, and detail displaced from a field it did not belong in is
-- moved to the specimen record rather than deleted.
--
-- One deliberate exception, applied four times. The sheet's Origin column
-- reads "Purchased as new with labels." on twenty of its twenty three rows: it
-- is filled down, not written per piece. All four of these pieces carry
-- specific hand-written provenance instead, and one of them is a 1950s chair
-- the stored copy records as unlabelled. Boilerplate is not a stronger source
-- than a specific note, so origin is kept in all four cases and the dates the
-- sheet does supply are applied on top.
--
-- Two facts to confirm, both applied as the sheet states them:
--   row 19  the sheet says the Kong collection was drawn for a Chinese
--           restaurant in Paris; the stored copy said French/Japanese. The
--           sheet wins here, but the Paris restaurant is widely documented as
--           Franco-Japanese, so this one is worth a second look.
--   row 20  the sheet attributes the Cone chair to Rosenthal as fact, while
--           the stored copy records the chair as having no labelling. The
--           house rule on attribution applies, so it reads "attributed to"
--           until the maker is confirmed.
begin;

-- ---------------------------------------------------------------- row 11
-- Eurostar armchair. The stored attribution held style tags rather than an
-- attribution, and the materials array had been split mid-parenthesis.
update modern_pieces set
  title = 'Philippe Starck Eurostar armchair with orange leather upholstery and a built-in swivel table',
  category_id = (select id from modern_categories where slug = 'modern-classics'),
  attribution = 'Only 100 copies were ever made: 44 for the Business Eurostar lounge at Gare du Nord in Paris, France and 56 for the Salon Business of the Eurostar terminal lounge in London, UK. This is a rare opportunity to own a significant proportion of those in existence.',
  period_label = '2002',
  year_from = 2002,
  year_to = 2002,
  materials = array['Lacquered resin', 'Leather upholstery', 'Steel']::text[],
  restoration_notes = 'No restoration completed. Limited restoration required. Further images can be made available.'
where slug = 'phillipe-starck-lounge-chair-rare-0nly-100-produced-7-pieces-available';

-- ---------------------------------------------------------------- row 13
-- Artek stool 64. The stored copy said "natural or black lacquer"; the sheet
-- says ebonised, so the finish follows the sheet. The stale "two sizes
-- available" line goes, because stool 65 is now its own listing.
update modern_pieces set
  title = 'Artek bar stool 64',
  category_id = (select id from modern_categories where slug = 'scandinavian-modern'),
  attribution = 'This is a Stool 64, originally designed by the Finnish designers Aino and Alvar Aalto for Artek in 1935. A staple of Scandinavian modernism, characterised by its iconic L-shaped legs and circular seat.',
  period_label = 'Designed in 1935. These seats dated 2010 to 2015',
  year_from = 2010,
  year_to = 2015,
  materials = array['Bentwood birch legs', 'Round seat', 'Ebonised wood finish']::text[],
  origin = 'Collected over a period of twelve years.',
  restoration_notes = 'These pieces do show wear consistent with previous use including light scuffs and scratches throughout. Overall, the stools are in very good condition. Please see photos.'
where slug = 'artek-aalto-stool-64';

-- ---------------------------------------------------------------- row 19
-- Emeco Kong armchair. The stored condition said the pads were clean; the
-- sheet says some need replacing, so the sheet wins. The commercial lines the
-- sheet does not cover are kept.
update modern_pieces set
  title = 'Philippe Starck Emeco Kong armchair',
  category_id = (select id from modern_categories where slug = '21st-century-modern'),
  attribution = 'Originally designed by Philippe Starck in 2003. The versatile Kong collection was created by Philippe Starck for a Chinese restaurant in Paris, France that he was designing. It is inspired by the furniture of Versailles, but still has tones of Asian design. This stool is made via Emeco''s 77-step process and is three times stronger than steel. These particular examples were produced by Emeco in the USA circa 2010.',
  period_label = 'Designed in 2003, these examples produced circa 2010',
  year_from = 2010,
  year_to = 2010,
  materials = array['Brushed recycled aluminium', 'Vinyl seat pad']::text[],
  origin = 'Originally designed for the Chinese restaurant Kong, opened in Paris in 2003. Light wear relevant to age, with the possibility of the surface being refinished to original standard.',
  restoration_notes = 'Untouched original. Some seat pads require replacement or restoration; the pads were an addition. A written condition report will accompany the sale. Additional photographs of specific chairs will be made available. Can be purchased as a single chair, a pair, or any number up to the total available.'
where slug = 'Phillipe - Starck - brushed-aluminium-armchair';

-- The stored condition spec contradicted the sheet in the same way.
update modern_piece_specs set
  detail = 'Aluminium clean with light marks only and structurally excellent; some seat pads require replacement or restoration'
where term = 'Overall' and grouping = 'Condition'
  and piece_id = (select id from modern_pieces where slug = 'Phillipe - Starck - brushed-aluminium-armchair');

-- ---------------------------------------------------------------- row 20
-- Panton Cone chair. The period field held condition and nickname detail
-- rather than a period; the sheet dates it, and the displaced detail moves to
-- the story and the specimen record.
update modern_pieces set
  title = 'Verner Panton Cone chair in vibrant orange',
  category_id = (select id from modern_categories where slug = 'mid-century-modern'),
  attribution = 'Orange fabric Cone chair, attributed to Verner Panton for Rosenthal, 1950s.',
  period_label = '1950 to 1959',
  year_from = 1950,
  year_to = 1959,
  origin = 'An early version, imported from a seller in Denmark in 2014 and since covered, not used as a seat.',
  story = 'Known as the Ballet Dancer. All prices on request, and we are happy to consider discounts on multiple purchases.',
  -- The stored array was a comma split of one sentence, so "powder coated"
  -- and "some patina" were reading as materials in their own right. Same
  -- defect as the Kong armchair's, tidied the same way: the condition half
  -- moves to the specimen record below.
  materials = array['Powder coated steel body', 'Fully upholstered', 'Stainless legs']::text[]
where slug = 'verner-panton-cone-chair-2-pieces-available-price-per-chair';

-- ------------------------------------------------------- specimen records
-- Kong already has six specs, so they shift down and availability takes the
-- first position, matching every other piece in the collection.
-- Guarded on the availability row so a second run is a no-op, matching the
-- insert below.
update modern_piece_specs set position = position + 1
where piece_id = (select id from modern_pieces where slug = 'Phillipe - Starck - brushed-aluminium-armchair')
  and not exists (
    select 1 from modern_piece_specs s
    where s.piece_id = modern_piece_specs.piece_id and s.term = 'Examples available'
  );

insert into modern_piece_specs (piece_id, position, grouping, term, detail)
select p.id, v.position, v.grouping, v.term, v.detail
from (values
  ('phillipe-starck-lounge-chair-rare-0nly-100-produced-7-pieces-available', 1, 'Availability', 'Examples available', '7'),
  ('phillipe-starck-lounge-chair-rare-0nly-100-produced-7-pieces-available', 2, 'Condition', 'Swivel base', 'Steel swivel base, some restriction, needs releasing'),
  ('artek-aalto-stool-64', 1, 'Availability', 'Examples available', '50'),
  ('artek-aalto-stool-64', 2, 'Materials', 'Seat top', 'Durable black birch veneer'),
  ('artek-aalto-stool-64', 3, 'Materials', 'Production', 'These particular examples were produced in Finland in the 2010s.'),
  ('artek-aalto-stool-64', 4, 'Marks', 'Labels', 'As an original vintage piece, early Artek paper labels, embossed stamps or structural patinas unique to aged Finnish birch would be typical.'),
  ('Phillipe - Starck - brushed-aluminium-armchair', 1, 'Availability', 'Examples available', '10'),
  ('Phillipe - Starck - brushed-aluminium-armchair', 8, 'Materials', 'Process', 'Crafted from recycled aluminium, requiring 24 hand welded pieces and eight hours of surface preparation.'),
  ('verner-panton-cone-chair-2-pieces-available-price-per-chair', 1, 'Availability', 'Examples available', '2'),
  ('verner-panton-cone-chair-2-pieces-available-price-per-chair', 2, 'Marks', 'Labelling', 'No labelling present; an early version.'),
  ('verner-panton-cone-chair-2-pieces-available-price-per-chair', 3, 'Condition', 'Legs', 'Stainless legs with minimal ageing and some patina')
) as v(slug, position, grouping, term, detail)
join modern_pieces p on p.slug = v.slug
where not exists (
  select 1 from modern_piece_specs s
  where s.piece_id = p.id and s.grouping = v.grouping and s.term = v.term
);

commit;
