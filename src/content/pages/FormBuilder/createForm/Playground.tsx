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
  Divider,
  MenuItem,
  Grid,
  IconButton,
  Select,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AttachmentIcon from "@mui/icons-material/Attachment";
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
  onDragOver: any;
  onDrop: any;
  handleDelete: any;
  handleDragDropPlayground: any;
  selected: any;
  setSelected: React.Dispatch<React.SetStateAction<any>>;
};
const Playground = ({
  data,
  onDragOver,
  onDrop,
  fields,
  handleDelete,
  handleDragDropPlayground,
  setSelected,
  selected,
}: Props) => {
  const [drag, setDrag] = useState(null);
  const [dragPlay, setDragPlay] = useState<string>("");

  const handleClick = (id: string) => {
    setSelected(id);
  };

  const onDragStart = (e, type: string) => {
    // e.target.classList.add("playground-drag-source");
    e.dataTransfer.effectAllowed = "move";
    setDragPlay(type);
  };

  const onDragEnter = (e, type: string) => {
    // e.currentTarget.classList.add("playground-drag-target");
    if (type === dragPlay) return;
    e.stopPropagation();
  };

  const onDragEnd = (e) => {
    e.preventDefault();
    // e.target.classList.remove("playground-drag-source");
  };

  const onDragLeave = (e) => {
    // e.currentTarget.classList.remove("drag-target");
  };

  const onDropData = (e) => {
    onDrop(e);
    setDrag("");
  };

  const onDropPlayground = (e, dataTarget: string) => {
    // e.currentTarget.classList.remove("drag-target");

    if (dataTarget !== dragPlay && dragPlay)
      handleDragDropPlayground(e, dragPlay, dataTarget);

    setDragPlay("");
  };

  const handleChange = (e) => {};

  const handleData = (item: IFields) => {
    const optionsObj = item.options;
    switch (item.inputType) {
      case "text":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <TextField
              onClick={() => setSelected([item._id])}
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
              onClick={() => setSelected([item._id])}
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
              onClick={() => setSelected([item._id])}
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
            <FormHelperText>{item.description}</FormHelperText>
            <Button onClick={() => setSelected([item._id])} variant="contained">
              {item.label}
            </Button>
          </>
        );
      case "dateTimePicker":
        return (
          <>
            <Box onClick={() => setSelected([item._id])}>
              <InputLabel>{item.label}</InputLabel>
              <DateTimePicker
                label={item.label}
                value={null}
                onChange={handleChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
                disabled
              />
              <FormHelperText>{item.description}</FormHelperText>
            </Box>
          </>
        );
      case "attachButton":
        return (
          <Button variant="contained" onClick={() => setSelected([item._id])}>
            <AttachmentIcon />
          </Button>
        );
      case "button":
        return (
          <Button variant="contained" onClick={() => setSelected([item._id])}>
            {item.label}
          </Button>
        );
      case "radios":
        return (
          <>
            <FormControl onClick={() => setSelected([item._id])}>
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
            <FormGroup onClick={() => setSelected([item._id])}>
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
            <FormControl fullWidth onClick={() => setSelected([item._id])}>
              <InputLabel id="demo-simple-select-label">
                {item.label}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={item.label}
                defaultValue={item.defaultValue}
                fullWidth
                onChange={handleChange}
              >
                {Object.keys(optionsObj).map((item) => {
                  const value = optionsObj[item];
                  return (
                    <MenuItem key={item} value={item}>
                      {value}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </>
        );
      case "cameraButton":
        return (
          <>
            <InputLabel>{item.label}</InputLabel>
            <Button onClick={() => setSelected([item._id])} variant="outlined">
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
              onClick={() => setSelected([item._id])}
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
            <InputLabel onClick={() => setSelected([item._id])}>
              Geolocation enabled
            </InputLabel>
          </>
        );
    }
  };

  return (
    <>
      <Card
        id="playground"
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDropData(e)}
        sx={{
          width: 700,
          height: "auto",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        <Box display="flex" justifyContent={"center"} py={5}>
          <Typography variant="h1">Form Builder</Typography>
        </Box>
        <Divider />
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
          gap={1}
          pb={10}
          mt={2}
        >
          {data.map((item, index) => {
            const obj = fields.find((x) => x._id == item.key);
            return (
              <Box
                draggable="true"
                onDragStart={(e) => onDragStart(e, item.key)}
                onDragEnter={(e) => onDragEnter(e, item.key)}
                onDragOver={(e) => onDragOver(e)}
                onDragEnd={(e) => onDragEnd(e)}
                onDragLeave={(e) => onDragLeave(e)}
                onDrop={(e) => onDropPlayground(e, item.key)}
                onClick={(e) => handleClick(item.key)}
                key={index}
                sx={[
                  {
                    width: "100%",
                    alignItems: "center",
                    "&:hover": {
                      backgroundColor: "#f0f2f5",
                      transitionDuration: "150ms",
                    },
                  },
                  selected.includes(item.key)
                    ? {
                        backgroundColor: "#e8eaf6",
                      }
                    : null,
                ]}
                px={2}
                py={2}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={11}>
                    {handleData(obj)}
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={(e) => handleDelete(item.key)}>
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Box>
      </Card>
    </>
  );
};

export default Playground;
