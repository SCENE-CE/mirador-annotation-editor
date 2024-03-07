import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import { Alarm } from '@mui/icons-material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import HMSInput from '../HMSInput';

const StyledDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '5px',
}));

const ContainerSlider = styled('div')(({ theme }) => ({
  padding: '15px',
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: 'rgba(1, 0, 0, 0.38)',
}));

const StyledDivFormTimeContainer = styled('div')(({ theme }) => ({
  alignContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
}));
const StyledDivTimeSelector = styled('div')(({ theme }) => ({
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  padding: '5px',
}));

const StyledDivToggleButton = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
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
  windowId,
  currentTime,
  setSeekTo,
  setCurrentTime,
  tstart,
  tend,
  onChange,
}) {
  const mediaVideo = VideosReferences.get(windowId);
  // eslint-disable-next-line no-underscore-dangle
  const videoDuration = mediaVideo.props.canvas.__jsonld.duration;

  /** set annotation start time to current time */
  const setTstartNow = () => {
    onChange({
      tstart: Math.floor(currentTime),
    });
  };

  /** set annotation end time to current time */
  const setTendNow = () => {
    onChange({
      tend: Math.floor(currentTime),
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
      seekToTstart();
    }
    if (timeEnd !== tend) {
      updateTend(timeEnd);
      seekToTend();
    }
  };

  /** Change from Tstart HMS Input */
  const updateTstart = (valueTstart) => {
    if (valueTstart > tend) {
      return;
    }
    onChange({
      tstart: valueTstart,
      ...setSeekTo(valueTstart),
      ...setCurrentTime(valueTstart),
    });
  };

  /** update annotation end time */
  const updateTend = (valueTend) => {
    onChange({
      tend: valueTend,
      ...setSeekTo(valueTend),
      ...setCurrentTime(valueTend),
    })
  };

  /**
   * Set the video player to the start of the annotation
    */
  const seekToTstart = () => {
    onChange({
      ...setSeekTo(tstart),
      ...setCurrentTime(tstart),
    });
  };

  /**
   * Seeks to the tend time and updates state accordingly.
   * @function seekToTend
   */
  const seekToTend = () => {
    onChange({
      ...setSeekTo(tend),
      ...setCurrentTime(tend),
    });
  };

  return (
    <StyledDiv>
      <Grid
        item
        xs={12}
      >
        <ContainerSlider>
          <StyledSlider
            size="small"
            value={[tstart, tend]}
            onChange={handleChangeTime}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            max={Math.round(videoDuration)}
            color="secondary"
            windowId={windowId}
          />
        </ContainerSlider>
      </Grid>
      <StyledDivFormTimeContainer>
        <StyledDivTimeSelector>
          <StyledDivToggleButton>
            <div>
              <StyledLabelSelector>
                Start
              </StyledLabelSelector>
            </div>
            <StyledToggleButton
              value="true"
              title="Set current time"
              size="small"
              onClick={setTstartNow}
            >
              <Alarm fontSize="small" />
            </StyledToggleButton>
          </StyledDivToggleButton>
          <HMSInput seconds={tstart} onChange={updateTstart} />
        </StyledDivTimeSelector>
        <StyledDivTimeSelector>
          <StyledDivToggleButton>
            <div>
              <StyledLabelSelector>
                End
              </StyledLabelSelector>
            </div>
            <StyledToggleButton
              value="true"
              title="Set current time"
              size="small"
              onClick={setTendNow}
            >
              <Alarm fontSize="small" />
            </StyledToggleButton>
          </StyledDivToggleButton>
          <HMSInput seconds={tend} onChange={updateTend} />
        </StyledDivTimeSelector>
      </StyledDivFormTimeContainer>
    </StyledDiv>

  );
}

TargetTimeInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  tend: PropTypes.number.isRequired,
  tstart: PropTypes.number.isRequired,
  currentTime: PropTypes.number.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default TargetTimeInput;
