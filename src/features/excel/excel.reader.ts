import { Buffer } from "node:buffer";

import ExcelJS from "exceljs";

import { presenceColumns, userColumns } from "./excel.columns";
import {
  type ExcelPresenceInput,
  excelPresenceSchema,
  type ExcelRowError,
  type ExcelUserInput,
  excelUserSchema,
} from "./excel.schema";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function validateXlsxUpload(file: File): string | null {
  if (!file.name.toLowerCase().endsWith(".xlsx"))
    return "Le fichier doit être au format .xlsx.";
  if (file.size === 0 || file.size > MAX_FILE_BYTES)
    return "Le fichier doit peser entre 1 octet et 5 Mo.";
  return null;
}

function cellString(
  value: ExcelJS.CellValue | undefined,
  header?: string
): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date)
    return header === "reglesAccepteesAt"
      ? value.toISOString()
      : value.toISOString().slice(0, 10);
  if (typeof value === "object" && "text" in value) return String(value.text);
  if (typeof value === "object" && "richText" in value)
    return value.richText.map((part) => part.text).join("");
  return String(value).trim();
}

async function parseRows<T>(
  buffer: ArrayBuffer,
  headers: string[],
  parse: (row: Record<string, string>) =>
    | { success: true; data: T }
    | {
        success: false;
        error: { issues: { path: PropertyKey[]; message: string }[] };
      }
): Promise<{ data: { ligne: number; value: T }[]; errors: ExcelRowError[] }> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet)
    return {
      data: [],
      errors: [
        { ligne: 1, champ: "fichier", message: "Aucune feuille trouvée." },
      ],
    };
  const actualHeaders = headers.map((_, index) =>
    cellString(sheet.getRow(1).getCell(index + 1).value).toLowerCase()
  );
  if (
    headers.some(
      (header, index) => actualHeaders[index] !== header.toLowerCase()
    )
  ) {
    return {
      data: [],
      errors: [
        {
          ligne: 1,
          champ: "en-têtes",
          message: `En-têtes attendus : ${headers.join(", ")}.`,
        },
      ],
    };
  }
  const data: { ligne: number; value: T }[] = [];
  const errors: ExcelRowError[] = [];
  sheet.eachRow((row, rowNumber) => {
    const isEmpty = headers.every(
      (_, index) => cellString(row.getCell(index + 1).value).length === 0
    );
    if (rowNumber === 1 || isEmpty) return;
    const values = Object.fromEntries(
      headers.map((header, index) => [
        header,
        cellString(row.getCell(index + 1).value, header),
      ])
    );
    const result = parse(values);
    if (result.success) data.push({ ligne: rowNumber, value: result.data });
    else
      result.error.issues.forEach((issue) =>
        errors.push({
          ligne: rowNumber,
          champ: String(issue.path[0] ?? "ligne"),
          message: issue.message,
        })
      );
  });
  return { data, errors };
}

export function parseUsersXlsx(buffer: Buffer) {
  const data = Uint8Array.from(buffer).buffer;
  return parseRows<ExcelUserInput>(
    data,
    userColumns.map(({ header }) => header),
    (row) => excelUserSchema.safeParse(row)
  ).catch(() => ({
    data: [],
    errors: [
      {
        ligne: 0,
        champ: "fichier",
        message: "Le fichier XLSX ne peut pas être lu.",
      },
    ],
  }));
}

export function parsePresencesXlsx(buffer: Buffer) {
  const data = Uint8Array.from(buffer).buffer;
  return parseRows<ExcelPresenceInput>(
    data,
    presenceColumns.map(({ header }) => header),
    (row) => excelPresenceSchema.safeParse(row)
  ).catch(() => ({
    data: [],
    errors: [
      {
        ligne: 0,
        champ: "fichier",
        message: "Le fichier XLSX ne peut pas être lu.",
      },
    ],
  }));
}
