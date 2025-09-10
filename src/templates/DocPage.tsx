import * as React from "react";
import { graphql } from "gatsby";
import DocsLayout from "../components/DocsLayout";
import SEO from "../components/SEO";

type PageProps = {
  children: React.ReactNode;
  data: {
    mdx: { frontmatter?: { title?: string | null } | null } | null;
  };
};

const DocPage: React.FC<PageProps> = ({ data, children }) => {
  const title = data.mdx?.frontmatter?.title || undefined;
  return (
    <DocsLayout title={title}>
      <SEO title={title} />
      {children}
    </DocsLayout>
  );
};

export default DocPage;

export const query = graphql`
  query DocPageById($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
    }
  }
`;
