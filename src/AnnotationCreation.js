import React, { useEffect, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { v4 as uuid } from 'uuid';
import { exportStageSVG } from 'react-konva-to-svg';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import { VideosReferences } from "mirador/dist/es/src/plugins/VideosReferences";
import Tab from '@mui/material/Tab';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import LayersIcon from '@mui/icons-material/Layers';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HubIcon from '@mui/icons-material/Hub';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import AnnotationDrawing from './annotationForm/AnnotationDrawing';
import WebAnnotation from './WebAnnotation';
import { secondsToHMS } from './utils';
import AnnotationFormContent from './annotationForm/AnnotationFormContent';
import AnnotationFormTime from './annotationForm/AnnotationFormTime';
import AnnotationFormDrawing from './annotationForm/AnnotationFormDrawing';
import { geomFromAnnoTarget, timeFromAnnoTarget } from './AnnotationCreationUtils';

const TARGET_VIEW = 'target';
const OVERLAY_VIEW = 'layer';
const TAG_VIEW = 'tag';
const MANIFEST_LINK_VIEW = 'link';


/** Component for creating annotations.
 * Display in companion window when a manifest is open and an annoation created or edited */
function AnnotationCreation(props) {
  const [toolState, setToolState] = useState({
    activeTool: 'cursor',
    closedMode: 'closed',
    colorPopoverOpen: false,
    currentColorType: false,
    fillColor: 'rgba(255, 0, 0, 0.5)',
    image: { id: null },
    imageEvent: null,
    lineWeightPopoverOpen: false,
    popoverAnchorEl: null,
    popoverLineWeightAnchorEl: null,
    strokeColor: 'green',
    strokeWidth: 3,
  });

  // Initial state setup
  const [state, setState] = useState(() => {
    let tstart;
    let tend;
    const annoState = {};
    if (props.annotation) {
      // annotation body
      if (Array.isArray(props.annotation.body)) {
        annoState.tags = [];
        props.annotation.body.forEach((body) => {
          if (body.purpose === 'tagging' && body.type === 'TextualBody') {
            annoState.tags.push(body.value);
          } else if (body.type === 'TextualBody') {
            annoState.textBody = body.value;
          } else if (body.type === 'Image') {
            // annoState.textBody = body.value; // why text body here ???
            annoState.image = body;
          } else if (body.type === 'AnnotationTitle') {
            annoState.title = body;
          }
        });
      } else if (props.annotation.body.type === 'TextualBody') {
        annoState.textBody = props.annotation.body.value;
      } else if (props.annotation.body.type === 'Image') {
        // annoState.textBody = props.annotation.body.value; // why text body here ???
        annoState.image = props.annotation.body;
      }
      //
      // drawing position
      if (props.annotation.target.selector) {
        if (Array.isArray(props.annotation.target.selector)) {
          props.annotation.target.selector.forEach((selector) => {
            if (selector.type === 'SvgSelector') {
              annoState.svg = selector.value;
            } else if (selector.type === 'FragmentSelector') {
              // TODO proper fragment selector extraction
              annoState.xywh = geomFromAnnoTarget(selector.value);
              [tstart, tend] = timeFromAnnoTarget(selector.value);
            }
          });
        } else {
          annoState.svg = props.annotation.target.selector.value;
          // TODO does this happen ? when ? where are fragments selectors ?
        }
      } else if (typeof props.annotation.target === 'string') {
        annoState.xywh = geomFromAnnoTarget(props.annotation.target);
        [tstart, tend] = timeFromAnnoTarget(props.annotation.target);
      }
    }

    // If we don't have tstart setted, we are creating a new annotation.
    // If we don't have tend setted, we set it at the end of the video.
    // So Tstart is current time and Tend the end of the video
    if (!tstart) {
      tstart = props.currentTime ? Math.floor(props.currentTime) : 0;
      tend = props.mediaVideo ? props.mediaVideo.props.canvas.__jsonld.duration : 0;
    }

    return {
      ...toolState,
      mediaVideo: props.mediaVideo,
      ...annoState,
      tend,
      textEditorStateBustingKey: 0,
      tstart,
      valueTime: [0, 1],
      valuetextTime: '',
    };
  });

  const [shapes, setShapes] = useState([]);
  const [scale, setScale] = useState(1);

  const [value, setValue] = useState(TARGET_VIEW);
  const { height, width } = props.mediaVideo ? props.mediaVideo : 0;

  // TODO Check the effect to keep and remove the other
  // Add a state to trigger redraw
  const [windowSize, setWindowSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // Listen to window resize event
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
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

  /** */
  const handleImgChange = (newUrl, imgRef) => {
    setToolState((prevState) => ({
      ...prevState,
      image: { ...prevState.image, id: newUrl },
    }));
  };

  /** set annotation start time to current time */
  const setTstartNow = () => {
    setState((prevState) => ({
      ...prevState,
      tstart: Math.floor(props.currentTime),
    }));
  };

  /** set annotation end time to current time */
  const setTendNow = () => {
    setState((prevState) => ({
      ...prevState,
      tend: Math.floor(props.currentTime),
    }));
  };

  /**
     * @param {number} newValueTime
     */
  const setValueTime = (newValueTime) => {
    setState((prevState) => ({
      ...prevState,
      valueTime: newValueTime,
    }));
  };
  const tabHandler = (event, TabIndex) => {
    setValue(TabIndex);
  };
  /**
   * Change from slider
   * @param {Event} event
   * @param {number} newValueTime
   */
  const handleChangeTime = (event, newValueTime) => {
    const timeStart = newValueTime[0];
    const timeEnd = newValueTime[1];
    updateTstart(timeStart);
    updateTend(timeEnd);
    seekToTstart();
    setValueTime(newValueTime);
  };

  /** Change from Tstart HMS Input */
  const updateTstart = (value) => {
    if (value > state.tend) {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      tstart: value,
      ...props.setSeekTo(value),
      ...props.setCurrentTime(value),

    }));
  };

  /** update annotation end time */
  const updateTend = (value) => {
    setState((prevState) => ({
      ...prevState,
      tend: value,
    }));
  };

  // eslint-disable-next-line require-jsdoc
  const seekToTstart = () => {
    setState((prevState) => ({
      ...prevState,
      ...props.setSeekTo(prevState.tstart),
      ...props.setCurrentTime(prevState.tstart),
    }));
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
     * Get SVG picture containing all the stuff draw in the stage (Konva Stage).
     * This image will be put in overlay of the iiif media
     */
  const getSvg = async () => {
    const stage = window.Konva.stages.find((s) => s.attrs.id === props.windowId);
    const svg = await exportStageSVG(stage); // TODO clean
    return svg;
  };


  /** Set color tool from current shape */
  const setColorToolFromCurrentShape = (colorState) => {
    setToolState((prevState) => ({
      ...prevState,
      ...colorState,
    }));
  }


  /** update shapes with shapes from annotationDrawing */

  const updateShapes = (newShapes) => {

    setShapes(newShapes);
  }

  /** delete shape */

  const deleteShape = (shapeId) => {

    const newShapes = shapes.filter((shape) => shape.id !== shapeId);
    setShapes(newShapes);
  }

  /**
     * Validate form and save annotation
     */
  const submitForm = async (e) => {
    e.preventDefault();
    // TODO Possibly problem of syncing
    // TODO Improve this code
    // If we are in edit mode, we have the transformer on the stage saved in the annotation
    if (state.activeTool === 'edit') {
      setState((prevState) => ({
        ...prevState,
        activeTool: 'cursor',
      }));
      return;
    }

    const {
      annotation,
      canvases,
      receiveAnnotation,
      config,
    } = props;

    const {
      title,
      textBody,
      image,
      tags,
      xywh,
      tstart,
      tend,
      textEditorStateBustingKey,
    } = state;

    // TODO rename variable for better comprenhension
    const svg = await getSvg();

    const t = (tstart && tend) ? `${tstart},${tend}` : null;
    const body = { value: (!textBody.length && t) ? `${secondsToHMS(tstart)} -> ${secondsToHMS(tend)}` : textBody };

    // TODO promises not handled. Use promiseAll ?
    canvases.forEach(async (canvas) => {
      const storageAdapter = config.annotation.adapter(canvas.id);
      const anno = new WebAnnotation({
        body,
        canvasId: canvas.id,
        fragsel: {
          t,
          xywh,
        },
        id: (annotation && annotation.id) || `${uuid()}`,
        image,
        manifestId: canvas.options.resource.id,
        svg,
        tags,
        title,
      }).toJson();

      if (annotation) {
        storageAdapter.update(anno)
          .then((annoPage) => {
            receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
          });
      } else {
        storageAdapter.create(anno)
          .then((annoPage) => {
            receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
          });
      }
    });

    // TODO check if we need other thing in state
    setState({
      image: { id: null },
      svg: null,
      tend: 0,
      textBody: '',
      textEditorStateBustingKey: textEditorStateBustingKey + 1,
      title: '',
      tstart: 0,
      xywh: null,
    });
  };

  /** */
  const {
    annotation,
    closeCompanionWindow,
    id,
    windowId,
  } = props;

  const {
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

  // TODO : Vérifier ce code, c'est étrange de comprarer un typeof à une chaine de caractère.
  const mediaIsVideo = props.mediaVideo !== 'undefined';
  if (mediaIsVideo) {
    valueTime[0] = tstart;
    valueTime[1] = tend;
  }

  const videoDuration = props.mediaVideo ? props.mediaVideo.props.canvas.__jsonld.duration : 0;
  // TODO: L'erreur de "Ref" sur l'ouverture d'une image vient d'ici et plus particulièrement
  //  du useEffect qui prend en dépedance [overlay.containerWidth, overlay.canvasWidth]
  const videoref = VideosReferences.get(windowId);
  const osdref = OSDReferences.get(windowId);
  let overlay = null;
  if (videoref) {
    overlay = videoref.canvasOverlay;
  }
  if (osdref) {
    console.debug('osdref', osdref);
  }

  /** Change scale from container / canva */
  const updateScale = () => {
    setScale(overlay.containerWidth / overlay.canvasWidth);
  };

  useEffect(() => {
  }, [overlay.containerWidth, overlay.canvasWidth]);

  return (
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
        player={mediaIsVideo ? props.mediaVideo : OSDReferences.get(windowId)}
          // we need to pass the width and height of the image to the annotation drawing component
        width={overlay ? overlay.containerWidth : 1920}
        height={overlay ? overlay.containerHeight : 1080}
        orignalWidth={overlay ? overlay.canvasWidth : 1920}
        orignalHeight={overlay ? overlay.canvasHeight : 1080}
        setShapeProperties={setShapeProperties}
        updateScale={updateScale}
        imageEvent={imageEvent}
        setColorToolFromCurrentShape={setColorToolFromCurrentShape}
        updateShapes={updateShapes}
        shapes={shapes}
        mediaVideo={props.mediaVideo}
      />
      <StyledForm
        onSubmit={submitForm}
      >
        <TabContext value={value}>
          <TabList value={value} onChange={tabHandler} aria-label="icon tabs">
            <StyledTab
              icon={<HighlightAltIcon />}
              aria-label="TargetSelector"
              value={TARGET_VIEW}
            />
            <StyledTab
              icon={<LayersIcon />}
              aria-label="TargetSelector"
              value={OVERLAY_VIEW}
            />
            <StyledTab
              icon={<LocalOfferIcon />}
              aria-label="TargetSelector"
              value={TAG_VIEW}
            />
            <StyledTab
              icon={<HubIcon />}
              aria-label="TargetSelector"
              value={MANIFEST_LINK_VIEW}
            />
          </TabList>
          <StyledTabPanel
            value={TARGET_VIEW}
          >
            {mediaIsVideo && (
              <AnnotationFormTime
                mediaIsVideo={mediaIsVideo}
                videoDuration={videoDuration}
                value={valueTime}
                handleChangeTime={handleChangeTime}
                windowid={windowId}
                setTstartNow={setTstartNow}
                tstart={tstart}
                updateTstart={updateTstart}
                setTendNow={setTendNow}
                tend={tend}
                updateTend={updateTend}
              />
            )}
          </StyledTabPanel>
          <StyledTabPanel
            value={OVERLAY_VIEW}
          >
            <AnnotationFormDrawing
              toolState={toolState}
              updateToolState={setToolState}
              handleImgChange={handleImgChange}
              shapes={shapes}
              deleteShape = {deleteShape}
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
          />
        </TabContext>
        <StyledButtonDivSaveOrCancel>
          <Button onClick={closeCompanionWindow}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </StyledButtonDivSaveOrCancel>
      </StyledForm>
    </CompanionWindow>
  );
}

const StyledButtonDivSaveOrCancel = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
}));

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
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: 'auto',
}));

AnnotationCreation.propTypes = {
  // TODO proper web annotation type ?
  annotation: PropTypes.object, // eslint-disable-line react/forbid-prop-types
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
  receiveAnnotation: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func,
  setSeekTo: PropTypes.func,
  windowId: PropTypes.string.isRequired,
  mediaVideo: PropTypes.object.isRequired,
};

AnnotationCreation.defaultProps = {
  annotation: null,
  canvases: [],
  closeCompanionWindow: () => {
  },
  currentTime: null,
  paused: true,
  setCurrentTime: () => {
  },
  setSeekTo: () => {
  },
};

export default AnnotationCreation;
