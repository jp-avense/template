import { useContext, useEffect, useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import { SidebarContext } from "src/contexts/SidebarContext";
import { useTranslation } from "react-i18next";

import {
  Box,
  Drawer,
  alpha,
  styled,
  Divider,
  useTheme,
  lighten,
  darken,
} from "@mui/material";

import SidebarMenu from "./SidebarMenu";
import logo from "src/assets/images/logo.png";
import { indigo } from "@mui/material/colors";
import { settingsService } from "src/services/settings.service";

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.trueWhite[70]};
        position: relative;
        z-index: 7;
        height: 100%;
        padding-bottom: 68px;
`
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();

  const { i18n } = useTranslation();

  const direction = i18n.dir();
  const theme = useTheme();

  const [tenantLogo, setLogo] = useState("");

  useEffect(() => {
    settingsService.getAll().then(({ data }) => {
      const logo = data.find((item) => item.key === "tenantLogo")?.value;
      setLogo(logo);
    });
  }, []);

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: "none",
            lg: "inline-block",
          },
          position: "fixed",
          left: 0,

          top: 0,
          background:
            theme.palette.mode === "dark"
              ? alpha(lighten(theme.header.background, 0.1), 0.5)
              : darken(theme.colors.alpha.black[100], 0.5),
          boxShadow:
            theme.palette.mode === "dark" ? theme.sidebar.boxShadow : "none",
        }}
      >
        <Scrollbar>
          <Box mt={3}>
            <Box
              mx={2}
              p={1}
              sx={{ backgroundColor: theme.colors.alpha.white[100] }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
            >
              <img src={tenantLogo || logo} alt="Logo" />
            </Box>
          </Box>
          <Divider
            sx={{
              mt: theme.spacing(3),
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10],
            }}
          />
          <SidebarMenu />
        </Scrollbar>
      </SidebarWrapper>
      <Drawer
        sx={{
          boxShadow: `${theme.sidebar.boxShadow}`,
        }}
        anchor={theme.direction === "rtl" ? "right" : "left"}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background:
              theme.palette.mode === "dark"
                ? theme.colors.alpha.white[100]
                : darken(theme.colors.alpha.black[100], 0.5),
          }}
        >
          <Scrollbar>
            <Box mt={3}>
              <Box
                mx={2}
                p={1}
                sx={{ backgroundColor: theme.colors.alpha.white[100] }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius={1}
              >
                <img src={logo} alt="Milgam Logo" />
              </Box>
            </Box>
            <Divider
              sx={{
                mt: theme.spacing(3),
                mx: theme.spacing(2),
                background: theme.colors.alpha.trueWhite[10],
              }}
            />
            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
