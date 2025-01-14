import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import { Alarm } from '@mui/icons-material';
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import HMSInput from './HMSInput';
import { MEDIA_TYPES } from './AnnotationFormUtils';

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: 'rgba(1, 0, 0, 0.38)',
}));

const StyledLabelSelector = styled('p')(({ theme }) => ({
  fontSize: '15px',
  margin: 0,
  minWidth: '40px',
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: 'none',
  height: '30px',
  margin: 'auto',
  marginLeft: '0',
  marginRight: '5px',
}));

/** Form part with time mangement, dual slider + double input. Mange Tstart and Tend value */
function TargetTimeInput({
  onChange,
playerReferences,
  tend,
  tstart,
  windowId,
}) {
  let duration;

  if (playerReferences.getMediaType() === MEDIA_TYPES.VIDEO
    || playerReferences.getMediaType() === MEDIA_TYPES.AUDIO) {
    duration = playerReferences.getMediaDuration();
  }

  let audioElement;

  if (playerReferences.getMediaType() === MEDIA_TYPES.AUDIO) {
    audioElement = playerReferences.getAudioElement();
  }

  /** set annotation start time to current time */
  const setTstartNow = () => {
    onChange({
      tstart: Math.floor(playerReferences.getCurrentTime()),
    });
  };

  /** set annotation end time to current time */
  const setTendNow = () => {
    onChange({
      tend: Math.floor(playerReferences.getCurrentTime()),
    });
  };

  // TODO: Décomposer cette fonction pour que la maj des
  //  state se face au onChange et l'appelle a seekToTstart /
  // end se face au 'onChangeCommitted' mui propriété afin d'éviter l'effet indésiré sur la vidéo
  /**
   * Change from slider
   * @param {Event} event
   * @param {any} newValueTime
   */
  const handleChangeTime = (event, newValueTime) => {
    const timeStart = newValueTime[0];
    const timeEnd = newValueTime[1];
    if (timeStart !== tstart) {
      updateTstart(timeStart);
    }
    if (timeEnd !== tend) {
      updateTend(timeEnd);
    }
  };

  /** Change from Tstart HMS Input */
  const updateTstart = (valueTstart) => {
    if (valueTstart > tend) {
      return;
    }
    if (audioElement) {
      audioElement.currentTime = valueTstart;
    }
    onChange({
      tstart: valueTstart,
      ...playerReferences.setSeekTo(valueTstart),
      ...playerReferences.setCurrentTime(valueTstart),
    });
  };

  /** update annotation end time */
  const updateTend = (valueTend) => {
    if (audioElement) {
      audioElement.currentTime = valueTend;
    }
    onChange({
      tend: valueTend,
      ...playerReferences.setSeekTo(valueTend),
      ...playerReferences.setCurrentTime(valueTend),
    });
  };

  return (
    <Grid container direction="column" spacing={1}>
      <Grid
        item
        container
        direction="column"
        spacing={1}
      >
        <Grid item>
          <Typography variant="subFormSectionTitle">Time</Typography>
        </Grid>
        <Grid container item>
          <StyledSlider
            sx={{
              marginLeft: '5px',
              width: '90%',
            }}
            size="small"
            value={[tstart, tend]}
            onChange={handleChangeTime}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            max={Math.round(duration)}
            color="secondary"
            windowId={windowId}
          />
        </Grid>
      </Grid>
      <Grid item container spacing={2} direction="column">
        <Grid item container>
          <Grid item container direction="column" xs={3}>
            <Grid
              item
              alignItems="center"
            >
              <StyledLabelSelector>
                Start
              </StyledLabelSelector>
            </Grid>
            <Grid item>
              <StyledToggleButton
                value="true"
                title="Set current time"
                size="small"
                onClick={setTstartNow}
              >
                <Alarm fontSize="small" />
              </StyledToggleButton>
            </Grid>
          </Grid>
          <HMSInput seconds={tstart} onChange={updateTstart} duration={duration} />
        </Grid>
        <Grid item container>
          <Grid
            item
            container
            direction="column"
            xs={3}
          >
            <Grid
              item
              alignItems="center"
            >
              <StyledLabelSelector>
                End
              </StyledLabelSelector>
            </Grid>
            <Grid item>
              <StyledToggleButton
                value="true"
                title="Set current time"
                size="small"
                onClick={setTendNow}
              >
                <Alarm fontSize="small" />
              </StyledToggleButton>
            </Grid>
          </Grid>
          <HMSInput seconds={tend} onChange={updateTend} />
        </Grid>
      </Grid>
    </Grid>
  );
}

TargetTimeInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  playerReferences: PropTypes.object.isRequired,
  tend: PropTypes.number.isRequired,
  tstart: PropTypes.number.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default TargetTimeInput;
