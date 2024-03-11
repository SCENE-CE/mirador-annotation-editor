import React from 'react';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import TextEditor from '../TextEditor';

/**
 * TextAnnotation section
 * @param annoHtml
 * @param updateAnnotationBody
 * @returns {Element}
 * @constructor
 */
export default function TextFormSection(
  {
    annoHtml,
    updateAnnotationBody,
  },
) {
  return (
    <Grid>
      <Typography variant="formSectionTitle">
        Note
      </Typography>
      <Grid>
        <TextEditor
          annoHtml={annoHtml}
          updateAnnotationBody={updateAnnotationBody}
        />
      </Grid>
    </Grid>
  );
}

TextFormSection.propTypes = {
  annoHtml: PropTypes.string.isRequired,
  updateAnnotationBody: PropTypes.func.isRequired,
};
