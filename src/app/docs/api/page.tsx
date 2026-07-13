"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Load SwaggerUI dynamically on the client side to prevent SSR "window is not defined" errors during build
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  return (
    <main className="bg-slate-900 min-h-screen p-6 text-slate-100">
      <div className="max-w-7xl mx-auto border border-slate-800 rounded-3xl bg-white overflow-hidden shadow-2xl">
        <SwaggerUI url="/api/docs" />
      </div>
    </main>
  );
}
