import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchGlobalProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchGlobal({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}: SearchGlobalProps) {
  return (
    <div className={`flex-1 relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 border border-gray-200 bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 rounded-lg"
      />
    </div>
  );
}
