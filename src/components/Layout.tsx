import * as React from "react";
import { Helmet } from "react-helmet";
import { Link } from "gatsby";
import SearchModal from "./SearchModal";
import "../styles.css";
import { SiNpm } from "react-icons/si";
import { FiMoon, FiSun } from "react-icons/fi";

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
};

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => (
  <Link
    to={to}
    activeClassName="bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-300"
    className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium transition dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800"
  >
    {children}
  </Link>
);

const Header: React.FC<{ onOpenSearch: () => void }> = ({ onOpenSearch }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [isDark, setIsDark] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);
  const toggleTheme = React.useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (next) {
        root.classList.add("dark");
        (root as any).style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        (root as any).style.colorScheme = "light";
      }
      try {
        window.localStorage.setItem("theme", next ? "dark" : "light");
      } catch (e) {}
    }
  }, [isDark]);
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenSearch();
      }
      if (e.key === "/") {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        const isTyping =
          tag === "input" ||
          tag === "textarea" ||
          (e.target as HTMLElement)?.isContentEditable;
        if (!isTyping) {
          e.preventDefault();
          onOpenSearch();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200 supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/60 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Home">
          <img src="/icon.png" alt="shikamaru" className="h-30 w-10 md:h-12" />
        </Link>
        <nav className="flex items-center gap-1 flex-shrink-0">
          <span className="hidden sm:inline">
            <NavLink to="/#features">Features</NavLink>
          </span>
          <NavLink to="/docs/getting-started">Docs</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Search docs (Cmd/Ctrl+K)"
          >
            <span>Search</span>
            <span className="hidden md:inline-flex rounded border border-slate-300 px-1 text-[10px] text-slate-500">
              ⌘K
            </span>
          </button>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            {isDark ? (
              <FiSun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <FiMoon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <a
            className="btn-ghost hidden sm:inline-flex"
            href="https://www.npmjs.com/package/shikamaru"
            target="_blank"
            rel="noreferrer"
            aria-label="View on npm"
            title="npm"
          >
            <SiNpm className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            className="btn-cta hidden sm:inline-flex"
            href="https://github.com/ibrahimasry/shikamaru"
            target="_blank"
            rel="noreferrer"
            aria-label="View on GitHub"
            title="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="border-t border-slate-200 mt-20 dark:border-slate-800">
    <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-500 flex items-center justify-between dark:text-slate-400">
      <p>MIT © 2025 — shikamaru</p>
      <p>Made with love</p>
    </div>
  </footer>
);

const Layout: React.FC<{
  title?: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Helmet>
        <title>{title ? `${title} — shikamaru` : "shikamaru CLI"}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" sizes="any" type="image/png" />
      </Helmet>
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <main>{children}</main>
      <Footer />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default Layout;
