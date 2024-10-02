"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Link, useMatches } from "@tanstack/react-router";

import React from "react";

interface BreadcrumbItemType {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const matches = useMatches();

  const breadcrumbs = matches
    .map((match) => {
      const breadcrumb = match.__beforeLoadContext["breadcrumb"];
      if (!breadcrumb || typeof breadcrumb !== "string") return null;
      return {
        label: breadcrumb,
        href: match.pathname,
      };
    })
    .filter((breadcrumb) => !!breadcrumb);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
