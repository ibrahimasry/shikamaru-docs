import type { GatsbyConfig } from "gatsby";
import remarkGfm from "remark-gfm";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "shikamaru CLI",
    siteUrl: "https://maru.ibrahimasry.com",
    description:
      "Spin up multi-repo dev environments with env management, port allocation, Docker/Hybrid orchestration, and web logs.",
    author: "@ibrahimasry",
    image: "/0.png",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "docs",
        path: `${__dirname}/src/docs/`,
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
        mdxOptions: { remarkPlugins: [remarkGfm] },
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-autolink-headers",
            options: { maintainCase: false, removeAccents: true },
          },
          { resolve: "gatsby-remark-smartypants" },
        ],
      },
    },
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://maru.ibrahimasry.com",
        sitemap: "https://maru.ibrahimasry.com/sitemap-index.xml",
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
  ],
};
export default config;
