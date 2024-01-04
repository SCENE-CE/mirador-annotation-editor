import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

// eslint-disable-next-line require-jsdoc
function valuetext(value) {
  return `${value}°C`;
}

export default function RangeSlider({max, valueTime, windowId, onChange}) {
  const [value, setValue] = React.useState(valueTime);
  // eslint-disable-next-line require-jsdoc
  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        max = {max}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        windowId={windowId}
        sx={{
            color: 'rgba(1, 0, 0, 0.38)',
        }}
      />
    </Box>
  );
}
