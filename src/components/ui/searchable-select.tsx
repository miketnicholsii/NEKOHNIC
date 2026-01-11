import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  className,
  id,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(lowerSearch)
    );
  }, [options, search]);

  // Focus search input when popover opens
  React.useEffect(() => {
    if (open) {
      // Small delay to ensure popover is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearch("");
    }
  }, [open]);

  const handleSelect = (option: string) => {
    onValueChange(option);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, option: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(option);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:bg-muted/50 transition-colors",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
        sideOffset={4}
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground mr-2" aria-hidden="true" />
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 border-0 p-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
            aria-label="Search options"
          />
        </div>
        
        {/* Options List */}
        <ScrollArea className="max-h-60">
          <div className="p-1" role="listbox">
            {filteredOptions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </p>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  role="option"
                  aria-selected={value === option}
                  tabIndex={0}
                  onClick={() => handleSelect(option)}
                  onKeyDown={(e) => handleKeyDown(e, option)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground",
                    "transition-colors",
                    value === option && "bg-accent/50"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{option}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
