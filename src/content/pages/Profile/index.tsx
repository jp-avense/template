import {
  Grid,
  List,
  ListItem,
  Typography,
  Box,
  Avatar,
  Button,
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
        ml: 3,
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  console.log("lmao", user);
  return (
    <>
      <Helmet>
        <title>{t("users")}</title>
      </Helmet>
      <PageTitleWrapper>
        <ProfileHeader />
      </PageTitleWrapper>
      {user ? (
        <Box justifyContent={"center"} display={"flex"}>
          <List
            sx={{
              backgroundColor: "white",
              pl: 20,
              pr: 20,
              height: "70vh",
            }}
          >
            <ListItem>
              <Avatar {...stringAvatar(`${user.name} ${user.family_name}`)} />
            </ListItem>
            <ListItem>
              <Typography sx={{ ml: "10px" }} variant="h3" color="primary">
                {user.name} {user.family_name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="h5" color="primary">
                <span>{t("phoneNumber")}: </span>
              </Typography>
              <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                {user.phone_number}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="h5" color="primary">
                <span>{t("email")}: </span>
              </Typography>
              <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                {user.email}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="h5" color="primary">
                <span>{t("password")}: </span>
              </Typography>
              <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                ***********
              </Typography>
            </ListItem>
            <ListItem>
              <ModalButton
                text={t("Change Details")}
                buttonProps={{
                  variant: "contained",
                }}
                title="Update information"
              >
                <ProfileForm userinfo={user} />
              </ModalButton>
            </ListItem>
          </List>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}

export default Profile;
