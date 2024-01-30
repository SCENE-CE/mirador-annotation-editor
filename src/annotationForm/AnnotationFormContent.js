import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

import PropTypes from 'prop-types';
import TextEditor from '../TextEditor';

/** Form part for edit annotation content and body */
function AnnotationFormContent({
  onChange, textBody, updateTextBody, textEditorStateBustingKey,
}) {
  return (
    <div>
      <Typography variant="overline">
        Content
      </Typography>
      <Grid item xs={12}>
        <TextField
          id="outlined-basic"
          label="Title"
          variant="outlined"
          onChange={onChange}
        />
      </Grid>
      <Grid>
        <TextEditor
          key={textEditorStateBustingKey}
          annoHtml={textBody}
          updateAnnotationBody={updateTextBody}
        />
      </Grid>
    </div>
  );
}

AnnotationFormContent.propTypes = {
  onChange: PropTypes.func,
  textBody: PropTypes.string,
  textEditorStateBustingKey: PropTypes.string,
  updateTextBody: PropTypes.func,
};

export default AnnotationFormContent;
