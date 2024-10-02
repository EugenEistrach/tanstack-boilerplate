"use client";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useChangeLocaleMutation, useCurrentLocale } from "@/app/lib/i18n";

import { CheckIcon, ChevronDownIcon, GlobeIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const locales = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
] as const;

export function LocaleSwitcher() {
  const changeLocale = useChangeLocaleMutation();
  const currentLocale = useCurrentLocale();

  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-[8rem]">
          <GlobeIcon className="mr-2 h-4 w-4" />
          {locales.find((l) => l.value === currentLocale)?.label}
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.value}
            onClick={(event) => {
              event.preventDefault();
              changeLocale.mutate(locale.value, {
                onSettled: () => {
                  // Close the dropdown after short delay to prevent
                  // flickering when clicking on the trigger`
                  setTimeout(() => {
                    setOpen(false);
                  }, 100);
                },
              });
            }}
          >
            {locale.label}
            {locale.value === currentLocale && (
              <CheckIcon className="ml-2 h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
