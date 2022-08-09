import {
  Grid,
  List,
  ListItem,
  Typography,
  Box,
  Avatar,
  Button,
  Paper,
} from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import ProfileHeader from "./ProfileHeader";
import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import ModalButton from "src/components/ModalButton";
import { AgentContext } from "src/contexts/AgentContext";
import AgentsForm from "../Agents/AgentsForm";
import ProfileForm from "./ProfileForm";

function Profile() {
  const { t } = useTranslation();
  const context = useContext(AuthContext);
  const {
    handleUser: { user },
  } = context;

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 120,
        height: 120,
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  return (
    <>
      <Helmet>
        <title>{t("users")}</title>
      </Helmet>
      <PageTitleWrapper>
        <ProfileHeader />
      </PageTitleWrapper>
      {user ? (
        <Box>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              width: "40%",
              mx: "auto",
              alignItems: "center"
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              alignItems="center"
            >
              <Box>
                <Avatar {...stringAvatar(`${user.name} ${user.family_name}`)} />
              </Box>
              <Typography variant="h3" color="primary" align="center">
                {user.name} {user.family_name}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              alignItems="center"
            >
              <Typography variant="h5" color="primary" align="center">
                {t("phoneNumber")}:
              </Typography>
              <Typography variant="h6" color="secondary">
                {user.phone_number}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              alignItems="center"
            >
              <Typography variant="h5" color="primary" align="center">
                {t("email")}:
              </Typography>

              <Typography variant="h6" color="secondary">
                {user.email}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              alignItems="center"
            >
              <Typography variant="h5" color="primary" align="center">
                {t("password")}:
              </Typography>

              <Typography variant="h6" color="secondary">
                ***********
              </Typography>
            </Box>
            <div>
              <ModalButton
                text={t("changeDetails")}
                buttonProps={{
                  variant: "contained",
                }}
                title={t("updateInformation")}
              >
                <ProfileForm userinfo={user} />
              </ModalButton>
            </div>
          </Paper>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}

export default Profile;
