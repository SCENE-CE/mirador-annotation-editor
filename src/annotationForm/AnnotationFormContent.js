import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import TextEditor from '../TextEditor';

/** Form part for edit annotation content and body */
function AnnotationFormContent({ textBody, updateTextBody, textEditorStateBustingKey }) {
  return (
    <Paper style={{ padding: '5px' }}>
      <Typography variant="overline">
        Infos
      </Typography>
      <Grid>
        <TextEditor
          key={textEditorStateBustingKey}
          annoHtml={textBody}
          updateAnnotationBody={updateTextBody}
        />
      </Grid>
    </Paper>
  );
}

AnnotationFormContent.propTypes = {
  textBody: PropTypes.string.isRequired,
  textEditorStateBustingKey: PropTypes.string.isRequired,
  updateTextBody: PropTypes.func.isRequired,
};

export default AnnotationFormContent;
