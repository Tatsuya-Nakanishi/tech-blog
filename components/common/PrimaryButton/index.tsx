import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";

interface PrimaryButtonProps extends ButtonProps {
  width?: string;
}

export default function Component({
  width = "w-full",
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
        width,
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
