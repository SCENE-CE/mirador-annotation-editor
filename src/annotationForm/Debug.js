import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

export function Debug(
  {
    drawingState,
    overlay,
    scale,
  },
) {
  const [updateComp, setUpdateComp] = useState(drawingState);

  useEffect(() => {
    console.log(drawingState);
  }, [drawingState, scale, overlay, updateComp]);

  const UpdateComponent = () => {
    setUpdateComp(drawingState);
  };

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Typography variant="formSectionTitle">
          Debug
        </Typography>
      </Grid>
      {/* <Grid/> */}
      {/* <Grid item container direction="column" spacing={1}> */}
      <Grid item>
        <Typography variant="subFormSectionTitle">
          Canvas size :
          {' '}
          {overlay.canvasWidth}
          {' '}
          x
          {' '}
          {overlay.canvasHeight}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="subFormSectionTitle">
          Container size :
          {' '}
          {overlay.containerWidth}
          {' '}
          x
          {overlay.containerHeight}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="subFormSectionTitle">
          Scale :
          {' '}
          {scale}
        </Typography>
      </Grid>
      {
              drawingState.currentShape && (
              <>
                <Grid item>
                  <Typography variant="subFormSectionTitle">
                    id :
                    {' '}
                    {drawingState.currentShape.id}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subFormSectionTitle">
                    Height :
                    {' '}
                    {drawingState.currentShape.height}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subFormSectionTitle">
                    Width :
                    {' '}
                    {drawingState.currentShape.width}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subFormSectionTitle">
                    x :
                    {' '}
                    {drawingState.currentShape.x}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subFormSectionTitle">
                    y :
                    {' '}
                    {drawingState.currentShape.y}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subFormSectionTitle">
                    scaleX :
                    {' '}
                    {drawingState.currentShape.scaleX}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subFormSectionTitle">
                    strokeWidth :
                    {' '}
                    {drawingState.currentShape.strokeWidth}
                  </Typography>
                </Grid>
              </>
              )
          }
      <Button onClick={UpdateComponent}>Update Editor</Button>
      <Grid item>
        <Editor
          value={drawingState}
          ace={ace}
          theme="ace/theme/github"
        />
      </Grid>
    </Grid>
  );
}

Debug.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  drawingState: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  scale: PropTypes.string.isRequired,
};
