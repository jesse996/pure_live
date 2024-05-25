import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";

// import tailwindcss from "@tailwindcss/vite";
import { remixDevTools } from "remix-development-tools";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [
    // tailwindcss(),
    remixDevTools(),
    remix({
      // ssr: false,
      future: {
        unstable_singleFetch: true,
      },
      ignoredRouteFiles: ["**/*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
    }),
    tsconfigPaths(),
  ],
});
