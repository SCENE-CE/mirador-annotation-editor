import React, { Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Paper, Grid, Popover, Divider,
  MenuList, MenuItem, ClickAwayListener,
} from '@mui/material';
import { Alarm, LastPage } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import RectangleIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import PolygonIcon from '@mui/icons-material/Timeline';
import GestureIcon from '@mui/icons-material/Gesture';
import ClosedPolygonIcon from '@mui/icons-material/ChangeHistory';
import OpenPolygonIcon from '@mui/icons-material/ShowChart';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import StrokeColorIcon from '@mui/icons-material/BorderColor';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import TitleIcon from '@mui/icons-material/Title';
import { SketchPicker } from 'react-color';
import { styled } from '@mui/material/styles';
import { v4 as uuid } from 'uuid';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import { exportStageSVG } from 'react-konva-to-svg';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AnnotationDrawing from './AnnotationDrawing';
import TextEditor from './TextEditor';
import WebAnnotation from './WebAnnotation';
import CursorIcon from './icons/Cursor';
import HMSInput from './HMSInput';
import ImageFormField from './ImageFormField';
import { secondsToHMS } from './utils';

/** Extract time information from annotation target */
function timeFromAnnoTarget(annotarget) {
  console.info('TODO proper time extraction from: ', annotarget);
  // TODO w3c media fragments: t=,10 t=5,
  const r = /t=([0-9.]+),([0-9.]+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return [0, 0];
  }
  return [Number(r[1]), Number(r[2])];
}

/** Extract xywh from annotation target */
function geomFromAnnoTarget(annotarget) {
  console.info('TODO proper xywh extraction from: ', annotarget);
  const r = /xywh=((-?[0-9]+,?)+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return '';
  }
  return r[1];
}

/** Component for creating annotations.
 * Display in companion window when a manifest is open and an annoation created or edited */
function AnnotationCreation(props) {
  // Initial state setup
  const [state, setState] = useState(() => {
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
              [annoState.tstart, annoState.tend] = timeFromAnnoTarget(selector.value);
            }
          });
        } else {
          annoState.svg = props.annotation.target.selector.value;
          // TODO does this happen ? when ? where are fragments selectors ?
        }
      } else if (typeof props.annotation.target === 'string') {
        annoState.xywh = geomFromAnnoTarget(props.annotation.target);
        [annoState.tstart, annoState.tend] = timeFromAnnoTarget(props.annotation.target);
      }
    }

    const toolState = {
      activeTool: 'cursor',
      closedMode: 'closed',
      colorPopoverOpen: false,
      currentColorType: false,
      fillColor: null,
      strokeColor: '#00BFFF',
      strokeWidth: 3,
      ...(props.config.annotation.defaults || {}),
    };

    const timeState = props.currentTime !== null
      ? { tend: Math.floor(props.currentTime) + 10, tstart: Math.floor(props.currentTime) }
      : { tend: null, tstart: null };

    return {
      ...toolState,
      ...timeState,
      activeTool: 'cursor',
      closedMode: 'closed',
      currentColorType: false,
      fillColor: null,
      image: { id: null },
      lineWeightPopoverOpen: false,
      mediaVideo: null,
      popoverAnchorEl: null,
      popoverLineWeightAnchorEl: null,
      textBody: '',
      textEditorStateBustingKey: 0,
      ...annoState,
      valuetextTime: '',
      valueTime: [0, 1],
    };
  });

  // You can use useEffect for componentDidMount, componentDidUpdate, and componentWillUnmount
  useEffect(() => {
    // componentDidMount logic
    const mediaVideo = VideosReferences.get(props.windowId);
    setState((prevState) => ({ ...prevState, mediaVideo }));

    // componentWillUnmount logic (if needed)
    return () => {
      // cleanup logic here
    };
  }, []); // Empty array means this effect runs once, similar to componentDidMount
  // listen on window id ?

  /** */
  const handleImgChange = (newUrl, imgRef) => {
    setState((prevState) => ({
      ...prevState,
      image: { ...prevState.image, id: newUrl },
    }));
  };

  /** */
  const handleCloseLineWeight = (e) => {
    setState((prevState) => ({
      ...prevState,
      lineWeightPopoverOpen: false,
      popoverLineWeightAnchorEl: null,
    }));
  };

  /** */
  const handleLineWeightSelect = (e) => {
    setState((prevState) => ({
      ...prevState,
      lineWeightPopoverOpen: false,
      popoverLineWeightAnchorEl: null,
      strokeWidth: e.currentTarget.value,
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

  /**
   * @param {Event} event
   * @param {number} newValueTime
   */
  const handleChangeTime = (event, newValueTime) => {
    const timeStart = newValueTime[0];
    const timeEnd = newValueTime[1];
    updateTstart(timeStart);
    updateTend(timeEnd);
    seekToTstart();
    seekToTend();
    setValueTime(newValueTime);
  };

  /** update annotation start time */
  const updateTstart = (value) => {
    setState((prevState) => ({
      ...prevState,
      tstart: value,
    }));
  };

  /** update annotation end time */
  const updateTend = (value) => {
    setState((prevState) => ({
      ...prevState,
      tend: value,
    }));
  };

  /** update annotation title */
  const updateTitle = (e) => {
    setState((prevState) => ({
      ...prevState,
      title: e.target.value,
    }));
  };

  /** seekTo/goto annotation end time */
  const seekToTend = () => {
    setState((prevState) => ({
      ...prevState,
      ...props.setSeekTo(prevState.tend),
      ...props.setCurrentTime(prevState.tend),
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

  // eslint-disable-next-line require-jsdoc
  const valuetextTime = () => state.valueTime;

  /** */
  const openChooseColor = (e) => {
    setState((prevState) => ({
      ...prevState,
      colorPopoverOpen: true,
      currentColorType: e.currentTarget.value,
      popoverAnchorEl: e.currentTarget,
    }));
  };

  /** */
  const openChooseLineWeight = (e) => {
    setState((prevState) => ({
      ...prevState,
      lineWeightPopoverOpen: true,
      popoverLineWeightAnchorEl: e.currentTarget,
    }));
  };

  /** Close color popover window */
  const closeChooseColor = (e) => {
    setState((prevState) => ({
      ...prevState,
      colorPopoverOpen: false,
      currentColorType: null,
      popoverAnchorEl: null,
    }));
  };

  /** Update strokecolor */
  const updateStrokeColor = (color) => {
    setState((prevState) => ({
      ...prevState,
      [prevState.currentColorType]: color.hex,
    }));
  };

  /**
   * Get SVG picture containing all the stuff draw in the stage (Konva Stage).
   * This image will be put in overlay of the iiif media
   */
  const getSvg = async () => {
    const stage = window.Konva.stages.find((stage) => stage.attrs.id === props.windowId);
    const svg = await exportStageSVG(stage); // TODO clean
    return svg;
  };

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
      submitForm(e);
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

    console.log('submitting form', state);

    // TODO rename variable for better comprenhension
    const svg = await getSvg();

    console.log('svg', svg);
    const t = (tstart && tend) ? `${tstart},${tend}` : null;
    const body = { value: (!textBody.length && t) ? `${secondsToHMS(tstart)} -> ${secondsToHMS(tend)}` : textBody };

    // TODO promises not handled. Use promiseAll ?
    canvases.forEach(async (canvas) => {
      const storageAdapter = config.annotation.adapter(canvas.id);
      const anno = new WebAnnotation({
        title,
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
      }).toJson();

      console.log(anno);

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
      title: '',
      image: { id: null },
      svg: null,
      tend: 0,
      textBody: '',
      textEditorStateBustingKey: textEditorStateBustingKey + 1,
      tstart: 0,
      xywh: null,
    });
  };

  /** */
  const changeTool = (e, tool) => {
    setState((prevState) => ({
      ...prevState,
      activeTool: tool,
    }));
  };

  /** */
  const changeClosedMode = (e) => {
    setState((prevState) => ({
      ...prevState,
      closedMode: e.currentTarget.value,
    }));
  };

  /** */
  const updateTextBody = (textBody) => {
    setState((prevState) => ({
      ...prevState,
      textBody,
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
  const updateGeometry = ({
    svg,
    xywh,
  }) => {
    setState((prevState) => ({
      ...prevState,
      svg,
      xywh,
    }));
  };

  /** */
  const {
    annotation,
    closeCompanionWindow,
    id,
    windowId,
  } = props;

  const {
    activeTool,
    colorPopoverOpen,
    currentColorType,
    fillColor,
    popoverAnchorEl,
    strokeColor,
    popoverLineWeightAnchorEl,
    lineWeightPopoverOpen,
    strokeWidth,
    closedMode,
    textBody,
    tstart,
    tend,
    textEditorStateBustingKey,
    image,
    valueTime,
    mediaVideo,
    title,
  } = state;

  // TODO : Vérifier ce code, c'est étrange de comprarer un typeof à une chaine de caractère.
  const mediaIsVideo = typeof VideosReferences.get(windowId) !== 'undefined';
  if (mediaIsVideo) {
    valueTime[0] = tstart;
    valueTime[1] = tend;
  }
  const myVideo = VideosReferences.get(windowId)
  const videoDuration = myVideo.props.canvas.__jsonld.duration
  return (
    <CompanionWindow
      title={title ? title.value : 'New Annotation'}
      windowId={windowId}
      id={id}
    >
      <AnnotationDrawing
        activeTool={activeTool}
        annotation={annotation}
        fillColor={fillColor}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        closed={closedMode === 'closed'}
        updateGeometry={updateGeometry}
        windowId={windowId}
        player={mediaIsVideo ? VideosReferences.get(windowId) : OSDReferences.get(windowId)}
        /// we need to pass the width and height of the image to the annotation drawing component
        width={1920}
        height={1080}
        setShapeProperties={setShapeProperties}
        // TODO Ajouter du style pour que le Konva et la vidéo se superpose
      />
      <StyledForm
        onSubmit={submitForm}
      >
        <div>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              onChange={updateTitle}
            />
          </Grid>
        </div>
        <Grid>
          <TextEditor
            key={textEditorStateBustingKey}
            annoHtml={textBody}
            updateAnnotationBody={updateTextBody}
          />
        </Grid>
        <div>

          {mediaIsVideo && (
            <>
              <Grid
                item
                xs={12}
              >
                <Typography id="range-slider" variant="overline">
                  Display period
                </Typography>
                  <div>
                    <Typography>
                      {videoDuration}
                    </Typography>
                    <Slider
                      value={valueTime}
                      onChange={handleChangeTime}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      max={Math.round(videoDuration)}
                      color="secondary"
                      windowid={windowId}
                      sx={{
                        color: 'rgba(1, 0, 0, 0.38)',
                      }}
                    />
                  </div>
              </Grid>
              <div style={{
                alignContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '5px',
              }}
              >
                <div style={{
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  justifyContent: 'center',
                  padding: '5px',
                }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  >
                    <div>
                      <p style={{
                        fontSize: '15px',
                        margin: 0,
                        minWidth: '40px',
                      }}
                      >
                        Start
                      </p>
                    </div>
                    <ToggleButton
                      value="true"
                      title="Set current time"
                      size="small"
                      onClick={setTstartNow}
                      style={{
                        border: 'none',
                        height: '30px',
                        margin: 'auto',
                        marginLeft: '0',
                        marginRight: '5px',
                      }}
                    >
                      <Alarm fontSize="small" />
                    </ToggleButton>
                  </div>
                  <HMSInput seconds={tstart} onChange={updateTstart} />
                </div>
                <div style={{
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '4px',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  justifyContent: 'center',
                  padding: '5px',
                }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  >
                    <div>
                      <p style={{
                        fontSize: '15px',
                        margin: 0,
                        minWidth: '40px',
                      }}
                      >
                        End
                      </p>
                    </div>
                    <ToggleButton
                      value="true"
                      title="Set current time"
                      size="small"
                      onClick={setTendNow}
                      style={{
                        border: 'none',
                        height: '30px',
                        margin: 'auto',
                        marginLeft: '0',
                        marginRight: '5px',
                      }}
                    >
                      <Alarm fontSize="small" />
                    </ToggleButton>
                  </div>
                  <HMSInput seconds={tend} onChange={updateTend} />
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="overline">
                Image Content
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ marginBottom: 10 }}>
              <ImageFormField value={image} onChange={handleImgChange} />
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="overline">
                Target
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                <StyledToggleButtonGroup
                  value={activeTool}
                  exclusive
                  onChange={changeTool}
                  aria-label="tool selection"
                  size="small"
                >

                  <ToggleButton value="text" aria-label="select text">
                    <TitleIcon />
                  </ToggleButton>
                  <ToggleButton value="cursor" aria-label="select cursor">
                    <CursorIcon />
                  </ToggleButton>
                  <ToggleButton value="edit" aria-label="select cursor">
                    <FormatShapesIcon />
                  </ToggleButton>
                  <ToggleButton value="debug" aria-label="select cursor">
                    <AccessibilityNewIcon />
                  </ToggleButton>
                </StyledToggleButtonGroup>
                <StyledDivider
                  flexItem
                  orientation="vertical"
                />
                <StyledToggleButtonGroup
                  value={activeTool}
                  exclusive
                  onChange={changeTool}
                  aria-label="tool selection"
                  size="small"
                >
                  <ToggleButton value="arrow" aria-label="add an arrow">
                    <ArrowOutwardIcon />
                  </ToggleButton>
                  <ToggleButton value="rectangle" aria-label="add a rectangle">
                    <RectangleIcon />
                  </ToggleButton>
                  <ToggleButton value="ellipse" aria-label="add a circle">
                    <CircleIcon />
                  </ToggleButton>
                  <ToggleButton value="polygon" aria-label="add a polygon">
                    <PolygonIcon />
                  </ToggleButton>
                  <ToggleButton value="freehand" aria-label="free hand polygon">
                    <GestureIcon />
                  </ToggleButton>
                </StyledToggleButtonGroup>
              </Paper>
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="overline">
                Style
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ToggleButtonGroup
                aria-label="style selection"
                size="small"
              >
                <ToggleButton
                  value="strokeColor"
                  aria-label="select color"
                  onClick={openChooseColor}
                >
                  <StrokeColorIcon style={{ fill: strokeColor }} />
                  <ArrowDropDownIcon />
                </ToggleButton>
                <ToggleButton
                  value="strokeColor"
                  aria-label="select line weight"
                  onClick={openChooseLineWeight}
                >
                  <LineWeightIcon />
                  <ArrowDropDownIcon />
                </ToggleButton>
                <ToggleButton
                  value="fillColor"
                  aria-label="select color"
                  onClick={openChooseColor}
                >
                  <FormatColorFillIcon style={{ fill: fillColor }} />
                  <ArrowDropDownIcon />
                </ToggleButton>
              </ToggleButtonGroup>

              <StyledDivider flexItem orientation="vertical" />
              { /* close / open polygon mode only for freehand drawing mode. */
                activeTool === 'freehand'
                  ? (
                    <ToggleButtonGroup
                      size="small"
                      value={closedMode}
                      onChange={changeClosedMode}
                    >
                      <ToggleButton value="closed">
                        <ClosedPolygonIcon />
                      </ToggleButton>
                      <ToggleButton value="open">
                        <OpenPolygonIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )
                  : null
              }
            </Grid>
          </Grid>
        </div>
        <div>
          <Button onClick={closeCompanionWindow}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </div>
      </StyledForm>
      <Popover
        open={lineWeightPopoverOpen}
        anchorEl={popoverLineWeightAnchorEl}
      >
        <Paper>
          <ClickAwayListener onClickAway={handleCloseLineWeight}>
            <MenuList autoFocus role="listbox">
              {[1, 3, 5, 10, 50].map((option, index) => (
                <MenuItem
                  key={option}
                  onClick={handleLineWeightSelect}
                  value={option}
                  selected={option == strokeWidth}
                  role="option"
                  aria-selected={option == strokeWidth}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popover>
      <Popover
        open={colorPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={closeChooseColor}
      >
        <SketchPicker
          // eslint-disable-next-line react/destructuring-assignment
          color={state[currentColorType] || {}}
          onChangeComplete={updateStrokeColor}
        />
      </Popover>
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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '&:first-of-type': {
    borderRadius: theme.shape.borderRadius,
  },
  '&:not(:first-of-type)': {
    borderRadius: theme.shape.borderRadius,
  },
  border: 'none',
  margin: theme.spacing(0.5),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0.5),
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
