import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type VisitorStore = {
  totalVisitors: number;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-visitors.json");
const DEFAULT_STORE: VisitorStore = {
  totalVisitors: 0,
  updatedAt: new Date(0).toISOString(),
};

let visitorWriteQueue = Promise.resolve();

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

export async function getVisitorTotal() {
  const store = await readVisitorStore();
  return store.totalVisitors;
}

export async function trackVisitor(hasVisitedBefore: boolean) {
  if (hasVisitedBefore) {
    return getVisitorTotal();
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
