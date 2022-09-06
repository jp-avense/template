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
import TextFieldsIcon from "@mui/icons-material/TextFields";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import BuildIcon from "@mui/icons-material/Build";
import ReportIcon from "@mui/icons-material/Report";
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
  const { t } = useTranslation();
  const context = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["refreshToken"]);
  const roles = useRoles();

  const isAdmin = roles.includes("admin");
  const isBackoffice = roles.includes("backoffice");

  const {
    handleAccess: { setAccessToken },
    handleId: { setIdToken },
    handleRefresh: { refreshToken, setRefreshToken },
    handleUser: { setUser },
  } = context;

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
              {isAdmin && (
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/reports"
                    startIcon={<ReportIcon />}
                  >
                    {t("reports")}
                  </Button>
                </ListItem>
            )}
           </List>
          </SubMenuWrapper>
        </List>
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              {t("controls")}
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
              {isAdmin ? (
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/agents"
                    startIcon={<PersonIcon />}
                  >
                    {t("users")}
                  </Button>
                </ListItem>
              ) : null}
            </List>
          </SubMenuWrapper>
        </List>
        {isAdmin ? (
          <>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t("System")}
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
                      to="/task-type"
                      startIcon={<DashboardIcon />}
                    >
                      {t("taskTypes")}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/task-status"
                      startIcon={<DashboardIcon />}
                    >
                      {t("taskStatuses")}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/task-details"
                      startIcon={<DashboardIcon />}
                    >
                      {t("taskDetails")}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/form-field"
                      startIcon={<TextFieldsIcon />}
                    >
                      {t("formFields")}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/form-builder"
                      startIcon={<BuildIcon />}
                    >
                      {t("formBuilder")}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/app-settings"
                      startIcon={<AppSettingsAltIcon />}
                    >
                      {t("appSettings")}
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>
          </>
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
                  to="/profile"
                  startIcon={<SettingsTwoToneIcon />}
                >
                  {t("myAccount")}
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
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
