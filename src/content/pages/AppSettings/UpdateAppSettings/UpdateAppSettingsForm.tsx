import {
  Grid,
  Button,
  TextField,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { settingsService } from "src/services/settings.service";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAxiosErrorMessage } from "src/lib";

interface KeyValuePair {
  key: string;
  value: any;
}

interface Props {
  data: any;
  selected: any;
  onDone: () => any;
}

const UpdateAppSettingsForm = ({ data, selected, onDone }: Props) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [key, setKey] = useState("");
  const [value, setValue] = useState<any>();
  const [arr, setArr] = useState([]);
  const [obj, setObj] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [unique, setUnique] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const { t } = useTranslation();

  const types = ["String", "Object", "Array", "Number", "Boolean"];

  const setSelectedType = (e) => {
    setType(e.target.value);
  };

  useEffect(() => {
    setType(selected.type);
    setKey(selected.key);
  }, [selected]);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    const uniq = currentData.every((item) => item.key !== key);
    setUnique(uniq);
  }, [key]);

  useEffect(() => {
    if (type === "Object") {
      const haveDuplicate = new Set(obj.map((v) => v.key));
      if (haveDuplicate.size < obj.length) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } else {
      setIsValid(true);
    }
  }, [obj]);

  useEffect(() => {
    if (type === selected.type) {
      if (type === "Object") {
        const res = Object.entries(selected.value).map(
          ([key, value]: [string, any]) => {
            return { key: key, value: value };
          }
        );
        setObj(res);
        setValue(selected.value);
      } else if (type === "Array") {
        setArr(selected.value);
        setValue(selected.value);
      } else if (type === "String") {
        setValue(selected.value);
      } else if (type === "Number") {
        setValue(selected.value);
      }
    } else {
      setObj([]);
      setValue("");
      setArr([]);
    }
  }, [type]);

  const addOption = () => {
    let current = arr.slice();
    current.push("");
    setArr(current);
  };

  const removeOption = () => {
    let current = arr.slice();
    current.splice(current.length - 1, 1);
    setArr(current);
  };

  const addObject = () => {
    let current = obj.slice();
    current.push({ key: "", value: "" });
    setObj(current);
  };

  const removeObject = () => {
    let current = obj.slice();
    current.splice(current.length - 1, 1);
    setObj(current);
  };

  const setArray = (val, index) => {
    const res = arr.slice();
    res[index] = val;
    setArr(res);
    setValue(res);
  };

  const setObject = (val, index, type) => {
    const res = obj.slice();
    res[index][type] = val;

    const object = res.reduce((acc, item) => {
      acc = {
        ...acc,
        [item.key]: item.value,
      };
      return acc;
    }, {});
    setObj(res);
    setValue(object);
  };

  const isObjectKeyUniq = (val, index) => {
    const res = obj.slice();
    res.splice(index, 1);
    if (val) {
      const uniq = res.every((item) => item.key !== val);
      if (uniq) {
        return <></>;
      } else if (!uniq) {
        return (
          <>
            <Typography color={"red"}>Object key already exists</Typography>
          </>
        );
      }
    }
  };

  console.log(arr);
  console.log(obj);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = JSON.stringify(value);
    const res = {
      key: key,
      value: val,
    };
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      await settingsService.updateSettings(res);

      setSuccess("Success");
      setIsSubmitting(false);
      await onDone();
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setError(getAxiosErrorMessage(error));
    }
  };

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={1}
        paddingBottom={1}
        paddingLeft={1}
      >
        <Grid item>
          <form onSubmit={handleSubmit} style={{ paddingTop: "1rem" }}>
            {error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : null}
            {success ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            ) : null}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{t("type")}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Type"
                onChange={(e) => setSelectedType(e)}
                value={type}
              >
                {types.map((c) => (
                  <MenuItem key={c} value={c}>
                    {t(c)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {type ? (
              <>
                <TextField
                  sx={{ mt: 2 }}
                  id="Key"
                  name="Key"
                  label={t("key")}
                  fullWidth
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                ></TextField>
              </>
            ) : (
              <></>
            )}
            {type === "String" ? (
              <>
                <TextField
                  sx={{ mt: 2 }}
                  id="value"
                  name="value"
                  label={t("value")}
                  fullWidth
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                ></TextField>
              </>
            ) : (
              <></>
            )}
            {type === "Number" ? (
              <>
                <TextField
                  sx={{ mt: 2 }}
                  id="value"
                  name="value"
                  label={t("value")}
                  fullWidth
                  value={value}
                  required
                  type="number"
                  onChange={(e) => setValue(e.target.value)}
                ></TextField>
              </>
            ) : (
              <></>
            )}
             {type === "boolean" ? (
              <>
                <TextField
                  select
                  sx={{ mt: 2 }}
                  id="value"
                  name="value"
                  label={t("value")}
                  fullWidth
                  value={value}
                  required
                  onChange={(e) => setValue(e.target.value)}
                >
                  <MenuItem value="true">{t("true")}</MenuItem>
                  <MenuItem value="false">{t("false")}</MenuItem>
                </TextField>
              </>
            ) : (
              <></>
            )}
            {type === "Array" ? (
              <>
                <Grid sx={{ mt: 2 }} container justifyContent={"space-between"}>
                  <Typography sx={{ mt: 1.5 }} variant="h5">
                    {t("arrayValues")}
                  </Typography>
                  <div>
                    <IconButton onClick={removeOption} color="error">
                      <RemoveIcon />
                    </IconButton>
                    <IconButton onClick={addOption} color="primary">
                      <AddIcon />
                    </IconButton>
                  </div>
                  {arr.map((c, index) => (
                    <TextField
                      key={index}
                      sx={{ mt: 2 }}
                      id="value"
                      name="value"
                      label={t("value")}
                      fullWidth
                      value={c}
                      required
                      onChange={(e) => setArray(e.target.value, index)}
                    ></TextField>
                  ))}
                </Grid>
              </>
            ) : (
              <></>
            )}
            {type === "Object" ? (
              <>
                <Grid sx={{ mt: 2 }} container justifyContent={"space-between"}>
                  <Typography sx={{ mt: 1.5 }} variant="h5">
                    {t("objectValues")}
                  </Typography>
                  <div>
                    <IconButton onClick={removeObject} color="error">
                      <RemoveIcon />
                    </IconButton>
                    <IconButton onClick={addObject} color="primary">
                      <AddIcon />
                    </IconButton>
                  </div>
                </Grid>
                {obj.map((c, index) => (
                  <Grid container justifyContent={"space-between"} key={index}>
                    <TextField
                      key={index}
                      sx={{ mt: 2 }}
                      id="key"
                      name="key"
                      label={t("key")}
                      value={c.key}
                      required
                      onChange={(e) => setObject(e.target.value, index, "key")}
                    ></TextField>
                    <TextField
                      key={index + c}
                      sx={{ mt: 2 }}
                      id="value"
                      name="value"
                      label={t("value")}
                      value={c.value}
                      required
                      onChange={(e) =>
                        setObject(e.target.value, index, "value")
                      }
                    ></TextField>
                    {isObjectKeyUniq(c.key, index)}
                  </Grid>
                ))}
              </>
            ) : (
              <></>
            )}
            {type ? (
              <div style={{ paddingTop: "10px" }}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={value?.length < 1 || isSubmitting || !isValid}
                >
                  {isSubmitting ? <CircularProgress size={18} /> : t("submit")}
                </Button>
              </div>
            ) : (
              <></>
            )}
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateAppSettingsForm;
