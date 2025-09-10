export type DocsNavItem = {
  title: string;
  path: string;
};

export const docsNav: DocsNavItem[] = [
  { title: "Getting Started", path: "/docs/getting-started" },
  { title: "Commands", path: "/docs/commands" },
  { title: "Configuration", path: "/docs/configuration" },
  { title: "Infra: Docker vs External", path: "/docs/infra" },
  { title: "Port Management", path: "/docs/ports" },
  { title: "Troubleshooting", path: "/docs/troubleshooting" },
];
