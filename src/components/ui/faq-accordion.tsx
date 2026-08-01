"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `faq-trigger-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div
            key={item.question}
            className={cn(
              "rounded-3xl border-2 bg-white",
              "transition-colors duration-200",
              isOpen
                ? [
                    "border-sky-300",
                    "shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]",
                  ]
                : "border-sky-50",
            )}
          >
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between
                  gap-4 px-6 py-5 text-left
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-sky-400
                  focus-visible:ring-inset"
              >
                <span
                  className="font-display text-lg font-bold
                    text-foreground"
                >
                  {item.question}
                </span>

                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-9 shrink-0 place-items-center",
                    "rounded-full transition-all duration-300",
                    isOpen
                      ? "rotate-45 bg-sky-400 text-white"
                      : "bg-sky-100 text-sky-600",
                  )}
                >
                  <Plus className="size-5" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden"
                >
                  <p
                    className="px-6 pb-6 leading-relaxed
                      text-muted-foreground"
                  >
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
