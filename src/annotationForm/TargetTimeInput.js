import { Grid, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import { Alarm } from '@mui/icons-material';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import HMSInput from '../HMSInput';

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '5px',
}));

const ContainerSlider = styled('div')(({ theme }) => ({
  paddingLeft: '20px',
  paddingRight: '20px',
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
  videoDuration,
  value,
  windowId,
  tstart,
  tend,
  setState,
  currentTime,
  setSeekTo,
  setCurrentTime,
  mediaVideo
}) {

  const mediaIsVideo = mediaVideo !== undefined;
  if (mediaIsVideo && valueTime) {
    valueTime[0] = tstart;
    valueTime[1] = tend;
  }
  /** set annotation start time to current time */
  const setTstartNow = () => {
    setState((prevState) => ({
      ...prevState,
      tstart: Math.floor(currentTime),
    }));
  };

  /** set annotation end time to current time */
  const setTendNow = () => {
    setState((prevState) => ({
      ...prevState,
      tend: Math.floor(currentTime),
    }));
  };

  /**
   * @param {number} newValueTime
   */
  const setValueTime = (newValueTime) => {
    setState((prevState) => ({
      ...prevState,
      valueTime: newValueTime,
    }));
  };

  /**
   * Change from slider
   * @param {Event} event
   * @param {number} newValueTime
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
      updateTend(timeEnd);
      seekToTend();
    }
    setValueTime(newValueTime);
  };

  /** Change from Tstart HMS Input */
  const updateTstart = (valueTstart) => {
    if (valueTstart > tend) {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      tstart: valueTstart,
      ...setSeekTo(valueTstart),
      ...setCurrentTime(valueTstart),

    }));
  };

  /** update annotation end time */
  const updateTend = (valueTend) => {
    setState((prevState) => ({
      ...prevState,
      tend: valueTend,
      ...setSeekTo(valueTend),
      ...setCurrentTime(valueTend),
    }));
  };

  /**
   * Set the video player to the start of the annotation
    */
  const seekToTstart = () => {
    setState((prevState) => ({
      ...prevState,
      ...setSeekTo(prevState.tstart),
      ...setCurrentTime(prevState.tstart),
    }));
  };

  /**
   * Seeks to the tend time and updates state accordingly.
   * @function seekToTend
   */
  const seekToTend = () => {
    setState((prevState) => ({
      ...prevState,
      ...setSeekTo(prevState.tend),
      ...setCurrentTime(prevState.tend),
    }));
  };

  return (
    <>
      { mediaIsVideo && (
        <StyledPaper>
          <Grid
            item
            xs={12}
          >
            <Typography id="range-slider" variant="overline">
              Target
            </Typography>
            <ContainerSlider>
              <StyledSlider
                size="small"
                value={value}
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
        </StyledPaper>
      )}
    </>

  );
}

TargetTimeInput.propTypes = {
  currentTime: PropTypes.number.isRequired,
  mediaIsVideo: PropTypes.bool.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  tend: PropTypes.number.isRequired,
  tstart: PropTypes.number.isRequired,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  videoDuration: PropTypes.number.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default TargetTimeInput;
