import { useAuthStore } from "@/store/authStore";
import { stringAvatar } from "@/utils/avatarUtils";
import { Avatar, Card, CardContent, TextField } from "@mui/material";

export const UserSection = () => {
  const userData = useAuthStore((store) => store.user);

  const fullName = `${userData?.name} ${userData?.surname}`;
  const imgSize = 110;

  return (
    <div className="p-2">
      <h1 className="text-2xl font-semibold mb-4">Account Center</h1>

      <Card className="shadow-md">
        <CardContent>
          <div className="flex flex-row gap-6 items-center">
            <Avatar
              {...stringAvatar(fullName)}
              src={userData?.avatar}
              sx={{
                width: imgSize,
                height: imgSize,
                fontSize: 32,
              }}
            />

            <div className="flex flex-col gap-4 w-full max-w-md">
              <TextField
                label="Full Name"
                value={fullName}
                InputProps={{ readOnly: true }}
                variant="outlined"
                size="small"
                fullWidth
              />

              <TextField
                label="Email"
                value={userData?.email || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                size="small"
                fullWidth
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
