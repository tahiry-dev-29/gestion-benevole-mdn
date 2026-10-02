import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

import {
  storeImageUpload,
  storePdfUpload,
} from "@/features/user/upload-file.server";
import { isRole } from "@/lib/rbac";

const uploadTypeSchema = z.enum(["image", "cv", "certificat"]);

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Non autorisé." },
      { status: 401 }
    );
  }
  if (
    !isRole(token.role) ||
    token.role === "USER" ||
    token.statut === "INACTIF"
  ) {
    return NextResponse.json(
      { success: false, error: "Non autorisé." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const parsedType = uploadTypeSchema.safeParse(formData.get("type"));
    if (!parsedType.success) {
      return NextResponse.json(
        { success: false, error: "Type de fichier invalide." },
        { status: 400 }
      );
    }
    const type = parsedType.data;
    const isAdmin = token.role === "ADMIN" || token.role === "SUPER_ADMIN";
    if (type !== "image" && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Seul un administrateur peut charger ce document.",
        },
        { status: 403 }
      );
    }

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni." },
        { status: 400 }
      );
    }
    if (!Number.isSafeInteger(file.size) || file.size <= 0) {
      return NextResponse.json(
        { success: false, error: "Le fichier est vide ou invalide." },
        { status: 400 }
      );
    }

    const result =
      type === "image"
        ? await storeImageUpload(file)
        : await storePdfUpload(type, file);
    return result.success
      ? NextResponse.json(result)
      : NextResponse.json(result, { status: result.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erreur lors du traitement du fichier." },
      { status: 500 }
    );
  }
}
