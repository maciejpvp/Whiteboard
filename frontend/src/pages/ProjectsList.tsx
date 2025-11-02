import { Navbar } from "../components/ProjectsList/Navbar";
import { useGetList } from "@/hooks/api/queries/useGetProjectList";
import { CircularProgress } from "@mui/material";
import { ListComponent } from "@/components/ProjectsList/ListComponent";

export const ProjectsList = () => {
  const { data: list, isLoading } = useGetList();

  return (
    <div className="w-dvw h-dvh bg-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto flex items-start justify-center p-8">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <CircularProgress size={40} sx={{ color: "#1544E5" }} />
          </div>
        ) : (
          <ListComponent list={list ?? []} />
        )}
      </main>
    </div>
  );
};
