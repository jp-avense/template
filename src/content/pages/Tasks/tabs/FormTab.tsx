import {
  Box,
  CircularProgress,
  getSnackbarContentUtilityClass,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterContext } from "src/contexts/FilterContext";
import { formService } from "src/services/form.service";
import {
  FormFieldExtended,
  InputTypeEnum,
} from "../../FormFields/form-field.interface";
import "./style.css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

type Props = {};

const FormTab = (props: Props) => {
  const context = useContext(FilterContext);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState("");

  const { t } = useTranslation();

  const {
    handleFilter: { selectedRows, originalData },
  } = context;

  const selected = useMemo(() => {
    return originalData.find(
      (item) => item._id === selectedRows[selectedRows.length - 1]
    );
  }, [selectedRows, originalData]);

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
    const { value, inputType, options } = item;

    if (value == null) return "";

    switch (inputType) {
      case InputTypeEnum.GEO:
        const {
          coords: { latitude, longitude },
        } = value;
        return `Lat ${latitude}  Long ${longitude}`;
      case InputTypeEnum.DATE_TIME_BUTTON:
      case InputTypeEnum.DATE_TIME_PICKER:
        return new Date(value).toLocaleString();
      case InputTypeEnum.RADIO:
      case InputTypeEnum.DROPDOWN:
        const [_, selectedValue] = Object.entries(options).find(
          ([key, val]) => key === value
        );
        return selectedValue;
      case InputTypeEnum.CAMERA_BUTTON:
      case InputTypeEnum.SIGNATURE:
        const {
          data: { presignedUrl },
        } = await formService.getImage(taskId, item.value);

        if (!presignedUrl) return t("noDataAvailable");

        return <img src={presignedUrl} className="form-image" />;

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

  const handleOpen = (src) => {
    setImgSrc(src);
    console.log(src);
    setIsOpen(true);
  };

  return (
    <div>
      {selected?.form
        ? selected.form.map((item: FormFieldExtended, index) => {
            const { key, value, label } = item;

            const getKey =
              key === "addressPicture" ||
              key === "appliancesList_tv_picture" ||
              key === "foreclosureSignature" ||
              key === "picture_1";

            const current = components[index];
            console.log(current);

            return value != null ? (
              <Box key={key + index} mb={2}>
                <Box color="#5569ff">{label || key}</Box>
                {getKey ? (
                  current?.props?.src && (
                    <>
                      <Box
                        component="img"
                        onClick={() => handleOpen(current.props.src)}
                        sx={{
                          cursor: "pointer",
                          height: 60,
                          width: 60,
                          objectFit: "cover",
                          margin: "2px",
                        }}
                        src={current.props.src}
                      />
                    </>
                  )
                ) : (
                  <div>{components[index]}</div>
                )}
              </Box>
            ) : null;
          })
        : t("noDataAvailable")}
      {isOpen && (
        <Lightbox mainSrc={imgSrc} onCloseRequest={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default FormTab;
