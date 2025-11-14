import { useSearchParams } from "react-router-dom";
import { Item } from "./SettingsSidebar";

type Props = {
  item: Item;
};

export const SettingsSidebarItem = ({ item }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { title, key } = item;
  const side = searchParams.get("side");

  const active = Boolean(key === side);

  const handleClick = () => {
    setSearchParams({ side: key });
  };

  return (
    <button
      className={`${active ? "bg-content2" : ""} p-4 text-lg flex flex-row items-start justify-start w-full`}
      onClick={handleClick}
    >
      <p>{title}</p>
    </button>
  );
};
