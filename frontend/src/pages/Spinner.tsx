import { Logo } from "@/components/ProjectsList/Logo";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export const SpinnerPage = () => {
  return (
    <div className="bg-slate-100 w-dvw h-dvh flex flex-col items-center justify-center">
      <div className="w-12 absolute top-[calc(50%-80px)]">
        <Logo />
      </div>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <LinearProgress />
      </Box>
      <div className="w-full text-center absolute top-[calc(50%+15px)]">
        <p className="text-slate-600 text-sm mt-6 text-center tracking-wide font-medium select-none">
          Initializing, please stand by...
        </p>
      </div>
    </div>
  );
};
