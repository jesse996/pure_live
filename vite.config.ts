import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { flatRoutes } from "remix-flat-routes";
import { remixDevTools } from "remix-development-tools";

export default defineConfig({
  plugins: [
    tailwindcss(),
    remixDevTools(),
    remixCloudflareDevProxy(),
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
