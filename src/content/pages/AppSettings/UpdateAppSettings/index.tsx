import { ReactNode, useState } from "react";
import { Button } from "@mui/material";
import Modals from "../../Components/Modals";
import { useTranslation } from "react-i18next";

type Props = {
  children?: ReactNode;
};

const UpdateAppSettings = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modals open={open} onClose={handleClose} title={t("update")}>
        <>{children}</>
      </Modals>
      <Button onClick={() => setOpen(true)} variant="contained">
        {t("update")}
      </Button>
    </>
  );
};

export default UpdateAppSettings;
