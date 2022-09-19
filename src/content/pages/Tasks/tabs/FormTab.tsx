import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterContext } from "src/contexts/FilterContext";
import { formService } from "src/services/form.service";
import { TabsContext } from "src/contexts/TabsContext";
import {
  FormFieldExtended,
  InputTypeEnum,
} from "../../FormFields/form-field.interface";

import moment from "moment";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./style.css";
import { settingsService } from "src/services/settings.service";
import ModalButton from "src/components/ModalButton";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Page,
  Text,
  Image as Img,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Rubik",
  src: "http://fonts.gstatic.com/s/rubik/v3/4sMyW_teKWHB3K8Hm-Il6A.ttf",
});

type Props = {};

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Rubik",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const FormTab = (props: Props) => {
  const context = useContext(FilterContext);

  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState([]);
  const [clickedImg, setClickedImg] = useState(0);
  const [baseUrl, setBaseUrl] = useState("");
  const [region, setRegion] = useState("");
  const [formValue, setFormValue] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [pdfData, setPdfData] = useState([]);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const {
    handleFilter: { selectedRows, originalData },
  } = context;

  const selected = useMemo(() => {
    return originalData.find(
      (item) => item._id === selectedRows[selectedRows.length - 1]
    );
  }, [selectedRows, originalData]);

  const handleImageClick = (urls: string[], index: number) => {
    setImgSrc(urls);
    setClickedImg(index);
    setIsOpen(true);
  };

  const PDFFile = () => {
    return (
      <Document key={"pdfDocument"}>
        <Page key={"pdfPage"} style={styles.body}>
          <Text style={styles.title}> Task {selected.taskId} </Text>
          {pdfData.map((item) => {
            return (
              <>
                <Text key={item.label + "text"} style={styles.text}>
                  {item.label} : {item.value}
                </Text>
              </>
            );
          })}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          ></Text>
        </Page>
      </Document>
    );
  };

  const shownValues = () => {
    const res = selected.form.filter((item: FormFieldExtended) => {
      const { key, value, label, inputType } = item;

      if (!label || inputType === InputTypeEnum.MARKUP || !value) return null;

      if (
        [InputTypeEnum.PRINT_BUTTON, InputTypeEnum.BUTTON].includes(
          inputType
        ) &&
        typeof value !== "boolean"
      )
        return null;

      return item;
    });
    setFormValue(res);
    return res;
  };

  const setConditionValue = (e) => {
    const current = e.target.value;
    setTaskDetails(current);
  };

  const handleClose = () => {
    pdfValues();
  };

  const pdfValues = () => {
    let taskVal;

    let val = formValue.reduce((acc, item, index) => {
      if (typeof components[index] === "string") {
        const res = { label: item.label, value: components[index] };
        acc = [...acc, res];
      }
      return acc;
    }, []);

    if (taskDetails.length > 0) {
      taskVal = taskDetails.map((item) => {
        let val = selected.taskDetails.find((c) => c.label === item);
        if (item === "Assigned To") {
          return { label: item, value: val.value.value };
        } else {
          if (val.inputType === "date") {
            return {
              label: item,
              value: moment(val.value).format("HH:MM DD/MM/YYYY"),
            };
          }
          return { label: item, value: val.value };
        }
      });
      val = [...val, ...taskVal];
    }

    setPdfData(val);
  };

  useEffect(() => {
    pdfValues();
  }, [components]);

  useEffect(() => {
    if (selected && selected?.form) {
      setLoading(true);
      const promise = Promise.all(
        shownValues().map((item) => {
          return createComponent(item, selected.taskId);
        })
      );

      promise
        .then((values) => {
          setComponents(values);
        })
        .finally(() => setLoading(false));
    }
  }, [selected, baseUrl, region]);

  useEffect(() => {
    settingsService.getAll().then(({ data }) => {
      const item = data.find((x) => x.key === "bucketName");
      const item2 = data.find((x) => x.key === "s3Region");

      setBaseUrl(item?.value ?? "");
      setRegion(item2?.value ?? "");
    });
  }, []);

  const createComponent = async (item: FormFieldExtended, taskId = null) => {
    const { value, inputType, options, key } = item;

    if (value == null) return "";

    switch (inputType) {
      case InputTypeEnum.GEO:
        const {
          coords: { latitude, longitude },
        } = value;
        return `Lat ${latitude}  Long ${longitude}`;
      case InputTypeEnum.DATE_TIME_BUTTON:
      case InputTypeEnum.DATE_TIME_PICKER:
        return moment(value).format("HH:MM DD/MM/YYYY");
      case InputTypeEnum.RADIO:
      case InputTypeEnum.DROPDOWN:
        const [_, selectedValue] = Object.entries(options).find(
          ([key, val]) => key === value
        );
        return selectedValue;
      case InputTypeEnum.CHECKBOX:
        return value.map((item) => <div key={item}>{item}</div>);
      case InputTypeEnum.CAMERA_BUTTON:
      case InputTypeEnum.SIGNATURE:
        let vals = Array.isArray(item.value) ? item.value : [item.value];

        if (inputType === InputTypeEnum.SIGNATURE) vals = [`image.png`];

        const promises = vals.map(async (name) => {
          return formService.getImage(baseUrl, region, taskId, name);
        });

        const results = await Promise.all(promises);

        const srcs = results.map((res) => {
          return res.data.presignedUrl;
        });

        const images = srcs.map((res, index) => {
          return (
            <img
              key={index}
              src={res}
              id={`image${index}`}
              className="form-image"
              onClick={() => handleImageClick(srcs, index)}
              style={{ cursor: "pointer", width: "50px", height: "50px" }}
            />
          );
        });

        return (
          <Box display="flex" flexDirection="row" gap={1}>
            {images}
          </Box>
        );

      case InputTypeEnum.BUTTON:
      case InputTypeEnum.PRINT_BUTTON:
        return (
          item.displayValue ?? (
            <>
              The field <b>{key}</b> has been clicked
            </>
          )
        );

      default:
        return value;
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={2}>
        <CircularProgress size={18} />
      </Box>
    );
  if (!selected || components.length === 0) return <>{t("noDataAvailable")}</>;

  return (
    <div>
      {selected?.form ? (
        <Table sx={{ mb: 5 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t("field")}</TableCell>
              <TableCell>{t("value")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ wordBreak: "break-word" }}>
            {formValue.map((item: FormFieldExtended, index) => {
              const { key, label } = item;

              return (
                <TableRow key={key + index}>
                  <TableCell>{label}</TableCell>
                  <TableCell>{components[index]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        t("noDataAvailable")
      )}
      {isOpen && (
        <Lightbox
          mainSrc={imgSrc[clickedImg]}
          onCloseRequest={() => setIsOpen(false)}
          nextSrc={imgSrc[(clickedImg + 1) % imgSrc.length]}
          prevSrc={imgSrc[(clickedImg + imgSrc.length - 1) % imgSrc.length]}
          onMovePrevRequest={() =>
            setClickedImg((clickedImg + imgSrc.length - 1) % imgSrc.length)
          }
          onMoveNextRequest={() =>
            setClickedImg((clickedImg + 1) % imgSrc.length)
          }
        />
      )}
      <ModalButton
        text={t("Download PDF")}
        buttonProps={{
          variant: "contained",
        }}
        title={t("Download PDF")}
      >
        Select additional details to be included in the pdf
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label="value"
          onChange={(e) => setConditionValue(e)}
          value={taskDetails || []}
          select
          SelectProps={{ multiple: true, onClose: handleClose }}
        >
          {selected.taskDetails.map((c) => (
            <MenuItem key={c.key} value={c.label}>
              {t(c.label)}
            </MenuItem>
          ))}
        </TextField>
        <PDFDownloadLink
          key={"pdfLink"}
          document={<PDFFile />}
          fileName={`task-${selected.taskId}`}
        >
          {({ loading }) =>
            loading ? (
              <Button variant="contained">Loading PDF</Button>
            ) : (
              <Button variant="contained">Download</Button>
            )
          }
        </PDFDownloadLink>
      </ModalButton>
    </div>
  );
};

export default FormTab;
