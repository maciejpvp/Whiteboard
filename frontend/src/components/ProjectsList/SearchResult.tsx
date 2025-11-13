import { useNavigate } from "react-router-dom";

type SearchItem = {
  id: string;
  title: string;
  lastModified?: string;
  isShared?: boolean;
  ownerId?: string;
};

type SearchResultProps = {
  results: SearchItem[];
  visible: boolean;
  setVisible: (v: boolean) => void;
  query: string;
};

export const SearchResult = ({
  results,
  visible,
  query,
}: SearchResultProps) => {
  const navigate = useNavigate();
  if (!results.length || !visible) return null;

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-bold">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-auto -translate-x-[10px]">
      {results.map((item) => {
        const handleOpen = () => {
          if (item.isShared) {
            navigate(`/project/${item.id}`, {
              state: { ownerId: item.ownerId },
            });
            return;
          }
          navigate(`/project/${item.id}`);
        };

        return (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-100 transition-colors cursor-pointer border-b border-slate-100 last:border-b-0"
            onClick={handleOpen}
          >
            <div className="flex flex-col">
              <span className="text-slate-800 font-medium">
                {highlightText(item.title, query)}
              </span>
              {item.lastModified && (
                <span className="text-slate-500 text-sm">
                  Last modified {item.lastModified}
                </span>
              )}
            </div>

            <div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  item.isShared
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {item.isShared ? "Shared" : "Private"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
