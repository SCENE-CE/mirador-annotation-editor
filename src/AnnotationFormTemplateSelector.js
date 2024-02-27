import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Card, CardActionArea, CardContent } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import HubIcon from '@mui/icons-material/Hub';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArticleIcon from '@mui/icons-material/Article';
import PropTypes from 'prop-types';

const TEXT_TYPE = 'text';
const IMAGE_TYPE = 'image';
const KONVA_TYPE = 'konva';
const MANIFEST_TYPE = 'manifest';
const TAGGING_TYPE = 'tagging';
const IIIF_TYPE = 'iiif';
/**
 * A component that renders a selection of annotation
 * form templates for different types of comments.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setCommentType - A function to set the type of comment.
 */
export default function AnnotationFormTemplateSelector({ setCommentType }) {
  /**
     * Sets the comment type for the application.
     * @param {string} type - The type of comment to set.
     */
  function setingComentType(type) {
    setCommentType(type);
  }

  return (
    <CardContainer>
      <button type="button" onClick={setingComentType(TEXT_TYPE)}>
        <Card>
          <CardActionArea>
            <CardContent>
              <CardTypography component="div">
                Text comment
                <TextFieldsIcon />
              </CardTypography>
            </CardContent>
          </CardActionArea>
        </Card>
      </button>
      <button type="button" onClick={setingComentType(IMAGE_TYPE)}>
        <Card>
          <CardActionArea>
            <CardContent>
              <CardTypography component="div">
                Image comment
                <ImageIcon />
              </CardTypography>
            </CardContent>
          </CardActionArea>
        </Card>
      </button>
      <button type="button" onClick={setingComentType(KONVA_TYPE)}>
        <Card>
          <CardActionArea>
            <CardContent>
              <CardTypography component="div">
                Konva comment
                <ImageIcon />
              </CardTypography>
            </CardContent>
          </CardActionArea>
        </Card>
      </button>
      <button type="button" onClick={setingComentType(MANIFEST_TYPE)}>
        <Card>
          <CardActionArea>
            <CardContent>
              <CardTypography component="div">
                Manifest comment
                <HubIcon />
              </CardTypography>
            </CardContent>
          </CardActionArea>
        </Card>
      </button>
      <button type="button" onClick={setingComentType(TAGGING_TYPE)}>
        <Card>
          <CardActionArea>
            <CardContent>
              <CardTypography component="div">
                Tagging
                <LocalOfferIcon />
              </CardTypography>
            </CardContent>
          </CardActionArea>
        </Card>
      </button>
      <button type="button" onClick={setingComentType(IIIF_TYPE)}>
        <Card>
          <CardActionArea>
            <CardContent>
              <CardTypography component="div">
                Manifest IIIF
                <ArticleIcon />
              </CardTypography>
            </CardContent>
          </CardActionArea>
        </Card>
      </button>
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
  setCommentType: PropTypes.func.isRequired,
};
