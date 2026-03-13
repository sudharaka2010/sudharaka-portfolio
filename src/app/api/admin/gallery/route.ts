import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  addAdminGalleryItem,
  deleteAdminGalleryItem,
  listAdminGalleryItems,
} from "@/lib/admin-gallery";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET() {
  const items = await listAdminGalleryItems();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const kindValue = formData.get("kind");
    const titleValue = formData.get("title");
    const descriptionValue = formData.get("description");
    const linkValue = formData.get("link");
    const mediaValue = formData.get("media");
    const thumbnailValue = formData.get("thumbnail");

    if (
      (kindValue !== "videos" && kindValue !== "images") ||
      typeof titleValue !== "string" ||
      typeof descriptionValue !== "string" ||
      typeof linkValue !== "string" ||
      !(mediaValue instanceof File)
    ) {
      return badRequest("Missing or invalid upload fields.");
    }

    if (kindValue === "videos" && !mediaValue.type.startsWith("video/")) {
      return badRequest("The uploaded file must be a video.");
    }

    if (kindValue === "images" && !mediaValue.type.startsWith("image/")) {
      return badRequest("The uploaded file must be an image.");
    }

    const thumbnailFile =
      thumbnailValue instanceof File && thumbnailValue.size > 0
        ? thumbnailValue
        : null;

    if (thumbnailFile && !thumbnailFile.type.startsWith("image/")) {
      return badRequest("Thumbnail must be an image.");
    }

    const item = await addAdminGalleryItem({
      kind: kindValue,
      title: titleValue.trim(),
      description: descriptionValue.trim(),
      link: linkValue.trim(),
      mediaFile: mediaValue,
      thumbnailFile,
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json(
      { error: "The upload could not be saved." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return badRequest("Upload id is required.");
  }

  const wasDeleted = await deleteAdminGalleryItem(id);

  if (!wasDeleted) {
    return NextResponse.json({ error: "Upload not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
