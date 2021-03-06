import { useContext, useEffect, useState } from "react";

import {
  Box,
  alpha,
  Stack,
  lighten,
  Divider,
  IconButton,
  Tooltip,
  styled,
  useTheme,
  Button,
  Avatar,
  Grid,
} from "@mui/material";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import { SidebarContext } from "src/contexts/SidebarContext";
import { AuthContext } from "src/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import hebFlag from "../../../assets/images/icons/hebFlag.svg";
import enFlag from "../../../assets/images/icons/enFlag.svg";

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: flex-start;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const context = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const { t, i18n } = useTranslation();

  const {
    handleUser: { user },
  } = context;

  useEffect(() => {
    if (user) {
      let res = user["custom:role"].split(",");
      setRoles(res);
    }
  }, [user]);

  const theme = useTheme();

  const handleDirection = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 1px 0 ${alpha(
                lighten(theme.colors.primary.main, 0.7),
                0.15
              )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
            : `0px 2px 8px -3px ${alpha(
                theme.colors.alpha.black[100],
                0.2
              )}, 0px 5px 22px -4px ${alpha(
                theme.colors.alpha.black[100],
                0.1
              )}`,
      }}
    >
      <Box display="flex" alignItems="center">
        <Box
          component="span"
          sx={{
            ml: 2,
            display: { lg: "none", xs: "inline-block" },
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? (
                <MenuTwoToneIcon fontSize="small" />
              ) : (
                <CloseTwoToneIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        py=".2rem"
      >
        <Grid item>
          {user ? (
            <>
              <Stack direction="row" alignItems="center" spacing={2}>
                {t("loggedInAs")}: {user.name + " " + user.family_name} -{" "}
                {t("roles")}:{" "}
                {roles
                  .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                  .join(" | ")}
              </Stack>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item>
          <Button
            onClick={() => handleDirection("en")}
            startIcon={
              <Avatar
                sx={{ width: 24, height: 24 }}
                variant="square"
                src={enFlag}
              />
            }
          >
            {t("english")}
          </Button>
          <Button
            onClick={() => handleDirection("he")}
            startIcon={
              <Avatar
                sx={{ width: 24, height: 24 }}
                variant="square"
                src={hebFlag}
              />
            }
          >
            {t("hebrew")}
          </Button>
        </Grid>
      </Grid>
    </HeaderWrapper>
  );
}

export default Header;
