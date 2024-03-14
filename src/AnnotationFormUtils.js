import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import HubIcon from '@mui/icons-material/Hub';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ArticleIcon from '@mui/icons-material/Article';
import React, { useEffect, useRef } from 'react';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
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

export const getTemplateType = (templateType) => templateTypes.find((type) => type.id === templateType);

/**
 * List of the template types supported
 */
export const templateTypes = [
  {
    description: 'Textual note with target',
    icon: <TextFieldsIcon />,
    id: template.TEXT_TYPE,
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
  // {
  //   description: 'Image in overlay with a note',
  //   icon: <ImageIcon fontSize="small" />,
  //   id: template.IMAGE_TYPE,
  //   label: 'Image',
  //   isCompatibleWithTemplate: (manifestType) =>{
  //     if( manifestType === manifestTypes.VIDEO){
  //       return true
  //     }
  //     if( manifestType === manifestTypes.IMAGE) {
  //       return false
  //     }
  //     if( manifestType === manifestTypes.AUDIO){
  //       return false
  //     }
  //   },
  // },
  {
    description: 'Drawings and text in overlay',
    icon: <CategoryIcon fontSize="small" />,
    id: template.KONVA_TYPE,
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
    description: 'Tag with target',
    icon: <LocalOfferIcon fontSize="small" />,
    id: template.TAGGING_TYPE,
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
    description: 'Edit directly the IIIF json code',
    icon: <DataObjectIcon fontSize="small" />,
    id: template.IIIF_TYPE,
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

/**
 *
 * @param target object
 * @param manifestType string
 * @param timeTarget boolean
 * @param spatialTarget boolean
 */
export const extractTargetFromAnnotation = (target, manifestType, timeTarget, spatialTarget, additionalParams) => {
  // Can be, String, SVGSelector, Array[SVGSelector,FragmentSelector]
  const maeTarget = {};
  let targetType;

  if (target) {
    // We have an existing annotation

    // First check target type
    if (target.selector) {
      if (Array.isArray(target.selector)) {
        targetType = targetTypes.MULTI;
      } else {
        targetType = targetTypes.SVG_SELECTOR;
      }
    } else if (typeof target === 'string') {
      targetType = targetTypes.STRING;
    }

    // Set spatial target if necessary
    if (spatialTarget) {
      switch (targetType) {
        case targetTypes.STRING:
          maeTarget.xywh = geomFromAnnoTarget(target);
          break;
        case targetTypes.SVG_SELECTOR:
          maeTarget.svg = target.selector.value;
          break;
        case targetTypes.MULTI:
          target.selector.forEach((selector) => {
            if (selector.type === 'SvgSelector') {
              maeTarget.svg = selector.value;
            } else if (selector.type === 'FragmentSelector') {
              // TODO proper fragment selector extraction
              maeTarget.xywh = geomFromAnnoTarget(selector.value);
            }
          });
          break;
        default: {
          break;
        }
      }
    }

    // Set time target
    if (timeTarget) {
      switch (targetType) {
        case targetTypes.STRING:
          const [tstart, tend] = timeFromAnnoTarget(target);
          maeTarget.tstart = tstart;
          maeTarget.tend = tend;
          break;
        case targetTypes.SVG_SELECTOR:
          break;
        case targetTypes.MULTI:
          target.selector.forEach((selector) => {
            if (selector.type === 'FragmentSelector') {
              const [tstart, tend] = timeFromAnnoTarget(selector.value);
              maeTarget.tstart = tstart;
              maeTarget.tend = tend;
            }
          });
          break;
        default:
          break;
      }
    }
    return maeTarget;
  }
  return null;
};

export const iiifTargetToMaeTarget = (iiifTarget) => {
  const target = extractTargetFromAnnotation(iiifTarget, manifestType, timeTarget, spatialTarget);
  if (!target) {
    const defaultTarget = {
      tend: 0,
      tstart: 0,
      xywh: '0,0,500,1000',
    };

    if (spatialTarget) {
      switch (manifestType) {
        case mediaTypes.IMAGE:
          defaultTarget.xywh = '0,0,500,1000';
          break;
        case mediaTypes.VIDEO:
          // eslint-disable-next-line no-case-declarations
          const targetHeigth = mediaVideo ? mediaVideo.props.canvas.__jsonld.height : 1000;
          // eslint-disable-next-line no-case-declarations
          const targetWidth = mediaVideo ? mediaVideo.props.canvas.__jsonld.width : 500;
          defaultTarget.xywh = `0,0,${targetWidth},${targetHeigth}`;
          break;
        default:
          break;
      }
    }
    if (timeTarget) {
      switch (manifestType) {
        case mediaTypes.VIDEO:
          defaultTarget.tstart = currentTime ? Math.floor(currentTime) : 0;
          // eslint-disable-next-line no-underscore-dangle
          defaultTarget.tend = mediaVideo ? mediaVideo.props.canvas.__jsonld.duration : 0;
          break;
        default:
          break;
      }
    }
    return defaultTarget;
  }
  return target;
};

export const maeTargetToIiifTarget = (maeTarget, canvasId) => {
  if (maeTarget.drawingState) {
    if (maeTarget.drawingState.shapes.length == 0) {
      console.info('Implement target as string on fullSizeCanvas');
      return `${canvasId}#` + `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}`;
    }
    if (maeTarget.drawingState.shapes.length === 1 && (maeTarget.drawingState.shapes[0].type === 'rectangle')) {
      let {
        x, y, width, height,
      } = maeTarget.drawingState.shapes[0];
      x = Math.floor(x);
      y = Math.floor(y);
      width = Math.floor(width);
      height = Math.floor(height);
      console.info('Implement target as string with one shape (reactangle or image)');
      // Image have not tstart and tend
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
