import React from 'react';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import TextEditor from '../TextEditor';

const MainTitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.8em',
}));

const MainContainer = styled(Typography)(({ theme }) => ({
  padding: '5px',
}));
/** Form part for edit annotation content and body */
function AnnotationFormContent({ textBody, updateTextBody, textEditorStateBustingKey }) {
  return (
    <MainContainer style={{ padding: '5px' }}>
      <MainTitleTypography variant="overline" component="h1">
        Infos
      </MainTitleTypography>
      <Grid>
        <TextEditor
          key={textEditorStateBustingKey}
          annoHtml={textBody}
          updateAnnotationBody={updateTextBody}
        />
      </Grid>
    </MainContainer>
  );
}

AnnotationFormContent.propTypes = {
  textBody: PropTypes.string.isRequired,
  textEditorStateBustingKey: PropTypes.string.isRequired,
  updateTextBody: PropTypes.func.isRequired,
};

export default AnnotationFormContent;
