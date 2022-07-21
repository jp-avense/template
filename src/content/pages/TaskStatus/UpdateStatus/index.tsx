import { Button } from "@mui/material";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import Modals from "../../Components/Modals";

type Props = {
  children?: ReactNode;
};

const UpdateStatus = ({ children }: Props) => {
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

export default UpdateStatus;
