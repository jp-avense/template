import { useContext, useEffect } from "react";

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem,
  Avatar,
} from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";
import { SidebarContext } from "src/contexts/SidebarContext";
import { authService } from "src/services/auth.service";
import { AuthContext } from "src/contexts/AuthContext";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import AssignmentIcon from "@mui/icons-material/AssignmentTwoTone";
import PersonIcon from "@mui/icons-material/PersonTwoTone";
import LogoutIcon from "@mui/icons-material/LogoutTwoTone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import hebFlag from "../../../../assets/images/icons/hebFlag.svg";
import enFlag from "../../../../assets/images/icons/enFlag.svg";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import useRoles from "src/hooks/useRole";

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  "transform",
                  "opacity",
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const { t, i18n } = useTranslation();
  const context = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["refreshToken"]);
  const roles = useRoles();

  const isAdmin = roles.includes("admin");

  const {
    handleAccess: { setAccessToken },
    handleId: { setIdToken },
    handleRefresh: { refreshToken, setRefreshToken },
    handleUser: { setUser },
  } = context;

  const handleDirection = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const logout = async () => {
    await authService.logout(refreshToken);
    setAccessToken(null);
    setIdToken(null);
    setUser(null);
    removeCookie("refreshToken");
  };
  return (
    <>
      <MenuWrapper sx={{ pt: 2 }}>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              {t("dashboards")}
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/dashboard"
                  startIcon={<DashboardIcon />}
                >
                  {t("dashboard")}
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              {t("taskManagement")}
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/tasks"
                  startIcon={<AssignmentIcon />}
                >
                  {t("tasks")}
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        {isAdmin ? (
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                {t("agentManagement")}
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/agents"
                    startIcon={<PersonIcon />}
                  >
                    {t("agents")}
                  </Button>
                </ListItem>
              </List>
            </SubMenuWrapper>
          </List>
        ) : null}
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              {t("account")}
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/settings"
                  startIcon={<SettingsTwoToneIcon />}
                >
                  {t("settings")}
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={logout}
                  to="/login"
                  startIcon={<LogoutIcon />}
                >
                  {t("logout")}
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              {t("language")}
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
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
              </ListItem>
              <ListItem component="div">
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
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
