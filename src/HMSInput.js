import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, styled } from '@mui/material';
import { secondsToHMSarray } from './utils';

const StyledInput = styled(Input)(({ theme }) => ({
  height: 'fit-content',
}));

const StyledHMSLabel = styled('span')({
  color: 'grey',
});

const StyledRoot = styled('div')({
  alignItems: 'center',
  display: 'flex',
});

function HMSInput({ seconds, onChange }) {
  const [hms, setHms] = useState(secondsToHMSarray(seconds));

  useEffect(() => {
      if(seconds != null) {
    setHms(secondsToHMSarray(Number(seconds)));
      }
  }, [seconds]);

  const someChange = (ev) => {
      if(!ev.target.value){
          return
      }
      hms[ev.target.name] = Number(ev.target.value)
      setHms(hms)
      onChange(hms.hours * 3600 + hms.minutes * 60 + hms.seconds);

  };

  return (
    <StyledRoot>
      <StyledInput
        variant="filled"
        type="number"
        min="0"
        name="hours"
        value={hms.hours}
        onChange={someChange}
        dir="rtl"
        inputProps={{ style: { width: '35px' } }}

      />
      <StyledHMSLabel style={{"margin": '2px',}}>h</StyledHMSLabel>
      <StyledInput
        type="number"
        min="0"
        max="59"
        name="minutes"
        value={hms.minutes}
        onChange={someChange}
        dir="rtl"
        inputProps={{ style: { width: '35px' } }}
      />
      <StyledHMSLabel style={{"margin": '2px',}}>m</StyledHMSLabel>
      <StyledInput
        type="number"
        min="0"
        max="59"
        name="seconds"
        value={hms.seconds}
        onChange={someChange}
        dir="rtl"
        inputProps={{ style: { width: '35px' } }}
      />
      <StyledHMSLabel style={{"margin": '2px',}}>s</StyledHMSLabel>
    </StyledRoot>
  );
}

HMSInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  seconds: PropTypes.number,
};

export default HMSInput;
