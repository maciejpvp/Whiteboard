import { Divider } from "@mui/material";
import { SettingsSidebarItem } from "./SettingsSidebarItem";

export type Item = {
  title: string;
  key: "account" | "appearance";
};

export const SettingsSidebar = () => {
  const items: Item[] = [
    {
      title: "Account",
      key: "account",
    },
    {
      title: "Appearance",
      key: "appearance",
    },
  ] as const;

  return (
    <div className="h-full flex flex-col gap-4 pt-3">
      <h1 className="font-semibold text-xl ml-3 mt-2">Settings</h1>
      <Divider />
      <ul className="flex flex-col">
        {items.map((item) => {
          return (
            <li key={item.title}>
              <SettingsSidebarItem item={item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
