import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DataObjectIcon from '@mui/icons-material/DataObject';
import React from 'react';
import { OVERLAY_TOOL } from './AnnotationCreationUtils';

export const template = {
  IIIF_TYPE: 'iiif',
  IMAGE_TYPE: 'image',
  KONVA_TYPE: 'konva',
  MANIFEST_TYPE: 'manifest',
  TAGGING_TYPE: 'tagging',
  TEXT_TYPE: 'text',
};

export const mediaTypes = {
  AUDIO: 'Sound',
  IMAGE: 'Image',
  VIDEO: 'Video',
};
/** Return template type * */
export const getTemplateType = (templateType) => templateTypes.find(
  (type) => type.id === templateType,
);

/**
 * List of the template types supported
 */
export const templateTypes = [
  {
    description: 'Textual note with target',
    icon: <TextFieldsIcon />,
    id: template.TEXT_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === mediaTypes.VIDEO) {
        return true;
      }
      if (mediaType === mediaTypes.IMAGE) {
        return true;
      }
      if (mediaType === mediaTypes.AUDIO) {
        return true;
      }
    },
    label: 'Note',
  },
  {
    description: 'Tag with target',
    icon: <LocalOfferIcon fontSize="small" />,
    id: template.TAGGING_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === mediaTypes.VIDEO) {
        return true;
      }
      if (mediaType === mediaTypes.IMAGE) {
        return true;
      }
      if (mediaType === mediaTypes.AUDIO) {
        return true;
      }
    },
    label: 'Tag',
  },
  {
    description: 'Image in overlay with a note',
    icon: <ImageIcon fontSize="small" />,
    id: template.IMAGE_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === mediaTypes.VIDEO) {
        return true;
      }
      if (mediaType === mediaTypes.IMAGE) {
        return false;
      }
      if (mediaType === mediaTypes.AUDIO) {
        return false;
      }
    },
    label: 'Image',
  },
  {
    description: 'Drawings and text in overlay',
    icon: <CategoryIcon fontSize="small" />,
    id: template.KONVA_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === mediaTypes.VIDEO) {
        return true;
      }
      if (mediaType === mediaTypes.IMAGE) {
        return false;
      }
      if (mediaType === mediaTypes.AUDIO) {
        return false;
      }
    },
    label: 'Overlay',
  },
  /*  {
    description: 'Link target to a manifest',
    icon: <HubIcon fontSize="small" />,
    id: template.MANIFEST_TYPE,
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === mediaTypes.VIDEO) {
        return true;
      }
      if (mediaType === mediaTypes.IMAGE) {
        return true;
      }
      if (mediaType === mediaTypes.AUDIO) {
        return true;
      }
    },
    label: 'Document',
  }, */
  {
    description: 'Edit directly the IIIF json code',
    icon: <DataObjectIcon fontSize="small" />,
    id: template.IIIF_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === mediaTypes.VIDEO) {
        return true;
      }
      if (mediaType === mediaTypes.IMAGE) {
        return true;
      }
      if (mediaType === mediaTypes.AUDIO) {
        return true;
      }
    },
    label: 'Expert mode',
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

const targetTypes = {
  MULTI: 'multi',
  STRING: 'string',
  SVG_SELECTOR: 'SVGSelector',
};

/** Transform maetarget to IIIF compatible data * */
export const maeTargetToIiifTarget = (maeTarget, canvasId) => {
  if (maeTarget.drawingState) {
    if (maeTarget.drawingState.shapes.length == 0) {
      console.info('Implement target as string on fullSizeCanvas');
      return `${canvasId}#` + `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}`;
    }
    if (maeTarget.drawingState.shapes.length === 1 && maeTarget.drawingState.shapes[0].type === 'rectangle') {
      let {
        // eslint-disable-next-line prefer-const
        x, y, width, height, scaleX, scaleY,
      } = maeTarget.drawingState.shapes[0];
      x = Math.floor(x);
      y = Math.floor(y);
      width = Math.floor(width * scaleX);
      height = Math.floor(height * scaleY);
      console.info('Implement target as string with one shape (reactangle or image)');
      // Image have not tstart and tend
      return `${canvasId}#${maeTarget.tend ? `xywh=${x},${y},${width},${height}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${x},${y},${width},${height}`}`;
    }
    if (maeTarget.drawingState.shapes.length === 1 && maeTarget.drawingState.shapes[0].type === 'image') {
      let {
        x, y, width, height,
      } = maeTarget.drawingState.shapes[0];
      x = Math.floor(x);
      y = Math.floor(y);
      width = Math.floor(width);
      height = Math.floor(height);
      return `${canvasId}#${maeTarget.tend ? `xywh=${x},${y},${width},${height}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${x},${y},${width},${height}`}`;
    }

    return {
      selector: [
        {
          type: 'SvgSelector',
          value: maeTarget.svg,
        },
        {
          type: 'FragmentSelector',
          value: `${canvasId}#${maeTarget.tend}` ? `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${maeTarget.fullCanvaXYWH}`,
        },
      ],
      source: canvasId,
    };
  }
  return `${canvasId}#${maeTarget.tend}` ? `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${maeTarget.fullCanvaXYWH}`;
};
