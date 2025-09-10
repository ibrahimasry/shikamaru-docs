import * as React from "react";
import { Helmet } from "react-helmet";

const SEO: React.FC<{title?: string; description?: string}> = ({title, description}) => {
  const fullTitle = title ? `${title} — shikamaru` : "shikamaru CLI";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;
