import React, {useEffect, useLayoutEffect, useState} from 'react';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import PropTypes from 'prop-types';
import AnnotationFormTemplateSelector from './AnnotationFormTemplateSelector';
import {
  template, geomFromAnnoTarget, timeFromAnnoTarget, defaultToolState,
} from './AnnotationFormUtils';
import AnnotationFormHeader from './AnnotationFormHeader';
import AnnotationFormFooter from './annotationForm/AnnotationFormFooter';
import AnnotationFormBody from "./AnnotationFormBody";
import {VideosReferences} from "mirador/dist/es/src/plugins/VideosReferences";
import {OSDReferences} from "mirador/dist/es/src/plugins/OSDReferences";
/**
 * Component for submitting a form to create or edit an annotation.
 * */
export default function AnnotationForm(
  {
    annotation,
    id,
    windowId,
    canvases,
    currentTime,
    closeCompanionWindow,
    config,
    mediaVideo,
    receiveAnnotation,
    setCurrentTime,
    setSeekTo
  },
) {
  // Initial state setup
  const [state, setState] = useState(() => {
    let tstart;
    let tend;
    const annoState = {};
    if (annotation) {
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
      if (annotation.target.selector) {
        if (Array.isArray(annotation.target.selector)) {
          annotation.target.selector.forEach((selector) => {
            if (selector.type === 'SvgSelector') {
              annoState.svg = selector.value;
            } else if (selector.type === 'FragmentSelector') {
              // TODO proper fragment selector extraction
              annoState.xywh = geomFromAnnoTarget(selector.value);
              [tstart, tend] = timeFromAnnoTarget(selector.value);
            }
          });
        } else {
          annoState.svg = annotation.target.selector.value;
          // TODO does this happen ? when ? where are fragments selectors ?
        }
      } else if (typeof annotation.target === 'string') {
        annoState.xywh = geomFromAnnoTarget(annotation.target);
        [tstart, tend] = timeFromAnnoTarget(annotation.target);
        annoState.tstart = tstart;
        annoState.tend = tend;
      }

      if (annotation.drawingState) {
        setDrawingState(JSON.parse(annotation.drawingState));
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
      ...toolState,
      mediaVideo,
      ...annoState,
      textEditorStateBustingKey: 0,
      valueTime: [0, 1],
    };
  });
  const [commentingType, setCommentingType] = useState(null);
  const [drawingState, setDrawingState] = useState({
    currentShape: null,
    isDrawing: false,
    shapes: [],
  });
  const [toolState, setToolState] = useState(defaultToolState);

  const {
    manifestNetwork,
    textBody,
    tstart,
    tend,
    textEditorStateBustingKey,
    valueTime,
  } = state;

  const mediaIsVideo = mediaVideo !== undefined;
  if (mediaIsVideo && valueTime) {
    valueTime[0] = tstart;
    valueTime[1] = tend;
  }

  // eslint-disable-next-line no-underscore-dangle
  const videoDuration = mediaVideo ? mediaVideo.props.canvas.__jsonld.duration : 0;
  // TODO: L'erreur de "Ref" sur l'ouverture d'une image vient d'ici et plus particulièrement
  //  du useEffect qui prend en dépedance [overlay.containerWidth, overlay.canvasWidth]
  const videoref = VideosReferences.get(windowId);
  const osdref = OSDReferences.get(windowId);
  let overlay = null;
  if (videoref) {
    overlay = videoref.canvasOverlay;
  } else if (osdref) {
    console.debug('osdref', osdref);
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

  const { height, width } = getHeightAndWidth();
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

  useEffect(() => {

  }, [toolState.fillColor, toolState.strokeColor, toolState.strokeWidth]);

  useLayoutEffect(() => {
  }, [{ height, width }]);

  const setShapeProperties = (options) => new Promise(() => {
    if (options.fill) {
      state.fillColor = options.fill;
    }

    if (options.strokeWidth) {
      state.strokeWidth = options.strokeWidth;
    }

    if (options.stroke) {
      state.strokeColor = options.stroke;
    }

    setState({ ...state });
  });

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
   * Updates the `textBody` property of the component's state.
   */
  const updateTextBody = (textBody) => {
    setState((prevState) => ({
      ...prevState,
      textBody,
    }));
  };

  const handleImgChange = (newUrl) => {
    setToolState({
      ...toolState,
      image: { ...toolState.image, id: newUrl },
    });
  };

  /**
   * Updates the manifest network in the component's state.
   * @param {Object} manifestNetwork The new manifest network object to update.
   */
  const updateManifestNetwork = (manifestNetwork) => {
    setState((prevState) => ({
      ...prevState,
      manifestNetwork,
    }));
  };
  /**
   * Resets the state after saving, potentially causing a re-render.
   *
   * @function resetStateAfterSave
   * @returns {void}
   */
  const resetStateAfterSave = () => {
    // TODO this create a re-render too soon for react and crash the app
    setState({
      image: { id: null },
      svg: null,
      tend: 0,
      textBody: '',
      textEditorStateBustingKey: textEditorStateBustingKey + 1,
      tstart: 0,
      xywh: null,
    });
  };

  return (
    <CompanionWindow
      title={annotation ? 'Edit annotation' : 'New annotation'}
      windowId={windowId}
      id={id}
    >
      { commentingType === null
          && (
          <AnnotationFormTemplateSelector
            setCommentingType={setCommentingType}
          />
          )}
      {commentingType?.id === template.TEXT_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <AnnotationFormBody
                commentingType={commentingType}
                textBody={textBody}
                textEditorStateBustingKey={textEditorStateBustingKey}
                updateTextBody={updateTextBody}
                currentTime={currentTime}
                mediaIsVideo={mediaIsVideo}
                setCurrentTime={setCurrentTime}
                setSeekTo={setSeekTo}
                setState={setState}
                tend={tend}
                tstart={tstart}
                valueTime={valueTime}
                videoDuration={videoDuration}
                windowId={windowId}
                handleImgChange={handleImgChange}
                toolState={toolState}
                updateToolState={setToolState}
                manifestNetwork={manifestNetwork}
                updateManifestNetwork={updateManifestNetwork}
                overlay={overlay}
                annotation={annotation}
                mediaVideo={mediaVideo}
                drawingState={drawingState}
                setDrawingState={setDrawingState}
                setShapeProperties={setShapeProperties}
                setToolState={setToolState}
            />
            <AnnotationFormFooter
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
              config={config}
              drawingState={drawingState}
              receiveAnnotation={receiveAnnotation}
              resetStateAfterSave={resetStateAfterSave}
              state={state}
              windowId={windowId}
            />
          </div>
          )}
      {commentingType?.id === template.IMAGE_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <AnnotationFormBody
                commentingType={commentingType}
                textBody={textBody}
                textEditorStateBustingKey={textEditorStateBustingKey}
                updateTextBody={updateTextBody}
                currentTime={currentTime}
                mediaIsVideo={mediaIsVideo}
                setCurrentTime={setCurrentTime}
                setSeekTo={setSeekTo}
                setState={setState}
                tend={tend}
                tstart={tstart}
                valueTime={valueTime}
                videoDuration={videoDuration}
                windowId={windowId}
                handleImgChange={handleImgChange}
                toolState={toolState}
                updateToolState={setToolState}
                manifestNetwork={manifestNetwork}
                updateManifestNetwork={updateManifestNetwork}
                overlay={overlay}
                annotation={annotation}
                mediaVideo={mediaVideo}
                drawingState={drawingState}
                setDrawingState={setDrawingState}
                setShapeProperties={setShapeProperties}
                setToolState={setToolState}
            />
            <AnnotationFormFooter
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
              config={config}
              drawingState={drawingState}
              receiveAnnotation={receiveAnnotation}
              resetStateAfterSave={resetStateAfterSave}
              state={state}
              windowId={windowId}
            />
          </div>
          )}
      {commentingType?.id === template.KONVA_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <AnnotationFormBody
                commentingType={commentingType}
                textBody={textBody}
                textEditorStateBustingKey={textEditorStateBustingKey}
                updateTextBody={updateTextBody}
                currentTime={currentTime}
                mediaIsVideo={mediaIsVideo}
                setCurrentTime={setCurrentTime}
                setSeekTo={setSeekTo}
                setState={setState}
                tend={tend}
                tstart={tstart}
                valueTime={valueTime}
                videoDuration={videoDuration}
                windowId={windowId}
                handleImgChange={handleImgChange}
                toolState={toolState}
                updateToolState={setToolState}
                manifestNetwork={manifestNetwork}
                updateManifestNetwork={updateManifestNetwork}
                overlay={overlay}
                annotation={annotation}
                mediaVideo={mediaVideo}
                drawingState={drawingState}
                setDrawingState={setDrawingState}
                setShapeProperties={setShapeProperties}
                setToolState={setToolState}
            />
            <AnnotationFormFooter
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
              config={config}
              drawingState={drawingState}
              receiveAnnotation={receiveAnnotation}
              resetStateAfterSave={resetStateAfterSave}
              state={state}
              windowId={windowId}
            />
          </div>
          )}
      {commentingType?.id === template.MANIFEST_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <AnnotationFormBody
                commentingType={commentingType}
                textBody={textBody}
                textEditorStateBustingKey={textEditorStateBustingKey}
                updateTextBody={updateTextBody}
                currentTime={currentTime}
                mediaIsVideo={mediaIsVideo}
                setCurrentTime={setCurrentTime}
                setSeekTo={setSeekTo}
                setState={setState}
                tend={tend}
                tstart={tstart}
                valueTime={valueTime}
                videoDuration={videoDuration}
                windowId={windowId}
                handleImgChange={handleImgChange}
                toolState={toolState}
                updateToolState={setToolState}
                manifestNetwork={manifestNetwork}
                updateManifestNetwork={updateManifestNetwork}
                overlay={overlay}
                annotation={annotation}
                mediaVideo={mediaVideo}
                drawingState={drawingState}
                setDrawingState={setDrawingState}
                setShapeProperties={setShapeProperties}
                setToolState={setToolState}
            />
            <AnnotationFormFooter
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
              config={config}
              drawingState={drawingState}
              receiveAnnotation={receiveAnnotation}
              resetStateAfterSave={resetStateAfterSave}
              state={state}
              windowId={windowId}
            />
          </div>
          )}
      {commentingType?.id === template.TAGGING_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <AnnotationFormFooter
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
              config={config}
              drawingState={drawingState}
              receiveAnnotation={receiveAnnotation}
              resetStateAfterSave={resetStateAfterSave}
              state={state}
              windowId={windowId}
            />
          </div>
          )}
      {commentingType?.id === template.IIIF_TYPE
          && (
          <div>
            <AnnotationFormHeader
              setCommentingType={setCommentingType}
              templateType={commentingType}
            />
            <AnnotationFormFooter
              annotation={annotation}
              canvases={canvases}
              closeFormCompanionWindow={closeFormCompanionWindow}
              config={config}
              drawingState={drawingState}
              receiveAnnotation={receiveAnnotation}
              resetStateAfterSave={resetStateAfterSave}
              state={state}
              windowId={windowId}
            />
          </div>
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
  canvases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      index: PropTypes.number,
    }),
  ),
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
  receiveAnnotation: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,

};

AnnotationForm.defaultProps = {
  annotation: null,
  canvases: [],
  closeCompanionWindow: () => {
  },
  currentTime: null,
};
