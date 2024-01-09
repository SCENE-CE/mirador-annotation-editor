import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, styled } from '@mui/material';
import { secondsToHMSarray } from './utils';

const StyledInput = styled(Input)(({ theme }) => ({
  height: 'fit-content',
  margin: '2px',
  '& input[type=number]': {
    '-moz-appearance': 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
}));

const StyledHMSLabel = styled('span')({
  color: 'grey',
});

const StyledRoot = styled('div')({
  alignItems: 'center',
  display: 'flex',
});

function HMSInput({ seconds, onChange }) {
  const [hms, setHms] = useState(secondsToHMSarray(0));

  useEffect(() => {
      if(seconds != null) {
    setHms(secondsToHMSarray(seconds));
      }
  }, [seconds]);

  const someChange = (ev) => {
    const newState = secondsToHMSarray(Number(ev.target.value));
    setHms(newState);
    onChange(newState.hours * 3600 + newState.minutes * 60 + newState.seconds);
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
        inputProps={{ style: { textAlign: 'center' } }}
      />
      <StyledHMSLabel>h</StyledHMSLabel>
      <StyledInput
        type="number"
        min="0"
        max="59"
        name="minutes"
        value={hms.minutes}
        onChange={someChange}
        inputProps={{ style: { textAlign: 'center' } }}
      />
      <StyledHMSLabel>m</StyledHMSLabel>
      <StyledInput
        type="number"
        min="0"
        max="59"
        name="seconds"
        value={hms.seconds}
        onChange={someChange}
        inputProps={{ style: { textAlign: 'center' } }}
      />
      <StyledHMSLabel>s</StyledHMSLabel>
    </StyledRoot>
  );
}

HMSInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  seconds: PropTypes.number.isRequired,
};

export default HMSInput;
