import { Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "@remix-run/react";
import classes from "./HeaderSimple.module.css";

const links = [
	{ link: "/", label: "Home" },
	// { link: "/pricing", label: "Pricing" },
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
			// className={"rounded-md leading-none px-2 py-2 text-sm"}
			data-active={active === link.link || undefined}
		>
			{link.label}
		</Link>
	));

	return (
		<header className={"px-5 h-full"}>
			<div className={"flex justify-between items-center  h-full"}>
				<Link to={"/"}>
					<div>娱乐娱乐</div>
				</Link>
				<Group gap={5} visibleFrom="xs">
					{items}
				</Group>

				<Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
			</div>
		</header>
	);
}
