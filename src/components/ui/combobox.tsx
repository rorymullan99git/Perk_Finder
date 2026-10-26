import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Merchant } from "@/types";

interface ComboboxProps {
  id: string;
  label: string;
  merchants: Merchant[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function MerchantCombobox({ id, label, merchants, selectedId, onSelect }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listId = `${id}-list`;

  const selectedMerchant = merchants.find((m) => m.id === selectedId);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = search.trim().toLowerCase();
  const filtered = merchants.filter(
    (m) =>
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.aliases.some((alias) => alias.toLowerCase().includes(q))
  );

  const choose = (merchantId: string) => {
    onSelect(merchantId);
    setOpen(false);
    setSearch("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && filtered[highlight]) choose(filtered[highlight].id);
      else setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label htmlFor={id} className="block text-sm text-stone-500 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={open ? search : selectedMerchant?.name ?? ""}
          placeholder={selectedMerchant?.name ?? "Search stores"}
          onFocus={() => {
            setOpen(true);
            setHighlight(0);
          }}
          onClick={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setHighlight(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="h-11 w-full rounded-lg border border-stone-300 bg-white pl-3 pr-9 text-base text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none"
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-stone-500">No matching store</li>
          ) : (
            filtered.map((m, i) => (
              <li
                key={m.id}
                role="option"
                aria-selected={m.id === selectedId}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(m.id)}
                onMouseEnter={() => setHighlight(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-3 py-2 text-sm text-stone-700",
                  i === highlight && "bg-stone-100"
                )}
              >
                <span>{m.name}</span>
                {m.id === selectedId && <Check className="h-4 w-4 text-emerald-700" />}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
