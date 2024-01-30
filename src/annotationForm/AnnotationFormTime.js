import {Divider, Grid, Paper} from '@mui/material';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import { Alarm } from '@mui/icons-material';
import React from 'react';
import PropTypes from 'prop-types';
import HMSInput from '../HMSInput';
import {styled} from "@mui/material/styles";



const StyledPaper = styled(Paper)(({ theme }) => ({
  padding:"5px"
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: 'rgba(1, 0, 0, 0.38)',
}));

const StyledDivFormTimeContainer = styled('div')(({ theme }) => ({
  alignContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  padding: '5px',
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

function AnnotationFormTime({
  videoDuration, value, handleChangeTime, windowid, setTstartNow, tstart, updateTstart, setTendNow, tend, updateTend, ...props
}) {
  return (
    <>
      <StyledPaper>
      <Grid
        item
        xs={12}
      >
        <Typography id="range-slider" variant="overline">
          Target
        </Typography>
        <div>
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
        </div>
      </Grid>
      <StyledDivFormTimeContainer
      >
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
    </>
  );
}

AnnotationFormTime.propTypes = {
  handleChangeTime: PropTypes.func,
  mediaIsVideo: PropTypes.bool,
  setTendNow: PropTypes.func,
  setTstartNow: PropTypes.func,
  tend: PropTypes.any,
  tstart: PropTypes.number,
  updateTend: PropTypes.func,
  updateTstart: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.number),
  videoDuration: PropTypes.any,
  windowid: PropTypes.any,
};

export default AnnotationFormTime;
