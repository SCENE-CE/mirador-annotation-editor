import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import HubIcon from '@mui/icons-material/Hub';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArticleIcon from '@mui/icons-material/Article';
import React from 'react';
import { OVERLAY_TOOL } from './AnnotationCreationUtils';
import TextCommentTemplate from './annotationForm/TextCommentTemplate';

export const template = {
  IIIF_TYPE: 'iiif',
  IMAGE_TYPE: 'image',
  KONVA_TYPE: 'konva',
  MANIFEST_TYPE: 'manifest',
  TAGGING_TYPE: 'tagging',
  TEXT_TYPE: 'text',
};

export const manifestTypes = {
  AUDIO: 'audio',
  IMAGE: 'image',
  VIDEO: 'video',
};

export const getTemplateType = (templateType) => {
  return templateTypes.find((type) => type.id === templateType);
};

/**
 * List of the template types supported
 */
export const templateTypes = [
  {
    description: 'mon incroyable description',
    icon: <TextFieldsIcon />,
    id: template.TEXT_TYPE,
    label: 'Text Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <ImageIcon fontSize="small" />,
    id: template.IMAGE_TYPE,
    label: 'Image Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <CategoryIcon fontSize="small" />,
    id: template.KONVA_TYPE,
    label: 'Konva Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <HubIcon fontSize="small" />,
    id: template.MANIFEST_TYPE,
    label: 'Manifest Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <LocalOfferIcon fontSize="small" />,
    id: template.TAGGING_TYPE,
    label: 'Tagging Comment',
  },
  {
    description: 'mon incroyable description',
    icon: <ArticleIcon fontSize="small" />,
    id: template.IIIF_TYPE,
    label: 'IIIF Manifest',
  },
];

/** Extract time information from annotation target */
export function timeFromAnnoTarget(annotarget) {
  // TODO w3c media fragments: t=,10 t=5,
  const r = /t=([0-9.]+),([0-9.]+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return [0, 0];
  }
  return [Number(r[1]), Number(r[2])];
}
/** Extract xywh from annotation target */
export function geomFromAnnoTarget(annotarget) {
  const r = /xywh=((-?[0-9]+,?)+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return '';
  }
  return r[1];
}

export const defaultToolState = {
  activeTool: OVERLAY_TOOL.EDIT,
  closedMode: 'closed',
  fillColor: 'rgba(83,162, 235, 0.5)',
  image: { id: '' },
  imageEvent: null,
  strokeColor: 'rgba(20,82,168,1)',
  strokeWidth: 2,
};

export const TARGET_VIEW = 'target';
export const OVERLAY_VIEW = 'layer';
export const TAG_VIEW = 'tag';
export const MANIFEST_LINK_VIEW = 'link';
