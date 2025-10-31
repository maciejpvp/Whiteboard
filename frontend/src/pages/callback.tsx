import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { exchangeCodeForToken } from "@/utils/auth";

export const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const [error, setError] = useState(false);

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      window.location.href = "/";

      return;
    }

    if (!code) return;

    exchangeCodeForToken(code).catch(() => setError(true));
  }, [code]);

  return (
    <div>
      <p className="text-md">{error ? "Something went wrong" : "Loading"}</p>
    </div>
  );
};
