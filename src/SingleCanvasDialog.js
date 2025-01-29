import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import { withTranslation } from 'react-i18next';
import i18n from 'i18next';

/**
 * Dialog to enforce single view for annotation creation / editing
 */
class SingleCanvasDialog extends Component {
  /** */
  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
  }

  /** */
  confirm() {
    const {
      handleClose,
      switchToSingleCanvasView,
    } = this.props;
    switchToSingleCanvasView();
    handleClose();
  }

  /** */
  render() {
    const {
      handleClose,
      open,
      t,
    } = this.props;

    return (
      <Dialog
        aria-labelledby="single-canvas-dialog-title"
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        onEscapeKeyDown={handleClose}
        open={open}
      >
        <DialogTitle id="single-canvas-dialog-title" disableTypography>
          <Typography variant="h2">
            Switch view type to single view?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body1" color="inherit">
            Annotations can only be edited in single canvas view type.
            Switch view type to single view now?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Tooltip title="Cancel">
            <Button onClick={handleClose}>
              Cancel
            </Button>
          </Tooltip>
          <Tooltip title="Switch to single view">
            <Button color="primary" onClick={this.confirm} variant="contained">
              Switch to single view
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>
    );
  }
}

SingleCanvasDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  switchToSingleCanvasView: PropTypes.func.isRequired,
};

export default (SingleCanvasDialog);
