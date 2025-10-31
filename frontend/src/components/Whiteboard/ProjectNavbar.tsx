import { UserComponent } from "../ProjectsList/UserComponent";

type Props = {
  title: string;
};

export const ProjectNavbar = ({ title }: Props) => {
  return (
    <div className="h-16 w-dvw bg-slate-50/80 py-2 px-5 flex items-center justify-between absolute top-0">
      <div className="h-full flex flex-row items-center justify-center gap-3">
        <img src="/DrawnUp.png" alt="DrawnUp Logo" className="w-full h-[90%]" />
        <h1 className="text-xl pb-3">{title}</h1>
      </div>
      <UserComponent />
    </div>
  );
};
