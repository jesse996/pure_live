import { Outlet } from "@remix-run/react";

export default function index() {
	return (
		<div>
			<p>in sys layout</p>
			<Outlet />
		</div>
	);
}
