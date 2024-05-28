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
import TextCommentTemplate from './TextCommentTemplate';
import ImageCommentTemplate from './ImageCommentTemplate';
import NetworkCommentTemplate from './NetworkCommentTemplate';
import DrawingTemplate from './DrawingTemplate';
import IIIFTemplate from './IIIFTemplate';
import TaggingTemplate from './TaggingTemplate';

import './debug.css';
import { playerReferences } from '../playerReferences';
/**
 * This function contain the logic for loading annotation and render proper template type
 * * */
export default function AnnotationFormBody(
  {
    annotation,
    canvases,
    closeFormCompanionWindow,
    currentTime,
    debugMode,
    getMediaAudio,
    saveAnnotation,
    templateType,
    windowId,
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
              currentTime={currentTime}
              saveAnnotation={saveAnnotation}
              windowId={windowId}
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
            windowId={windowId}
            templateType={templateType}
            saveAnnotation={saveAnnotation}
            debugMode={debugMode}
            currentTime={currentTime}
          />
          )
        }
          {
          templateType.id === template.KONVA_TYPE && (
            <DrawingTemplate
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
              currentTime={currentTime}
              debugMode={debugMode}
              overlay={playerReferences.getOverlay()}
              saveAnnotation={saveAnnotation}
              windowId={windowId}
            />
          )
        }
          {
          templateType.id === template.MANIFEST_TYPE && (
            <NetworkCommentTemplate
              annotation={annotation}
              canvases={canvases}
              currentTime={currentTime}
              closeFormCompanionWindow={closeFormCompanionWindow}
              saveAnnotation={saveAnnotation}
              windowId={windowId}
              getMediaAudio={getMediaAudio}
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
              windowId={windowId}
              currentTime={currentTime}
              annotation={annotation}
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
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]),
  // eslint-disable-next-line react/forbid-prop-types
  getMediaAudio: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  saveAnnotation: PropTypes.func.isRequired,
  templateType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,

};
