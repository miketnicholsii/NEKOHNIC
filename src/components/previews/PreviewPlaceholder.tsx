import { memo } from "react";
import { Sparkles } from "lucide-react";

interface PreviewPlaceholderProps {
  title: string;
  description: string;
}

export const PreviewPlaceholder = memo(function PreviewPlaceholder({
  title,
  description,
}: PreviewPlaceholderProps) {
  return (
    <div className="relative h-full w-full rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 shadow-lg overflow-hidden">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      <div className="relative flex h-full min-h-[360px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground max-w-[220px]">{description}</p>
        <div className="mt-2 h-1.5 w-24 rounded-full bg-muted" />
      </div>
    </div>
  );
});
