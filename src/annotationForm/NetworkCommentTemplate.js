import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'draft-js/lib/uuid';
import { Grid } from '@mui/material';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import ManifestNetworkFormSection from './ManifestNetworkFormSection';
import { TEMPLATE } from './AnnotationFormUtils';
import AnnotationFormFooter from './AnnotationFormFooter';
import { resizeKonvaStage } from './AnnotationFormOverlay/KonvaDrawing/KonvaUtils';

/** Form part for edit annotation content and body */
function NetworkCommentTemplate(
  {
    annotation,
    closeFormCompanionWindow,
    playerReferences,
    saveAnnotation,
    t,
    windowId,
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
        templateType: TEMPLATE.MANIFEST_TYPE,
      },
      motivation: 'commenting',
      target: null,
    };
  } else if (maeAnnotation.maeData.target.drawingState && typeof maeAnnotation.maeData.target.drawingState === 'string') {
    maeAnnotation.maeData.target.drawingState = JSON.parse(
      maeAnnotation.maeData.target.drawingState,
    );
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

  function getBaseAnnotation(id) {
    if(!id) {
      return null;
    }
    const match = id.match(
      /((http|https|localStorage)\:\/\/[a-z0-9\/:%_+.,#?!@&=-]+)#((http|https)\:\/\/[a-z0-9\/:%_+.,#?!@&=-]+)/gi,
    );

    return match ? match[0].split('#').slice(1) : id;
  }

  /** SaveFunction for Manifest* */
  const saveFunction = () => {
    resizeKonvaStage(
      windowId,
      playerReferences.getMediaTrueWidth(),
      playerReferences.getMediaTrueHeight(),
      1 / playerReferences.getScale(),
    );

    console.log(annotationState.id);
    const baseAnnotation = getBaseAnnotation(annotationState.id);
    console.log("base" , baseAnnotation);
    if (baseAnnotation) {
      annotationState.id = `${getBaseAnnotation(annotationState.id)}#${annotation.maeData.manifestNetwork}`;
    }
    console.log(annotationState.id);

    saveAnnotation(annotationState);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <ManifestNetworkFormSection
          manifestNetwork={annotation.maeData.manifestNetwork}
          onChange={updateManifestNetwork}
          t={t}
        />
      </Grid>
      <Grid item>
        <TextFormSection
          annoHtml={annotationState.body.value}
          updateAnnotationBody={updateAnnotationTextBody}
          t={t}
        />
      </Grid>
      <TargetFormSection
        onChangeTarget={updateTargetState}
        playerReferences={playerReferences}
        spatialTarget
        t={t}
        target={annotationState.maeData.target}
        timeTarget
        windowId={windowId}
      />
      <Grid item>
        <AnnotationFormFooter
          closeFormCompanionWindow={closeFormCompanionWindow}
          saveAnnotation={saveFunction}
          t={t}
        />
      </Grid>
    </Grid>
  );
}

NetworkCommentTemplate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  annotation: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  closeFormCompanionWindow: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  playerReferences: PropTypes.object.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default NetworkCommentTemplate;
