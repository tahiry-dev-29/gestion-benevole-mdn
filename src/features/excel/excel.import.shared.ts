import { Buffer } from "node:buffer";

import { validateXlsxUpload } from "./excel.reader";
import type { ExcelRowError } from "./excel.schema";

export type XlsxUpload =
  { buffer: Buffer; errors: null } | { buffer: null; errors: ExcelRowError[] };

export async function readXlsxUpload(
  fileValue: FormDataEntryValue | null
): Promise<XlsxUpload> {
  if (!(fileValue instanceof File)) {
    return {
      buffer: null,
      errors: [{ ligne: 0, champ: "fichier", message: "Fichier manquant." }],
    };
  }
  const validationError = validateXlsxUpload(fileValue);
  if (validationError) {
    return {
      buffer: null,
      errors: [{ ligne: 0, champ: "fichier", message: validationError }],
    };
  }

  try {
    const buffer = Buffer.from(await fileValue.arrayBuffer());
    if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
      return {
        buffer: null,
        errors: [
          {
            ligne: 0,
            champ: "fichier",
            message: "Le contenu n'est pas un fichier XLSX valide.",
          },
        ],
      };
    }
    return { buffer, errors: null };
  } catch {
    return {
      buffer: null,
      errors: [
        {
          ligne: 0,
          champ: "fichier",
          message: "Impossible de lire le fichier sélectionné.",
        },
      ],
    };
  }
}

export function failedImport(errors: ExcelRowError[]) {
  return { success: false, imported: 0, errors };
}
