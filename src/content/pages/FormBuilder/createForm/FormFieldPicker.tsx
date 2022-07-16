import { useState, useEffect } from "react";

import {
  Tooltip,
  IconButton,
  Grid,
  Typography,
  Divider,
  List,
  Card,
  ListItem,
  useTheme,
  Theme,
  ListItemText,
  styled,
  CircularProgress,
  Box,
} from "@mui/material";
import { formService } from "src/services/form.service";
import { t } from "i18next";
import "./style.css";

const ListWrapper = styled(List)(
  () => `
      .MuiListItem-root {
        border-radius: 0;
        margin: 0;
      }
`
);

type Props = {
  onDragEnter: any;
  onDragStart: any;
  onDragLeave: any;
  onDrop: any;
};

function FormFieldPicker({
  onDragEnter,
  onDragStart,
  onDragLeave,
  onDrop,
}: Props) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [drag, setDrag] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    formService
      .getFields()
      .then(({ data }) => {
        data.sort((a, b) => a.order - b.order);

        setForms(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // const handleSelectOne = (id: string) => {
  //   let res = [];

  //   if (!selected.includes(id)) res = [...selected, id];
  //   else res = selected.filter((item) => item === id);

  //   setSelected(res);

  //   // console.log(res);
  // };

  return (
    <>
      <Grid
        sx={{
          width: 300,
          height: "100%",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            backgroundColor: "white",
            px: 2,
            py: 1,
          }}
        >
          <Grid item>
            <Typography variant="h5">{t("Form Fields")}</Typography>
          </Grid>
        </Grid>
        <Divider />
        <Grid style={{ backgroundColor: "white" }}>
          {loading ? (
            <ListItem alignItems="center">
              <CircularProgress size={30} />
            </ListItem>
          ) : (
            <Grid item style={{ height: 999 }}>
              <ListWrapper disablePadding>
                {forms.map((item) => {
                  const { key } = item;
                  return (
                    <>
                      <ListItem
                        draggable="true"
                        onDragEnter={(e) => onDragEnter(e, item._id)}
                        onDragStart={(e) => onDragStart(e, item._id)}
                        onDragLeave={(e) => onDragLeave(e)}
                        onDrop={(e) => onDrop(e, item._id)}
                        // onClick={(e) => {
                        //   handleSelectOne(item._id);
                        // }}
                        key={key}
                        sx={{
                          color: `${theme.colors.primary.main}`,
                          "&:hover": {
                            color: `${theme.colors.primary.dark}`,
                            borderRadius: 0,
                          },
                        }}
                        button
                      >
                        <ListItemText>{item.label}</ListItemText>
                      </ListItem>
                      <Divider />
                    </>
                  );
                })}
              </ListWrapper>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default FormFieldPicker;
