import React from "react";
import { Snackbar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
// import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { setSnackData } from "../../redux/action/userAction";

function Snack(props) {
  const snackResponse = useSelector((state) => state);
  const dispatch = useDispatch();
  const handleClose = () => {
    let snackData = {
      showSnack: false,
    };
    dispatch(setSnackData(snackData));
  };
  return (
    <Snackbar
      open={snackResponse.userReducer.snackResponse.showSnack ? true : false}
      autoHideDuration={4000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      onClose={handleClose}
      message={
        <span data-testid="snackbar-message">
          {snackResponse.userReducer.snackResponse.snackMessage}
        </span>
      }
      className={
        "snack-" + snackResponse.userReducer.snackResponse.snackVariant
      }
      //   action={
      //     <IconButton
      //       key="close"
      //       aria-label="close"
      //       color="inherit"
      //       onClick={handleClose}
      //       data-testid="snackbar"
      //     >
      //       <CloseIcon />
      //     </IconButton>
      //   }
    />
  );
}

export default Snack;
