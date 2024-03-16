import "@mantine/core/styles.css";
import "@mantine/nprogress/styles.css";
import "./root.css";

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
import { ReactElement, useEffect } from "react";
import {
  AppShell,
  Burger,
  Container,
  createTheme,
  Group,
  MantineProvider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { NavbarSimple } from "~/components/NavbarSimple/NavbarSimple";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  // autoContrast: true,
  // primaryColor: "cyan",
});

export function Layout({ children }: { children: ReactElement }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="referrer" content="no-referrer" />

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
  return <Outlet />;
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
          <Link to={"/"}>娱乐娱乐</Link>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavbarSimple />
      </AppShell.Navbar>

      <AppShell.Main>
        {/*<Container size={"xl"}>*/}
        {children}
        {/*</Container>*/}
      </AppShell.Main>
    </AppShell>
  );
}

export function ErrorBoundary() {
  const error: any = useRouteError();
  console.info("🚀 ~ error", error);
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
