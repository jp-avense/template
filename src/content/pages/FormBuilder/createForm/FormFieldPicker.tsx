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
import Scrollbar from "src/components/Scrollbar";
import { useTranslation } from "react-i18next";
import "./style.css";

type Props = {
  onDragEnter: any;
  onDragStart: any;
};

function FormFieldPicker({ onDragEnter, onDragStart }: Props) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

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
          <Box sx={{ backgroundColor: "#5569FF" }} py={2} px={3.5}>
            <Typography sx={{ color: "white" }} variant="h4">
              {t("formFields")}
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
                        onDragEnter={(e) => onDragEnter(e, item._id)}
                        key={key}
                        py={2}
                        px={3.5}
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
