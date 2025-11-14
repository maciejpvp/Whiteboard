import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import SettingsLayout from "@/layouts/settings";
import { UserSection } from "@/components/Settings/Sections/UserSection";

export const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const side = searchParams.get("side");

  useEffect(() => {
    if (!side) {
      setSearchParams({ side: "account" });
    }
  }, [side, setSearchParams]);

  return (
    <SettingsLayout>
      <div className="h-full w-full flex flex-row">
        {side === "account" ? (
          <UserSection />
        ) : side === "appearance" ? (
          <UserSection />
        ) : (
          ""
        )}
      </div>
    </SettingsLayout>
  );
};
