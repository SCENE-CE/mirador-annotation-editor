import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DataObjectIcon from '@mui/icons-material/DataObject';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { OVERLAY_TOOL } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';

export const TEMPLATE = {
  IIIF_TYPE: 'iiif',
  IMAGE_TYPE: 'image',
  KONVA_TYPE: 'konva',
  MANIFEST_TYPE: 'manifest',
  TAGGING_TYPE: 'tagging',
  TEXT_TYPE: 'text',
};

export const MEDIA_TYPES = {
  AUDIO: 'Audio',
  IMAGE: 'Image',
  UNKNOWN: 'Unknown',
  VIDEO: 'Video',
};
/** Return template type * */
export const getTemplateType = (templateType) => TEMPLATE_TYPES.find(
  (type) => type.id === templateType,
);

/**
 * List of the template types supported
 */
export const TEMPLATE_TYPES = [
  {
    description: 'Textual note with target',
    icon: <TextFieldsIcon />,
    id: TEMPLATE.TEXT_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === MEDIA_TYPES.VIDEO) {
        return true;
      }
      if (mediaType === MEDIA_TYPES.IMAGE) {
        return true;
      }
      if (mediaType === MEDIA_TYPES.AUDIO) {
        return false;
      }
    },
    label: 'Note',
  },
  {
    description: 'Tag with target',
    icon: <LocalOfferIcon fontSize="small" />,
    id: TEMPLATE.TAGGING_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === MEDIA_TYPES.VIDEO) {
        return true;
      }
      if (mediaType === MEDIA_TYPES.IMAGE) {
        return true;
      }
      if (mediaType === MEDIA_TYPES.AUDIO) {
        return true;
      }
    },
    label: 'Tag',
  },
  {
    description: 'Image in overlay with a note',
    icon: <ImageIcon fontSize="small" />,
    id: TEMPLATE.IMAGE_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === MEDIA_TYPES.VIDEO) {
        return true;
      }
      // Mirador doesn't support annotation from an image
      if (mediaType === MEDIA_TYPES.IMAGE) {
        return true;
      }
      if (mediaType === MEDIA_TYPES.AUDIO) {
        return false;
      }
    },
    label: 'Image',
  },
  {
    description: 'Drawings and text in overlay',
    icon: <CategoryIcon fontSize="small" />,
    id: TEMPLATE.KONVA_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === MEDIA_TYPES.VIDEO) {
        return true;
      }
      // Mirador doesnot support annotation from an image
      if (mediaType === MEDIA_TYPES.IMAGE) {
        return false;
      }
      if (mediaType === MEDIA_TYPES.AUDIO) {
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
    id: TEMPLATE.IIIF_TYPE,
    // eslint-disable-next-line consistent-return
    isCompatibleWithTemplate: (mediaType) => {
      if (mediaType === MEDIA_TYPES.VIDEO) {
        return true;
      }
      if (mediaType === MEDIA_TYPES.IMAGE) {
        return true;
      }
      if (mediaType === MEDIA_TYPES.AUDIO) {
        return true;
      }
    },
    label: 'Expert mode',
  },
];

export const defaultToolState = {
  activeTool: OVERLAY_TOOL.EDIT,
  closedMode: 'closed',
  fillColor: 'rgba(83,162, 235, 0.5)',
  image: { id: '' },
  imageEvent: null,
  strokeColor: 'rgba(20,82,168,1)',
  strokeWidth: 2,
};

export const targetSVGToolState = {
  activeTool: OVERLAY_TOOL.EDIT,
  closedMode: 'closed',
  image: { id: null },
  imageEvent: null,
  strokeColor: 'rgba(255,0, 0, 0.5)',
  strokeWidth: 2,
};

export const TARGET_VIEW = 'target';
export const OVERLAY_VIEW = 'layer';
export const TAG_VIEW = 'tag';
export const MANIFEST_LINK_VIEW = 'link';

/** Split a second to { hours, minutes, seconds }  */
export function secondsToHMSarray(secs) {
  const h = Math.floor(secs / 3600);
  return {
    hours: h,
    minutes: Math.floor(secs / 60) - h * 60,
    seconds: secs % 60,
  };
}

/**
 * Checks if a given string is a valid URL.
 * @returns {boolean} - Returns true if the string is a valid URL, otherwise false.
 */
export const isValidUrl = (string) => {
  if (string === '' || string === undefined || string === null) {
    return true;
  }
  try {
    // eslint-disable-next-line no-new
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Save the annotation in the storage adapter
 * @param canvasId
 * @param storageAdapter
 * @param receiveAnnotation
 * @param annotation
 * @returns {Promise<void>}
 */
export async function saveAnnotationInStorageAdapter(
  canvasId,
  storageAdapter,
  receiveAnnotation,
  annotation,
) {
  console.log('Annotation to save', annotation);
  if (annotation.id) {
    storageAdapter.update(annotation)
      .then((annoPage) => {
        receiveAnnotation(canvasId, storageAdapter.annotationPageId, annoPage);
      });
  } else {
    // eslint-disable-next-line no-param-reassign
    annotation.id = uuidv4();
    storageAdapter.create(annotation)
      .then((annoPage) => {
        receiveAnnotation(canvasId, storageAdapter.annotationPageId, annoPage);
      });
  }
}
