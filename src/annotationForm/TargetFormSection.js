import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import {
  extractTargetFromAnnotation,
  manifestTypes,
} from '../AnnotationFormUtils';
import TargetTimeInput from './TargetTimeInput';
import { TargetSpatialInput } from './TargetSpatialInput';

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
    target,
    currentTime,
    onChangeTarget,
    setCurrentTime,
    setSeekTo,
    spatialTarget,
    timeTarget,
    windowId,
    manifestType,
    overlay,
  },
) {
  console.log('targetFS', target);
  if (!target) {
    target = {};
    if (manifestType === manifestTypes.VIDEO) {
      const mediaVideo = VideosReferences.get(windowId);
      target.tstart = currentTime || 0;
      target.tend = mediaVideo.props.canvas.__jsonld.duration ? mediaVideo.props.canvas.__jsonld.duration : 0;
    }

    if (spatialTarget) {
      switch (manifestType) {
        case manifestTypes.IMAGE:
          // TODO set default xywh
          target.xywh = '0,0,500,1000';
          break;
        case manifestTypes.VIDEO:
          const mediaVideo = VideosReferences.get(windowId);
          const targetHeigth = mediaVideo ? mediaVideo.props.canvas.__jsonld.height : 1000;
          const targetWidth = mediaVideo ? mediaVideo.props.canvas.__jsonld.width : 500;
          target.xywh = `0,0,${targetWidth},${targetHeigth}`;
          break;
        default:
          break;
      }
    }

    onChangeTarget(target);
  }

  // const initTarget = () => {
  // h
  // };
  //
  // useEffect(() => {
  //   onChangeTarget(initTarget());
  // }, []);

  const onChangeTimeTargetInput = (newData) => {
    console.log('newData', newData);
    onChangeTarget({
      ...target,
      ...newData,
    });
  };

  const onChangeSpatialTargetInput = (newData) => {
    onChangeTarget({
      ...target,
      ...newData,
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
              xywh={target.xywh}
              svg={target.svg}
              onChange={onChangeSpatialTargetInput}
              windowId={windowId}
              manifestType={manifestType}
              targetDrawingState={target.drawingState}
              overlay={overlay}

            />
            )
        }
      {
        (timeTarget && manifestType !== manifestTypes.IMAGE) && (
        <TargetTimeInput
          tstart={target.tstart}
          tend={target.tend}
          onChange={onChangeTimeTargetInput}
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
  spatialTarget: PropTypes.bool.isRequired,
  timeTarget: PropTypes.bool.isRequired,
  windowId: PropTypes.string.isRequired,
  onChangeTarget: PropTypes.func.isRequired,
  target: PropTypes.object.isRequired,
};
