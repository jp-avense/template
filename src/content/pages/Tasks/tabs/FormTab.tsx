import { Box } from "@mui/material";
import  { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FilterContext } from "src/contexts/FilterContext";

type Props = {};

const FormTab = (props: Props) => {
  const context = useContext(FilterContext);

  const { t } = useTranslation();

  const {
    handleFilter: { selectedRows, originalData },
  } = context;

  const selected = useMemo(() => {
    return originalData.find(
      (item) => item._id === selectedRows[selectedRows.length - 1]
    );
  }, [selectedRows, originalData]);

  if (!selected) return <>{t("noDataAvailable")}</>;

  return (
    <div>
      {selected?.form
        ? selected.form.map((item, index) => {
            const { key, value, label } = item;

            return value != null ? (
              <Box key={key + index} mb={2}>
                <Box color="#5569ff">{label || key}</Box>
                <div>{value}</div>
              </Box>
            ) : null;
          })
        : t("noDataAvailable")}
    </div>
  );
};

export default FormTab;
