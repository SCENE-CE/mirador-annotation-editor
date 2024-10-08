import React, { useState } from 'react';
import { Grid, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import AnnotationFormFooter from './AnnotationFormFooter';
import { mediaTypes, template } from './AnnotationFormUtils';
import { maeTargetToIiifTarget } from '../IIIFUtils';
import TargetFormSection from './TargetFormSection';
import { getSvg } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import {playerReferences} from "../playerReferences";

/** Tagging Template* */
export default function TaggingTemplate(
  {
    annotation,
    closeFormCompanionWindow,
    currentTime,
    debugMode,
    getMediaAudio,
    mediaType,
    overlay,
    saveAnnotation,
    setCurrentTime,
    setSeekTo,
    windowId,
  },
) {
  let maeAnnotation = annotation;

  if (!maeAnnotation.id) {
    // If the annotation does not have maeData, the annotation was not created with mae
    maeAnnotation = {
      body: {
        type: 'Image',
        value: '',
      },
      maeData: {
        target: null,
        templateType: template.TAGGING_TYPE,
      },
      motivation: 'tagging',
      target: null,
    };
  } else if (maeAnnotation.maeData.target.drawingState && typeof maeAnnotation.maeData.target.drawingState === 'string') {
    maeAnnotation.maeData.target.drawingState = JSON.parse(
      maeAnnotation.maeData.target.drawingState,
    );
  }

  const [annotationState, setAnnotationState] = useState(maeAnnotation);

  /** Update Target State * */
  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  /** Update annotation with Tag Value * */
  const updateTaggingValue = (newTextValue) => {
    const newBody = annotationState.body;
    newBody.value = newTextValue;
    setAnnotationState({
      ...annotationState,
      body: newBody,
    });
  };

  /** Save function * */
  const saveFunction = () => {
    // TODO This code is not DRY, it's the same as in TextCommentTemplate.js
    if (mediaType !== mediaTypes.AUDIO) {
      const promises = playerReferences.getCanvases().map(async (canvas) => {
        // Adapt target to the canvas
        // eslint-disable-next-line no-param-reassign
        console.log(annotation.maeData);
        annotationState.maeData.target.svg = await getSvg(windowId);
        const overlay = playerReferences.getOverlay();
        annotationState.maeData.target.scale = playerReferences.getHeight() / playerReferences.getDisplayedImageHeight() * playerReferences.getZoom();
        console.log('annotationState.maeData.target.scale', annotationState.maeData.target.scale);
        // annotationState.maeData.target.dataUrl = await getKonvaAsDataURL(windowId);
        annotationState.target = maeTargetToIiifTarget(annotationState.maeData.target, canvas.id);
        annotationState.maeData.target.drawingState = JSON.stringify(
          annotationState.maeData.target.drawingState,
        );
        console.log('annotationState', annotationState.target);
        // delete annotationState.maeData.target;
        return saveAnnotation(annotationState, canvas.id);
      });
      Promise.all(promises).then(() => {
        closeFormCompanionWindow();
      });
    }
    // TODO: Proper save for AUDIO media's annotation
    if (mediaType === mediaTypes.AUDIO) {
      console.log('TODO: Proper save for AUDIO media\'s annotation');
      closeFormCompanionWindow();
    }
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="formSectionTitle">Tag</Typography>
      </Grid>
      <Grid item>
        <TextField
          id="outlined-basic"
          label="Your tag here :"
          value={annotationState.body.value}
          variant="outlined"
          onChange={(event) => updateTaggingValue(event.target.value)}
        />
      </Grid>
      <Grid item>
        <TargetFormSection
          currentTime={currentTime}
          mediaType={mediaType}
          onChangeTarget={updateTargetState}
          setCurrentTime={setCurrentTime}
          setSeekTo={setSeekTo}
          spatialTarget
          target={annotationState.maeData.target}
          timeTarget
          windowId={windowId}
          closeFormCompanionWindow={closeFormCompanionWindow}
          getMediaAudio={getMediaAudio}
          debugMode={debugMode}
        />
      </Grid>
      <Grid item>
        <AnnotationFormFooter
          closeFormCompanionWindow={closeFormCompanionWindow}
          saveAnnotation={saveFunction}
        />
      </Grid>
    </Grid>
  );
}

TaggingTemplate.propTypes = {
  annotation: PropTypes.shape({
    adapter: PropTypes.func,
    body: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
      }),
    ),
    defaults: PropTypes.objectOf(
      PropTypes.oneOfType(
        [PropTypes.bool, PropTypes.func, PropTypes.number, PropTypes.string],
      ),
    ),
    drawingState: PropTypes.string,
    manifestNetwork: PropTypes.string,
    target: PropTypes.string,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  getMediaAudio: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  saveAnnotation: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};
