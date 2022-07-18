import { useState } from "react";

import {
  Card,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  FormHelperText,
  InputLabel,
  FormGroup,
  FormControl,
  FormLabel,
  Menu,
  MenuItem,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { getAxiosErrorMessage } from "src/lib";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Swal from "sweetalert2";
import "./style.css";

interface IFields {
  _id: string;
  key: string;
  label: string;
  inputType: string;
  rows?: number;
  placeholder?: string;
  description?: string;
  note?: string;
  defaultValue?: string;
  options?: {
    [key: string]: string;
  };
}

interface IData {
  key: string;
  conditions: string[];
  rules: string[];
}

type Props = {
  data: IData[];
  fields: IFields[];
  onDrop: any;
  handleDragDropPlayground: any;
};
const Playground = ({
  data,
  onDrop,
  fields,
  handleDragDropPlayground,
}: Props) => {
  const [drag, setDrag] = useState(null);
  const [dragPlay, setDragPlay] = useState<string>("");

  const handleData = (item: IFields) => {
    const optionsObj = item.options;
    switch (item.inputType) {
      case "text":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder={item.placeholder}
              fullWidth
              disabled
            ></TextField>
            <FormHelperText>{item.description}</FormHelperText>
          </>
        );
      case "textarea":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <TextField
              multiline
              rows={item.rows}
              aria-label="empty textarea"
              placeholder={item.placeholder}
              fullWidth
              disabled
            />
            <FormHelperText>{item.description}</FormHelperText>
          </>
        );
      case "markup":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <Box
              sx={{
                borderStyle: "dotted",
                height: "75px",
                width: "100%",
              }}
            ></Box>
            <FormHelperText>{item.description}</FormHelperText>
          </>
        );
      case "dateTimeRegister":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <DateTimePicker
              label={item.label}
              value={null}
              onChange={handleChange}
              renderInput={(params) => <TextField fullWidth {...params} />}
              disabled
            />
            <FormHelperText>{item.description}</FormHelperText>
          </>
        );
      case "dateTimePicker":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <DateTimePicker
              label={item.label}
              value={null}
              onChange={handleChange}
              renderInput={(params) => <TextField fullWidth {...params} />}
              disabled
            />
            <FormHelperText>{item.description}</FormHelperText>
          </>
        );
      case "attachButton":
        return (
          <>
            <Button variant="outlined" disabled>
              {item.label}
            </Button>
          </>
        );
      case "radios":
        return (
          <>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                {item.label}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={item.defaultValue}
                name="radio-buttons-group"
              >
                {Object.values(optionsObj).map((item) => {
                  return (
                    <FormControlLabel
                      key={item}
                      value={item}
                      control={<Radio />}
                      label={item}
                      disabled
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          </>
        );
      case "checkboxes":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <FormGroup>
              {Object.values(optionsObj).map((item) => {
                return (
                  <FormControlLabel
                    key={item}
                    control={<Checkbox />}
                    label={item}
                    disabled
                  />
                );
              })}
            </FormGroup>
            <FormHelperText>{item.description}</FormHelperText>
          </>
        );
      case "dropdown":
        return (
          <>
            <Box>
              <Button variant="outlined" disabled>
                {item.label}
              </Button>
            </Box>
          </>
        );
      case "cameraButton":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <Button variant="outlined">
              <CameraAltIcon />
            </Button>
            <FormHelperText>{item.description}</FormHelperText>
          </>
        );
      case "signature":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder={item.placeholder}
              fullWidth
              disabled
            ></TextField>
            <FormHelperText>{item.description}</FormHelperText>
          </>
        );
      case "geo":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder={item.placeholder}
              fullWidth
              disabled
            ></TextField>
            <FormHelperText>{item.description}</FormHelperText>
          </>
        );
    }
  };

  const onDragEnter = (e, type: string) => {
    if (type === dragPlay) return;
    e.currentTarget.classList.add("playground-drag-target");
    // console.log(type);
  };

  const onDragStart = (e, type: string) => {
    e.target.classList.add("playground-drag-source");
    e.dataTransfer.effectAllowed = "move";
    setDragPlay(type);
  };

  const onDragEnd = (e) => {
    e.preventDefault();
    e.target.classList.remove("playground-drag-source");
  };

  const onDragPlaygroundOver = (e) => e.preventDefault();

  const onDropData = (e) => {
    onDrop(e);
    setDrag("");
  };

  const onDragLeave = (e) => {
    e.currentTarget.classList.remove("playground-drag-target");
  };

  const onDropPlayground = (e, dataTarget: string) => {
    e.currentTarget.classList.remove("drag-target");

    if (dataTarget !== dragPlay)
      handleDragDropPlayground(e, dragPlay, dataTarget);

    setDragPlay("");
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    // console.log(e.target.value);
  };

  // console.log(data);
  return (
    <>
      {/* "text", "textarea", "markup", "dateTimeRegister", "attachButton",
      "cameraButton", "radios", "checkboxes", "dropdown", "dateTimePicker",
      "button", "signature", "geo", */}

      <Card
        id="playground"
        onDrop={(e) => onDropData(e)}
        onDragOver={(e) => onDragOver(e)}
        style={{
          width: 700,
          marginTop: 50,
          paddingTop: 50,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <Box display="flex" justifyContent={"center"}>
          <Typography variant="h3">Form</Typography>
        </Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
          gap={1}
          pb={3}
          px={2}
          mt={2}
        >
          {data.map((item) => {
            const obj = fields.find((x) => x._id == item.key);
            return (
              <Box
                draggable="true"
                onDragStart={(e) => onDragStart(e, item.key)}
                onDragEnd={(e) => onDragEnd(e)}
                onDragEnter={(e) => onDragEnter(e, item.key)}
                onDragOver={onDragPlaygroundOver}
                onDragLeave={(e) => onDragLeave(e)}
                onDrop={(e) => onDropPlayground(e, item.key)}
                key={item.key}
                sx={{ width: "100%" }}
              >
                {handleData(obj)}
              </Box>
            );
          })}
        </Box>
      </Card>
    </>
  );
};

export default Playground;
