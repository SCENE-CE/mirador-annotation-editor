import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import PropTypes, { string } from 'prop-types';
import { Grid } from '@mui/material';
import AnnotationFormTemplateSelector from './AnnotationFormTemplateSelector';
import {
  getTemplateType,
  template, usePrevious,
} from './AnnotationFormUtils';
import AnnotationFormHeader from './AnnotationFormHeader';
import AnnotationFormBody from './AnnotationFormBody';
import { saveAnnotationInStorageAdapter } from './AnnotationCreationUtils';

/**
 * Component for submitting a form to create or edit an annotation.
 * */
export default function AnnotationForm(
  {
    annotation,
    id,
    windowId,
    currentTime,
    closeCompanionWindow,
    mediaVideo,
    setCurrentTime,
    setSeekTo,
    canvases,
    receiveAnnotation,
    config,
    osdref,
    getMediaAudio,
  },
) {
  const [templateType, setTemplateType] = useState(null);
  const [mediaType, setMediaType] = useState(canvases[0].__jsonld.items[0].items[0].body.type);
  const debugMode = config.debugMode === true;
  // TODO must be improved when parsing annotation
  if (!templateType) {
    if (annotation.id) {
      if (annotation.maeData && annotation.maeData.templateType) {
        // Annotation has been created with MAE
        setTemplateType(getTemplateType(annotation.maeData.templateType));
      } else {
        // Annotation has been created with other IIIF annotation editor
        setTemplateType(getTemplateType(template.IIIF_TYPE));
      }
    }
  }

  let overlay = null;
  if (mediaVideo) {
    overlay = mediaVideo.canvasOverlay;
  } else if (osdref.current) {
    overlay = {
      canvasHeight: osdref.current.canvas.clientHeight,
      canvasWidth: osdref.current.canvas.clientWidth,
      containerHeight: osdref.current.canvas.clientHeight,
      containerWidth: osdref.current.canvas.clientWidth,
    };
  } else {
    overlay = {
      canvasHeight: 500,
      canvasWidth: 1000,
      containerHeight: 500,
      containerWidth: 1000,
    };
  }

  // Listen to window resize event
  useEffect(() => {
    setTemplateType(null);
    setMediaType(canvases[0].__jsonld.items[0].items[0].body.type);
  }, [canvases[0].index]);

  /**
   * Retrieves the height and width of a media element.
   * If the media element is a video, returns its dimensions.
   * If not a video, attempts to retrieve dimensions from a manifest image.
   * If no dimensions are found, default values are returned.
   *
   * @returns {{height: number, width: number}}
   */
  const getHeightAndWidth = () => {
    if (mediaVideo) {
      return mediaVideo;
    }
    // Todo get size from manifest image
    return {
      height: 1000,
      width: 500,
    };
  };

  const {
    height,
    width,
  } = getHeightAndWidth();
  // TODO Check the effect to keep and remove the other
  // Add a state to trigger redraw
  const [windowSize, setWindowSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // Listen to window resize event
  useEffect(() => {
    /**
     * Updates the state with the current window size when the window is resized.
     * @function handleResize
     * @returns {void}
     */
    const handleResize = () => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // TODO Useless ?
  useLayoutEffect(() => {
  }, [{
    height,
    width,
  }]);

  /**
   * Closes the companion window with the specified ID and position.
   *
   * @returns {void}
   */
  const closeFormCompanionWindow = () => {
    closeCompanionWindow('annotationCreation', {
      id,
      position: 'right',
    });
  };

  /** Save function * */
  const saveAnnotation = (annotationToSaved, canvasId) => {
    const storageAdapter = config.annotation.adapter(canvasId);
    return saveAnnotationInStorageAdapter(
      canvasId,
      storageAdapter,
      receiveAnnotation,
      annotationToSaved,
    );
  };

  return (
    <CompanionWindow
      title={annotation.id ? 'Edit annotation' : 'New annotation'}
      windowId={windowId}
      id={id}
    >
      {templateType === null
        ? (
          <AnnotationFormTemplateSelector
            setCommentingType={setTemplateType}
            mediaType={mediaType}
          />
        )
        : (
          <Grid container direction="column" spacing={1}>
            <Grid item container>
              <AnnotationFormHeader
                setCommentingType={setTemplateType}
                templateType={templateType}
                annotation={annotation}
              />
            </Grid>
            <Grid item>
              <AnnotationFormBody
                templateType={templateType}
                windowId={windowId}
                overlay={overlay}
                annotation={annotation}
                mediaVideo={mediaVideo}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                setSeekTo={setSeekTo}
                mediaType={mediaType}
                closeFormCompanionWindow={closeFormCompanionWindow}
                saveAnnotation={saveAnnotation}
                canvases={canvases}
                osdref={osdref}
                getMediaAudio={getMediaAudio}
                debugMode={debugMode}
              />
            </Grid>
          </Grid>
        )}
    </CompanionWindow>
  );
}

AnnotationForm.propTypes = {
  annotation: PropTypes.oneOfType([
    PropTypes.shape({
      body: PropTypes.shape({
        format: PropTypes.string,
        id: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.string,
      }),
      drawingState: PropTypes.string,
      id: PropTypes.string,
      manifestNetwork: PropTypes.string,
      motivation: PropTypes.string,
      target: PropTypes.string,
    }),
    PropTypes.string,
  ]),
  closeCompanionWindow: PropTypes.func,
  config: PropTypes.shape({
    annotation: PropTypes.shape({
      adapter: PropTypes.func,
      defaults: PropTypes.objectOf(
        PropTypes.oneOfType(
          [PropTypes.bool, PropTypes.func, PropTypes.number, PropTypes.string],
        ),
      ),
    }),
  }).isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]),
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  mediaVideo: PropTypes.object.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,

};

AnnotationForm.defaultProps = {
  annotation: null,
  closeCompanionWindow: () => {
  },
  currentTime: null,
};
