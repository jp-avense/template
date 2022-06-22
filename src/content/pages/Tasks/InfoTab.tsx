import { Box, Grid, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { useState } from "react";
import AuditTab from "./tabs/AuditTab";
import GeneralTab from "./tabs/GeneralTab";
import RealTimeTab from "./tabs/RealTimeTab";

const InfoTab = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container padding={1} bgcolor={"#ffffff"}>
      <Grid item width="100%">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange}>
              <Tab sx={{ width: "34%" }} label="GENERAL" value="1" />
              <Tab sx={{ width: "33%" }} label="REAL TIME" value="2" />
              <Tab sx={{ width: "33%" }} label="AUDIT" value="3" />
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
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default InfoTab;
