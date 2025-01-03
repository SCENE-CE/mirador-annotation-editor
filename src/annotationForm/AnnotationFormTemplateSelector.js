import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {
  Card, CardActionArea, CardContent, Grid,
} from '@mui/material';
import PropTypes from 'prop-types';
import { MEDIA_TYPES, TEMPLATE_TYPES } from './AnnotationFormUtils';
/**
 * A component that renders a selection of annotation
 * form templates for different types of comments.
 */
export default function AnnotationFormTemplateSelector({
  mediaType,
  setCommentingType,
  t,
}) {
  /**
     * Sets the comment type for the application.
     */
  const setCommentType = (template) => setCommentingType(template);
  const templates = TEMPLATE_TYPES(t);

  return (
    <CardContainer>
      {mediaType === MEDIA_TYPES.AUDIO ? (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Typography>
              {t('audio_not_supported')}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        templates.map((template) => (
          template.isCompatibleWithTemplate(mediaType) && (
            <Card key={template.id}>
              <CardActionArea id={template.id} onClick={() => setCommentType(template)}>
                <CardContent>
                  <CardTypography variant="h6" component="div">
                    {t(template.label)}
                    {template.icon}
                  </CardTypography>
                  <DescriptionCardTypography component="div" variant="body2">
                    {t(template.description)}
                  </DescriptionCardTypography>
                </CardContent>
              </CardActionArea>
            </Card>
          )
        ))
      )}
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

AnnotationFormTemplateSelector.propTypes = {
  mediaType: PropTypes.string.isRequired,
  setCommentingType: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};
