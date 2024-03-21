import Typography from '@mui/material/Typography';
import { Grid, setRef } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

/** Debug Component * */
export function Debug(
  {
    drawingState,
    overlay,
    scale,
  },
) {
  const [updateComp, setUpdateComp] = useState(drawingState);
  const jsonEditorRef = useRef(null);

  const setRef = (instance) => {
    if (instance) {
      jsonEditorRef.current = instance.jsonEditor;
    } else {
      jsonEditorRef.current = null;
    }
  };

  useEffect(() => {
    console.log('--------------New Render--------------');
    console.log('canvas Width:', overlay.canvasWidth);
    console.log('canvas Height:', overlay.canvasHeight);
    console.log('overlay.containerWidth', overlay.containerWidth);
    console.log('overlay.containerHeight', overlay.containerHeight);
    console.log('drawingState', drawingState);
    console.log('-------------End of Render---------------');
  }, [drawingState, scale, overlay, updateComp]);

  useEffect(() => {
    if (jsonEditorRef.current !== null) {
      jsonEditorRef.current.set(drawingState);
    }
  }, [drawingState]);

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
      <Grid item sx={{ height: '500px' }}>
        <Editor
          ref={setRef}
          value={drawingState}
          ace={ace}
          theme="ace/theme/github"
          mode="code"
          statusBar
          htmlElementProps={{
            style: {
              height: 500,
            },
          }}
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
