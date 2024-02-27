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
import {template} from './AnnotationFormUtils';
import CategoryIcon from "@mui/icons-material/Category";
/**
 * A component that renders a selection of annotation
 * form templates for different types of comments.
 */
export default function AnnotationFormTemplateSelector({ setCommentingType }) {
  /**
     * Sets the comment type for the application.
     * @param {string} type - The type of comment to set.
     */
  function setCommentType(type) {
    return setCommentingType(type);
  }

  const templateTypes = [
      {
          label:'Text Comment',
          id:template.TEXT_TYPE,
          icon:<TextFieldsIcon/>,
          description:'mon incroyable description',
      },
      {
          label:'Image Comment',
          id:template.IMAGE_TYPE,
          icon:<ImageIcon/>,
          description:'mon incroyable description',
      },
      {
          label:'Konva Comment',
          id:template.KONVA_TYPE,
          icon:<CategoryIcon/>,
          description:'mon incroyable description',
      },
      {
          label:'Manifest Comment',
          id:template.MANIFEST_TYPE,
          icon:<HubIcon/>,
          description:'mon incroyable description',
      },
      {
          label:'Tagging Comment',
          id:template.TAGGING_TYPE,
          icon:<LocalOfferIcon/>,
          description:'mon incroyable description',
      },
      {
          label:'IIIF Manifest',
          id:template.IIIF_TYPE,
          icon:<ArticleIcon/>,
          description:'mon incroyable description',
      },
  ];


  return (
    <CardContainer>
        { templateTypes.map( t =>
            <Card>
                <CardActionArea id={t.id} onClick={() =>setCommentType(t.id)}>
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
        ) }
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
