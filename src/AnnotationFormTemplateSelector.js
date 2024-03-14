import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {Card, CardActionArea, CardContent, Grid} from '@mui/material';
import PropTypes from 'prop-types';
import {mediaTypes, templateTypes} from './AnnotationFormUtils';
/**
 * A component that renders a selection of annotation
 * form templates for different types of comments.
 */
export default function AnnotationFormTemplateSelector({ setCommentingType, mediaType }) {
  /**
     * Sets the comment type for the application.
     */
  const setCommentType = (template) => setCommentingType(template);

  return (
    <CardContainer>
      {mediaType === mediaTypes.AUDIO ? (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Typography> Mirador Annotation Editor Plugin doesn't support Audio annotation yet</Typography>
            </Grid>

          </Grid>
      ) : (
          templateTypes.map((t) => (
                ( t.isCompatibleWithTemplate(mediaType) && (
                    <Card>
                      <CardActionArea id={t.id} onClick={() => setCommentType(t)}>
                        <CardContent>
                          <CardTypography variant="h6" component="div">
                            {t.label}
                            {t.icon}
                            {t.isCompatibleWithTemplate(mediaType)}
                          </CardTypography>
                          <DescriptionCardTypography component="div" variant="body2">
                            {t.description}
                          </DescriptionCardTypography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                ))
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
  setCommentingType: PropTypes.func.isRequired,
};
