import {
  Box,
  Typography,
  List,
  Checkbox,
  MenuItem,
  Button,
  TextField,
  Divider,
  IconButton,
  Tab,
  Tabs,
  AppBar,
  Paper,
  Grid,
} from "@mui/material";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { TaskType } from "../../TaskType/type.interface";
import FormGeneralSettings from "./FormGeneralSettings";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type Props = {
  selected: any[];
  activeForms: any[];
  setFieldSettings: React.Dispatch<React.SetStateAction<any>>;
  generalData?: {
    mode: "create" | "update";
    value: {
      key: string;
      label: string;
      description: string;
      form: string;
    };
  };
  taskTypes: TaskType[];
  fieldSettings: any[];
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div {...other}>
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function FormFieldSettings({
  selected,
  activeForms,
  setFieldSettings,
  generalData,
  taskTypes,
  fieldSettings,
}: Props) {
  const [action, setAction] = useState([]);
  const [conditions, setCondition] = useState([]);
  const [required, setRequired] = useState(true);
  const [selectedForm, setSelectedForm] = useState<any>([]);
  const [currentTab, setCurrentTab] = useState(0);

  const actions = [
    "closeForm",
    "rescheduleTask",
    "transmitDone",
    "transmitRescheduled",
  ];

  const setSelectedCondition = (e, index) => {
    const data = activeForms.filter((c) => e.target.value == c.label);
    let current = selectedForm.slice();
    current.splice(index, 1, data[0]);
    setSelectedForm(current);
  };

  const setConditionValue = (e, index) => {
    let current = selectedForm.slice();
    current[index].value = e.target.value;
    setSelectedForm(current);
  };

  const setStringValue = (e, formIndex, valIndex) => {
    let current = selectedForm.slice();
    current[formIndex].value[valIndex] = e.target.value;
    setSelectedForm(current);
  };

  useEffect(() => {
    const res = selectedForm.map((c) => {
      let current = (({ key, value }) => ({ key, value }))(c);

      return current;
    });

    setCondition(res);
  }, [selectedForm]);

  useEffect(() => {
    const current = conditions.reduce((acc, item) => {
      if (item.key && item.value?.length > 0) {
        const value = item.value.filter((value) => value != "");

        if (value.length > 0) {
          acc = {
            ...acc,
            [item.key]: value,
          };
        }
      }
      return acc;
    }, {});
    let settings = fieldSettings.slice();

    const res = {
      rules: { required: required, action: action },
      conditions: current,
      _id: selected[0]?._id,
    };
    if (fieldSettings.length > 0) {
      const index = fieldSettings.findIndex((c) => c._id === selected[0]?._id);
      if (index > -1) {
        settings.splice(index, 1, res);
        setFieldSettings(settings);
      } else {
        settings.push(res);
        setFieldSettings(settings);
      }
    } else {
      settings.push(res);
      setFieldSettings(settings);
    }
  }, [conditions, required, action]);

  useEffect(() => {}, [selected]);

  const setSelectedAction = (e) => {
    setAction(e.target.value);
  };

  const handleClick = () => {
    setRequired(!required);
  };

  const addOption = () => {
    let current = selectedForm.slice();
    current.push({ key: "", label: "" });
    setSelectedForm(current);
  };

  const removeOption = () => {
    let current = selectedForm.slice();
    current.splice(current.length - 1, 1);
    setSelectedForm(current);
  };

  const addValue = (index) => {
    let current = selectedForm.slice();
    if (current[index].value) {
      current[index].value.push("");
    } else {
      current[index].value = [""];
    }
    setSelectedForm(current);
  };

  const removeValue = (index) => {
    let current = selectedForm.slice();
    current[index].value?.splice(current[index].value.length - 1, 1);
    setSelectedForm(current);
  };

  const changeTab = (e, newTab) => setCurrentTab(newTab);

  return (
    <Paper square elevation={0} sx={{ height: "100vh" }}>
      <AppBar position="static" sx={{ p: 1 }}>
        <Tabs
          onChange={changeTab}
          value={currentTab}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "transparent",
              borderRadius: 0,
              border: "0",
              boxShadow: "0",
            },
          }}
        >
          <Tab label="General Settings" />
          <Tab label="Field Settings" />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <FormGeneralSettings data={generalData} taskTypes={taskTypes} />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <List>
          {selected.length === 1 ? (
            <>
              <span>
                Required?
                <Checkbox checked={required} onClick={handleClick}></Checkbox>
              </span>
              <TextField
                fullWidth
                label="Actions"
                onChange={(e) => setSelectedAction(e)}
                value={action}
                select
                SelectProps={{ multiple: true }}
              >
                {actions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {t(c)}
                  </MenuItem>
                ))}
              </TextField>
              {activeForms.length > 0 ? (
                <>
                  <Grid container justifyContent={"space-between"}>
                    <Typography sx={{ mt: 2 }} variant="h5">
                      {t("conditions")}
                    </Typography>
                    <Grid item sx={{ mt: 2 }}>
                      <IconButton sx={{ mr: 1 }} onClick={removeOption}>
                        <RemoveIcon />
                      </IconButton>
                      <IconButton
                        disabled={activeForms.length <= conditions.length}
                        onClick={addOption}
                      >
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  {selectedForm.map((form, index) => (
                    <>
                      <TextField
                        sx={{ mt: 2, mb: 1 }}
                        fullWidth
                        label="Fields"
                        select
                        onChange={(e) => setSelectedCondition(e, index)}
                        value={form.label}
                      >
                        {activeForms.map((c) => (
                          <MenuItem
                            disabled={
                              selectedForm.findIndex((object) => {
                                return object.key === c.key;
                              }) > -1
                                ? true
                                : false
                            }
                            key={c.key}
                            value={c.label}
                          >
                            {t(c.label)}
                          </MenuItem>
                        ))}
                      </TextField>

                      {form.inputType ? (
                        <>
                          {form.inputType === "dropdown" ||
                          form.inputType === "radios" ||
                          form.inputType === "checkboxes" ? (
                            <>
                              <TextField
                                fullWidth
                                label="value"
                                onChange={(e) => setConditionValue(e, index)}
                                value={form.value || []}
                                select
                                SelectProps={{ multiple: true }}
                              >
                                {Object.entries(form.options).map(
                                  ([key, value]: [string, any]) => (
                                    <MenuItem key={key} value={key}>
                                      {t(value)}
                                    </MenuItem>
                                  )
                                )}
                              </TextField>
                              <Divider
                                component="li"
                                sx={{
                                  mt: 2,
                                  height: 2,
                                  backgroundColor: "orchid  ",
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <Grid container justifyContent={"space-between"}>
                                <Typography sx={{ mt: 1 }} variant="h5">
                                  {t("Text Values")}
                                </Typography>
                                <Grid item sx={{ mt: 2 }}>
                                  <IconButton
                                    sx={{ mr: 1 }}
                                    onClick={() => removeValue(index)}
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                  <IconButton onClick={() => addValue(index)}>
                                    <AddIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                              {form.value?.map((val, valIndex) => (
                                <TextField
                                  sx={{ mt: 1 }}
                                  key={valIndex}
                                  fullWidth
                                  label="value"
                                  onChange={(e) =>
                                    setStringValue(e, index, valIndex)
                                  }
                                  value={val}
                                />
                              ))}
                              <Divider
                                component="li"
                                sx={{
                                  mt: 2,
                                  height: 2,
                                  backgroundColor: "orchid",
                                }}
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ))}
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </List>
      </TabPanel>
    </Paper>
  );
}
export default FormFieldSettings;
