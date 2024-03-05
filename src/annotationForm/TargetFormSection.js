import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import {
  geomFromAnnoTarget,
  manifestTypes,
  template,
  timeFromAnnoTarget,
} from '../AnnotationFormUtils';
import TargetTimeInput from './TargetTimeInput';
import { TargetSpatialInput } from './TargetSpatialInput';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences'

/**
 * Section of Time and Space Target
 * @param templateType
 * @param currentTime
 * @param manifestType
 * @param setCurrentTime
 * @param setSeekTo
 * @param spatialTarget
 * @param windowId
 * @returns {Element}
 * @constructor
 */
export default function TargetFormSection(
  {
    currentTime,
    onChangeTarget,
    setCurrentTime,
    setSeekTo,
    spatialTarget,
    target,
    timeTarget,
    windowId,
    manifestType,
  },
) {
  // TODO implement spatial target
  // eslint-disable-next-line no-param-reassign
  spatialTarget = false;

  const targetTypes = {
    MULTI: 'multi',
    STRING: 'string',
    SVG_SELECTOR: 'SVGSelector',
  };

  // Can be, String, SVGSelector, Array[SVGSelector,FragmentSelector]
  const [targetType, setTargetType] = useState(null);

  let svg;
  let xywh;
  let tstart;
  let tend;
  let mediaVideo

  if(manifestType === manifestTypes.VIDEO) {
    mediaVideo = VideosReferences.get(windowId);
  }

  if(target) {
    // We have an existing annotation

    // First check target type
    if (target.selector) {
      if (Array.isArray(target.selector)) {
        setTargetType(targetTypes.MULTI);
      } else {
        setTargetType(targetTypes.SVG_SELECTOR);
      }
    } else if (typeof target === 'string') {
      setTargetType(targetTypes.STRING);
    }

    // Set spatial target if necessary
    if (spatialTarget) {
      switch (targetType) {
        case targetTypes.STRING:
          xywh = geomFromAnnoTarget(target);
          break;
        case targetTypes.SVG_SELECTOR:
          svg = target.selector.value;
          break;
        case targetTypes.MULTI:
          target.selector.forEach((selector) => {
            if (selector.type === 'SvgSelector') {
              svg = selector.value;
            } else if (selector.type === 'FragmentSelector') {
              // TODO proper fragment selector extraction
              xywh = geomFromAnnoTarget(selector.value);
            }
          });
          break;
        default:
          break;
      }
    }

    // Set time target
    if (timeTarget) {
      switch (targetType) {
        case targetTypes.STRING:
          [tstart, tend] = timeFromAnnoTarget(target);
          break;
        case targetTypes.SVG_SELECTOR:
          break;
        case targetTypes.MULTI:
          target.selector.forEach((selector) => {
            if (selector.type === 'FragmentSelector') {
              [tstart, tend] = timeFromAnnoTarget(selector.value);
            }
          });
          break;
        default:
          break;
      }
    }
  } else {
    // new annotation
    if (spatialTarget) {
      switch (manifestType) {
        case manifestTypes.IMAGE:
          xywh = '0,0,500,1000';
          break;
        case manifestTypes.VIDEO:
          // eslint-disable-next-line no-case-declarations
          const targetHeigth = mediaVideo ? mediaVideo.props.canvas.__jsonld.height : 1000;
          // eslint-disable-next-line no-case-declarations
          const targetWidth = mediaVideo ? mediaVideo.props.canvas.__jsonld.width : 500;
          xywh = `0,0,${targetWidth},${targetHeigth}`;
          break;
        default:
          break;
      }
    }
    if (timeTarget) {
      switch (manifestType) {
        case manifestTypes.VIDEO:
          tstart = currentTime ? Math.floor(currentTime) : 0;
          // eslint-disable-next-line no-underscore-dangle
          tend = mediaVideo ? mediaVideo.props.canvas.__jsonld.duration : 0;
          break;
        default:
          break;
      }
    }
  }
  const onChangeXywh = (newXywh) => {
    console.log('TODO in development');
  };

  const onChangeTime = (time) => {
    onChangeTarget({
      t: time,
    });
  };


  return (
    <Grid>
      <Typography variant="overline">
        Target
      </Typography>
      {
            spatialTarget && (
            <TargetSpatialInput
              xywh={xywh}
              setXywh={onChangeXywh}
            />
            )
        }
      {
            timeTarget && (
            <TargetTimeInput
              tstart={tstart}
              tend={tend}
              onChange={onChangeTime}
              tend={tend}
              windowId={windowId}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              setSeekTo={setSeekTo}

            />
            )
        }
    </Grid>
  );
}

TargetFormSection.propTypes = {
  commentingType: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  manifestType: PropTypes.string.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  spatialTarget: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};
