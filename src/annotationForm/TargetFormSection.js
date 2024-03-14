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
 * @param mediaType
 * @param setCurrentTime
 * @param setSeekTo
 * @param spatialTarget
 * @param windowId
 * @returns {Element}
 * @constructor
 */
export default function TargetFormSection(
  {
    closeFormCompanionWindow,
    currentTime,
    getMediaAudio,
    mediaType,
    onChangeTarget,
    overlay,
    setCurrentTime,
    setSeekTo,
    spatialTarget,
    target,
    timeTarget,
    windowId,
  },
) {
  console.log('targetFS', target);
  if (!target) {
    target = {};
    if (mediaType === manifestTypes.VIDEO) {
      const mediaVideo = VideosReferences.get(windowId);
      target.tstart = currentTime || 0;
      target.tend = mediaVideo.props.canvas.__jsonld.duration ? mediaVideo.props.canvas.__jsonld.duration : 0;
    }

    // TODO Check if its possible to use overlay ?
    switch (mediaType) {
      case manifestTypes.IMAGE:
        // TODO set default xywh
        target.fullCanvaXYWH = '0,0,500,1000';
        break;
      case manifestTypes.VIDEO:
        const mediaVideo = VideosReferences.get(windowId);
        const targetHeigth = mediaVideo ? mediaVideo.props.canvas.__jsonld.height : 1000;
        const targetWidth = mediaVideo ? mediaVideo.props.canvas.__jsonld.width : 500;
        target.fullCanvaXYWH = `0,0,${targetWidth},${targetHeigth}`;
        break;
      default:
        break;
    }

    target.drawingState = {
      currentShape: null,
      isDrawing: false,
      shapes: [],
    };

    onChangeTarget(target);
  }

  const onChangeTimeTargetInput = (newData) => {
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

  if (mediaType === manifestTypes.IMAGE) {
    timeTarget = false;
  }

  if (mediaType === manifestTypes.AUDIO) {
    spatialTarget = false;
  }

  return (
    <Grid item container direction="column" spacing={1}>
      <Grid item>
        <Typography variant="formSectionTitle">
          Target
        </Typography>
      </Grid>
      {
        spatialTarget && (
        <Grid item container direction="column">
          <TargetSpatialInput
            xywh={target.xywh}
            svg={target.svg}
            onChange={onChangeSpatialTargetInput}
            windowId={windowId}
            mediaType={mediaType}
            targetDrawingState={target.drawingState}
            overlay={overlay}
            closeFormCompanionWindow={closeFormCompanionWindow}
          />
        </Grid>
        )
      }
      {
        timeTarget && (
          <Grid item container direction="column">
            <TargetTimeInput
              tstart={target.tstart}
              tend={target.tend}
              onChange={onChangeTimeTargetInput}
              windowId={windowId}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              setSeekTo={setSeekTo}
              getMediaAudio={getMediaAudio}
              mediaType={mediaType}
              closeFormCompanionWindow={closeFormCompanionWindow}
            />
          </Grid>
        )
        }
    </Grid>
  );
}

TargetFormSection.propTypes = {
  currentTime: PropTypes.number.isRequired,
  mediaType: PropTypes.string.isRequired,
  onChangeTarget: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  spatialTarget: PropTypes.bool.isRequired,
  target: PropTypes.object.isRequired,
  timeTarget: PropTypes.bool.isRequired,
  windowId: PropTypes.string.isRequired,
};
