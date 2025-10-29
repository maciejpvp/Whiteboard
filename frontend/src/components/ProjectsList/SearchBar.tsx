import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export const SearchBar = () => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState(input);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 500);

    return () => clearTimeout(handler);
  }, [input]);

  useEffect(() => {
    if (debouncedInput) {
      console.log(`Searching ${debouncedInput}`);
    }
  }, [debouncedInput]);

  return (
    <div className="flex items-center rounded-full p-3 w-full max-w-md mx-auto">
      <SearchIcon className="text-slate-500" />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search..."
        className="flex-1 bg-transparent outline-none text-slate-700"
      />
      <button onClick={() => setInput("")}>
        <ClearIcon className="text-slate-600 mr-2" />
      </button>
    </div>
  );
};
