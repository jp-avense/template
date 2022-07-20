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
import Scrollbar from "src/components/Scrollbar";
import { t } from "i18next";
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
      <Box
        sx={{
          width: 300,
          height: "100vh",
          backgroundColor: "white",
          position: "fixed",
        }}
      >
        <Scrollbar>
          <Box sx={{ backgroundColor: "#5569FF" }} py={2} px={2}>
            <Typography sx={{ color: "white" }} variant="h3">
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
                      <Box
                        draggable="true"
                        onDragStart={(e) => onDragStart(e, item._id)}
                        onDragEnd={(e) => onDragEnd(e)}
                        onDragEnter={(e) => onDragEnter(e, item._id)}
                        onDragLeave={(e) => onDragLeave(e)}
                        key={key}
                        py={2}
                        px={2}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f0f2f5",
                            transitionDuration: "150ms",
                          },
                        }}
                      >
                        <Typography variant="body2">{item.label}</Typography>
                      </Box>
                      <Divider />
                    </>
                  );
                })}
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Box>
    </>
  );
}

export default FormFieldPicker;
