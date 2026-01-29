import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationGlobalProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationGlobal({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationGlobalProps) {
  if (totalPages <= 1) return <></>;

  return (
    <div className={`p-4 border-t border-gray-100 bg-gray-50/30 flex justify-center ${className}`}>
      <Pagination>
        <PaginationContent className="gap-1">
          <PaginationItem>
            <button
              aria-label="Anterior"
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={`flex items-center justify-center h-8 w-8 px-2 text-xs md:h-9 md:w-auto md:px-3 md:text-sm rounded transition-colors ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-gray-100"
              }`}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="hidden md:inline">Anterior</span>
            </button>
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;

            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => onPageChange(pageNumber)}
                    isActive={isCurrentPage}
                    className={`cursor-pointer h-8 w-8 text-xs md:h-9 md:w-9 md:text-sm ${
                      isCurrentPage
                        ? "bg-primary text-foreground font-bold hover:bg-primary shadow-sm"
                        : "hover:bg-gray-100 text-foreground/70"
                    }`}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationEllipsis className="h-8 w-8 md:h-9 md:w-9" />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <button
              aria-label="Siguiente"
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={`flex items-center justify-center h-8 w-8 px-2 text-xs md:h-9 md:w-auto md:px-3 md:text-sm rounded transition-colors ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-gray-100"
              }`}
              disabled={currentPage === totalPages}
            >
              <span className="hidden md:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
