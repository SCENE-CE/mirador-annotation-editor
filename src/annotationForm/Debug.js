import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import PropTypes from 'prop-types';
import { mediaTypes } from './AnnotationFormUtils';
import {playerReferences} from "../playerReferences";

/** Debug Component * */
export function Debug(
  {
    drawingState,
    scale,
  },
) {
  const [updateComp, setUpdateComp] = useState(drawingState);
  const jsonEditorRef = useRef(null);
/** update the jsonEditor dynamicly **/
  const setRef = (instance) => {
    if (instance) {
      jsonEditorRef.current = instance.jsonEditor;
    } else {
      jsonEditorRef.current = null;
    }
  };
  /**check if mediaType = video and if it is set border around video**/
  if (playerReferences.getMediaType() === mediaTypes.VIDEO) {
    const videoElement = document.querySelector('video');
    const parentVideoElement = videoElement.parentElement;
    const grandParentVideoElement = parentVideoElement.parentElement;
    videoElement.style.border = 'solid blue';
    parentVideoElement.style.border = 'solid red';
    grandParentVideoElement.style.border = 'solid green';
  }

  useEffect(() => {
    console.log('--------------New Render--------------');
    console.log('canvas Width:', playerReferences.getCanvasWidth());
    console.log('canvas Height:', playerReferences.getCanvasHeight());
    console.log('overlay.containerWidth', playerReferences.getContainerWidth());
    console.log('overlay.containerHeight', playerReferences.getContainerHeight());
    console.log('drawingState', drawingState);
    console.log('-------------End of Render---------------');
  }, [drawingState, scale, updateComp]);

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
          {playerReferences.getCanvasWidth()}
          {' '}
          x
          {' '}
          {playerReferences.getCanvasHeight()}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="subFormSectionTitle">
          Container size :
          {' '}
          {playerReferences.getContainerWidth()}
          {' '}
          x
          {playerReferences.getContainerHeight()}
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
  scale: PropTypes.string.isRequired,
};
