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
  ListItem,
  List,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Modals from "../Components/Modals";

import { useTranslation } from "react-i18next";

type Props = {
  data: any;
  text?: string;
  title?: string;
};

const ValueModal = ({ data, text, title }: Props) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [dataType, setDataType] = useState("");
  const [showData, setShowData] = useState<any>(<></>);

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };
  const handleOpen = (e) => {
    e.stopPropagation();
    handleShowData();
    setOpen(true);
  };

  const { t } = useTranslation();

  useEffect(() => {
    setDataType(typeof data);
  }, [data]);

  const handleShowData = () => {
    if (dataType === "object" && Array.isArray(data)) {
      const res = data.reduce((acc, item) => {
        if (typeof item === "object") {
          const keys = Object.keys(item);
          const element = keys.map((c) => {
            const res = (
              <ListItem>
                <Typography variant="h5" color="secondary">
                  "{[c]}":&nbsp;
                </Typography>
                <Typography variant="h5" color="primary">
                  "{item[c]}",
                </Typography>
              </ListItem>
            );
            return res;
          });
          const show = (
            <>
              <div>
                {"{"}
                {element}
                {"}"},
              </div>
            </>
          );
          acc = [...acc, show];
        } else if (typeof item === "string") {
          const element = (
            <ListItem>
              <Typography variant="h5" color="primary">
                "{item}",
              </Typography>
            </ListItem>
          );
          acc = [...acc, element];
        }

        return acc;
      }, []);

      const show = (
        <span>
          {"["}
          {res}

          {"]"}
        </span>
      );
      setShowData(show);
    } else if (dataType === "object") {
      const keys = Object.keys(data);
      const element = keys.map((c, index) => {
        const res = (
          <ListItem>
            <Typography variant="h5" color="primary">
              "{[c]}": "{data[c]}",
            </Typography>
          </ListItem>
        );
        return res;
      });
      const res = (
        <span>
          {"{"} {element} {"}"}
        </span>
      );
      setShowData(res);
    }
  };

  return (
    <>
      {dataType !== "string" && dataType !== "number" ? (
        <>
          <Grid item>
            <Modals open={open} onClose={handleClose} title={t("viewValue")}>
              <List>{showData}</List>
            </Modals>
          </Grid>
          <Button variant="contained" onClick={handleOpen}>
            {text || t("viewValue")}
          </Button>
        </>
      ) : (
        <>
          <span>{data}</span>
        </>
      )}
    </>
  );
};

export default ValueModal;
