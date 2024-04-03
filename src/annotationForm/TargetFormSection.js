import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { mediaTypes } from '../AnnotationFormUtils';
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
    debugMode,
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
    helloWorld,
  },
) {
  if (!target) {
    // eslint-disable-next-line no-param-reassign
    target = {};
    if (mediaType === mediaTypes.VIDEO) {
      const mediaVideo = VideosReferences.get(windowId);
      // eslint-disable-next-line no-param-reassign
      target.tstart = currentTime || 0;
      // eslint-disable-next-line max-len,no-underscore-dangle,no-param-reassign
      target.tend = mediaVideo.props.canvas.__jsonld.duration ? Math.floor(mediaVideo.props.canvas.__jsonld.duration) : 0;
    }

    // TODO Check if its possible to use overlay ?
    switch (mediaType) {
      case mediaTypes.IMAGE:
        // TODO set default xywh
        // eslint-disable-next-line no-param-reassign
        target.fullCanvaXYWH = '0,0,500,1000';
        break;
      case mediaTypes.VIDEO:
        // eslint-disable-next-line no-case-declarations
        const mediaVideo = VideosReferences.get(windowId);
        // eslint-disable-next-line no-underscore-dangle,no-case-declarations
        const targetHeigth = mediaVideo ? mediaVideo.props.canvas.__jsonld.height : 1000;
        // eslint-disable-next-line no-underscore-dangle,no-case-declarations
        const targetWidth = mediaVideo ? mediaVideo.props.canvas.__jsonld.width : 500;
        // eslint-disable-next-line no-param-reassign
        target.fullCanvaXYWH = `0,0,${targetWidth},${targetHeigth}`;
        break;
      default:
        break;
    }

    // eslint-disable-next-line no-param-reassign
    target.drawingState = {
      currentShape: null,
      isDrawing: false,
      shapes: [],
    };

    onChangeTarget(target);
  }

  /** Handle timeTargetInput * */
  const onChangeTimeTargetInput = (newData) => {
    onChangeTarget({
      ...target,
      ...newData,
    });
  };
  /** Handle spatialTarget Changes * */
  const onChangeSpatialTargetInput = (newData) => {
    onChangeTarget({
      ...target,
      ...newData,
    });
  };

  if (mediaType === mediaTypes.IMAGE) {
    // eslint-disable-next-line no-param-reassign
    timeTarget = false;
  }

  if (mediaType === mediaTypes.AUDIO) {
    // eslint-disable-next-line no-param-reassign
    spatialTarget = false;
  }

  console.log(helloWorld);
  return (
    <Grid item container direction="column" spacing={1}>
      <Grid item>
        <Typography variant="formSectionTitle">
          Target
        </Typography>
        <Typography>
          {helloWorld}
        </Typography>
        <Typography>
          toto
        </Typography>
      </Grid>
      {
        spatialTarget && (
        <Grid item container direction="column">
          <TargetSpatialInput
            setTargetDrawingState={onChangeSpatialTargetInput}
            xywh={target.xywh}
            svg={target.svg}
            onChange={onChangeSpatialTargetInput}
            windowId={windowId}
            mediaType={mediaType}
            targetDrawingState={target.drawingState}
            overlay={overlay}
            closeFormCompanionWindow={closeFormCompanionWindow}
            debugMode={debugMode}
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
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  getMediaAudio: PropTypes.object.isRequired,
  helloWorld: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  onChangeTarget: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  spatialTarget: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  target: PropTypes.object.isRequired,
  timeTarget: PropTypes.bool.isRequired,
  windowId: PropTypes.string.isRequired,
};
