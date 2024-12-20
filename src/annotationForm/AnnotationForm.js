import React, {
  useEffect, useState,
} from 'react';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import PropTypes from 'prop-types';
import { Grid, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import AnnotationFormTemplateSelector from './AnnotationFormTemplateSelector';
import {
  getTemplateType, saveAnnotationInStorageAdapter,
  TEMPLATE,
} from './AnnotationFormUtils';
import AnnotationFormHeader from './AnnotationFormHeader';
import AnnotationFormBody from './AnnotationFormBody';
import { playerReferences } from '../playerReferences';
import { convertAnnotationStateToBeSaved } from '../IIIFUtils';

/**
 * Component for submitting a form to create or edit an annotation.
 * */
export default function AnnotationForm(
  {
    annotation,
    canvases,
    closeCompanionWindow,
    currentTime,
    config,
    getMediaAudio,
    id,
    receiveAnnotation,
    windowId,
  },
) {
  const [templateType, setTemplateType] = useState(null);
  // eslint-disable-next-line no-underscore-dangle
  const [mediaType, setMediaType] = useState(playerReferences.getMediaType());

  const debugMode = config.debug === true;

  // TODO must be improved when parsing annotation
  if (!templateType) {
    if (annotation.id) {
      if (annotation.maeData && annotation.maeData.templateType) {
        // Annotation has been created with MAE
        setTemplateType(getTemplateType(annotation.maeData.templateType));
      } else {
        // Annotation has been created with other IIIF annotation editor
        setTemplateType(getTemplateType(TEMPLATE.IIIF_TYPE));
      }
    }
  }

  // Listen to window resize event
  useEffect(() => {
    setTemplateType(null);
    // eslint-disable-next-line no-underscore-dangle
    setMediaType(playerReferences.getMediaType());
  }, [canvases[0].index]);

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

  // // TODO Useless ?
  // useLayoutEffect(() => {
  // }, [{
  //   height,
  //   width,
  // }]);

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

  /**
   * Save the annotation
   * @param annotationState
   */
  const saveAnnotation = (annotationState) => {
    const promises = playerReferences.getCanvases()
      .map(async (canvas) => {
        const annotationStateToBeSaved = await convertAnnotationStateToBeSaved(
          annotationState,
          canvas,
          windowId,
        );
        const storageAdapter = config.annotation.adapter(canvas.id);
        return saveAnnotationInStorageAdapter(
          canvas.id,
          storageAdapter,
          receiveAnnotation,
          annotationStateToBeSaved,
        );
      });
    Promise.all(promises)
      .then(() => {
        closeFormCompanionWindow();
      });
  };

  if (!playerReferences.isInitialized()) {
    return (
      <CompanionWindow
        title="Media not supported"
        windowId={windowId}
        id={id}
      >
        <Grid container padding={1} spacing={1}>
          <Grid item>
            <Typography>
              Your current canva media type is not supported by the annotation editor.
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              We detect
              {' '}
              <strong>
                {playerReferences.getMediaType()}
                {' '}
              </strong>
              {' '}
              media type.
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              If you want to annotate video media you must install MAEV to create and edit
              annotation on video :
              <Link>https://github.com/SCENE-CE/mirador-annotation-editor-video</Link>
            </Typography>
          </Grid>
        </Grid>
      </CompanionWindow>
    );
  }

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
                annotation={annotation}
                currentTime={currentTime}
                closeFormCompanionWindow={closeFormCompanionWindow}
                saveAnnotation={saveAnnotation}
                getMediaAudio={getMediaAudio}
                debugMode={debugMode}
                canvases={canvases}
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
  // eslint-disable-next-line react/forbid-prop-types
  canvases: PropTypes.object.isRequired,
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
    debug: PropTypes.bool,
  }).isRequired,
  currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]),
  // eslint-disable-next-line react/forbid-prop-types
  getMediaAudio: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  receiveAnnotation: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

AnnotationForm.defaultProps = {
  annotation: null,
  closeCompanionWindow: () => {
  },
  currentTime: null,
};
