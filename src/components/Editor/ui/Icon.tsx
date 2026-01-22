"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconProps = React.ComponentPropsWithoutRef<"svg"> & {
  icon: LucideIcon;
};

export function Icon({ icon: IconComponent, className, ...props }: IconProps) {
  return <IconComponent className={cn("size-4 shrink-0", className)} {...props} />;
}
