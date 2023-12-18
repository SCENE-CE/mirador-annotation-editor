import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Paper, Grid, Popover, Divider,
  MenuList, MenuItem, ClickAwayListener,
} from '@material-ui/core';
import { Alarm, LastPage } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import RectangleIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import PolygonIcon from '@material-ui/icons/Timeline';
import GestureIcon from '@material-ui/icons/Gesture';
import ClosedPolygonIcon from '@material-ui/icons/ChangeHistory';
import OpenPolygonIcon from '@material-ui/icons/ShowChart';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import StrokeColorIcon from '@material-ui/icons/BorderColor';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import FormatShapesIcon from '@material-ui/icons/FormatShapes';
import { SketchPicker } from 'react-color';
import { v4 as uuid } from 'uuid';
import { withStyles } from '@material-ui/core/styles';
import CompanionWindow from 'mirador/dist/es/src/containers/CompanionWindow';
import { VideosReferences } from 'mirador/dist/es/src/plugins/VideosReferences';
import { OSDReferences } from 'mirador/dist/es/src/plugins/OSDReferences';
import Slider from '@material-ui/core/Slider';
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

/** */
class AnnotationCreation extends Component {
  /** */
  constructor(props) {
    super(props);

    const annoState = {};
    if (props.annotation) {
      //
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

    this.state = {
      ...toolState,
      ...timeState,
      activeTool: 'cursor',
      closedMode: 'closed',
      currentColorType: false,
      fillColor: null,
      image: { id: null },
      lineWeightPopoverOpen: false,
      popoverAnchorEl: null,
      popoverLineWeightAnchorEl: null,
      svg: null,
      textBody: '',
      textEditorStateBustingKey: 0,
      // eslint-disable-next-line sort-keys,max-len
      // TO DO : The state must be updated with the video's timing information when the component is mounted
      valueTime: [0, 13],
      xywh: null,
      ...annoState,
      valuetextTime: '',
    };

    this.submitForm = this.submitForm.bind(this);
    // this.updateBody = this.updateBody.bind(this);
    this.updateTextBody = this.updateTextBody.bind(this);
    this.updateTstart = this.updateTstart.bind(this);
    this.updateTend = this.updateTend.bind(this);
    this.setTstartNow = this.setTstartNow.bind(this);
    this.setTendNow = this.setTendNow.bind(this);
    this.seekToTstart = this.seekToTstart.bind(this);
    this.seekToTend = this.seekToTend.bind(this);
    this.updateGeometry = this.updateGeometry.bind(this);
    this.changeTool = this.changeTool.bind(this);
    this.changeClosedMode = this.changeClosedMode.bind(this);
    this.openChooseColor = this.openChooseColor.bind(this);
    this.openChooseLineWeight = this.openChooseLineWeight.bind(this);
    this.handleLineWeightSelect = this.handleLineWeightSelect.bind(this);
    this.handleCloseLineWeight = this.handleCloseLineWeight.bind(this);
    this.closeChooseColor = this.closeChooseColor.bind(this);
    this.updateStrokeColor = this.updateStrokeColor.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.valuetextTime = this.valuetextTime.bind(this);
  }

  /** */
  handleImgChange(newUrl, imgRef) {
    const { image } = this.state;
    this.setState({ image: { ...image, id: newUrl } });
  }

  /** */
  handleCloseLineWeight(e) {
    this.setState({
      lineWeightPopoverOpen: false,
      popoverLineWeightAnchorEl: null,
    });
  }

  /** */
  handleLineWeightSelect(e) {
    this.setState({
      lineWeightPopoverOpen: false,
      popoverLineWeightAnchorEl: null,
      strokeWidth: e.currentTarget.value,
    });
  }

  /** set annotation start time to current time */
  setTstartNow() {
    // eslint-disable-next-line react/destructuring-assignment
    this.setState({ tstart: Math.floor(this.props.currentTime) });
  }

  /** set annotation end time to current time */
  setTendNow() {
    // eslint-disable-next-line react/destructuring-assignment
    this.setState({ tend: Math.floor(this.props.currentTime) });
  }

  handleChangeTime = (event, newValueTime) => {
    const timeStart = newValueTime[0];
    const timeEnd = newValueTime[1];
    this.updateTstart(timeStart);
    this.updateTend(timeEnd);
    this.seekToTstart();
    this.seekToTend();
    this.setState({ valueTime: newValueTime });
  };

  /** update annotation start time */
  updateTstart(value) { this.setState({ tstart: value }); }

  /** update annotation end time */
  updateTend(value) { this.setState({ tend: value }); }

  /** seekTo/goto annotation start time */

  /** seekTo/goto annotation end time */
  seekToTend() {
    const { paused, setCurrentTime, setSeekTo } = this.props;
    const { tend } = this.state;
    if (!paused) {
      this.setState(setSeekTo(tend));
    } else {
      this.setState(setCurrentTime(tend));
    }
  }

  // eslint-disable-next-line require-jsdoc
  seekToTstart() {
    const { paused, setCurrentTime, setSeekTo } = this.props;
    const { tstart } = this.state;
    if (!paused) {
      this.setState(setSeekTo(tstart));
    } else {
      this.setState(setCurrentTime(tstart));
    }
  }

  // eslint-disable-next-line require-jsdoc
  valuetextTime() {
    return this.valueTime;
  }

  /** */
  openChooseColor(e) {
    this.setState({
      colorPopoverOpen: true,
      currentColorType: e.currentTarget.value,
      popoverAnchorEl: e.currentTarget,
    });
  }

  /** */
  openChooseLineWeight(e) {
    this.setState({
      lineWeightPopoverOpen: true,
      popoverLineWeightAnchorEl: e.currentTarget,
    });
  }

  /** */
  closeChooseColor(e) {
    this.setState({
      colorPopoverOpen: false,
      currentColorType: null,
      popoverAnchorEl: null,
    });
  }

  /** */
  updateStrokeColor(color) {
    const { currentColorType } = this.state;
    this.setState({
      [currentColorType]: color.hex,
    });
  }

  /** */
  submitForm(e) {
    e.preventDefault();
    const {
      annotation, canvases, receiveAnnotation, config,
    } = this.props;
    const {
      textBody, image, tags, xywh, svg, tstart, tend, textEditorStateBustingKey,
    } = this.state;
    const t = (tstart && tend) ? `${tstart},${tend}` : null;
    const body = { value: (!textBody.length && t) ? `${secondsToHMS(tstart)} -> ${secondsToHMS(tend)}` : textBody };

    canvases.forEach((canvas) => {
      const storageAdapter = config.annotation.adapter(canvas.id);

      const anno = new WebAnnotation({
        body,
        canvasId: canvas.id,
        fragsel: { t, xywh },
        id: (annotation && annotation.id) || `${uuid()}`,
        image,
        manifestId: canvas.options.resource.id,
        svg,
        tags,
      }).toJson();

      if (annotation) {
        storageAdapter.update(anno).then((annoPage) => {
          receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
        });
      } else {
        storageAdapter.create(anno).then((annoPage) => {
          receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
        });
      }
    });

    this.setState({
      image: { id: null },
      svg: null,
      tend: null,
      textBody: '',
      textEditorStateBustingKey: textEditorStateBustingKey + 1,
      tstart: null,
      xywh: null,
    });
  }

  /** */
  changeTool(e, tool) {
    this.setState({
      activeTool: tool,
    });
  }

  /** */
  changeClosedMode(e) {
    this.setState({
      closedMode: e.currentTarget.value,
    });
  }

  /** */
  updateTextBody(textBody) {
    this.setState({ textBody });
  }

  /** */
  updateGeometry({ svg, xywh }) {
    this.setState({
      svg, xywh,
    });
  }

  /** */
  render() {
    const {
      annotation, classes, closeCompanionWindow, id, windowId,
    } = this.props;

    const {
      activeTool, colorPopoverOpen, currentColorType, fillColor, popoverAnchorEl,
      strokeColor, popoverLineWeightAnchorEl, lineWeightPopoverOpen, strokeWidth, closedMode,
      textBody, svg, tstart, tend,
      textEditorStateBustingKey, image, valueTime,
    } = this.state;

    const mediaIsVideo = typeof VideosReferences.get(windowId) !== 'undefined';

    return (
      <CompanionWindow
        title={annotation ? 'Edit annotation' : 'New annotation'}
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
          svg={svg}
          updateGeometry={this.updateGeometry}
          windowId={windowId}
          player={mediaIsVideo ? VideosReferences.get(windowId) : OSDReferences.get(windowId)}
        />
        <form onSubmit={this.submitForm} className={classes.section}>
          <div>
            <Grid item xs={12}>
              <Typography variant="overline">
                Text Content
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextEditor
                key={textEditorStateBustingKey}
                annoHtml={textBody}
                updateAnnotationBody={this.updateTextBody}
              />
            </Grid>
          </div>
          <div>

            { mediaIsVideo && (
            <>
              <Grid item xs={12} className={classes.paper}>
                <Typography id="range-slider" variant="overline">
                  Display period
                </Typography>
                <Slider
                  value={valueTime}
                  onChange={this.handleChangeTime}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  getAriaValueText={this.valuetextTime}
                  max={2000}
                  color="secondary"
                  classes={{
                    root: classes.MuiSliderColorSecondary,
                  }}
                />
              </Grid>
              <div className={`${classes.paper} ${classes.selectTimeField} `}>
                <div className={`${classes.paper} ${classes.selectTimeModule} `}>
                  <div className={classes.buttonTimeContainer}>
                    <div>
                      <p className={classes.textTimeButton}>Start</p>
                    </div>
                    <ToggleButton
                      value="true"
                      title="Set current time"
                      size="small"
                      onClick={this.setTstartNow}
                      className={classes.timecontrolsbutton}
                    >
                      <Alarm fontSize="small" />
                    </ToggleButton>
                  </div>
                  <HMSInput seconds={tstart} onChange={this.updateTstart} />
                </div>
                <div className={`${classes.paper} ${classes.selectTimeModule}`}>
                  <div className={classes.buttonTimeContainer}>
                    <div>
                      <p className={classes.textTimeButton}>End</p>
                    </div>
                    <ToggleButton
                      value="true"
                      title="Set current time"
                      size="small"
                      onClick={this.setTendNow}
                      className={classes.timecontrolsbutton}
                    >
                      <Alarm fontSize="small" />
                    </ToggleButton>
                  </div>
                  <HMSInput seconds={tend} onChange={this.updateTend} />
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
                <ImageFormField value={image} onChange={this.handleImgChange} />
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
                <Paper elevation={0} className={classes.paper}>
                  <ToggleButtonGroup
                    className={classes.grouped}
                    value={activeTool}
                    exclusive
                    onChange={this.changeTool}
                    aria-label="tool selection"
                    size="small"
                  >
                    <ToggleButton value="cursor" aria-label="select cursor">
                      <CursorIcon />
                    </ToggleButton>
                    <ToggleButton value="edit" aria-label="select cursor">
                      <FormatShapesIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Divider flexItem orientation="vertical" className={classes.divider} />
                  <ToggleButtonGroup
                    className={classes.grouped}
                    value={activeTool}
                    exclusive
                    onChange={this.changeTool}
                    aria-label="tool selection"
                    size="small"
                  >
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
                  </ToggleButtonGroup>
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
                    onClick={this.openChooseColor}
                  >
                    <StrokeColorIcon style={{ fill: strokeColor }} />
                    <ArrowDropDownIcon />
                  </ToggleButton>
                  <ToggleButton
                    value="strokeColor"
                    aria-label="select line weight"
                    onClick={this.openChooseLineWeight}
                  >
                    <LineWeightIcon />
                    <ArrowDropDownIcon />
                  </ToggleButton>
                  <ToggleButton
                    value="fillColor"
                    aria-label="select color"
                    onClick={this.openChooseColor}
                  >
                    <FormatColorFillIcon style={{ fill: fillColor }} />
                    <ArrowDropDownIcon />
                  </ToggleButton>
                </ToggleButtonGroup>

                <Divider flexItem orientation="vertical" className={classes.divider} />
                { /* close / open polygon mode only for freehand drawing mode. */
                  activeTool === 'freehand'
                    ? (
                      <ToggleButtonGroup
                        size="small"
                        value={closedMode}
                        onChange={this.changeClosedMode}
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
        </form>
        <Popover
          open={lineWeightPopoverOpen}
          anchorEl={popoverLineWeightAnchorEl}
        >
          <Paper>
            <ClickAwayListener onClickAway={this.handleCloseLineWeight}>
              <MenuList autoFocus role="listbox">
                {[1, 3, 5, 10, 50].map((option, index) => (
                  <MenuItem
                    key={option}
                    onClick={this.handleLineWeightSelect}
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
          onClose={this.closeChooseColor}
        >
          <SketchPicker
            // eslint-disable-next-line react/destructuring-assignment
            color={this.state[currentColorType] || {}}
            onChangeComplete={this.updateStrokeColor}
          />
        </Popover>
      </CompanionWindow>
    );
  }
}
/** */
const styles = (theme) => ({
  buttonTimeContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  divider: {
    margin: theme.spacing(1, 0.5),
  },
  grouped: {
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    border: 'none',
    margin: theme.spacing(0.5),
  },
  MuiSliderColorSecondary: {
    color: 'rgba(1, 0, 0, 0.38)',
  },
  paper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
  selectTimeField: {
    alignContent: 'center',
    display: 'flex',
    flexDirection: 'wrap',
    gap: '5px',
    padding: '5px',
  },
  selectTimeModule: {
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '4px',
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    padding: '5px',
  },
  textTimeButton: {
    fontSize: '15px',
    margin: 0,
  },
  timecontrolsbutton: {
    border: 'none',
    height: '30px',
    margin: 'auto',
    marginLeft: '0',
    marginRight: '5px',
    width: '30px',
  },
});

AnnotationCreation.propTypes = {
  // TODO proper web annotation type ?
  annotation: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  canvases: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, index: PropTypes.number }),
  ),
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
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
  paused: PropTypes.bool,
  receiveAnnotation: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func,
  setSeekTo: PropTypes.func,
  windowId: PropTypes.string.isRequired,
};

AnnotationCreation.defaultProps = {
  annotation: null,
  canvases: [],
  closeCompanionWindow: () => {},
  currentTime: null,
  paused: true,
  setCurrentTime: () => {},
  setSeekTo: () => {},
};

export default withStyles(styles)(AnnotationCreation);
