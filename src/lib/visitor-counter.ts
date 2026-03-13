import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type VisitorStore = {
  totalVisitors: number;
  updatedAt: string;
};

type CountApiPayload = {
  value?: number | string;
 };

type VisitorCounterProvider = "countapi" | "filesystem";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-visitors.json");
const COUNT_API_BASE = "https://api.countapi.xyz";
const DEFAULT_COUNT_API_NAMESPACE = "sudharaka-portfolio";
const DEFAULT_COUNT_API_KEY = "site-visitors";
const DEFAULT_STORE: VisitorStore = {
  totalVisitors: 0,
  updatedAt: new Date(0).toISOString(),
};

let visitorWriteQueue = Promise.resolve();

function normalizeCounterValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function sanitizeCounterSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveCounterProvider(): VisitorCounterProvider {
  const configured = process.env.VISITOR_COUNTER_PROVIDER?.trim().toLowerCase();

  if (configured === "filesystem" || configured === "countapi") {
    return configured;
  }

  return process.env.NODE_ENV === "production" ? "countapi" : "filesystem";
}

function resolveCountApiNamespace() {
  const configuredNamespace =
    process.env.VISITOR_COUNTER_NAMESPACE ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    DEFAULT_COUNT_API_NAMESPACE;

  return sanitizeCounterSegment(configuredNamespace) || DEFAULT_COUNT_API_NAMESPACE;
}

function resolveCountApiKey() {
  const configuredKey = process.env.VISITOR_COUNTER_KEY ?? DEFAULT_COUNT_API_KEY;
  return sanitizeCounterSegment(configuredKey) || DEFAULT_COUNT_API_KEY;
}

async function fetchCountApiValue(endpoint: string) {
  const response = await fetch(`${COUNT_API_BASE}/${endpoint}`, {
    method: "GET",
    cache: "no-store",
    next: { revalidate: 0 },
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    return 0;
  }

  if (!response.ok) {
    throw new Error(`Visitor counter request failed: ${response.status}`);
  }

  const payload = (await response.json()) as CountApiPayload;
  const normalizedValue = normalizeCounterValue(payload.value);

  if (normalizedValue === null) {
    throw new Error("Visitor counter returned an invalid value.");
  }

  return normalizedValue;
}

async function getRemoteVisitorTotal() {
  const namespace = resolveCountApiNamespace();
  const key = resolveCountApiKey();
  return fetchCountApiValue(`get/${namespace}/${key}`);
}

async function hitRemoteVisitorTotal() {
  const namespace = resolveCountApiNamespace();
  const key = resolveCountApiKey();
  return fetchCountApiValue(`hit/${namespace}/${key}`);
}

async function ensureVisitorStore() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, `${JSON.stringify(DEFAULT_STORE, null, 2)}\n`, "utf8");
  }
}

async function readVisitorStore() {
  await ensureVisitorStore();

  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<VisitorStore>;

    return {
      totalVisitors:
        typeof parsed.totalVisitors === "number" && Number.isFinite(parsed.totalVisitors)
          ? parsed.totalVisitors
          : 0,
      updatedAt:
        typeof parsed.updatedAt === "string" && parsed.updatedAt.length > 0
          ? parsed.updatedAt
          : DEFAULT_STORE.updatedAt,
    } satisfies VisitorStore;
  } catch {
    return DEFAULT_STORE;
  }
}

async function saveVisitorStore(store: VisitorStore) {
  await ensureVisitorStore();
  await writeFile(DATA_FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

async function queueVisitorWrite<T>(task: () => Promise<T>) {
  const nextTask = visitorWriteQueue.then(task, task);

  visitorWriteQueue = nextTask.then(
    () => undefined,
    () => undefined,
  );

  return nextTask;
}

async function getFilesystemVisitorTotal() {
  const store = await readVisitorStore();
  return store.totalVisitors;
}

async function trackFilesystemVisitor(hasVisitedBefore: boolean) {
  if (hasVisitedBefore) {
    return getFilesystemVisitorTotal();
  }

  return queueVisitorWrite(async () => {
    const currentStore = await readVisitorStore();
    const nextStore: VisitorStore = {
      totalVisitors: currentStore.totalVisitors + 1,
      updatedAt: new Date().toISOString(),
    };

    await saveVisitorStore(nextStore);
    return nextStore.totalVisitors;
  });
}

export async function getVisitorTotal() {
  const provider = resolveCounterProvider();

  if (provider === "countapi") {
    try {
      return await getRemoteVisitorTotal();
    } catch {
      // Fall back to the local file store for local servers or hosts with persistent disks.
    }
  }

  try {
    return await getFilesystemVisitorTotal();
  } catch {
    return 0;
  }
}

export async function trackVisitor(hasVisitedBefore: boolean) {
  const provider = resolveCounterProvider();

  if (provider === "countapi") {
    try {
      return hasVisitedBefore ? await getRemoteVisitorTotal() : await hitRemoteVisitorTotal();
    } catch {
      // Fall back to the local file store when the hosted counter is unavailable.
    }
  }

  try {
    return await trackFilesystemVisitor(hasVisitedBefore);
  } catch {
    return hasVisitedBefore ? 0 : 1;
  }
}
