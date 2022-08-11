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

  return (
    <div>
      {selected?.form
        ? selected.form.map((item: FormFieldExtended, index) => {
            const { key, value, label } = item;

            const getKey =
              key === "addressPicture" ||
              key === "appliancesList_tv_picture" ||
              key === "foreclosureSignature";
            const getImg = components.find((x) => x.$$typeof);
            const getVal = getImg?.props.src;

            const imgIndex = components.filter((x) => x.props);
            const zImg = imgIndex.map((x) => x.props.src);

            console.log(zImg);

            return value != null ? (
              <Box key={key + index} mb={2}>
                <Box color="#5569ff">{label || key}</Box>
                {getKey ? (
                  <>
                    <Box
                      component="img"
                      onClick={() => setIsOpen(true)}
                      sx={{
                        cursor: "pointer",
                        height: 120,
                        width: 120,
                        objectFit: "cover",
                      }}
                      src={zImg[photoIndex]}
                    />

                    {isOpen && (
                      <Lightbox
                        mainSrc={zImg[photoIndex]}
                        nextSrc={zImg[photoIndex]}
                        prevSrc={
                          zImg[(photoIndex + zImg.length - 1) % zImg.length]
                        }
                        onCloseRequest={() => setIsOpen(false)}
                        onMovePrevRequest={() =>
                          setPhotoIndex(
                            (photoIndex + zImg.length - 1) % zImg.length
                          )
                        }
                        onMoveNextRequest={() =>
                          setPhotoIndex((photoIndex + 1) % zImg.length)
                        }
                      />
                    )}
                  </>
                ) : (
                  <div>{components[index]}</div>
                )}
              </Box>
            ) : null;
          })
        : t("noDataAvailable")}
    </div>
  );
};

export default FormTab;
