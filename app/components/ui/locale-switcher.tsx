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
import { Suspense } from "react";

const locales = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
] as const;

export function LocaleSwitcher() {
  const changeLocale = useChangeLocaleMutation();
  const currentLocale = useCurrentLocale();

  return (
    <DropdownMenu>
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
            onClick={() => changeLocale.mutate(locale.value)}
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
