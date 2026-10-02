import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { put } from "@vercel/blob";

type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string; status: number };

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function storeFile(
  filename: string,
  bytes: Buffer,
  contentType: string
): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, bytes, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);
  return `/uploads/${filename}`;
}

export async function storeImageUpload(file: File): Promise<UploadResult> {
  const extension = imageExtensions[file.type];
  if (!extension) {
    return {
      success: false,
      error: "Format non supporté (JPG, PNG, WebP, ou PDF).",
      status: 400,
    };
  }
  if (file.size > 2 * 1024 * 1024) {
    return {
      success: false,
      error: "L'image ne doit pas dépasser 2 Mo.",
      status: 400,
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const url = await storeFile(`${randomUUID()}.${extension}`, bytes, file.type);
  return { success: true, url };
}

export async function storePdfUpload(
  type: "cv" | "certificat",
  file: File
): Promise<UploadResult> {
  if (file.type !== "application/pdf") {
    return {
      success: false,
      error: "Seuls les fichiers PDF sont acceptés.",
      status: 400,
    };
  }
  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      error: "Le fichier PDF ne doit pas dépasser 5 Mo.",
      status: 400,
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return {
      success: false,
      error: "Le fichier fourni n'est pas un PDF valide.",
      status: 400,
    };
  }
  const url = await storeFile(`${type}-${randomUUID()}.pdf`, bytes, file.type);
  return { success: true, url };
}
