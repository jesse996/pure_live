import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "./root.css";

import {
  AppShell,
  Burger,
  Group,
  MantineProvider,
  createTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { type ReactElement, Suspense, useEffect } from "react";
import { NavbarSimple } from "~/components/NavbarSimple/NavbarSimple";

const theme = createTheme({
  // fontFamily: "Open Sans, sans-serif",
  // autoContrast: true,
  // primaryColor: "cyan",
});

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
        <MantineProvider theme={theme}>
          <NavigationProgress />
          <MyLayout>{children}</MyLayout>
        </MantineProvider>
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Outlet />
    </Suspense>
  );
}

function MyLayout({ children }: { children: ReactElement }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  // const pinned = useHeadroom({ fixedAt: 120 });
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state !== "idle") {
      // console.info("nprogress", nprogress);
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [navigation]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
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
          <Link to={"/"}>纯粹直播</Link>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavbarSimple toggleMobile={toggleMobile} />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
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
