import { Link } from "@remix-run/react";
import {
  Accordion,
  Button,
  Datepicker,
  Modal,
  Sidebar,
  Tooltip,
} from "flowbite-react";
import { useState } from "react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiOutlineExclamationCircle,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

export default function IndexPage() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Sidebar aria-label="Default sidebar example">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={HiChartPie}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="#"
              icon={HiViewBoards}
              label="Pro"
              labelColor="dark"
            >
              Kanban
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiInbox} label="3">
              Inbox
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiUser}>
              Users
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiShoppingBag}>
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiArrowSmRight}>
              Sign In
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiTable}>
              Sign Up
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      <Tooltip content={<div className={"bg-red-700"}>dasd</div>}>
        <Button>Default tooltip</Button>
      </Tooltip>
    </>
  );
}
