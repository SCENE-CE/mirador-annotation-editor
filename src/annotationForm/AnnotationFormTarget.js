import { Grid, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import HMSInput from '../HMSInput';

const StyledTargetContainer = styled('div')(({ theme }) => ({
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
const StyledFieldset = styled('fieldset')(({ theme }) => ({
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
}));

const MainTitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.8em',
}));

/** Form part with time mangement, dual slider + double input. Mange Tstart and Tend value */
function AnnotationFormTarget({
  videoDuration,
  value,
  windowid,
  tstart,
  tend,
  mediaIsVideo,
  setState,
  setSeekTo,
  setCurrentTime,
}) {
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
    updateTstart(timeStart);
    updateTend(timeEnd);
    seekToTstart();
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

  return (
    <>
      { mediaIsVideo && (
        <StyledTargetContainer>
          <Grid
            item
            xs={12}
          >
            <MainTitleTypography id="range-slider" variant="overline" component="h1">
              Target
            </MainTitleTypography>
            <ContainerSlider>
              <StyledSlider
                size="small"
                value={value}
                onChange={handleChangeTime}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                max={Math.round(videoDuration)}
                color="secondary"
                windowid={windowid}
              />
            </ContainerSlider>
          </Grid>
          <StyledDivFormTimeContainer>
            <StyledFieldset>
              <legend>
                <Typography variant="overline" component="h2">
                  Start
                </Typography>
              </legend>
              <HMSInput seconds={tstart} onChange={updateTstart} />
            </StyledFieldset>
            <StyledFieldset>
              <legend>
                <Typography variant="overline" component="h2">
                  End
                </Typography>
              </legend>
              <HMSInput seconds={tend} onChange={updateTend} />
            </StyledFieldset>
          </StyledDivFormTimeContainer>
        </StyledTargetContainer>
      )}
    </>

  );
}

AnnotationFormTarget.propTypes = {
  currentTime: PropTypes.number.isRequired,
  mediaIsVideo: PropTypes.bool.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  tend: PropTypes.number.isRequired,
  tstart: PropTypes.number.isRequired,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  videoDuration: PropTypes.number.isRequired,
  windowid: PropTypes.string.isRequired,
};

export default AnnotationFormTarget;
