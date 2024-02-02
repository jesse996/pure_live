import { Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderSimple.module.css";
import { Link, useLocation } from "@remix-run/react";

const links = [
  { link: "/", label: "Home" },
  { link: "/pricing", label: "Pricing" },
];

export function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const active = location.pathname;

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Link to={"/"}>
          <div>logo</div>
        </Link>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </div>
    </header>
  );
}
