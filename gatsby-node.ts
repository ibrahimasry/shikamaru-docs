import type { GatsbyNode } from "gatsby";
import path from "path";

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(/* GraphQL */ `
      type MdxFrontmatter {
        title: String
        slug: String
        order: Int
      }
      type Mdx implements Node {
        frontmatter: MdxFrontmatter
        slug: String
        body: String
        fields: MdxFields
      }
      type MdxFields {
        slug: String
      }
    `);
  };

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  getNode,
  actions,
}) => {
  if (node.internal.type !== "Mdx") return;
  const fileNode = getNode(node.parent as string) as any;
  const sourceName: string | undefined = fileNode?.sourceInstanceName;
  if (sourceName !== "docs") return;
  const relativePath: string = fileNode?.relativePath || fileNode?.name || "";
  const withoutExt = relativePath.replace(/\.(md|mdx)$/i, "");
  const normalized = withoutExt
    .replace(/index$/i, "")
    .replace(/[^a-z0-9/_-]+/gi, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "")
    .toLowerCase();
  const explicit = (node as any).frontmatter?.slug as string | undefined;
  const slug =
    (explicit && explicit.trim()) || normalized || `${fileNode?.name}`;
  actions.createNodeField({ node, name: "slug", value: slug });
};

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
  reporter,
}) => {
  const { createPage } = actions;
  const result = await graphql<{
    allMdx: {
      nodes: Array<{
        id: string;
        fields?: { slug?: string | null } | null;
        internal?: { contentFilePath?: string | null } | null;
      }>;
    };
  }>(`
    {
      allMdx(filter: { internal: { contentFilePath: { regex: "/docs/" } } }) {
        nodes {
          id
          internal {
            contentFilePath
          }
          fields {
            slug
          }
        }
      }
    }
  `);
  if (result.errors) {
    reporter.panicOnBuild(result.errors as unknown as string);
    return;
  }
  const nodes = result.data?.allMdx.nodes || [];
  const templatePath = path.resolve("src/templates/DocPage.tsx");
  nodes.forEach((n) => {
    const slug = n.fields?.slug;
    if (!slug) return;
    const componentWithContent = `${templatePath}?__contentFilePath=${n.internal?.contentFilePath || ""}`;
    createPage({
      path: `/docs/${slug}`,
      component: componentWithContent,
      context: { id: n.id },
    });
  });
};

export {};
