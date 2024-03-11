import React, { useEffect, useLayoutEffect, useState } from 'react';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import PropTypes from 'prop-types';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import AnnotationFormTemplateSelector from './AnnotationFormTemplateSelector';
import {
  getTemplateType,
  manifestTypes,
  template, templateTypes,
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
  },
) {
  const [templateType, setTemplateType] = useState(null);

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
  let manifestType;
  if (mediaVideo) {
    manifestType = manifestTypes.VIDEO;
  } else {
    manifestType = manifestTypes.IMAGE;
  }
  // TODO add check to other type of manifest

  // eslint-disable-next-line no-underscore-dangle
  // TODO: L'erreur de "Ref" sur l'ouverture d'une image vient d'ici et plus particulièrement
  //  du useEffect qui prend en dépedance [overlay.containerWidth, overlay.canvasWidth]
  const osdref = OSDReferences.get(windowId);
  let overlay = null;
  if (mediaVideo) {
    overlay = mediaVideo.canvasOverlay;
  } else if (osdref) {
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

  const saveAnnotation = (annotationToSaved, canvasId) => {
    const storageAdapter = config.annotation.adapter(canvasId);
    saveAnnotationInStorageAdapter(canvasId, storageAdapter, receiveAnnotation, annotationToSaved)
      .then(console.log('Annotation saved'));
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
          />
        )
        : (
          <>
            <AnnotationFormHeader
              setCommentingType={setTemplateType}
              templateType={templateType}
              annotation={annotation}
            />
            <AnnotationFormBody
              templateType={templateType}
              windowId={windowId}
              overlay={overlay}
              annotation={annotation}
              mediaVideo={mediaVideo}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              setSeekTo={setSeekTo}
              manifestType={manifestType}
              closeFormCompanionWindow={closeFormCompanionWindow}
              saveAnnotation={saveAnnotation}
              canvases={canvases}
            />
          </>
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
