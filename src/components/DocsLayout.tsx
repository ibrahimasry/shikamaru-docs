import * as React from "react";
import { Link, navigate, graphql, useStaticQuery } from "gatsby";
import Layout from "./Layout";
import { docsNav } from "./docsNav";

type DocsLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function generateSlugFromText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const DocsLayout: React.FC<DocsLayoutProps> = ({ title, children }) => {
  const data = useStaticQuery<{
    allMdx: {
      nodes: Array<{
        fields?: { slug?: string | null } | null;
        frontmatter?: { title?: string | null; order?: number | null } | null;
      }>;
    };
  }>(graphql`
    query DocsSidebarQuery {
      allMdx(
        filter: { internal: { contentFilePath: { regex: "/docs/" } } }
        sort: [{ frontmatter: { order: ASC } }, { frontmatter: { title: ASC } }]
      ) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            order
          }
        }
      }
    }
  `);
  const dynamicNav = (data.allMdx?.nodes || [])
    .map((n) => ({
      title:
        n.frontmatter?.title ||
        (n.fields?.slug ? n.fields.slug.replace(/[-_]/g, " ") : "Untitled"),
      path: n.fields?.slug ? `/docs/${n.fields.slug}` : undefined,
      order: n.frontmatter?.order ?? 9999,
    }))
    .filter((n) => Boolean(n.path)) as Array<{
    title: string;
    path: string;
    order: number;
  }>;
  const navItems =
    dynamicNav.length > 0
      ? dynamicNav
      : docsNav.map((d) => ({ ...d, order: 9999 }));
  const contentRef = React.useRef<HTMLElement | null>(null);
  const [headings, setHeadings] = React.useState<TocHeading[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [currentPath, setCurrentPath] = React.useState<string | null>(null);
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!contentRef.current) return;
    const rootElement = contentRef.current;
    const foundHeadings: TocHeading[] = [];
    const nodes = rootElement.querySelectorAll<HTMLHeadingElement>("h2, h3");
    nodes.forEach((node) => {
      const text = node.innerText || node.textContent || "";
      if (!text) return;
      if (!node.id) {
        node.id = generateSlugFromText(text);
      }
      // Add anchor link next to heading text (once)
      node.classList.add("group");
      const existingAnchor =
        node.querySelector<HTMLAnchorElement>("a.doc-anchor");
      if (!existingAnchor) {
        const anchor = document.createElement("a");
        anchor.href = `#${node.id}`;
        anchor.setAttribute("aria-label", "Link to this section");
        anchor.className =
          "doc-anchor ml-2 opacity-0 group-hover:opacity-100 align-middle text-slate-400 hover:text-brand-700 transition";
        anchor.textContent = "#";
        node.appendChild(anchor);
      }
      const level = (node.tagName.toLowerCase() === "h3" ? 3 : 2) as 2 | 3;
      foundHeadings.push({ id: node.id, text, level });
    });
    setHeadings(foundHeadings);
  }, [children]);

  React.useEffect(() => {
    if (!contentRef.current) return;
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target) {
          const id = (visible[0].target as HTMLElement).id;
          if (id) setActiveId(id);
        }
      },
      {
        root: null,
        rootMargin: "-64px 0px -60% 0px",
        threshold: [0, 1.0],
      }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  // Track current path for prev/next and restore sidebar state
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
      const savedQuery = window.localStorage.getItem("docsSidebarQuery");
      if (savedQuery) setSearchQuery(savedQuery);
      const savedScroll = window.localStorage.getItem("docsSidebarScroll");
      if (savedScroll && sidebarRef.current) {
        sidebarRef.current.scrollTop = Number(savedScroll) || 0;
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("docsSidebarQuery", searchQuery);
  }, [searchQuery]);

  React.useEffect(() => {
    const el = sidebarRef.current;
    if (!el || typeof window === "undefined") return;
    const onScroll = () => {
      window.localStorage.setItem("docsSidebarScroll", String(el.scrollTop));
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [sidebarRef.current]);

  // Keyboard navigation: j (next), k (previous)
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement)?.isContentEditable;
      if (isTyping) return;

      const indexByTitle = title
        ? docsNav.findIndex((d) => d.title === title)
        : -1;
      const indexByPath = currentPath
        ? docsNav.findIndex((d) => d.path === currentPath)
        : -1;
      const currentIndex = indexByTitle !== -1 ? indexByTitle : indexByPath;
      if (currentIndex === -1) return;

      if (e.key.toLowerCase() === "j") {
        const next =
          currentIndex < docsNav.length - 1
            ? docsNav[currentIndex + 1]
            : undefined;
        if (next) navigate(next.path);
      }
      if (e.key.toLowerCase() === "k") {
        const prev = currentIndex > 0 ? docsNav[currentIndex - 1] : undefined;
        if (prev) navigate(prev.path);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [title, currentPath]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <Layout title={title}>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <div className="sticky top-20">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-slate-800 font-semibold dark:text-slate-200">
                shikamaru
              </span>
            </Link>
            <div
              ref={sidebarRef}
              className="max-h-[calc(100vh-6rem)] overflow-y-auto pr-1"
            >
              <div className="mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search docs..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>
              <nav className="space-y-1">
                {navItems
                  .filter((item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      activeClassName="bg-brand-50 text-brand-700 ring-1 ring-brand-100 dark:bg-slate-800 dark:text-brand-300"
                      className="block px-3 py-2 rounded-lg text-slate-700 hover:text-brand-700 hover:bg-brand-50 dark:text-slate-300 dark:hover:text-brand-300 dark:hover:bg-slate-800"
                    >
                      {item.title}
                    </Link>
                  ))}
              </nav>
            </div>
          </div>
        </aside>
        <article
          ref={contentRef}
          className="col-span-12 md:col-span-8 lg:col-span-7 prose dark:prose-invert"
        >
          {children}
          <div className="not-prose mt-12 pt-6 border-t border-slate-200 flex items-center justify-between text-sm dark:border-slate-800">
            {(() => {
              const indexByTitle = title
                ? docsNav.findIndex((d) => d.title === title)
                : -1;
              const indexByPath = currentPath
                ? docsNav.findIndex((d) => d.path === currentPath)
                : -1;
              const currentIndex =
                indexByTitle !== -1 ? indexByTitle : indexByPath;
              const prev =
                currentIndex > 0 ? docsNav[currentIndex - 1] : undefined;
              const next =
                currentIndex !== -1 && currentIndex < docsNav.length - 1
                  ? docsNav[currentIndex + 1]
                  : undefined;
              return (
                <>
                  <div>
                    {prev ? (
                      <Link
                        to={prev.path}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                      >
                        <span className="text-slate-400 dark:text-slate-500">
                          ←
                        </span>
                        <span className="flex flex-col text-left">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Previous
                          </span>
                          <span className="font-medium">{prev.title}</span>
                        </span>
                      </Link>
                    ) : (
                      <span />
                    )}
                  </div>
                  <div>
                    {next ? (
                      <Link
                        to={next.path}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                      >
                        <span className="flex flex-col text-right">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Next
                          </span>
                          <span className="font-medium">{next.title}</span>
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">
                          →
                        </span>
                      </Link>
                    ) : (
                      <span />
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </article>
        <aside className="hidden md:block md:col-span-1 lg:col-span-2">
          <div className="sticky top-20">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 dark:text-slate-400">
              On this page
            </p>
            <nav className="text-sm space-y-1">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={
                    "block px-2 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-brand-500 " +
                    (h.level === 3 ? "ml-4 " : "") +
                    (activeId === h.id
                      ? "text-brand-700 bg-brand-50 dark:text-brand-300 dark:bg-slate-800"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white")
                  }
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </Layout>
  );
};

export default DocsLayout;
