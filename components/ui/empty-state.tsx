import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 border-dashed p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-soft text-brand">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-muted">{description}</p>
      </div>
      {action}
    </Card>
  );
}
