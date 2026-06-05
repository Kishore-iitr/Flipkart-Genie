import { BrainCircuit } from "lucide-react";

export function ReasoningPanel({ reasoning }: { reasoning?: string }) {
  if (!reasoning) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-card-foreground shadow-sm mb-4">
      <div className="flex items-center gap-2 font-semibold mb-2 text-primary">
        <BrainCircuit className="w-4 h-4" />
        <h3>Genie's Reasoning</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">{reasoning}</p>
    </div>
  );
}
