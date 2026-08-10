-- House of Chairs, a chosen visual per era.
--
-- The generative studies were bound to a hardcoded list of five eras in
-- content/landing.ts, so an era created in the dashboard had no drawing and
-- the home page row could only ever show those five. The choice moves to the
-- category record, where the owner can change it, and the drawing becomes a
-- property of the era rather than a property of the code.
--
-- Additive only, and inside the modern_ namespace. The check constraint names
-- the five studies that have a renderer; "tide" is deliberately absent because
-- it falls through to a text placeholder rather than drawing anything.
alter table modern_categories
  add column visual text not null default 'rings'
    check (visual in ('chair', 'grove', 'rings', 'silhouette', 'strata'));

-- The five original eras keep exactly the drawing they already had, so nothing
-- on the live site changes appearance. The six added from the stock list are
-- spread across the set so the grid does not repeat a study side by side; the
-- owner can change any of them from the dashboard.
update modern_categories set visual = case slug
  when 'bauhaus-and-modernist'  then 'strata'
  when 'danish-modern'          then 'rings'
  when 'space-age'              then 'chair'
  when 'italian-and-sculptural' then 'grove'
  when 'modern-classics'        then 'silhouette'
  when 'mid-century-modern'     then 'chair'
  when 'retro-modern'           then 'grove'
  when 'scandinavian-modern'    then 'rings'
  when 'late-20th-century'      then 'strata'
  when '21st-century-modern'    then 'silhouette'
  when 'contemporary-modern'    then 'grove'
  else visual
end;
