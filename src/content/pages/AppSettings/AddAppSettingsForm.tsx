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
  onDone: () => any;
}

const AddAppSettingsForm = ({ data, onDone }: Props) => {
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

  const [options, setOptions] = useState([{ key: "", value: "" }]);

  const { t } = useTranslation();

  const types = ["String", "Object", "Array", "Number"];

  const setSelectedType = (e) => {
    setType(e.target.value);
  };

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    const uniq = currentData.every((item) => item.key !== key);
    setUnique(uniq);
  }, [key]);

  useEffect(() => {
    setKey("");
    setValue([]);
    setArr([]);
    setObj([]);
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
    setObj(res);
    setValue(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let val;
    if (type === "Object" && value.length === 1) {
      val = JSON.stringify(value[0]);
    } else {
      val = JSON.stringify(value);
    }
    const res = {
      key: key,
      value: val,
    };
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      await settingsService.addSetting(res);

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
        sx={{ minHeight: 500 }}
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
                  required
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                ></TextField>
                {!unique ? (
                  <>
                    <Typography color={"red"}>Key already exists</Typography>
                  </>
                ) : (
                  <></>
                )}
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
                  disabled={value.length < 1 || !unique || isSubmitting}
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

export default AddAppSettingsForm;
