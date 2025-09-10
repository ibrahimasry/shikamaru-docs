import * as React from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { Link } from "gatsby";

const NotFoundPage: React.FC = () => (
  <Layout title="Page not found">
    <SEO title="404: Not found" />
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Page not found</h1>
      <p className="text-slate-600">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-block">Go home</Link>
    </div>
  </Layout>
);

export default NotFoundPage;
