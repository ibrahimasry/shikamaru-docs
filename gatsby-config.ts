import type { GatsbyConfig } from "gatsby";
import remarkGfm from "remark-gfm";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "shikamaru CLI",
    siteUrl: "https://shikamaru.ibrahimasry.com",
    description:
      "Spin up multi-repo dev environments with env management, port allocation, Docker/Hybrid orchestration, and web logs.",
    author: "@ibrahimasry",
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
  ],
};
export default config;
