// src/components/ui/badge.tsx
import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
