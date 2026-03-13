import { mkdir, readFile, rm, stat, writeFile } from "fs/promises";
import path from "path";

export type AdminGalleryItem = {
  id: string;
  kind: "videos" | "images";
  title: string;
  description: string;
  link: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
};

type AddGalleryItemInput = {
  kind: "videos" | "images";
  title: string;
  description: string;
  link: string;
  mediaFile: File;
  thumbnailFile?: File | null;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "figma-gallery.json");
const LEGACY_DATA_FILE = path.join(DATA_DIR, "admin-gallery.json");
const UPLOAD_ROOT = path.join(process.cwd(), "public", "figma", "uploads");
const MEDIA_DIRS = {
  videos: path.join(UPLOAD_ROOT, "videos"),
  images: path.join(UPLOAD_ROOT, "images"),
  thumbnails: path.join(UPLOAD_ROOT, "thumbnails"),
} as const;

function sortItems(items: AdminGalleryItem[]) {
  return [...items].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function getFileExtension(file: File, fallback: string) {
  const extension = path.extname(file.name || "");
  return extension || fallback;
}

async function ensureStorage() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(MEDIA_DIRS.videos, { recursive: true });
  await mkdir(MEDIA_DIRS.images, { recursive: true });
  await mkdir(MEDIA_DIRS.thumbnails, { recursive: true });

  try {
    await stat(DATA_FILE);
  } catch {
    try {
      const legacyData = await readFile(LEGACY_DATA_FILE, "utf8");
      await writeFile(DATA_FILE, legacyData, "utf8");
    } catch {
      await writeFile(DATA_FILE, "[]\n", "utf8");
    }
  }
}

async function writeBuffer(targetPath: string, file: File) {
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(targetPath, Buffer.from(arrayBuffer));
}

export async function listAdminGalleryItems() {
  await ensureStorage();
  const raw = await readFile(DATA_FILE, "utf8");
  const items = JSON.parse(raw) as AdminGalleryItem[];
  return sortItems(items);
}

async function saveAdminGalleryItems(items: AdminGalleryItem[]) {
  await ensureStorage();
  await writeFile(DATA_FILE, `${JSON.stringify(sortItems(items), null, 2)}\n`, "utf8");
}

export async function addAdminGalleryItem(input: AddGalleryItemInput) {
  await ensureStorage();

  const createdAt = new Date().toISOString();
  const id = `${Date.now()}-${slugify(input.title) || "project"}`;
  const mediaExtension = getFileExtension(
    input.mediaFile,
    input.kind === "videos" ? ".mp4" : ".png",
  );
  const mediaDir = input.kind === "videos" ? MEDIA_DIRS.videos : MEDIA_DIRS.images;
  const mediaFileName = `${id}${mediaExtension}`;
  const mediaPath = path.join(mediaDir, mediaFileName);
  const mediaUrl = `/figma/uploads/${input.kind}/${mediaFileName}`;

  await writeBuffer(mediaPath, input.mediaFile);

  let thumbnailUrl: string | undefined;

  if (input.thumbnailFile) {
    const thumbExtension = getFileExtension(input.thumbnailFile, ".png");
    const thumbFileName = `${id}-thumb${thumbExtension}`;
    const thumbPath = path.join(MEDIA_DIRS.thumbnails, thumbFileName);
    thumbnailUrl = `/figma/uploads/thumbnails/${thumbFileName}`;
    await writeBuffer(thumbPath, input.thumbnailFile);
  }

  const items = await listAdminGalleryItems();
  const nextItem: AdminGalleryItem = {
    id,
    kind: input.kind,
    title: input.title,
    description: input.description,
    link: input.link,
    mediaUrl,
    thumbnailUrl,
    createdAt,
  };

  await saveAdminGalleryItems([nextItem, ...items]);
  return nextItem;
}

export async function deleteAdminGalleryItem(id: string) {
  const items = await listAdminGalleryItems();
  const target = items.find((item) => item.id === id);

  if (!target) {
    return false;
  }

  await rm(path.join(process.cwd(), "public", target.mediaUrl.replace(/^\//, "")), {
    force: true,
  });

  if (target.thumbnailUrl) {
    await rm(
      path.join(process.cwd(), "public", target.thumbnailUrl.replace(/^\//, "")),
      {
        force: true,
      },
    );
  }

  await saveAdminGalleryItems(items.filter((item) => item.id !== id));
  return true;
}
