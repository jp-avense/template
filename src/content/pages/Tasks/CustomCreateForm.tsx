import { DateTimePicker } from "@mui/lab";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AttachmentIcon from "@mui/icons-material/Attachment";
import TodayIcon from "@mui/icons-material/Today";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PrintIcon from "@mui/icons-material/Print";
import SignaturePad from "signature_pad";
import "./style.css";
import { useTranslation } from "react-i18next";
import _, { cloneDeep } from "lodash";
import { Form } from "../FormBuilder/form.interface";
import {
  InputTypeEnum,
  FormFieldExtended,
} from "../FormFields/form-field.interface";

type Props = {
  form: Form;
  setValues: (value: any) => any;
  values: any;
};

const CustomCreateForm = ({ form, setValues, values }: Props) => {
  const [canvas, setCanvas] = useState(null);
  const [pad, setPad] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (canvas) setPad(new SignaturePad(canvas));
  }, [canvas]);

  const handleDateChange = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleChange = (e) => {
    const {
      target: { id, value, checked, name },
    } = e;

    let toSplit = id || name;

    const [key, inputType] = toSplit.split(".");
    if (!inputType) return;

    let obj = cloneDeep(values);

    switch (inputType) {
      case InputTypeEnum.CHECKBOX:
        let res = values[key].slice();

        if (checked) res.push(value);
        else res = res.filter((item) => item !== value);

        obj[key] = res;
        break;

      default:
        obj[key] = value;
    }

    const invalidFields = form.formFields.filter(
      (item) => !checkConditions(obj, item)
    );

    for (const f of invalidFields) {
      delete obj[f.key]
    }

    const recalculatedVals = recursiveDisplay(form.formFields, cloneDeep(obj));

    setValues(recalculatedVals);
  };

  const generateFieldComponent = (field: FormFieldExtended) => {
    const {
      label,
      description,
      defaultValue,
      placeholder,
      options,
      rows,
      key: pk,
      inputType,
      value,
    } = field;

    switch (inputType) {
      case InputTypeEnum.DROPDOWN:
        return (
          <FormControl fullWidth>
            <Box mb={1}>{label}</Box>
            <Select
              value={values[pk]}
              defaultValue={defaultValue}
              placeholder={placeholder}
              name={`${pk}.${inputType}`}
              fullWidth
              onChange={handleChange}
            >
              {Object.entries(options).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{description}</FormHelperText>
          </FormControl>
        );

      case InputTypeEnum.CHECKBOX:
        return (
          <FormGroup>
            <FormLabel>{label}</FormLabel>
            {Object.entries(options).map(([key, label]) => {
              const checked = values[pk]?.includes(key);

              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      value={key}
                      defaultChecked={defaultValue === key}
                      checked={checked}
                      onChange={handleChange}
                      id={`${pk}.${inputType}`}
                    />
                  }
                  label={label}
                />
              );
            })}
            <FormHelperText>{description}</FormHelperText>
          </FormGroup>
        );

      case InputTypeEnum.TEXT:
        return (
          <Box>
            <Box mb={1}>{label}</Box>
            <TextField
              placeholder={placeholder}
              defaultValue={defaultValue}
              helperText={description}
              value={values[pk]}
              fullWidth
              id={`${pk}.${inputType}`}
              onChange={handleChange}
            />
          </Box>
        );

      case InputTypeEnum.TEXTAREA:
        return (
          <Box>
            <Box mb={1}>{label}</Box>
            <TextField
              placeholder={placeholder}
              defaultValue={defaultValue}
              helperText={description}
              value={values[pk]}
              fullWidth
              multiline
              id={`${pk}.${inputType}`}
              onChange={handleChange}
              rows={rows}
            />
          </Box>
        );

      case InputTypeEnum.DATE_TIME_PICKER:
        return (
          <Box>
            <Box mb={1}>{label}</Box>
            <DateTimePicker
              renderInput={(props) => (
                <TextField
                  {...props}
                  placeholder={placeholder}
                  helperText={description}
                  id={`${pk}.${inputType}`}
                  fullWidth
                  defaultValue={defaultValue}
                />
              )}
              value={values[pk]}
              onChange={(e) => handleDateChange(e, pk)}
            />
          </Box>
        );

      case InputTypeEnum.RADIO:
        return (
          <Box>
            <FormControl>
              <FormLabel>{label}</FormLabel>
              <RadioGroup row>
                {Object.entries(options).map(([key, inputLabel]) => {
                  return (
                    <FormControlLabel
                      key={key}
                      control={
                        <Radio
                          id={`${pk}.${inputType}`}
                          value={key}
                          checked={values[pk] == key}
                        />
                      }
                      onChange={handleChange}
                      label={inputLabel}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case InputTypeEnum.ATTACH_BUTTON:
        return (
          <Box>
            <FormControl>
              <Button variant="contained" endIcon={<AttachmentIcon />}>
                {label}
              </Button>
              <FormHelperText>{description}</FormHelperText>
            </FormControl>
          </Box>
        );

      case InputTypeEnum.DATE_TIME_BUTTON:
        return (
          <Box>
            <FormControl>
              <Button variant="contained" endIcon={<TodayIcon />}>
                {label}
              </Button>
              <FormHelperText>{description}</FormHelperText>
            </FormControl>
          </Box>
        );

      case InputTypeEnum.CAMERA_BUTTON:
        return (
          <Box>
            <FormControl>
              <Button variant="contained" endIcon={<PrintIcon />}>
                {label}
              </Button>
              <FormHelperText>{description}</FormHelperText>
            </FormControl>
          </Box>
        );

      case InputTypeEnum.PRINT_BUTTON:
        return (
          <Box>
            <FormControl>
              <Button variant="contained" endIcon={<CameraAltIcon />}>
                {label}
              </Button>
              <FormHelperText>{description}</FormHelperText>
            </FormControl>
          </Box>
        );

      case InputTypeEnum.MARKUP:
        let res = value || defaultValue;
        res = _.unescape(res);

        return <div dangerouslySetInnerHTML={{ __html: res }} />;

      case InputTypeEnum.SIGNATURE:
        return (
          <Box>
            <Box mb={1}>{label}</Box>
            <canvas
              id="canvas"
              height="300"
              width="500"
              ref={(e) => setCanvas(e)}
            ></canvas>
            <Box mt={1}>{description}</Box>
          </Box>
        );
    }
  };

  const checkConditions = (currentValues, field: FormFieldExtended) => {
    const { conditions } = field;

    if (!conditions || Object.keys(conditions).length < 1) return true;

    return Object.entries(conditions).every(
      ([key, value]: [string, string[]]) => {
        const formValue: string | string[] = currentValues[key];

        return value.some((item) => {
          if (item === "!null") {
            return Array.isArray(formValue) ? formValue.length : formValue;
          } else {
            if (Array.isArray(formValue)) return formValue.includes(item);
            return formValue == item;
          }
        });
      }
    );
  };

  const recursiveDisplay = (fields: any[], valueContainer) => {
    const allShownFields = fields.filter((item) =>
      checkConditions(valueContainer, item)
    );

    const newFieldsToShow = allShownFields.filter(
      (item) => !(item.key in valueContainer)
    );

    if (newFieldsToShow.length == 0) return valueContainer;

    for (const newField of newFieldsToShow) {
      const { defaultValue, key, inputType } = newField;

      let fallbackValue = inputType === InputTypeEnum.CHECKBOX ? [] : "";

      if (defaultValue == null || defaultValue == "") {
        valueContainer[key] = fallbackValue;
      } else {
        let resetValue = defaultValue;

        if (inputType === InputTypeEnum.CHECKBOX) {
          if (!Array.isArray(defaultValue)) resetValue = [defaultValue];
        }

        valueContainer[key] = resetValue;
      }
    }

    return recursiveDisplay(fields, valueContainer);
  };

  const shownFields = useMemo(() => {
    return form.formFields.filter((item) => checkConditions(values, item));
  }, [values, form]);

  return (
    <>
      <Grid
        container
        gap={3}
        direction="column"
        onClick={(e) => e.stopPropagation()}
      >
        {shownFields.length === 0
          ? t("noDataAvailable")
          : shownFields.map((item) => (
              <Grid item key={item._id}>
                {generateFieldComponent(item)}
              </Grid>
            ))}
      </Grid>
    </>
  );
};

export default CustomCreateForm;
