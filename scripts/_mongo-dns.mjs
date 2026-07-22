/**
 * DNS repair for seed scripts that connect with a `mongodb+srv://` URI.
 *
 * An SRV URI can't be dialled directly — the driver first resolves
 * `_mongodb._tcp.<host>` to find the replica set members. That lookup goes
 * through Node's configured resolvers, which on Windows are often just
 * `127.0.0.1` (a WSL / Internet Connection Sharing / VPN stub). When nothing is
 * listening there the lookup fails with ECONNREFUSED and the seed dies before
 * it ever opens a socket — even though ordinary web traffic on the machine
 * works fine, because browsers don't go through Node's resolver list.
 *
 * `ensureSrvResolvable()` probes the SRV record and, if the machine's resolvers
 * can't answer, repoints *this process* at a public resolver. It calls
 * `dns.setServers`, which is in-memory and process-scoped — no machine, network
 * adapter, or hosts-file state is touched, and nothing persists after exit.
 *
 * Set SEED_DNS_SERVERS to skip the probe and force specific resolvers:
 *   SEED_DNS_SERVERS=1.1.1.1 pnpm seed:committees
 */
import dns from "dns";

const FALLBACK_RESOLVERS = ["1.1.1.1", "8.8.8.8", "9.9.9.9"];

/**
 * Errors meaning "this resolver is broken or unreachable" — worth retrying
 * elsewhere. A genuine NXDOMAIN/ENODATA is excluded on purpose: the hostname is
 * simply wrong, and a different resolver would return the same answer, so
 * swapping would only bury a typo in MONGODB_URI behind a confusing detour.
 */
const RESOLVER_FAULTS = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEOUT",
  "ETIMEDOUT",
  "ESERVFAIL",
  "EREFUSED",
]);

/** The SRV name a `mongodb+srv://` URI resolves through, or null if not SRV. */
function srvName(uri) {
  try {
    const url = new URL(uri);
    if (url.protocol !== "mongodb+srv:") return null;
    return url.hostname ? `_mongodb._tcp.${url.hostname}` : null;
  } catch {
    return null;
  }
}

/** Resolve `name` using `servers`, or the process defaults when null. */
async function probe(name, servers) {
  const resolver = new dns.promises.Resolver();
  if (servers) resolver.setServers(servers);
  return resolver.resolveSrv(name);
}

/**
 * Make sure the SRV lookup behind `uri` can succeed, swapping in a public
 * resolver for this process if the machine's own resolvers can't answer.
 *
 * Never throws and never blocks the seed: if it can't fix the lookup it logs
 * what it tried and returns, letting `mongoose.connect` surface the real
 * connection error rather than masking it with a DNS one.
 */
export async function ensureSrvResolvable(uri, log = console.warn) {
  const name = srvName(uri);
  if (!name) return; // Plain `mongodb://` host list — no SRV step to fix.

  const forced = (process.env.SEED_DNS_SERVERS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (forced.length) {
    try {
      dns.setServers(forced);
      log(`[mongo-dns] Using SEED_DNS_SERVERS: ${forced.join(", ")}`);
    } catch (err) {
      log(`[mongo-dns] SEED_DNS_SERVERS is not a valid resolver list: ${err.message}`);
    }
    return;
  }

  try {
    await probe(name, null);
    return; // The machine's resolvers are fine — leave them alone.
  } catch (err) {
    if (!RESOLVER_FAULTS.has(err.code)) return; // Real NXDOMAIN, etc.
    log(
      `[mongo-dns] System resolver (${dns.getServers().join(", ") || "none"}) ` +
        `could not look up ${name}: ${err.code}. Trying a public resolver…`,
    );
  }

  for (const server of FALLBACK_RESOLVERS) {
    try {
      await probe(name, [server]);
      dns.setServers([server]);
      log(
        `[mongo-dns] Using ${server} for this process only. ` +
          `Nothing on the machine was changed.`,
      );
      return;
    } catch {
      // Try the next one — a blocked outbound port 53 fails them all.
    }
  }

  log(
    `[mongo-dns] No resolver could look up ${name} ` +
      `(tried the system resolver and ${FALLBACK_RESOLVERS.join(", ")}). ` +
      `Outbound DNS on port 53 may be blocked.`,
  );
}
