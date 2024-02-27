import React, { useState } from 'react';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import PropTypes from 'prop-types';
import AnnotationFormTemplateSelector from './AnnotationFormTemplateSelector';
import {
  template, geomFromAnnoTarget, timeFromAnnoTarget, defaultToolState,
} from './AnnotationFormUtils';
import AnnotationFormHeader from './AnnotationFormHeader';
import AnnotationFormFooter from './annotationForm/AnnotationFormFooter';
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
            <p>TEXT TYPE</p>
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
            <p>IMAGE TYPE</p>
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
            <p>KONVA TYPE</p>
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
            <p>MANIFEST TYPE</p>
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
            <p>TAGGING TYPE</p>
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
            <p>IIIF TYPE</p>
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
