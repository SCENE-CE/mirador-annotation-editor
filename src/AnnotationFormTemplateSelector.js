import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Card, CardActionArea, CardContent } from '@mui/material';
import PropTypes from 'prop-types';
import { templateTypes } from './AnnotationFormUtils';
/**
 * A component that renders a selection of annotation
 * form templates for different types of comments.
 */
export default function AnnotationFormTemplateSelector({ setCommentingType }) {
  /**
     * Sets the comment type for the application.
     */
  const setCommentType = (template) => {setCommentingType(template)
  console.log(template)};

  return (
    <CardContainer>
      { templateTypes.map((t) => (
        <Card>
          <CardActionArea id={t.id} onClick={() => setCommentType(t)}>
            <CardContent>
              <CardTypography component="div">
                {t.label}
                {t.icon}
              </CardTypography>
              <CardTypography component="div">
                {t.description}
              </CardTypography>
            </CardContent>
          </CardActionArea>
        </Card>
      )) }
    </CardContainer>
  );
}
const CardContainer = styled('div')(({
  theme,
}) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  margin: '10px',
}));

const CardTypography = styled(Typography)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

AnnotationFormTemplateSelector.propTypes = {
  setCommentingType: PropTypes.func.isRequired,
};
