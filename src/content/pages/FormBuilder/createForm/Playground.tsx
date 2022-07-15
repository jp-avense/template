import { useState } from "react";

import {
  Card,
  TextField,
  TextareaAutosize,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface IFields {
  _id: string;
  key: string;
  label: string;
  inputType: string;
  rows?: number;
  placeholder?: string;
  description?: string;
  note?: string;
  options?: [{ key: string }];
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
};
const Playground = ({ data, onDrop, fields }: Props) => {
  const [drag, setDrag] = useState(null);
  const [gender, setGender] = useState([]);

  const onDropData = (e) => {
    onDrop(e);
    setDrag("");
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <>
      {/* "text", "textarea", "markup", "dateTimeRegister", "attachButton",
      "cameraButton", "radios", "checkboxes", "dropdown", "dateTimePicker",
      "button", "signature", "geo", */}
      <Card
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
            const obj = fields.find((x) => x._id === item.key);

            const genderData = obj.options;

            console.log(obj);

            switch (obj.inputType) {
              case "text":
                return (
                  <>
                    <InputLabel>{obj.label}</InputLabel>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder={obj.placeholder}
                      fullWidth
                      key={item.key}
                      disabled
                    ></TextField>
                    <FormHelperText>{obj.description}</FormHelperText>
                  </>
                );
              case "textarea":
                return (
                  <>
                    <InputLabel>{obj.label}</InputLabel>
                    <TextField
                      multiline
                      rows={obj.rows}
                      aria-label="empty textarea"
                      placeholder={obj.placeholder}
                      fullWidth
                      disabled
                    />
                    <FormHelperText>{obj.description}</FormHelperText>
                  </>
                );
              case "dateTimePicker":
                return (
                  <>
                    <InputLabel>{obj.label}</InputLabel>
                    <DateTimePicker
                      label="Date&Time picker"
                      value={null}
                      onChange={handleChange}
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                      disabled
                    />
                    <FormHelperText>{obj.description}</FormHelperText>
                  </>
                );
              case "attachButton":
                return <Button variant="outlined">Button</Button>;
              case "radios":
                return (
                  <>
                    <InputLabel>{obj.label}</InputLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                    >
                      {genderData.map((item) => {
                        <FormControlLabel
                          value={item}
                          control={<Radio />}
                          label="Male"
                          disabled
                        />;
                      })}
                    </RadioGroup>
                    <FormHelperText>{obj.description}</FormHelperText>
                  </>
                );
              case "checkboxes":
                return <Checkbox disabled />;
              case "cameraButton":
                return (
                  <>
                    <InputLabel>{obj.label}</InputLabel>
                    <Button variant="outlined">
                      <CameraAltIcon />
                    </Button>
                    <FormHelperText>{obj.description}</FormHelperText>
                  </>
                );
            }
          })}
        </Box>
      </Card>
    </>
  );
};

export default Playground;
