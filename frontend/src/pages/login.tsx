import { redirectToGoogleLogin } from "@/utils/auth";

export const LoginPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-[40vh] px-4">
        <h1 className="text-3xl font-bold text-foreground mb-1">Data_Guard</h1>
        <p className="text-sm text-muted mb-5">Welcome back</p>

        <button
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 ease-in-out border border-white/10 backdrop-blur-md shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          onClick={redirectToGoogleLogin}
        >
          {/* <GoogleLogoIcon className="w-6 h-6" /> */}
          <span className="text-base font-medium text-default-900 tracking-wide">
            Continue with Google
          </span>
        </button>

        <p className="text-xs text-default-400 mt-4 text-center max-w-xs">
          We only use your email to authenticate. We will never post or access
          anything without your permission.
        </p>
      </div>
    </div>
  );
};
