import { Button, Grid, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/** Annotation form footer, save or cancel the edition/creation of an annotation */
function AnnotationFormFooter({
  closeFormCompanionWindow,
  saveAnnotation,
  t,
}) {
  /**
     * Validate form and save annotation
     */

  return (
    <Grid container item spacing={1} justifyContent="flex-end">
      <Tooltip title={t('cancel')}>
        <Button onClick={closeFormCompanionWindow}>
          {t('cancel')}
        </Button>
      </Tooltip>
      <Tooltip title={t('save')}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={saveAnnotation}
        >
          {t('save')}
        </Button>
      </Tooltip>
    </Grid>
  );
}
AnnotationFormFooter.propTypes = {
  closeFormCompanionWindow: PropTypes.func.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default AnnotationFormFooter;
