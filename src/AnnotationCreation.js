import React, { useEffect, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import Tab from '@mui/material/Tab';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import LayersIcon from '@mui/icons-material/Layers';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HubIcon from '@mui/icons-material/Hub';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import AnnotationDrawing from './annotationForm/AnnotationDrawing';
import AnnotationFormContent from './annotationForm/TextCommentTemplate';
import AnnotationFormTarget from './annotationForm/TargetTimeInput';
import {
  defaultToolState,
  geomFromAnnoTarget, timeFromAnnoTarget,
} from './AnnotationCreationUtils';
import AnnotationFormOverlay from './annotationForm/AnnotationFormOverlay/AnnotationFormOverlay';
import AnnotationFormFooter from './annotationForm/AnnotationFormFooter';
import AnnotationFormManifestNetwork from './annotationForm/NetworkCommentTemplate';

const TARGET_VIEW = 'target';
const OVERLAY_VIEW = 'layer';
const TAG_VIEW = 'tag';
const MANIFEST_LINK_VIEW = 'link';

/** Component for creating annotations.
 * Display in companion window when a manifest is open and an annoation created or edited */
function AnnotationCreation({
  annotation,
  canvases,
  closeCompanionWindow,
  config,
  id,
  mediaVideo,
  receiveAnnotation,
  currentTime,
  setCurrentTime,
  setSeekTo,
  windowId,
}) {
  const [toolState, setToolState] = useState(defaultToolState);

  const [drawingState, setDrawingState] = useState({
    currentShape: null,
    isDrawing: false,
    shapes: [],
  });

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

  const [isMouseOverSave, setIsMouseOverSave] = useState(false);
  const [scale, setScale] = useState(1);
  const [viewTool, setViewTool] = useState(TARGET_VIEW);

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

  /**
   * Handles tab selection event.
   *
   * @param {Event} event - The event object triggered by the tab selection.
   * @param {string} TabIndex - The index of the selected tab.
   * @returns {void}
   */
  const tabHandler = (event, TabIndex) => {
    setViewTool(TabIndex);
  };

  /** */
  const updateGeometry = ({ svg, xywh }) => {
    setState((prevState) => ({
      ...prevState,
      svg,
      xywh,
    }));
  };

  /** */
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

  /** */
  const updateTextBody = (textBody) => {
    setState((prevState) => ({
      ...prevState,
      textBody,
    }));
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
   * Updates the tool state by merging the current color state with the existing tool state.
   * @param {object} colorState - The color state to be merged with the tool state.
   * @returns {void}
   */
  const setColorToolFromCurrentShape = (colorState) => {
    setToolState((prevState) => ({
      ...prevState,
      ...colorState,
    }));
  };

  /**
   * Deletes a shape from the drawing state based on its ID.
   * If no shape ID is provided, clears all shapes from the drawing state.
   *
   * @param {string} [shapeId] - The ID of the shape to delete.
   * If not provided, clears all shapes.
   */
  const deleteShape = (shapeId) => {
    if (!shapeId) {
      setDrawingState((prevState) => ({
        ...prevState,
        currentShape: null,
        shapes: [],
      }));
    } else {
      setDrawingState((prevState) => ({
        ...prevState,
        currentShape: null,
        shapes: prevState.shapes.filter((shape) => shape.id !== shapeId),
      }));
    }
  };

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

  const {
    manifestNetwork,
    textBody,
    tstart,
    tend,
    textEditorStateBustingKey,
    valueTime,
  } = state;

  const {
    activeTool,
    fillColor,
    strokeColor,
    strokeWidth,
    closedMode,
    imageEvent,
  } = toolState;

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

  /** Change scale from container / canva */
  const updateScale = () => {
    setScale(overlay.containerWidth / overlay.canvasWidth);
  };

  useEffect(() => {
  }, [overlay.containerWidth, overlay.canvasWidth]);

  return (
  // eslint-disable-next-line max-len
    // we need to get the width and height of the image to pass it to the annotation drawing component
    <CompanionWindow
      title={annotation ? 'Edit annotation' : 'New annotation'}
      windowId={windowId}
      id={id}
    >
      <StyledAnnotationDrawing
        scale={scale}
        activeTool={activeTool}
        annotation={annotation}
        fillColor={fillColor}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        closed={closedMode === 'closed'}
        updateGeometry={updateGeometry}
        windowId={windowId}
        player={mediaIsVideo ? mediaVideo : OSDReferences.get(windowId)}
        // we need to pass the width and height of the image to the annotation drawing component
        width={overlay ? overlay.containerWidth : 1920}
        height={overlay ? overlay.containerHeight : 1080}
        originalWidth={overlay ? overlay.canvasWidth : 1920}
        originalHeight={overlay ? overlay.canvasHeight : 1080}
        setShapeProperties={setShapeProperties}
        updateScale={updateScale}
        imageEvent={imageEvent}
        setColorToolFromCurrentShape={setColorToolFromCurrentShape}
        drawingState={drawingState}
        isMouseOverSave={isMouseOverSave}
        mediaVideo={mediaVideo}
        setDrawingState={setDrawingState}
        tabView={viewTool}
      />
      <StyledForm>
        <TabContext value={viewTool}>
          <TabList value={viewTool} onChange={tabHandler} aria-label="icon tabs">
            <StyledTab
              icon={<HighlightAltIcon />}
              aria-label="TargetSelector"
              value={TARGET_VIEW}
              tooltip="Target"
            />
            <StyledTab
              icon={<LayersIcon />}
              aria-label="OverlaySelector"
              value={OVERLAY_VIEW}
              tooltip="Overlay"
            />
            <StyledTab
              icon={<LocalOfferIcon />}
              aria-label="InfosSelector"
              value={TAG_VIEW}
              tooltip="Infos"
            />
            <StyledTab
              icon={<HubIcon />}
              aria-label="ManifestNetworkSelector"
              value={MANIFEST_LINK_VIEW}
              tooltip="Manifest Network"
            />
          </TabList>
          <StyledTabPanel
            value={TARGET_VIEW}
          >
            <AnnotationFormTarget
              mediaIsVideo={mediaIsVideo}
              videoDuration={videoDuration}
              value={valueTime}
              windowid={windowId}
              tstart={tstart}
              tend={tend}
              currentTime={currentTime}
              setState={setState}
              setCurrentTime={setCurrentTime}
              setSeekTo={setSeekTo}
            />
          </StyledTabPanel>
          <StyledTabPanel
            value={OVERLAY_VIEW}
          >
            <AnnotationFormOverlay
              toolState={toolState}
              updateToolState={setToolState}
              shapes={drawingState.shapes}
              currentShape={drawingState.currentShape}
              deleteShape={deleteShape}
            />
          </StyledTabPanel>
          <StyledTabPanel
            value={TAG_VIEW}
          >
            <AnnotationFormContent
              textBody={textBody}
              updateTextBody={updateTextBody}
              textEditorStateBustingKey={textEditorStateBustingKey}
            />
          </StyledTabPanel>
          <StyledTabPanel
            value={MANIFEST_LINK_VIEW}
          >
            <AnnotationFormManifestNetwork
              manifestNetwork={manifestNetwork}
              updateManifestNetwork={updateManifestNetwork}
            />
          </StyledTabPanel>
        </TabContext>
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
      </StyledForm>
    </CompanionWindow>
  );
}

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(2),
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: '0px',
  padding: '12px 8px',
}));

const StyledTabPanel = styled(TabPanel)(({ theme }) => ({
  padding: '0',
}));

const StyledAnnotationDrawing = styled(AnnotationDrawing)(({ theme }) => ({
  height: 'auto',
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
}));

AnnotationCreation.propTypes = {
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
  setCurrentTime: PropTypes.func,
  setSeekTo: PropTypes.func,
  windowId: PropTypes.string.isRequired,
};

AnnotationCreation.defaultProps = {
  annotation: null,
  canvases: [],
  closeCompanionWindow: () => {
  },
  currentTime: null,
  setCurrentTime: () => {
  },
  setSeekTo: () => {
  },
};

export default AnnotationCreation;
