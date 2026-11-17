import "server-only";
import { adminDbConfigured, createAdminClient } from "./admin";

/**
 * The client the public form routes write with. It is the service-role client
 * whenever the server has its key, so the forms keep working once the public
 * insert policies on modern_enquiries, modern_interest and modern_subscribers
 * are dropped (supabase/migrations/0007_forms_server_only.sql). That closes the
 * hole bots used to write straight into the tables with the browser key,
 * skipping every check in these routes.
 *
 * Without the key it falls back to the anon client, which only works while
 * those public insert policies still exist.
 */
export async function formsDb() {
  if (adminDbConfigured) return createAdminClient();
  const { createClient } = await import("./server");
  return createClient();
}
