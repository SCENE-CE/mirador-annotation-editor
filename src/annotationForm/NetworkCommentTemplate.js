import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'draft-js/lib/uuid';
import { Grid } from '@mui/material';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import ManifestNetworkFormSection from './ManifestNetworkFormSection';
import { maeTargetToIiifTarget, template } from '../AnnotationFormUtils';
import AnnotationFormFooter from './AnnotationFormFooter';

/** Form part for edit annotation content and body */
function NetworkCommentTemplate(
  {
    annotation,
    currentTime,
    mediaType,
    setCurrentTime,
    setSeekTo,
    windowId,
    saveAnnotation,
    closeFormCompanionWindow,
    canvases,
    getMediaAudio,
    overlay,
  },
) {
  let maeAnnotation = annotation;

  if (!maeAnnotation.id) {
    // If the annotation does not have maeData, the annotation was not created with mae
    maeAnnotation = {
      body: {
        id: uuid(),
        type: 'TextualBody',
        value: '',
      },
      maeData: {
        manifestNetwork: '',
        target: null,
        templateType: template.MANIFEST_TYPE,
      },
      motivation: 'commenting',
      target: null,
    };
  }

  const [annotationState, setAnnotationState] = useState(maeAnnotation);

  /** Update annotationState with manifestData * */
  const updateManifestNetwork = (manifestNetwork) => {
    // TODO probably can be simplified
    const newMaeData = annotationState.maeData;
    newMaeData.manifestNetwork = manifestNetwork;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  /**
   * Update the annotation's Body
   * */
  const updateAnnotationTextBody = (newTextValue) => {
    const newBody = annotationState.body;
    newBody.value = newTextValue;
    setAnnotationState({
      ...annotationState,
      body: newBody,
    });
  };

  /** Update annotationState with Target * */
  const updateTargetState = (target) => {
    const newMaeData = annotationState.maeData;
    newMaeData.target = target;
    setAnnotationState({
      ...annotationState,
      maeData: newMaeData,
    });
  };

  /** SaveFunction for Manifest* */
  const saveFunction = () => {
    canvases.forEach(async (canvas) => {
      // Adapt target to the canvas
      // eslint-disable-next-line no-param-reassign
      annotationState.target = maeTargetToIiifTarget(annotationState.maeData.target, canvas.id);
      saveAnnotation(annotationState, canvas.id);
    });
    closeFormCompanionWindow();
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <ManifestNetworkFormSection
          manifestNetwork={annotation.maeData.manifestNetwork}
          onChange={updateManifestNetwork}
        />
      </Grid>
      <Grid item>
        <TextFormSection
          annoHtml={annotationState.body.value}
          updateAnnotationBody={updateAnnotationTextBody}
        />
      </Grid>
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
        overlay={overlay}
      />
      <Grid item>
        <AnnotationFormFooter
          closeFormCompanionWindow={closeFormCompanionWindow}
          saveAnnotation={saveFunction}
        />
      </Grid>
    </Grid>
  );
}

NetworkCommentTemplate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  annotation: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  getMediaAudio: PropTypes.object.isRequired,
  mediaType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default NetworkCommentTemplate;
