import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import ToggleButton from '@mui/material/ToggleButton';
import { Grid } from '@mui/material';
import {
  template,
} from './AnnotationFormUtils';
import TextCommentTemplate from './annotationForm/TextCommentTemplate';
import ImageCommentTemplate from './annotationForm/ImageCommentTemplate';
import NetworkCommentTemplate from './annotationForm/NetworkCommentTemplate';
import DrawingTemplate from './annotationForm/DrawingTemplate';
import IIIFTemplate from './annotationForm/IIIFTemplate';
import TaggingTemplate from './annotationForm/TaggingTemplate';

import './debug.css';
/**
 * This function contain the logic for loading annotation and render proper template type
 * * */
export default function AnnotationFormBody(
  {
    annotation,
    templateType,
      // FeatureMediaVideo
      currentTime,
      // FeatureMedia
      mediaType,
    overlay,
      // FeatureMediaVideo
      setCurrentTime,
      // FeatureMediaVideo
      setSeekTo,
    windowId,
    closeFormCompanionWindow,
    saveAnnotation,
    canvases,
      // FeatureMediaAudio
      getMediaAudio,
    debugMode,
  },
) {
  // TODO At this end we must only have annoSTate, setAnnoState, templateType,
  //  mediaType, windowId in XTemplateProps
  // TODO Search where overlay is used. Only in Konva ?
  // TODO setSeekTo, setCurrentTime, overlay, currentTime,
  //  mediaVideo must be get only in TargetFormSection
  // TODO annotation is it usefeul in XTemplateProps ?

  const [showDebug, setShowDebug] = useState(false);

  return (
    <Grid container direction="column">
      { !showDebug && (
        <TemplateContainer item>
          {
          templateType.id === template.TEXT_TYPE && (
            <TextCommentTemplate
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
                // FeatureMediaVideo
              currentTime={currentTime}
                // FeatureMedia
              mediaType={mediaType}
              saveAnnotation={saveAnnotation}
                // FeatureMediaVideo
              setCurrentTime={setCurrentTime}
                // FeatureMediaVideo
              setSeekTo={setSeekTo}
              windowId={windowId}
              overlay={overlay}
                // FeatureMediaAudio
              getMediaAudio={getMediaAudio}
              debugMode={debugMode}
            />
          )
        }
          {
          templateType.id === template.IMAGE_TYPE && (
          <ImageCommentTemplate
            annotation={annotation}
            canvases={canvases}
            closeFormCompanionWindow={closeFormCompanionWindow}
              // FeatureMediaVideo
            setCurrentTime={setCurrentTime}
              // FeatureMediaVideo
            setSeekTo={setSeekTo}
            windowId={windowId}
            templateType={templateType}
              // FeatureMedia
            mediaType={mediaType}
            saveAnnotation={saveAnnotation}
              // FeatureMediaVideo
            currentTime={currentTime}
            overlay={overlay}
            debugMode={debugMode}
          />
          )
        }
          {
          templateType.id === template.KONVA_TYPE && (
            <DrawingTemplate
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
                // FeatureMediaVideo
              currentTime={currentTime}
                // FeatureMedia
              mediaType={mediaType}
              overlay={overlay}
              saveAnnotation={saveAnnotation}
                // FeatureMediaVideo
              setCurrentTime={setCurrentTime}
                // FeatureMediaVideo
              setSeekTo={setSeekTo}
              windowId={windowId}
              debugMode={debugMode}
            />
          )
        }
          {
          templateType.id === template.MANIFEST_TYPE && (
            <NetworkCommentTemplate
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
                // FeatureMediaVideo
              currentTime={currentTime}
                // FeatureMedia
              mediaType={mediaType}
              saveAnnotation={saveAnnotation}
                // FeatureMediaVideo
              setCurrentTime={setCurrentTime}
                // FeatureMediaVideo
              setSeekTo={setSeekTo}
              windowId={windowId}
                // FeatureMediaAudio
              getMediaAudio={getMediaAudio}
              overlay={overlay}
              debugMode={debugMode}
            />
          )
        }
          {
          templateType.id === template.IIIF_TYPE && (
            <IIIFTemplate
              annotation={annotation}
              closeFormCompanionWindow={closeFormCompanionWindow}
              saveAnnotation={saveAnnotation}
              canvases={canvases}
            />
          )
        }
            {templateType.id === template.TAGGING_TYPE && (
            <TaggingTemplate
              canvases={canvases}
              saveAnnotation={saveAnnotation}
              closeFormCompanionWindow={closeFormCompanionWindow}
                // FeatureMediaVideo
              currentTime={currentTime}
                // FeatureMedia
              mediaType={mediaType}
                // FeatureMediaVideo
              setCurrentTime={setCurrentTime}
                // FeatureMediaVideo
              setSeekTo={setSeekTo}
              windowId={windowId}
              overlay={overlay}
              annotation={annotation}
                // FeatureMediaAudio
              getMediaAudio={getMediaAudio}
              debugMode={debugMode}
            />
            )}
        </TemplateContainer>
      )}
      <Grid item>
        <ToggleButton
          value={showDebug}
          onChange={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Hide' : 'Show'}
          {' '}
          Debug
        </ToggleButton>
        {showDebug && (
        <Editor
          value={annotation}
          ace={ace}
          theme="ace/theme/github"
        />
        )}
      </Grid>
    </Grid>
  );
}

const TemplateContainer = styled(Grid)({
  margin: '0 10px',
});

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
  // eslint-disable-next-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  getMediaAudio: PropTypes.object.isRequired,
  mediaType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  overlay: PropTypes.object.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  templateType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,

};
