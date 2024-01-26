import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import { Alarm } from '@mui/icons-material';
import React from 'react';
import PropTypes from 'prop-types';
import HMSInput from '../HMSInput';

function AnnotationFormTime({
  videoDuration, value, handleChangeTime, windowid, setTstartNow, tstart, updateTstart, setTendNow, tend, updateTend, ...props
}) {
  return (
    <>
      <Grid
        item
        xs={12}
      >
        <Typography id="range-slider" variant="overline">
          Display period
        </Typography>
        <div>
          <Typography>
            {videoDuration}
          </Typography>
          <Slider
            value={value}
            onChange={handleChangeTime}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            max={Math.round(videoDuration)}
            color="secondary"
            windowid={windowid}
            sx={{
              color: 'rgba(1, 0, 0, 0.38)',
            }}
          />
        </div>
      </Grid>
      <div style={{
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '5px',
      }}
      >
        <div style={{
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'center',
          padding: '5px',
        }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          >
            <div>
              <p style={{
                fontSize: '15px',
                margin: 0,
                minWidth: '40px',
              }}
              >
                Start
              </p>
            </div>
            <ToggleButton
              value="true"
              title="Set current time"
              size="small"
              onClick={setTstartNow}
              style={{
                border: 'none',
                height: '30px',
                margin: 'auto',
                marginLeft: '0',
                marginRight: '5px',
              }}
            >
              <Alarm fontSize="small" />
            </ToggleButton>
          </div>
          <HMSInput seconds={tstart} onChange={updateTstart} />
        </div>
        <div style={{
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'center',
          padding: '5px',
        }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          >
            <div>
              <p style={{
                fontSize: '15px',
                margin: 0,
                minWidth: '40px',
              }}
              >
                End
              </p>
            </div>
            <ToggleButton
              value="true"
              title="Set current time"
              size="small"
              onClick={setTendNow}
              style={{
                border: 'none',
                height: '30px',
                margin: 'auto',
                marginLeft: '0',
                marginRight: '5px',
              }}
            >
              <Alarm fontSize="small" />
            </ToggleButton>
          </div>
          <HMSInput seconds={tend} onChange={updateTend} />
        </div>
      </div>

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
