import { Box, Grid } from "@mui/material";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { TabsContext } from "src/contexts/TabsContext";
import { AgentContext, IAgent } from "src/contexts/AgentContext";
import { useTranslation } from "react-i18next";

const AgentInfo = () => {
  const [data, setData] = useState<IAgent>();
  const tabsContext = useContext(TabsContext);
  const { t } = useTranslation();
  const context = useContext(AgentContext);
  const { agents: Agents } = context.handleAgents;
  const {
    handleTabs: { currentRow },
  } = tabsContext;

  useEffect(() => {
    const res = Agents.find((e) => e.email === currentRow);
    setData(res);
  }, [currentRow]);

  return (
    <Grid container padding={1} bgcolor={"#ffffff"}>
      <Grid item width="100%" sx={{ padding: "0px", minHeight: "400px" }}>
        <Box fontWeight="bold" sx={{ ml: 3, mt: 2 }}>
          <Typography variant="h3" color="primary">
            {t("userInformation")}
          </Typography>
        </Box>
        <List>
          {data?.email ? (
            <>
              <ListItem key="1">
                <Typography variant="h5" color="primary">
                  <span>{t("name")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.name}</span>
                </Typography>
              </ListItem>
              <ListItem key="2">
                <Typography variant="h5" color="primary">
                  <span>{t("familyName")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.family_name}</span>
                </Typography>
              </ListItem>
              <ListItem key="3">
                <Typography variant="h5" color="primary">
                  <span>{t("email")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.email}</span>
                </Typography>
              </ListItem>
              <ListItem key="4">
                <Typography variant="h5" color="primary">
                  <span>{t("emailVerified")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.email_verified}</span>
                </Typography>
              </ListItem>
              <ListItem key="5">
                <Typography variant="h5" color="primary">
                  <span>{t("phoneNumber")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.phone_number}</span>
                </Typography>
              </ListItem>
              <ListItem key="6">
                <Typography variant="h5" color="primary">
                  <span>{t("phoneNumberVerified")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.phone_number_verified}</span>
                </Typography>
              </ListItem>
              <ListItem key="7">
                <Typography variant="h5" color="primary">
                  <span>{t("userRoles")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data["custom:role"]}</span>
                </Typography>
              </ListItem>
              <ListItem key="8">
                <Typography variant="h5" color="primary">
                  <span>{t("userName")}: </span>
                </Typography>
                <Typography sx={{ ml: "10px" }} variant="h6" color="secondary">
                  <span>{data.preferred_username}</span>
                </Typography>
              </ListItem>
            </>
          ) : (
            <></>
          )}
        </List>
      </Grid>
    </Grid>
  );
};

export default AgentInfo;
