import { Link } from "@remix-run/react";
import { IconBellRinging, IconReceipt2 } from "@tabler/icons-react";

type Props = {
  toggleMobile: (open: boolean) => void;
}

const data = [
  // { link: "/?tag=技术", label: "技术", icon: IconBellRinging },
  // { link: "/?tag=新闻", label: "新闻", icon: IconReceipt2 },
  { link: "/live/bilibili/category", label: "BiliBili", icon: IconReceipt2 },
  { link: "/live/douyu/category", label: "斗鱼", icon: IconReceipt2 },
  { link: "/live/huya/category", label: "虎牙", icon: IconReceipt2 },
  { link: "/live/douyin/category", label: "抖音", icon: IconReceipt2 },
];


export function NavbarSimple({ toggleMobile }: Props) {
  const links = data.map((item) => (
    <Link className={"flex mb-2 p-2 rounded"} to={item.link} key={item.label} onClick={() => toggleMobile(false)}>
      <span className={"text-lg"}>{item.label}</span>
    </Link>
  ));

  return (
    <nav>
      <div>{links}</div>
    </nav>
  );
}
