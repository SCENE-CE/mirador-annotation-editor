import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, styled } from '@mui/material';
import { secondsToHMSarray } from './AnnotationFormUtils';

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

/** Hours minutes seconds form inputs */
function HMSInput({ seconds, onChange, duration }) {
  const [hms, setHms] = useState(secondsToHMSarray(seconds));

  useEffect(() => {
    if (seconds != null) {
      setHms(secondsToHMSarray(Number(seconds)));
    }
  }, [seconds]);

  /** Handle change on one form */
  const someChange = (ev) => {
    const { name, value } = ev.target;
    let numValue = Number(value);

    if (numValue < 0) {
      numValue = 0;
    }

    if ((name === 'minutes' || name === 'seconds') && numValue > 59) {
      numValue = 59;
    }

    const newHms = {
      ...hms,
      [name]: numValue,
    };

    let totalSeconds = newHms.hours * 3600 + newHms.minutes * 60 + newHms.seconds;

    if (totalSeconds > duration) {
      totalSeconds = duration; // Clamp to the duration
      newHms.hours = Math.floor(totalSeconds / 3600);
      newHms.minutes = Math.floor((totalSeconds % 3600) / 60);
      newHms.seconds = totalSeconds % 60;
    }

    setHms({ ...newHms }); // Ensure immutability
    onChange(totalSeconds);
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
      <StyledHMSLabel style={{ margin: '2px' }}>h</StyledHMSLabel>
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
      <StyledHMSLabel style={{ margin: '2px' }}>m</StyledHMSLabel>
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
      <StyledHMSLabel style={{ margin: '2px' }}>s</StyledHMSLabel>
    </StyledRoot>
  );
}

HMSInput.propTypes = {
  duration: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  seconds: PropTypes.number.isRequired,
};

export default HMSInput;
