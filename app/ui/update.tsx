import { Button, IconButton, Snackbar, withStyles } from "@material-ui/core";
import { common } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import React, { FC } from "react";
import { useServiceWorkerInstallPrompt } from "../pwa";

const WhiteButton = withStyles(() => ({
  root: {
    color: common.white
  }
}))(Button);

const WhiteCloseIcon = withStyles(() => ({
  root: {
    color: common.white
  }
}))(CloseIcon);

export const Update: FC = () => {
  const [
    updateAvailable,
    promptForUpdate,
    cancelUpdate
  ] = useServiceWorkerInstallPrompt();

  return (
    <Snackbar
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      open={updateAvailable}
      onClose={cancelUpdate}
      message="Update available"
      action={[
        <WhiteButton
          key="install"
          color="primary"
          size="small"
          onClick={promptForUpdate}
        >
          INSTALL
        </WhiteButton>,
        <IconButton key="close" onClick={cancelUpdate}>
          <WhiteCloseIcon />
        </IconButton>
      ]}
    />
  );
};
