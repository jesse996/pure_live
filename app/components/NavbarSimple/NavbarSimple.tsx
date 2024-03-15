import { IconBellRinging, IconReceipt2 } from "@tabler/icons-react";
import { Link } from "@remix-run/react";

const data = [
  { link: "/?tag=技术", label: "技术", icon: IconBellRinging },
  { link: "/?tag=新闻", label: "新闻", icon: IconReceipt2 },
  { link: "/live/bilibili", label: "斗鱼", icon: IconReceipt2 },
];

export function NavbarSimple() {
  const links = data.map((item) => (
    <Link className={"flex mb-2 p-2 rounded"} to={item.link} key={item.label}>
      {/*<item.icon className={classes.linkIcon} stroke={1.5} />*/}
      <span className={"text-lg"}>{item.label}</span>
    </Link>
  ));

  return (
    <nav>
      <div>{links}</div>
    </nav>
  );
}
