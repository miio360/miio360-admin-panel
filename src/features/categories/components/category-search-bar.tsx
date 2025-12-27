import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";

interface CategorySearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export function CategorySearchBar({
  searchTerm,
  onSearch,
}: CategorySearchBarProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-4 border border-gray-200 bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 rounded-lg"
        />
      </div>
    </div>
  );
}
