import { ListType } from "@/types";
import { ItemComponent } from "./ItemComponent";
import { FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  list: ListType;
};

export const ListComponent = ({ list }: Props) => {
  const navigate = useNavigate();
  const isEmpty = !list || list.length === 0;

  return (
    <div className="flex flex-col w-full max-w-[1400px] h-full">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 border-b border-slate-200 pb-2">
        <h1 className="text-2xl font-semibold text-slate-900 pl-1">
          Recent Whiteboards
        </h1>
        <button
          onClick={() => navigate("/create")}
          className="
            flex items-center gap-2 px-4 py-2
            bg-blue-600 text-white font-medium
            rounded-lg shadow-md hover:bg-blue-700
            transition-colors duration-200
          "
        >
          <FolderPlus size={18} />
          Create New
        </button>
      </header>

      {/* Content */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center text-slate-500 h-full py-24">
          <FolderPlus size={48} className="mb-4 text-slate-400" />
          <p className="text-lg font-medium mb-2">No recent whiteboards yet</p>
          <p className="text-sm text-slate-500">
            Create your first project to get started.
          </p>
        </div>
      ) : (
        <ul
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
            gap-6
            px-1
            py-2
          "
        >
          {list.map((item) => (
            <li key={item.WhiteboardId}>
              <ItemComponent item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
