import PropTypes from "prop-types";

import { DialogContent, IconButton, Box, DialogActions } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";

function SimpleDialog(props) {
  const { onClose, children, title, open, actions } = props;

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      open={open}
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle variant="h3" sx={{ bgcolor: "#5569ff", mb: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          color="white"
        >
          <span>{title}</span>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ position: "relative" }}>{children}</DialogContent>
      {
        actions ? <DialogActions>{actions}</DialogActions> : null
      }
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  actions: PropTypes.node
};

export default SimpleDialog;
