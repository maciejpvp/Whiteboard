import { ListType } from "@/types";
import { ItemComponent } from "./ItemComponent";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { CreateWhiteboardModal } from "../Modals/CreateWhiteboardModal";

type Props = {
  data: {
    list: ListType;
    sharedList: ListType;
  };
};

export const ListComponent = ({ data }: Props) => {
  const { list, sharedList } = data;
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateWhiteboard = () => {
    setModalOpen((prev) => !prev);
  };

  const renderSection = (title: string, items: ListType) => {
    if (!items || items.length === 0) return null;

    return (
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-3 pl-1">
          {title}
        </h2>
        <ul
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
            gap-6 px-1 py-2
          "
        >
          {items.map((item) => (
            <li key={item.WhiteboardId} className="">
              <ItemComponent item={item} />
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const bothEmpty =
    (!list || list.length === 0) && (!sharedList || sharedList.length === 0);

  const sortedList = [...list].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const sortedSharedList = [...sharedList].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="flex flex-col w-full max-w-[1400px] h-full">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 border-b border-slate-200 pb-2">
        <h1 className="text-2xl font-semibold text-slate-900 pl-1">
          Whiteboards
        </h1>
        <button
          onClick={handleCreateWhiteboard}
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
        <CreateWhiteboardModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </header>

      {/* Empty State */}
      {bothEmpty ? (
        <div className="flex flex-col items-center justify-center text-slate-500 h-full py-24">
          <FolderPlus size={48} className="mb-4 text-slate-400" />
          <p className="text-lg font-medium mb-2">No whiteboards yet</p>
          <p className="text-sm text-slate-500">
            Create your first whiteboard to get started.
          </p>
        </div>
      ) : (
        <>
          {renderSection("Your Whiteboards", sortedList)}
          {renderSection("Shared With You", sortedSharedList)}
        </>
      )}
    </div>
  );
};
