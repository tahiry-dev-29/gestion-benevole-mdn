import { Button } from "@/components/ui/button";

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  pageSize: number;
  totalUsers: number;
  onPageChange: (page: number) => void;
}

export function UsersPagination({
  currentPage,
  totalPages,
  startIndex,
  pageSize,
  totalUsers,
  onPageChange,
}: UsersPaginationProps) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
      <div>
        Affichage de{" "}
        <strong className="text-slate-200">
          {totalUsers > 0 ? startIndex + 1 : 0}
        </strong>{" "}
        à{" "}
        <strong className="text-slate-200">
          {Math.min(startIndex + pageSize, totalUsers)}
        </strong>{" "}
        sur <strong className="text-slate-200">{totalUsers}</strong>{" "}
        utilisateurs
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-slate-900/60 border-slate-800 text-slate-300 disabled:opacity-40"
        >
          Précédent
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={
              currentPage === page
                ? "bg-cyan-600 hover:bg-cyan-500 text-white font-bold size-8 p-0"
                : "bg-slate-900/60 border-slate-800 text-slate-300 size-8 p-0"
            }
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="bg-slate-900/60 border-slate-800 text-slate-300 disabled:opacity-40"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
