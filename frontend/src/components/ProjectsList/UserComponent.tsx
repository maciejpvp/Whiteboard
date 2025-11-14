import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import { Avatar, Menu, MenuItem, Divider } from "@mui/material";
import type { MenuProps } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { stringAvatar } from "../../utils/avatarUtils";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

type menuItemType = {
  label: string;
  icon: React.ReactElement;
  divider?: boolean;
  to?: string;
  onClick?: () => void;
};

const menuItems: menuItemType[] = [
  {
    label: "Settings",
    icon: <SettingsIcon />,
    divider: true,
    to: "/settings",
  },
  {
    label: "Log Out",
    icon: <LogoutIcon />,
    divider: false,
    onClick: () => console.log("log out"),
  },
] as const;

export const UserComponent = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const userData = useAuthStore((store) => store.user);
  const fullName = `${userData?.name} ${userData?.surname}`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div>
        <button
          id="user-menu-button"
          aria-controls={open ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar {...stringAvatar(fullName)} />
        </button>
        <StyledMenu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              "aria-labelledby": "user-menu-button",
            },
          }}
        >
          {menuItems.flatMap((item) => [
            <MenuItem
              key={item.label}
              onClick={() => {
                handleClose();
                if (item.to) navigate(item.to);
                item?.onClick?.();
              }}
              disableRipple
            >
              {item.icon}
              {item.label}
            </MenuItem>,
            item.divider ? (
              <Divider key={`${item.label}-divider`} sx={{ my: 0.5 }} />
            ) : null,
          ])}
        </StyledMenu>
      </div>
    </div>
  );
};
