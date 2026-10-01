import ExcelJS from "exceljs";

import {
  type ExcelPresence,
  type ExcelUser,
  presenceColumns,
  userColumns,
} from "./excel.columns";

async function writeWorkbook<T extends object>(
  sheetName: string,
  columns: { header: string; key: keyof T; width: number }[],
  rows: T[]
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  sheet.columns = columns.map((column) => ({ ...column, key: String(column.key) }));
  sheet.addRows(rows);
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF334155" } };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function exportUsersXlsx(rows: ExcelUser[]) {
  return writeWorkbook("Utilisateurs", userColumns, rows);
}

export function exportPresencesXlsx(rows: ExcelPresence[]) {
  return writeWorkbook("Présences", presenceColumns, rows);
}

export function exportUsersTemplateXlsx() {
  return writeWorkbook<ExcelUser>("Utilisateurs", userColumns, []);
}

export function exportPresencesTemplateXlsx() {
  return writeWorkbook<ExcelPresence>("Présences", presenceColumns, []);
}
