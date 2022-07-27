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
import { cloneDeep } from "lodash";
import CircleIcon from "@mui/icons-material/Circle";
import Select from "react-select";

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
  generalSettings: Values;
  setGeneralSettings: React.Dispatch<React.SetStateAction<Values>>;
  loading: boolean;
  onSubmit: any;
};

type Values = {
  name: string;
  description: string;
  type: string;
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

function CircleDivide() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      gap={1}
      marginTop={2}
    >
      <CircleIcon sx={{ fontSize: 12, opacity: 0.2 }} />
      <CircleIcon sx={{ fontSize: 12, opacity: 0.2 }} />
      <CircleIcon sx={{ fontSize: 12, opacity: 0.2 }} />
    </Box>
  );
}

function FormFieldSettings({
  selected,
  activeForms,
  setFieldSettings,
  generalData,
  taskTypes,
  fieldSettings,
  generalSettings,
  setGeneralSettings,
  loading,
  onSubmit,
}: Props) {
  const [action, setAction] = useState([]);
  const [currentFormAction, setCurrentFormAction] = useState([]);
  const [conditions, setCondition] = useState([]);
  const [required, setRequired] = useState(true);
  const [selectedForm, setSelectedForm] = useState<any>([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [markUpVal, setMarkUpval] = useState();

  const actions = [
    { value: "closeForm", label: t("closeForm") },
    { value: "rescheduleTask", label: t("rescheduleTask") },
    { value: "transmitDone", label: t("transmitDone") },
    { value: "transmitRescheduled", label: t("transmitRescheduled") },
  ];

  const setSelectedCondition = (e, index) => {
    const forms = cloneDeep(activeForms);
    const data = forms.filter((c) => e.target.value == c.label);
    let current = selectedForm.slice();
    current.splice(index, 1, data[0]);
    setSelectedForm(current);
  };

  const setConditionValue = (e, index) => {
    let current = selectedForm.slice();
    current[index].value = e.target.value;
    setSelectedForm(current);
  };

  const setConditionNotNull = (e, index) => {
    let current = selectedForm.slice();
    if (e.target.checked) {
      current[index].value = ["!null"];
    } else delete current[index].value;
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
    const res = action.map((c) => {
      return { value: c, label: t(c) };
    });
    setCurrentFormAction(res);
  }, [action]);

  useEffect(() => {
    if (selected[0]?._id) {
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

      const settings = fieldSettings.slice();
      let res;
      if (selected[0].inputType === "markup") {
        res = {
          rules: { required: required, action: action },
          conditions: current,
          value: markUpVal,
          _id: selected[0]?._id,
        };
      } else {
        res = {
          rules: { required: required, action: action },
          conditions: current,
          _id: selected[0]?._id,
        };
      }
      if (fieldSettings.length > 0) {
        const index = fieldSettings.findIndex(
          (c) => c._id === selected[0]?._id
        );
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
    }
  }, [conditions, required, action, markUpVal]);

  useEffect(() => {
    const index = fieldSettings.findIndex((c) => c._id === selected[0]?._id);
    if (index > -1) {
      const condition = Object.entries(fieldSettings[index].conditions)
        .map(([key, value]: [string, any]) => {
          const forms = cloneDeep(activeForms);
          const res = forms.find((c) => c.key === key);
          if (res) {
            res.value = value;
            return res;
          }
        })
        .filter(Boolean);
      setSelectedForm(condition);
      setAction(fieldSettings[index].rules.action);
      setRequired(fieldSettings[index].rules.required);
      if (selected[0].inputType === "markup") {
        setMarkUpval(fieldSettings[index].value);
      }
    } else {
      setSelectedForm([]);
      setAction([]);
      setRequired(true);
      setMarkUpval(undefined);
    }
  }, [selected]);

  const setSelectedAction = (e) => {
    const res = e.map((c) => c.value);

    setAction(res);
  };

  const setSelectedMarkUpValue = (e) => {
    setMarkUpval(e.target.value);
  };

  const handleClick = (e) => {
    setRequired(e.target.checked);
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

  console.log(selected);

  return (
    <Paper square elevation={0} sx={{ minHeight: "100%" }}>
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
          <Tab label={t("generalSettings")} />
          <Tab label={t("fieldSettings")} />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <FormGeneralSettings
          data={generalData}
          taskTypes={taskTypes}
          settings={generalSettings}
          setSettings={setGeneralSettings}
          loading={loading}
          onSubmit={onSubmit}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <List>
          {selected.length === 1 ? (
            <>
              <span>
                {t("isRequired")}
                <Checkbox checked={required} onClick={handleClick}></Checkbox>
              </span>
              <Select
                options={actions}
                placeholder="Actions"
                isMulti
                value={currentFormAction}
                onChange={(e) => setSelectedAction(e)}
              />
              {selected[0].inputType == "markup" ? (
                <>
                  <TextField
                    sx={{ mt: 2 }}
                    fullWidth
                    onChange={(e) => setSelectedMarkUpValue(e)}
                    label="Markup value"
                    value={markUpVal || ""}
                  ></TextField>
                </>
              ) : (
                <></>
              )}

              {activeForms.length > 0 ? (
                <>
                  <Grid
                    container
                    justifyContent={"space-between"}
                    alignItems="center"
                  >
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
                      <Grid container justifyContent={"space-between"}>
                        <Grid item xs={4}>
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
                        </Grid>

                        <Grid item xs={4} sx={{ mt: 2 }}>
                          {form.inputType ? (
                            <>
                              {form.inputType === "dropdown" ||
                              form.inputType === "radios" ||
                              form.inputType === "checkboxes" ? (
                                <>
                                  <span>
                                    Any Value
                                    <Checkbox
                                      checked={
                                        form.value?.includes("!null") || false
                                      }
                                      onClick={(e) =>
                                        setConditionNotNull(e, index)
                                      }
                                    ></Checkbox>
                                  </span>
                                  {!form.value?.includes("!null") ? (
                                    <TextField
                                      fullWidth
                                      label="value"
                                      onChange={(e) =>
                                        setConditionValue(e, index)
                                      }
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
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Grid
                                    container
                                    justifyContent={"space-between"}
                                  >
                                    <span>
                                      Any Value
                                      <Checkbox
                                        checked={
                                          form.value?.includes("!null") || false
                                        }
                                        onClick={(e) =>
                                          setConditionNotNull(e, index)
                                        }
                                      ></Checkbox>
                                    </span>
                                    {!form.value?.includes("!null") ? (
                                      <>
                                        <Typography variant="h5">
                                          {t("Text Values")}
                                        </Typography>
                                        <Grid item sx={{ mt: 2 }}>
                                          <IconButton
                                            sx={{ mr: 1 }}
                                            onClick={() => removeValue(index)}
                                          >
                                            <RemoveIcon />
                                          </IconButton>
                                          <IconButton
                                            onClick={() => addValue(index)}
                                          >
                                            <AddIcon />
                                          </IconButton>
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
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Grid>
                                </>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </Grid>
                      </Grid>
                      <CircleDivide />
                    </>
                  ))}{" "}
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
