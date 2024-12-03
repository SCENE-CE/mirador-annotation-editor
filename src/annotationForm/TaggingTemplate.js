import React, { useState } from 'react';
import { Grid, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import AnnotationFormFooter from './AnnotationFormFooter';
import { template } from './AnnotationFormUtils';
import TargetFormSection from './TargetFormSection';

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

  /** Update annotation with Tag Value * */
  const updateTaggingValue = (newTextValue) => {
    const newBody = annotationState.body;
    newBody.value = newTextValue;
    setAnnotationState({
      ...annotationState,
      body: newBody,
    });
  };

  /** Update Target State * */
  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  /** Save function * */
  const saveFunction = () => {
    saveAnnotation(annotationState);
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
          windowId={windowId}
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
  annotationState: PropTypes.shape({
    body: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
      }),
    ),
    maeData: PropTypes.shape({
      target: PropTypes.string,
      templateType: PropTypes.string,
    }),
  }).isRequired,
  setAnnotationState: PropTypes.func.isRequired,
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
