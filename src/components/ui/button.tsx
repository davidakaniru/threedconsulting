import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button",
    "inline-flex shrink-0 items-center justify-center",
    "whitespace-nowrap border border-transparent",
    "font-display font-bold",
    "transition-[transform,background-color,color,border-color,box-shadow,filter]",
    "duration-200 ease-out",
    "outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:not-aria-[haspopup]:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive",
    "aria-invalid:ring-2 aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:brightness-95",
          "hover:shadow-md",
        ],

        secondary: [
          "bg-secondary text-secondary-foreground",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:bg-secondary/80",
          "hover:shadow-md",
        ],

        outline: [
          "border-primary/25 bg-background text-primary",
          "shadow-xs",
          "hover:-translate-y-0.5",
          "hover:border-primary/40",
          "hover:bg-primary/10",
          "hover:shadow-sm",
          "aria-expanded:border-primary/40",
          "aria-expanded:bg-primary/10",
        ],

        ghost: [
          "bg-transparent text-foreground/80",
          "hover:bg-primary/10",
          "hover:text-primary",
          "aria-expanded:bg-primary/10",
          "aria-expanded:text-primary",
        ],

        muted: [
          "bg-muted text-foreground",
          "hover:-translate-y-0.5",
          "hover:bg-muted/80",
        ],

        destructive: [
          "bg-destructive text-white",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:bg-destructive/90",
          "hover:shadow-md",
          "focus-visible:ring-destructive/40",
        ],

        coral: [
          "bg-coral text-white",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:brightness-95",
          "hover:shadow-md",
          "focus-visible:ring-coral/40",
        ],

        purple: [
          "bg-purple text-white",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:brightness-95",
          "hover:shadow-md",
          "focus-visible:ring-purple/40",
        ],

        turquoise: [
          "bg-turquoise text-white",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:brightness-95",
          "hover:shadow-md",
          "focus-visible:ring-turquoise/40",
        ],

        pink: [
          "bg-pink text-foreground",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:brightness-95",
          "hover:shadow-md",
          "focus-visible:ring-pink/40",
        ],

        cream: [
          "border-primary/10 bg-cream text-foreground",
          "shadow-xs",
          "hover:-translate-y-0.5",
          "hover:border-primary/20",
          "hover:shadow-sm",
        ],

        link: [
          "h-auto rounded-none bg-transparent p-0",
          "text-primary underline-offset-4",
          "hover:underline",
          "focus-visible:ring-offset-4",
        ],
      },

      size: {
        xs: [
          "h-7 gap-1 rounded-full px-2.5 text-xs",
          "has-data-[icon=inline-start]:pl-2",
          "has-data-[icon=inline-end]:pr-2",
          "[&_svg:not([class*='size-'])]:size-3",
        ],

        sm: [
          "h-9 gap-1.5 rounded-full px-4 text-sm",
          "has-data-[icon=inline-start]:pl-3",
          "has-data-[icon=inline-end]:pr-3",
        ],

        default: [
          "h-10 gap-2 rounded-full px-5 text-sm",
          "has-data-[icon=inline-start]:pl-4",
          "has-data-[icon=inline-end]:pr-4",
        ],

        lg: [
          "h-12 gap-2 rounded-full px-6 text-base",
          "has-data-[icon=inline-start]:pl-5",
          "has-data-[icon=inline-end]:pr-5",
        ],

        xl: [
          "h-14 gap-2.5 rounded-full px-8 text-base",
          "has-data-[icon=inline-start]:pl-6",
          "has-data-[icon=inline-end]:pr-6",
          "[&_svg:not([class*='size-'])]:size-5",
        ],

        icon: "size-10 rounded-full",

        "icon-xs": [
          "size-7 rounded-full",
          "[&_svg:not([class*='size-'])]:size-3",
        ],

        "icon-sm": "size-9 rounded-full",

        "icon-lg": [
          "size-12 rounded-full",
          "[&_svg:not([class*='size-'])]:size-5",
        ],
      },

      elevation: {
        none: "",
        soft: "shadow-sm hover:shadow-md",
        playful: [
          "shadow-[0_5px_0_0_color-mix(in_oklch,currentColor,transparent_80%)]",
          "hover:-translate-y-0.5",
          "hover:shadow-[0_7px_0_0_color-mix(in_oklch,currentColor,transparent_82%)]",
          "active:translate-y-1",
          "active:shadow-[0_1px_0_0_color-mix(in_oklch,currentColor,transparent_80%)]",
        ],
      },

      fullWidth: {
        true: "w-full",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      elevation: "none",
      fullWidth: false,
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  elevation = "none",
  fullWidth = false,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-elevation={elevation}
      data-fullwidth={fullWidth}
      className={cn(
        buttonVariants({ variant, size, elevation, fullWidth, className }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
