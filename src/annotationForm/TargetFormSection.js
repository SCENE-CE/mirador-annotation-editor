import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { MEDIA_TYPES, TEMPLATE } from './AnnotationFormUtils';
import TargetTimeInput from './TargetTimeInput';
import { TargetSpatialInput } from './TargetSpatialInput';
import { playerReferences } from '../playerReferences';

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
    onChangeTarget,
    spatialTarget,
    target,
    timeTarget,
    windowId,
  },
) {
  if (!target) {
    // eslint-disable-next-line no-param-reassign
    target = {};
    if (playerReferences.getMediaType() === MEDIA_TYPES.VIDEO) {
      // eslint-disable-next-line no-param-reassign
      target.tstart = currentTime || 0;
      target.tend = playerReferences.getMediaDuration() ? Math.floor(playerReferences.getMediaDuration()) : 0;
    }

    // TODO Check if its possible to use overlay ?
    switch (playerReferences.getMediaType()) {
      case MEDIA_TYPES.IMAGE:
      case MEDIA_TYPES.VIDEO:
        const targetHeigth = playerReferences.getHeight();
        const targetWidth = playerReferences.getWidth();
        // eslint-disable-next-line no-param-reassign
        target.fullCanvaXYWH = `0,0,${targetWidth},${targetHeigth}`;
        break;
      default:
        break;
    }

    if (target.templateType !== TEMPLATE.IMAGE_TYPE
      && target.templateType !== TEMPLATE.KONVA_TYPE) {
      // eslint-disable-next-line no-param-reassign
      target.drawingState = {
        currentShape: null,
        isDrawing: false,
        shapes: [],
      };
    }

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

  if (playerReferences.getMediaType() === MEDIA_TYPES.IMAGE) {
    // eslint-disable-next-line no-param-reassign
    timeTarget = false;
  }

  if (playerReferences.getMediaType() === MEDIA_TYPES.AUDIO) {
    // eslint-disable-next-line no-param-reassign
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
            setTargetDrawingState={onChangeSpatialTargetInput}
            xywh={target.xywh}
            svg={target.svg}
            onChange={onChangeSpatialTargetInput}
            windowId={windowId}
            targetDrawingState={target.drawingState}
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
              getMediaAudio={getMediaAudio}
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
  onChangeTarget: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  spatialTarget: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  target: PropTypes.object.isRequired,
  timeTarget: PropTypes.bool.isRequired,
  windowId: PropTypes.string.isRequired,
};
