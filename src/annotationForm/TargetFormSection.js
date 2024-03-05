import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import {
  geomFromAnnoTarget,
  manifestTypes,
  template,
  timeFromAnnoTarget,
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

  console.log('targetFormSection target', target);

  const onChangeXywh = (newXywh) => {
    console.log('TODO in development');
  };

  const onChangeTargetInput = (newData) => {
    onChangeTarget(newData);
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
              setXywh={onChangeTargetInput}
            />
            )
        }
      {
            timeTarget && (
            <TargetTimeInput
              tstart={target.tstart}
              tend={target.tend}
              onChange={onChangeTargetInput}
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
  target: PropTypes.shape({
    t: PropTypes.number,
    xywh: PropTypes.string,
  }).isRequired,
};
