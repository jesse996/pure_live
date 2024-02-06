import "@mantine/core/styles.css";
import "./root.css";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ReactElement } from "react";

import { HeaderSimple } from "~/components/HeaderSimple/HeaderSimple";
import {
  AppShell,
  ColorSchemeScript,
  Container,
  createTheme,
  MantineProvider,
} from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  autoContrast: true,
  // primaryColor: "cyan",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <title>新新闻</title>
        <meta charSet="utf-8" />
        <meta name="referrer" content="never" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme={"light"} />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme={"light"}>
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
  const [opened, { toggle }] = useDisclosure();
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell
      // className={"lg:w-2/3 mx-auto"}
      header={{ height: 60 }}
      // navbar={{
      //   width: 300,
      //   breakpoint: "sm",
      //   collapsed: { mobile: !opened },
      // }}
      padding="md"
    >
      <AppShell.Header>
        <HeaderSimple />
      </AppShell.Header>

      {/*<AppShell.Navbar p="md">Navbar</AppShell.Navbar>*/}

      <AppShell.Main>
        <Container size={"xl"}>{children}</Container>
      </AppShell.Main>
    </AppShell>
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
