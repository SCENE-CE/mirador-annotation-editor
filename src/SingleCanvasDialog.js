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
            {t('switch_view_h2')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body1" color="inherit">
            {t('question_switch_view')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Tooltip title={t('cancel')}>
            <Button onClick={handleClose}>
              {t('cancel')}
            </Button>
          </Tooltip>
          <Tooltip title={t('switch_view')}>
            <Button color="primary" onClick={this.confirm} variant="contained">
              {t('switch_view')}
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
  t: PropTypes.func.isRequired,
};

export default SingleCanvasDialog;
