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
import { useTranslation } from "react-i18next";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AttachmentIcon from "@mui/icons-material/Attachment";
import "./style.css";
import { InputTypeEnum } from "../../FormFields/form-field.interface";
import _ from "lodash";
import { Droppable, Draggable } from "react-beautiful-dnd";

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
  value?: any;
}

interface IData {
  key: string;
  conditions: object;
  rules: object;
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

  const { t } = useTranslation();

  const handleClick = (id: string) => {
    setSelected([id]);
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
      case InputTypeEnum.MARKUP:
        let res = item.value || item.defaultValue;
        res = _.unescape(res);

        return <div dangerouslySetInnerHTML={{ __html: res }} />;

      case "dateTimeRegister":
        return (
          <>
            <FormHelperText>{item.description}</FormHelperText>
            <Button variant="contained">{item.label}</Button>
          </>
        );
      case "dateTimePicker":
        return (
          <>
            <Box>
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
          <Button variant="contained" endIcon={<AttachmentIcon />}>
            {item.label}
          </Button>
        );
      case "button":
        return <Button variant="contained">{item.label}</Button>;
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
            <FormControl fullWidth>
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
            <InputLabel>Geolocation enabled</InputLabel>
          </>
        );

      case "button":
        return <Button variant="contained">{item.label}</Button>;
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
          zIndex: 2,
        }}
      >
        <Box display="flex" justifyContent={"center"} py={5}>
          <Typography variant="h1">{t("formBuilder")}</Typography>
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
          <Droppable droppableId="playground">
            {(droppableProvided, droppableSnapshot) => (
              <Grid
                container
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {data.map((item, index) => {
                  console.log("dragData", data);
                  const obj = fields.find((x) => x._id === item.key);
                  return (
                    <Draggable
                      key={item.key}
                      draggableId={`key${item.key}`}
                      index={index}
                    >
                      {(draggableProvided, draggableSnapshot) => (
                        <Box
                          p={2}
                          my={1}
                          onClick={(e) => handleClick(item.key)}
                          sx={[
                            {
                              width: "100%",
                              alignItems: "center",
                              "&:hover": {
                                backgroundColor: "#f0f2f5",
                                transitionDuration: "150ms",
                              },
                              boxShadow: draggableSnapshot.isDragging
                                ? "0 5px 5px rgba(0, 0, 0, 0.2)"
                                : "unset",
                              backgroundColor: draggableSnapshot.isDragging
                                ? "#e8eaf6"
                                : "unset",
                            },
                            selected.includes(item.key)
                              ? {
                                  backgroundColor: "#e8eaf6",
                                }
                              : null,
                          ]}
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
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
                              <IconButton
                                onClick={(e) => handleDelete(item.key)}
                              >
                                <DeleteRoundedIcon fontSize="small" />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Draggable>
                  );
                })}
                {droppableProvided.placeholder}
              </Grid>
            )}
          </Droppable>
        </Box>
      </Card>
    </>
  );
};

export default Playground;
