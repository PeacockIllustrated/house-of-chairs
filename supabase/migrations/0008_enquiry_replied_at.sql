-- 0008: remember when the owner replied to an enquiry from the dashboard.
-- Additive and nullable; existing rows stay as they are. Only the service
-- role (the dashboard's server routes) writes it, under the existing
-- owner policies on modern_enquiries.
alter table modern_enquiries
  add column if not exists replied_at timestamptz;
