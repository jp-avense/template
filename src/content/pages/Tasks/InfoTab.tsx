import { Box, Grid, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { useState } from "react";
import AuditTab from "./tabs/AuditTab";
import GeneralTab from "./tabs/GeneralTab";
import RealTimeTab from "./tabs/RealTimeTab";
import { useTranslation } from "react-i18next";
import FormTab from "./tabs/FormTab";

const InfoTab = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("1");
  
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container padding={1} bgcolor={"#ffffff"}>
      <Grid item width="100%">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <Tab label={t("general")} value="1" sx={{ flex: "1" }} />
              <Tab label={t("realTime")} value="2" sx={{ flex: "1" }} />
              <Tab label={t("audit")} value="3" sx={{ flex: "1" }} />
              <Tab label={t("form")} value="4" sx={{ flex: "1" }} />
            </TabList>
          </Box>
          <TabPanel sx={{ padding: "0px", minHeight: "400px" }} value="1">
            <GeneralTab />
          </TabPanel>
          <TabPanel value="2">
            <RealTimeTab />
          </TabPanel>
          <TabPanel value="3">
            <AuditTab />
          </TabPanel>
          <TabPanel value="4">
            <FormTab />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default InfoTab;
