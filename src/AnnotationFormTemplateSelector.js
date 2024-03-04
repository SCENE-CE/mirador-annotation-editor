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
  const setCommentType = (template) => setCommentingType(template);

  return (
    <CardContainer>
      { templateTypes.map((t) => (
        <Card>
          <CardActionArea id={t.id} onClick={() => setCommentType(t)}>
            <CardContent>
              <CardTypography variant="h6" component="div">
                {t.label}
                {t.icon}
              </CardTypography>
              <DescriptionCardTypography component="div" variant="body2">
                {t.description}
              </DescriptionCardTypography>
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

const CardTypography = styled(Typography, { name: 'CompanionWindow', slot: 'body1Next' })({
  display: 'flex',
  justifyContent: 'space-between',
});

const DescriptionCardTypography = styled(Typography, { name: 'CompanionWindow', slot: 'body1Next' })({
  color: '#adabab',
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledTitle = styled(Typography, { name: 'CompanionWindow', slot: 'title' })({});

AnnotationFormTemplateSelector.propTypes = {
  setCommentingType: PropTypes.func.isRequired,
};
