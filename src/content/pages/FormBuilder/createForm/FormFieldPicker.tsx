import React, { useState, useEffect } from "react";

import {
  Typography,
  Divider,
  useTheme,
  CircularProgress,
  Box,
  Grid,
  ListItem,
  ListItemText,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formService } from "src/services/form.service";
import Scrollbar from "src/components/Scrollbar";
import { useTranslation } from "react-i18next";
import "./style.css";
import {
  Droppable,
  Draggable,
  NotDraggingStyle,
  DraggingStyle,
} from "react-beautiful-dnd";

type Props = {
  onDragEnter: any;
  onDragStart: any;
};

function FormFieldPicker({ onDragEnter, onDragStart }: Props) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortedForms, setSortedForms] = useState([]);
  const [expandedVal, setExpandedVal] = useState("");
  const [expanded, setExpanded] = useState(false);

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

  useEffect(() => {
    sortForms();
  }, [forms]);

  const sortForms = () => {
    if (forms.length > 0) {
      const inputType = forms.map((c) => c.inputType);
      const availableInputTypes = Array.from(new Set(inputType));
      const sort = availableInputTypes.map((c) => {
        const res = forms.filter((x) => x.inputType === c);
        return { inputType: c, forms: res };
      });
      setSortedForms(sort);
    }
  };

  const handleAccordian = (e) => {
    if (e === expandedVal) {
      setExpanded(!expanded);
    } else setExpanded(true);
    setExpandedVal(e);
  };

  return (
    <>
      <Box
        sx={{
          width: 300,
          height: "100vh",
          backgroundColor: "white",
          position: "fixed",
          zIndex: 1000,
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
                {sortedForms.map((x) => (
                  <Accordion
                    key={x.inputType}
                    onChange={() => handleAccordian(t(x.inputType))}
                    expanded={expandedVal === t(x.inputType) ? expanded : false}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{t(x.inputType)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Droppable droppableId="formFields" isDropDisabled={true}>
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {x.forms.map((item, index) => {
                              const { key } = item;
                              return (
                                <Draggable
                                  key={item._id}
                                  draggableId={item._id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <React.Fragment>
                                      <Box
                                        key={key}
                                        py={2}
                                        px={3.5}
                                        sx={{
                                          "&:hover": {
                                            backgroundColor: "#f0f2f5",
                                            transitionDuration: "150ms",
                                          },
                                          boxShadow: snapshot.isDragging
                                            ? "0 5px 5px rgba(0, 0, 0, 0.2)"
                                            : "unset",
                                          backgroundColor: snapshot.isDragging
                                            ? "#e8eaf6"
                                            : "unset",
                                        }}
                                        style={provided.draggableProps.style}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Typography variant="body2">
                                          {item.label} ({key})
                                        </Typography>
                                      </Box>
                                      {snapshot.isDragging && (
                                        <Box py={2} px={3.5}>
                                          <Typography
                                            className={`dnd-copy`}
                                            variant="body2"
                                          >
                                            {item.label} ({key})
                                          </Typography>
                                        </Box>
                                      )}
                                      <Divider />
                                    </React.Fragment>
                                  )}
                                </Draggable>
                              );
                            })}
                          </Box>
                        )}
                      </Droppable>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Box>
    </>
  );
}

export default FormFieldPicker;
