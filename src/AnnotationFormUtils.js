import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import HubIcon from '@mui/icons-material/Hub';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArticleIcon from '@mui/icons-material/Article';
import React from 'react';

export const template = {
  IIIF_TYPE: 'iiif',
  IMAGE_TYPE: 'image',
  KONVA_TYPE: 'konva',
  MANIFEST_TYPE: 'manifest',
  TAGGING_TYPE: 'tagging',
  TEXT_TYPE: 'text',
};

export const templateTypes = [
  {
    description: 'mon incroyable description',
    icon: <TextFieldsIcon />,
    id: template.TEXT_TYPE,
    label: 'Text Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <ImageIcon />,
    id: template.IMAGE_TYPE,
    label: 'Image Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <CategoryIcon />,
    id: template.KONVA_TYPE,
    label: 'Konva Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <HubIcon />,
    id: template.MANIFEST_TYPE,
    label: 'Manifest Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <LocalOfferIcon />,
    id: template.TAGGING_TYPE,
    label: 'Tagging Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <ArticleIcon />,
    id: template.IIIF_TYPE,
    label: 'IIIF Manifest',
  },
];
