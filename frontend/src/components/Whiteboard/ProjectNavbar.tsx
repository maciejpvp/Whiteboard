import { useNavigate } from "react-router-dom";
import { UserComponent } from "../ProjectsList/UserComponent";

type Props = {
  title: string;
};

export const ProjectNavbar = ({ title }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="h-16 w-dvw bg-slate-50 py-2 px-5 flex items-center justify-between absolute top-0">
      <button
        className="h-full flex flex-row items-center justify-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/DrawnUp.png" alt="DrawnUp Logo" className="w-full h-[90%]" />
        <span className="text-xl pb-3 text-nowrap">{title}</span>
      </button>
      <UserComponent />
    </div>
  );
};
