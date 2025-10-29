import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { UserComponent } from "./UserComponent";

export const Navbar = () => {
  return (
    <div className="h-16 w-dvw bg-slate-50 py-2 px-5 flex items-center justify-between relative">
      <Logo />
      <div className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center">
        <SearchBar />
      </div>
      <UserComponent />
    </div>
  );
};
