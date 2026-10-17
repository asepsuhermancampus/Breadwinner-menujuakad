import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-foreground text-white hover:bg-primary",
        secondary: "border border-border bg-surface text-foreground hover:bg-subtle",
        ghost: "text-secondary hover:bg-subtle hover:text-foreground",
        danger: "bg-danger text-white hover:bg-danger/90",
      },
      size: { default: "py-3", small: "px-3 py-2 text-xs", icon: "size-11 p-0" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
export function Button({ className, variant, size, type = "button", ...props }: Props) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
