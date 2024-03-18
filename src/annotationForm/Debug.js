import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

export function Debug({ overlay, scale, drawingState}) {
  return <>
    <Typography variant="formSectionTitle">
      Debug
    </Typography>
    <Paper>
      Canvas size :
      {overlay.canvasWidth} : {overlay.canvasHeight}
      <br/>
      Container size :
      {overlay.containerWidth} : {overlay.containerHeight}
      <br/>
      Scale :
      {scale}
      <br/>
      Current shape
      {drawingState.currentShape && JSON.stringify(drawingState.currentShape)}
    </Paper>
  </>;
}

Debug.propTypes = {
  overlay: PropTypes.any,
  scale: PropTypes.number,
  drawingState: PropTypes.any
};
