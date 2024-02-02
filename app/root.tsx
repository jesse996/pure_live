import "./root.css";
import "@mantine/core/styles.css";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ReactElement } from "react";

import { HeaderSimple } from "~/components/HeaderSimple/HeaderSimple";
import { ColorSchemeScript, Container, MantineProvider } from "@mantine/core";

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
