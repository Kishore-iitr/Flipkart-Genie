import Link from "next/link";
import { Sparkles, Globe, GitFork } from "lucide-react";

const links = {
  Shop: [
    { label: "All Products", href: "/#products" },
    { label: "Electronics", href: "/?cat=Electronics" },
    { label: "Gaming", href: "/?cat=Gaming" },
    { label: "Photography", href: "/?cat=Photography" },
  ],
  Explore: [
    { label: "Ask Genie", href: "/genie" },
    { label: "Cart", href: "/cart" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-[#172337] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe500]">
                <Sparkles className="h-3.5 w-3.5 text-[#2874f0]" />
              </div>
              <span className="font-bold text-white">
                Flipkart<span className="text-[#ffe500]"> Genie</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your AI-powered shopping assistant. Find the perfect product every time.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h3 className="mb-4 text-sm font-semibold text-white">{group}</h3>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Flipkart Genie. Built with Next.js &amp; ♥
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <GitFork className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
