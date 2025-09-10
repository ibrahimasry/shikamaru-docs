import * as React from "react";
import { Helmet } from "react-helmet";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  pathname?: string;
  noindex?: boolean;
};

const siteUrl = "https://maru.ibrahimasry.com";
const defaultImage = "/0.png";

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  pathname,
  noindex,
}) => {
  const fullTitle = title ? `${title} — shikamaru` : "shikamaru CLI";
  const canonical = pathname ? `${siteUrl}${pathname}` : siteUrl;
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}${defaultImage}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "shikamaru CLI",
    url: siteUrl,
    description:
      description ||
      "Spin up multi-repo dev environments with env management, port allocation, Docker/Hybrid orchestration, and web logs.",
  } as const;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SEO;
