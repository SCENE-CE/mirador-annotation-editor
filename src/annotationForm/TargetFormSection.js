import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { manifestTypes, template } from '../AnnotationFormUtils';
import TargetTimeInput from './TargetTimeInput';
import { Grid, Typography } from '@mui/material';


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
    onChange,
    setCurrentTime,
    setSeekTo,
    spatialTarget,
    target,
    timeTarget,
    windowId,
  },
) {


  return (
    <Grid>
      <Typography variant="overline">
        Target
      </Typography>
      {
            spatialTarget && (
            <TargetSpatialInput />
            )
        }
      {
            timeTarget && (
            <TargetTimeInput
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
