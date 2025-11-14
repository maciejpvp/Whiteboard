import { Navbar } from "@/components/ProjectsList/Navbar";
import { SettingsSidebar } from "@/components/Settings/SettingsSidebar";
import { Divider } from "@mui/material";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen ">
      <Navbar hideSearchBar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16  pb-5">
        <div className="h-full grid grid-cols-1 md:grid-cols-[minmax(220px,0.3fr)_1fr] bg-content1 text-content1-foreground rounded-lg">
          <SettingsSidebar />
          <div className="flex">
            <Divider orientation="vertical" />
            <main className="h-full overflow-auto w-full">{children}</main>
          </div>
        </div>
      </main>
    </div>
  );
}
