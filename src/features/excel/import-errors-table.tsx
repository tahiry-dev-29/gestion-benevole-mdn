import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ImportError = { ligne: number; champ: string; message: string };

export function ImportErrorsTable({ errors }: { errors: ImportError[] }) {
  return (
    <div role="alert" className="max-h-64 overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ligne</TableHead>
            <TableHead>Champ</TableHead>
            <TableHead>Erreur</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errors.map((error, index) => (
            <TableRow key={`${error.ligne}-${error.champ}-${index}`}>
              <TableCell>{error.ligne || "—"}</TableCell>
              <TableCell>{error.champ}</TableCell>
              <TableCell>{error.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
