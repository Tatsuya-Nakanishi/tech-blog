import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TagProps {
  backgroundColor?: string;
  children: React.ReactNode;
}

export default function Component({
  backgroundColor = "bg-blue-100",
  children,
}: TagProps) {
  return (
    <Label
      className={cn(
        backgroundColor,
        "inline-block text-black hover:bg-opacity-80 rounded-full px-4 py-1 text-sm font-normal cursor-pointer transition-colors duration-200"
      )}
    >
      {children}
    </Label>
  );
}
