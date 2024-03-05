import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  geomFromAnnoTarget,
  template, timeFromAnnoTarget,
} from './AnnotationFormUtils';
import TextCommentTemplate from './annotationForm/TextCommentTemplate';
import ImageCommentTemplate from './annotationForm/ImageCommentTemplate';
import NetworkCommentTemplate from './annotationForm/NetworkCommentTemplate';
import DrawingTemplate from './annotationForm/DrawingTemplate';
import IIIFTemplate from './annotationForm/IIIFTemplate';
/**
 * This function contain the logic for loading annotation and render proper template type
 * * */
export default function AnnotationFormBody(
  {
    annotation,
    templateType,
    currentTime,
    manifestType,
    mediaVideo,
    overlay,
    setCurrentTime,
    setSeekTo,
    windowId,
    closeFormCompanionWindow,
    saveAnnotation,
    canvases,
  },
) {


  console.log('afb annotation', annotation);
  console.log('afb templateType', templateType);
  // Initial state setup
  const [state, setState] = useState(() => {
    let tstart;
    let tend;
    const annoState = {};
    if (annotation.id) {
      // annotation body
      if (Array.isArray(annotation.body)) {
        annoState.tags = [];
        annotation.body.forEach((body) => {
          if (body.purpose === 'tagging' && body.type === 'TextualBody') {
            annoState.tags.push(body.value);
          } else if (body.type === 'TextualBody') {
            annoState.textBody = body.value;
          } else if (body.type === 'Image') {
            annoState.textBody = body.value; // why text body here ???
            // annoState.image = body;
          } else if (body.type === 'AnnotationTitle') {
            annoState.title = body;
          }
        });
      } else if (annotation.body.type === 'TextualBody') {
        annoState.textBody = annotation.body.value;
      } else if (annotation.body.type === 'Image') {
        annoState.textBody = annotation.body.value; // why text body here ???
        annoState.image = annotation.body;
      }
      // drawing position


      if (annotation.drawingState) {
        annoState.drawingState = JSON.parse(annotation.drawingState);
      }
      if (annotation.manifestNetwork) {
        annoState.manifestNetwork = annotation.manifestNetwork;
      }
    } else {
      if (mediaVideo) {
        // Time target
        annoState.tstart = currentTime ? Math.floor(currentTime) : 0;
        // eslint-disable-next-line no-underscore-dangle
        const annotJson = mediaVideo.props.canvas.__jsonld;
        annoState.tend = mediaVideo ? annotJson.duration : 0;

        // Geometry target
        const targetHeigth = mediaVideo ? annotJson.height : 1000;
        const targetWidth = mediaVideo ? annotJson.width : 500;
        annoState.xywh = `0,0,${targetWidth},${targetHeigth}`;
      } else {
        // TODO image and audio case
      }
      annoState.textBody = '';
      annoState.manifestNetwork = '';
    }

    return {
      mediaVideo,
      ...annoState,
      textEditorStateBustingKey: 0,
    };
  });

  const updateAnnotation = (newAnnoState) => {
    console.log('newAnnoState', newAnnoState);
    setState((prevState) => ({
      ...prevState,
      ...newAnnoState,
    }
    ));
  };

  // TODO At this end we must only have annoSTate, setAnnoState, templateType,
  //  manifestType, windowId in XTemplateProps
  // TODO Search where overlay is used. Only in Konva ?
  // TODO setSeekTo, setCurrentTime, overlay, currentTime,
  //  mediaVideo must be get only in TargetFormSection
  // TODO annotation is it usefeul in XTemplateProps ?

  return (
    <TemplateContainer>
      {
        templateType.id === template.TEXT_TYPE && (
          <TextCommentTemplate
            annotation={annotation}
            setCurrentTime={setCurrentTime}
            setSeekTo={setSeekTo}
            windowId={windowId}
            manifestType={manifestType}
            currentTime={currentTime}
            closeFormCompanionWindow={closeFormCompanionWindow}
            canvases={canvases}
          />
        )
      }
      {
        templateType.id === template.IMAGE_TYPE && (
          <ImageCommentTemplate
            annoState={state}
            setAnnoState={setState}
            setCurrentTime={setCurrentTime}
            setSeekTo={setSeekTo}
            windowId={windowId}
            templateType={templateType}
            manifestType={manifestType}
            currentTime={currentTime}
          />
        )
      }
      {
        templateType.id === template.KONVA_TYPE && (
          <DrawingTemplate
            annoState={state}
            setAnnoState={setState}
            overlay={overlay}
            setCurrentTime={setCurrentTime}
            setSeekTo={setSeekTo}
            windowId={windowId}
            manifestType={manifestType}
            annotation={annotation}
            currentTime={currentTime}
            mediaVideo={mediaVideo}
          />
        )
      }
      {
        templateType.id === template.MANIFEST_TYPE && (
          <NetworkCommentTemplate
            annoState={state}
            setAnnoState={setState}
            setCurrentTime={setCurrentTime}
            setSeekTo={setSeekTo}
            windowId={windowId}
            manifestType={manifestType}
            currentTime={currentTime}
          />
        )
      }
      {
        templateType.id === template.IIIF_TYPE && (
          <IIIFTemplate
            annotation={annotation}
            updateAnnotation={updateAnnotation}
            closeFormCompanionWindow={closeFormCompanionWindow}
            saveAnnotation={saveAnnotation}
            canvases={canvases}
          />
        )
      }
    </TemplateContainer>
  );
}
const TemplateContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
}));
AnnotationFormBody.propTypes = {
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
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]).isRequired,
  manifestType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  mediaVideo: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  templateType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,

};
