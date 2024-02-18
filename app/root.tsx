import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "./root.css";

import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import { ReactElement, useEffect } from "react";

import { HeaderSimple } from "~/components/HeaderSimple/HeaderSimple";
import {
  AppShell,
  Burger,
  ColorSchemeScript,
  Container,
  createTheme,
  Group,
  MantineProvider,
} from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { NavbarSimple } from "~/components/NavbarSimple/NavbarSimple";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  autoContrast: true,
  // primaryColor: "cyan",
});

// export const loader = async () => {
//   await supabaseClient.from("sys_article").select("source");
// };

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
          <NavigationProgress />
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
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const pinned = useHeadroom({ fixedAt: 120 });
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state !== "idle") {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [navigation]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        {/*<HeaderSimple />*/}
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          <Link to={"/"}>娱乐娱乐</Link>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavbarSimple />
      </AppShell.Navbar>

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
