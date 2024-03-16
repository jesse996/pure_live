import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getCategoryRooms } from "~/apis/bilibili";
import { useLoaderData } from "@remix-run/react";
import { IconEye } from "@tabler/icons-react";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const searchParam = new URLSearchParams(request.url);
  const rooms = await getCategoryRooms(
    params.categoryId!,
    params.areaId!,
    Number(searchParam.get("page") ?? "1")
  );
  return { rooms };
};

export default function AreaDetail() {
  const { rooms } = useLoaderData<typeof loader>();
  // console.info("rooms", rooms);
  return (
    <div
      className={
        "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] justify-center"
      }
    >
      {rooms.items.map((item) => (
        <div
          key={item.roomId}
          className=" m-4 shadow-lg rounded-lg overflow-hidden"
        >
          <div className="relative">
            <img
              src={item.cover}
              alt={item.title}
              referrerPolicy={"no-referrer"}
              className="h-48 w-full object-cover"
            />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 truncate">{item.title}</div>
            <div className="text-gray-700 text-base">{item.nick}</div>
            <div className="mt-2 text-sm text-gray-600 flex items-center gap-1">
              <IconEye />
              {item.watching}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
