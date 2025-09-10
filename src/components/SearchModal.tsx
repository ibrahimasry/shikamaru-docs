import * as React from "react";
import { graphql, useStaticQuery, navigate } from "gatsby";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type DocNode = {
  title: string;
  path: string;
  order: number;
};

const useDocsIndex = (): DocNode[] => {
  const data = useStaticQuery<{
    allMdx: {
      nodes: Array<{
        fields?: { slug?: string | null } | null;
        frontmatter?: { title?: string | null; order?: number | null } | null;
      }>;
    };
  }>(graphql`
    query SearchModalDocsIndexQuery {
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

  return (data.allMdx?.nodes || [])
    .map((n) => ({
      title:
        n.frontmatter?.title ||
        (n.fields?.slug ? n.fields.slug.replace(/[-_]/g, " ") : "Untitled"),
      path: n.fields?.slug ? `/docs/${n.fields.slug}` : "#",
      order: n.frontmatter?.order ?? 9999,
    }))
    .filter((n) => n.path !== "#");
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const docs = useDocsIndex();
  const [query, setQuery] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs.slice(0, 20);
    return docs
      .filter(
        (d) =>
          d.title.toLowerCase().includes(q) || d.path.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [docs, query]);

  React.useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-x-0 top-20 mx-auto w-full max-w-2xl">
        <div className="mx-4 rounded-xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-4 py-3">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search docs..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <ul className="max-h-96 overflow-y-auto py-2">
            {results.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500">No results</li>
            ) : (
              results.map((r) => (
                <li key={r.path}>
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-brand-50"
                    onClick={() => {
                      navigate(r.path);
                      onClose();
                    }}
                  >
                    <div className="font-medium text-slate-800">{r.title}</div>
                    <div className="text-xs text-slate-500">{r.path}</div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
