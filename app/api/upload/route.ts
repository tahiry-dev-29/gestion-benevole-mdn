import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { put } from "@vercel/blob";

// Types acceptés et leur extension
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const ALLOWED_PDF_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 Mo
const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 Mo

export async function POST(request: NextRequest) {
  // Authentification requise : ADMIN+
  const token = await getToken({ req: request });
  if (!token || (token.role !== "ADMIN" && token.role !== "SUPER_ADMIN")) {
    return NextResponse.json(
      { success: false, error: "Non autorisé." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type"); // "image" | "cv" | "certificat"

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni." },
        { status: 400 }
      );
    }

    const isPdf = type === "cv" || type === "certificat";

    if (isPdf) {
      // Validation PDF
      const pdfExtension = ALLOWED_PDF_TYPES[file.type];
      if (!pdfExtension) {
        return NextResponse.json(
          { success: false, error: "Seuls les fichiers PDF sont acceptés." },
          { status: 400 }
        );
      }
      if (file.size > MAX_PDF_SIZE) {
        return NextResponse.json(
          { success: false, error: "Le fichier PDF ne doit pas dépasser 5 Mo." },
          { status: 400 }
        );
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      const filename = `${type}-${randomUUID()}.pdf`;

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(filename, bytes, {
          access: "public",
          contentType: "application/pdf",
          addRandomSuffix: false,
        });
        return NextResponse.json({ success: true, url: blob.url });
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), bytes);
      return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    }

    // Validation image
    const extension = ALLOWED_IMAGE_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { success: false, error: "Format non supporté (JPG, PNG, WebP, ou PDF)." },
        { status: 400 }
      );
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, error: "L'image ne doit pas dépasser 2 Mo." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}.${extension}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, bytes, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);
    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erreur lors du traitement du fichier." },
      { status: 500 }
    );
  }
}
