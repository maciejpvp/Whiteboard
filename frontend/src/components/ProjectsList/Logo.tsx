import { useNavigate } from "react-router-dom";

export const Logo = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="h-full flex flex-row items-center justify-center gap-3"
    >
      <img src="/DrawnUp.png" alt="DrawnUp Logo" className="w-full h-[90%]" />
      <h1 className="text-xl font-semibold">DrawnUp</h1>
    </button>
  );
};
