import { useState, useEffect } from "react";

import {
  Typography,
  Divider,
  useTheme,
  CircularProgress,
  Box,
  Grid,
  ListItem,
  ListItemText,
} from "@mui/material";
import { formService } from "src/services/form.service";
import { t } from "i18next";
import Scrollbar from "src/components/Scrollbar";
import "./style.css";

type Props = {
  onDragEnter: any;
  onDragStart: any;
  onDragEnd: any;
  onDragLeave: any;
};

function FormFieldPicker({
  onDragEnter,
  onDragStart,
  onDragEnd,
  onDragLeave,
}: Props) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    formService
      .getFields()
      .then(({ data }) => {
        setForms(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Grid
        sx={{
          width: 300,
          height: "100%",
          backgroundColor: 'white'
        }}
      >
        <Scrollbar>
          <Box sx={{ backgroundColor: "#5569FF" }} py={2} px={2}>
            <Typography sx={{ color: "white" }} variant="h4">
              Field Forms
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress size={50} />
              </Box>
            ) : (
              <Box>
                {forms.map((item) => {
                  const { key } = item;
                  return (
                    <>
                      <ListItem
                        draggable="true"
                        onDragStart={(e) => onDragStart(e, item._id)}
                        onDragEnd={(e) => onDragEnd(e)}
                        onDragEnter={(e) => onDragEnter(e, item._id)}
                        onDragLeave={(e) => onDragLeave(e)}
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
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Grid>
    </>
  );
}

export default FormFieldPicker;
