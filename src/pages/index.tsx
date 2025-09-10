import * as React from "react";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { Link } from "gatsby";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Spin up multi-repo dev environments" />
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              shikamaru CLI
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Spin up multi-repo dev environments with{" "}
              <span className="font-semibold">env management</span>,{" "}
              <span className="font-semibold">port allocation</span>,{" "}
              <span className="font-semibold">Docker/Hybrid orchestration</span>
              , and real-time logs.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                className="btn-primary"
                href="https://www.npmjs.com/package/shikamaru"
                target="_blank"
                rel="noreferrer"
              >
                npm install -g shikamaru
              </a>
              <Link className="btn-ghost" to="/docs/getting-started">
                Get Started
              </Link>
            </div>
            <div className="mt-6 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 mr-4">
                ✅ Node ≥16
              </span>
              <span className="inline-flex items-center gap-2">
                🐳 Docker required for docker/hybrid
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <pre className="text-sm leading-6 overflow-auto">
              {`$ maru start
✔ Select repositories: api, web, player
✔ Execution mode: hybrid
✔ Ports allocated: saved to ports-map.json
✔ Generated env files from .env.example
→ Web logs: http://localhost:3015`}
            </pre>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            ["Repo discovery", "Pick services to run. Save profiles."],
            [".env generation", "From .env.example + cloud + globals."],
            ["Port allocation", "Avoid conflicts. Persist across runs."],
            ["Docker/Hybrid modes", "Run locally, in Docker, or mix."],
            ["log viewer", "real-time logs in web or terminal."],
            ["Infra inference", "Auto decide Docker vs external DB/queues."],
          ].map(([title, desc], i) => (
            <div key={i} className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="rounded-2xl border border-slate-200 p-6 bg-white">
          <h2 className="text-2xl font-bold">One Command Quick Start</h2>
          <pre className="mt-4">{`npm install -g shikamaru
maru start`}</pre>
          <p className="mt-4 text-slate-600 text-sm">
            Add <code>global.env</code> and <code>frontend.global.env</code> to
            your workspace root for all services variables. Use{" "}
            <code>--skip-cloud</code> to avoid fetching from Azure.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
