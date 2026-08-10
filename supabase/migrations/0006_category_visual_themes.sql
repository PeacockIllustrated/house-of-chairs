-- House of Chairs, eight more studies for an era to choose from.
--
-- The first five were the ones the landing page happened to have drawn. These
-- are themed, so the owner can pick one that suits the era rather than the one
-- that happens to be left: bent steel for the modernists, paper cord for the
-- Scandinavians, atomic shells for the space age, brushed aluminium for the
-- industrial end, terrazzo and a colonnade for the Italians, crossing
-- polycarbonate planes for the transparent chairs, and nested shells for
-- anything sold by the dozen.
--
-- The constraint is replaced rather than extended because a check constraint
-- cannot be added to; every value the previous one allowed is still here.
alter table modern_categories drop constraint if exists modern_categories_visual_check;

alter table modern_categories
  add constraint modern_categories_visual_check
  check (visual in (
    'chair', 'grove', 'rings', 'silhouette', 'strata',
    'tubular', 'weave', 'orbit', 'terrazzo', 'arcade', 'facet', 'stack', 'brushed'
  ));
