import { Divider, Grid, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import { Alarm } from '@mui/icons-material';
import React from 'react';
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
  paddingRight: '20px',
  paddingLeft: '20px',
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
function AnnotationFormTime({
  videoDuration, value, handleChangeTime, windowid, setTstartNow, tstart, updateTstart, setTendNow, tend, updateTend, ...props
}) {
  return (
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
            windowid={windowid}
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
  );
}

AnnotationFormTime.propTypes = {
  handleChangeTime: PropTypes.func.isRequired,
  mediaIsVideo: PropTypes.bool.isRequired,
  setTendNow: PropTypes.func.isRequired,
  setTstartNow: PropTypes.func.isRequired,
  tend: PropTypes.any.isRequired,
  tstart: PropTypes.number.isRequired,
  updateTend: PropTypes.func.isRequired,
  updateTstart: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  videoDuration: PropTypes.any.isRequired,
  windowid: PropTypes.any.isRequired,
};

export default AnnotationFormTime;
