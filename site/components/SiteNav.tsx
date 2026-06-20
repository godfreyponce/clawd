"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: [string, string][] = [
  ["/", "Home"],
  ["/docs", "Docs"],
  ["/journey", "Journey"],
];

export default function SiteNav() {
  const path = usePathname();
  return (
    <nav className="flex items-center gap-6 text-sm">
      {links.map(([href, label]) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`transition-colors duration-200 ${
              active ? "text-ink font-medium" : "text-mut hover:text-ink"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
