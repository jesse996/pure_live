import "@mantine/core/styles.css";
import "./root.css";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { ReactElement } from "react";

import { HeaderSimple } from "~/components/HeaderSimple/HeaderSimple";
import { ColorSchemeScript, Container, MantineProvider } from "@mantine/core";
import { NothingFoundBackground } from "~/components/NotFound/NothingFoundBackground";
import { err } from "@remix-run/dev/dist/result";

export default function App() {
  return (
    <html lang="en">
      <head>
        <title>新新闻</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Layout>
            <Outlet />
          </Layout>
          <ScrollRestoration />
          <Scripts />
        </MantineProvider>
      </body>
    </html>
  );
}

function Layout({ children }: { children: ReactElement }) {
  return (
    <Container size="lg">
      <HeaderSimple />
      {children}
    </Container>
  );
}

// export function ErrorBoundary() {
//   const error = useRouteError();
//   // When NODE_ENV=production:
//   // error.message = "Unexpected Server Error"
//   // error.stack = undefined
//   console.info("🚀 ~ file:root method:ErrorBoundary line:56 -----", error);
//   if (error.status === 404) {
//     return <div>404</div>;
//   }
// }
