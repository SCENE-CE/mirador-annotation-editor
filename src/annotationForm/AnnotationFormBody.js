import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { JsonEditor as Editor } from 'jsoneditor-react';
import ace from 'brace';
import ToggleButton from '@mui/material/ToggleButton';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import {
  TEMPLATE,
} from './AnnotationFormUtils';
import TextCommentTemplate from './TextCommentTemplate';
import ImageCommentTemplate from './ImageCommentTemplate';
import NetworkCommentTemplate from './NetworkCommentTemplate';
import DrawingTemplate from './DrawingTemplate';
import IIIFTemplate from './IIIFTemplate';
import TaggingTemplate from './TaggingTemplate';

import './debug.css';
import { playerReferences } from '../playerReferences';
import { AdvancedAnnotationEditor } from './AdvancedAnnotationEditor';

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

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Grid container direction="column">
      { !showAdvanced && (
        <TemplateContainer item>
          {
          templateType.id === TEMPLATE.TEXT_TYPE && (
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
          templateType.id === TEMPLATE.IMAGE_TYPE && (
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
          templateType.id === TEMPLATE.KONVA_TYPE && (
            <DrawingTemplate
              annotation={annotation}
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
          templateType.id === TEMPLATE.MANIFEST_TYPE && (
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
          templateType.id === TEMPLATE.IIIF_TYPE && (
            <IIIFTemplate
              annotation={annotation}
              closeFormCompanionWindow={closeFormCompanionWindow}
              saveAnnotation={saveAnnotation}
              canvases={canvases}
            />
          )
        }
            {templateType.id === TEMPLATE.TAGGING_TYPE && (
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
    {/*   <Grid
        item
        style={{
          bottom: '0',
          margin: '20px',
          position: 'absolute',
        }}
      >
        <ToggleButton
          value={showAdvanced}
          onChange={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'}
          {' '}
          advanced mode
        </ToggleButton>
      </Grid> */}
      <Grid item>
        {showAdvanced && (
          <AdvancedAnnotationEditor
            value={annotation}
            onChange={(updatedAnnotation) => {
              annotation = updatedAnnotation;
            }}
            closeFormCompanionWindow={closeFormCompanionWindow}
            saveAnnotation={saveAnnotation}
          />
        )}
      </Grid>
      { debugMode && (
      <>
        <Typography>
          { playerReferences.getMediaType() }
          {' '}
        </Typography>
        <Typography>
          Scale
          {' '}
          { playerReferences.getScale() }
        </Typography>
        <Typography>
          Zoom
          {' '}
          { playerReferences.getZoom() }
          {' '}
        </Typography>
        <Typography>
          Image true Size
          {' '}
          { playerReferences.getWidth() }
          {' '}
          x
          {' '}
          { playerReferences.getHeight() }
        </Typography>
        <Typography>
          Container Size
          {' '}
          { playerReferences.getContainerWidth() }
          {' '}
          x
          {' '}
          { playerReferences.getContainerHeight() }
        </Typography>
        <Typography>
          Image Displayed
          {' '}
          { playerReferences.getDisplayedImageWidth() }
          {' '}
          x
          {' '}
          { playerReferences.getDisplayedImageHeight() }
        </Typography>
      </>
      )}
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
  canvases: PropTypes.object.isRequired,
  closeFormCompanionWindow: PropTypes.func.isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  debugMode: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  getMediaAudio: PropTypes.object.isRequired,
  saveAnnotation: PropTypes.func.isRequired,
  templateType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};
