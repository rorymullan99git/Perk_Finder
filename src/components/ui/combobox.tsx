import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Merchant } from "@/types";

interface ComboboxProps {
  merchants: Merchant[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function MerchantCombobox({
  merchants,
  selectedId,
  onSelect,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedMerchant = merchants.find((m) => m.id === selectedId);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = merchants.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.aliases.some((alias) => alias.toLowerCase().includes(q))
    );
  });

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-12 w-full items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-900 shadow-sm hover:border-emerald-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 transition-colors"
      >
        <span className="flex items-center gap-2.5 truncate font-medium">
          {selectedMerchant ? (
            <>
              <span
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedMerchant.color }}
              />
              <span className="truncate">{selectedMerchant.name}</span>
              <span className="text-xs text-stone-600 dark:text-stone-400 capitalize hidden sm:inline">
                ({selectedMerchant.category.replace('_', ' ')})
              </span>
            </>
          ) : (
            <span className="text-stone-600 dark:text-stone-400">Select an Australian merchant...</span>
          )}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-stone-600 dark:text-stone-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-[280px] rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl dark:border-stone-800 dark:bg-stone-900 animate-in fade-in-80 zoom-in-95">
          {/* Search bar */}
          <div className="relative mb-2 flex items-center px-2">
            <Search className="h-4 w-4 text-stone-600 dark:text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Woolies, 7-Eleven, Apple, Bunnings, BP..."
              className="h-9 w-full bg-transparent text-sm placeholder:text-stone-400 focus:outline-none dark:text-stone-100"
              autoFocus
            />
          </div>

          <div className="h-px bg-stone-100 dark:bg-stone-800 mb-1" />

          {/* List items */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-stone-600 dark:text-stone-400">
                No matching Australian merchant found.
              </div>
            ) : (
              filtered.map((m) => {
                const isSelected = m.id === selectedId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSelect(m.id);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-left transition-colors",
                      isSelected
                        ? "bg-emerald-50 text-emerald-950 font-semibold dark:bg-emerald-950/40 dark:text-emerald-200"
                        : "hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200"
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="truncate">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-600 dark:text-stone-400 capitalize">
                        {m.category.replace('_', ' ')}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
