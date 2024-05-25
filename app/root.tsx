import "./root.css";
import "../public/antd.min.css";

import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { type ReactElement, useEffect } from "react";
import { NavbarSimple } from "~/components/NavbarSimple/NavbarSimple";
import { StyleProvider } from "@ant-design/cssinjs";

export function Layout({ children }: { children: ReactElement }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/*<meta name="referrer" content="no-referrer" />*/}
        <title>纯粹直播</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <ScrollRestoration />
        <script src="../node_modules/flowbite/dist/flowbite.js"></script>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <StyleProvider layer>
      <Outlet />
    </StyleProvider>
  );
}

export function ErrorBoundary() {
  const error: any = useRouteError();
  console.info(error);

  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  }

  return (
    <>
      <h1>Error!</h1>
      <p>{error?.message ?? "Unknown error"}</p>
    </>
  );
}
