import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useGetList } from "@/hooks/api/queries/useGetProjectList";
import { SearchResult } from "./SearchResult";
import { timeAgo } from "@/utils/timeAgo";

type SearchItem = {
  id: string;
  title: string;
  lastModified?: string;
  isShared?: boolean;
};

export const SearchBar = () => {
  const { data } = useGetList();
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [visible, setVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(input), 100);
    return () => clearTimeout(handler);
  }, [input]);

  useEffect(() => {
    const searchArray: SearchItem[] = [
      ...(data?.list.map((l) => ({
        id: l.WhiteboardId,
        title: l.Title,
        isShared: false,
        lastModified: timeAgo(l.updatedAt),
      })) ?? []),
      ...(data?.sharedList.map((l) => ({
        id: l.WhiteboardId,
        title: l.Title,
        isShared: true,
        ownerId: l.owner,
        lastModified: timeAgo(l.updatedAt),
      })) ?? []),
    ];

    if (debouncedInput.trim() === "") {
      setResults([]);
    } else {
      const filtered = searchArray.filter((item) =>
        item.title.toLowerCase().includes(debouncedInput.toLowerCase()),
      );
      setResults(filtered);
    }
  }, [debouncedInput, data]);

  // hide results on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed top-0 left-[50%] -translate-x-[50%] w-full max-w-md mx-auto z-50 p-3"
      ref={containerRef}
    >
      <div className="flex items-center rounded-full p-3 w-full max-w-md mx-auto bg-slate-100">
        <SearchIcon className="text-slate-500" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search..."
          className="flex-1 bg-transparent outline-none text-slate-700"
          onFocus={() => setVisible(true)}
        />
        <button onClick={() => setInput("")}>
          <ClearIcon className="text-slate-600 mr-2" />
        </button>
      </div>

      <SearchResult
        results={results}
        visible={visible}
        setVisible={setVisible}
        query={debouncedInput}
      />
    </div>,
    document.body,
  );
};
