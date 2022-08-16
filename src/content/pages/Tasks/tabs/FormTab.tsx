import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterContext } from "src/contexts/FilterContext";
import { formService } from "src/services/form.service";
import {
  FormFieldExtended,
  InputTypeEnum,
} from "../../FormFields/form-field.interface";

import Lightbox from "react-image-lightbox";

import "react-image-lightbox/style.css";
import "./style.css";

type Props = {};

const FormTab = (props: Props) => {
  const context = useContext(FilterContext);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState([]);
  const [clickedImg, setClickedImg] = useState(0);

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

  useEffect(() => {
    if (selected && selected?.form) {
      setLoading(true);
      const promise = Promise.all(
        selected.form.map((item) => {
          return createComponent(item, selected.taskId);
        })
      );

      promise
        .then((values) => {
          setComponents(values);
        })
        .finally(() => setLoading(false));
    }
  }, [selected]);

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
        return new Date(value).toLocaleString(language);
      case InputTypeEnum.RADIO:
      case InputTypeEnum.DROPDOWN:
        const [_, selectedValue] = Object.entries(options).find(
          ([key, val]) => key === value
        );
        return selectedValue;
      case InputTypeEnum.CAMERA_BUTTON:
      case InputTypeEnum.SIGNATURE:
        let vals = Array.isArray(item.value) ? item.value : [item.value];

        if (inputType === InputTypeEnum.SIGNATURE) vals = [`image.png`];

        const promises = vals.map(async (name) => {
          return formService.getImage(taskId, name);
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("field")}</TableCell>
              <TableCell>{t("value")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selected.form.map((item: FormFieldExtended, index) => {
              const { key, value, label, inputType } = item;

              if (!label || inputType === InputTypeEnum.MARKUP || !value)
                return null;

              if (
                [InputTypeEnum.PRINT_BUTTON, InputTypeEnum.BUTTON].includes(
                  inputType
                ) &&
                typeof value !== "boolean"
              )
                return null;

              return (
                <TableRow key={key + index}>
                  <TableCell>{label}</TableCell>
                  <TableCell>{components[index]}</TableCell>
                </TableRow>
              );
            })}
            ;
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
    </div>
  );
};

export default FormTab;
