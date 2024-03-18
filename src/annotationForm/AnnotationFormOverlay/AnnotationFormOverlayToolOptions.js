import {
  Button,
  ClickAwayListener, Divider, Grid, MenuItem, MenuList, Paper, Popover, TextField,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StrokeColorIcon from '@mui/icons-material/BorderColor';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import React, { useEffect, useState } from 'react';
import ClosedPolygonIcon from '@mui/icons-material/ChangeHistory';
import OpenPolygonIcon from '@mui/icons-material/ShowChart';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { SketchPicker } from 'react-color';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { v4 as uuidv4 } from 'uuid';
import ImageFormField from './ImageFormField';
import { isShapesTool, OVERLAY_TOOL } from '../../AnnotationCreationUtils';
import { defaultLineWeightChoices, KONVA_MODE } from './KonvaDrawing/KonvaUtils';
import { defaultToolState } from '../../AnnotationFormUtils';

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0.5),
}));

const StyledDivButtonImage = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '5px',
}));

/** Utils functions to convert string to object */
const rgbaToObj = (rgba = 'rgba(255,255,255,0.5)') => {
  const rgbaArray = rgba.split(',');
  return {
    // eslint-disable-next-line sort-keys
    r: Number(rgbaArray[0].split('(')[1]),
    // eslint-disable-next-line sort-keys
    g: Number(rgbaArray[1]),
    // eslint-disable-next-line sort-keys
    b: Number(rgbaArray[2]),
    // eslint-disable-next-line sort-keys
    a: Number(rgbaArray[3].split(')')[0]),
  };
};

/** Convert color object to rgba string */
const objToRgba = (obj = {
  // eslint-disable-next-line sort-keys
  r: 255, g: 255, b: 255, a: 0.5,
}) => `rgba(${obj.r},${obj.g},${obj.b},${obj.a})`;

/** All the tools options for the overlay options */
function AnnotationFormOverlayToolOptions({
  setToolState,
  toolState,
  displayMode,
    setDrawingState,
    drawingState
}) {
  // set toolOptionsValue
  const [toolOptions, setToolOptions] = useState({
    colorPopoverOpen: false,
    currentColorType: null,
    lineWeightPopoverOpen: false,
    popoverAnchorEl: null,
    popoverLineWeightAnchorEl: null,
  });

  useEffect(() => {
    // TODO: This useEffect fix the bug on konva to svg but may be useless
  }, []);
  // Set unused default color to avoid error on render
  const currentColor = toolOptions.currentColorType ? rgbaToObj(toolState[toolOptions.currentColorType]) : 'rgba(255, 0, 0, 0.5)';

  // Fonction to manage option displaying
  /** */
  const openChooseLineWeight = (e) => {
    setToolOptions({
      ...toolOptions,
      lineWeightPopoverOpen: true,
      popoverLineWeightAnchorEl: e.currentTarget,
    });
  };

  /** */
  const handleLineWeightSelect = (e) => {
    setToolOptions({
      ...toolOptions,
      lineWeightPopoverOpen: false,
      popoverLineWeightAnchorEl: null,
    });
    setToolState({
      ...toolState,
      strokeWidth: e.currentTarget.value,
    });
  };

  /** Close color popover window */
  const closeChooseColor = (e) => {
    setToolOptions({
      ...toolOptions,
      colorPopoverOpen: false,
      currentColorType: null,
      popoverAnchorEl: null,
    });
  };

  /** */
  const openChooseColor = (e) => {
    setToolOptions({
      ...toolOptions,
      colorPopoverOpen: true,
      currentColorType: e.currentTarget.value,
      popoverAnchorEl: e.currentTarget,
    });
  };

  /** */
  const handleCloseLineWeight = (e) => {
    setToolOptions({
      ...toolOptions,
      lineWeightPopoverOpen: false,
      popoverLineWeightAnchorEl: null,
    });
  };

  /**  closed mode change */
  const changeClosedMode = (e) => {
    setToolState({
      ...toolState,
      closedMode: e.currentTarget.value,
    });
  };

  /** Update color : fillColor or strokeColor */
  const updateColor = (color) => {
    setToolState({
      ...toolState,
      [toolOptions.currentColorType]: objToRgba(color.rgb),
    });
  };


  const handleImgChange = (newUrl, imgRef) => {
    setToolState({
      ...toolState,
      image: { ...toolState.image, id: newUrl },
    });
  };


  const addImage = () => {
    const data = {
      id: toolState?.image?.id,
      uuid: uuidv4(),
    };

    setToolState({
      ...toolState,
      image: { id: null },
      imageEvent: data,
    });
  };

  const handleTextChange = (e) =>{
    console.log(e.target.value)
    setDrawingState( {
      ...drawingState,
      currentShape:{
        ...drawingState.currentShape,
        text:e.target.value,
      }
    })
  }


  return (
    <div>
      {
        (displayMode === KONVA_MODE.DRAW && isShapesTool(toolState.activeTool)) && (
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
                  <StrokeColorIcon style={{ fill: toolState.strokeColor }} />
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
                  <FormatColorFillIcon style={{ fill: toolState.fillColor }} />
                  <ArrowDropDownIcon />
                </ToggleButton>
              </ToggleButtonGroup>

              <StyledDivider flexItem orientation="vertical" />
              { /* close / open polygon mode only for freehand drawing mode. */
              false
                && (
                  <ToggleButtonGroup
                    size="small"
                    value={toolState.closedMode}
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
            }
            </Grid>
            <Popover
              open={toolOptions.lineWeightPopoverOpen}
              anchorEl={toolOptions.popoverLineWeightAnchorEl}
            >
              <div>
                <ClickAwayListener onClickAway={handleCloseLineWeight}>
                  <MenuList autoFocus role="listbox">
                    {defaultLineWeightChoices.map((option, index) => (
                      <MenuItem
                        key={option}
                        onClick={handleLineWeightSelect}
                        value={option}
                        selected={option === toolState.strokeWidth}
                        role="option"
                        aria-selected={option === toolState.strokeWidth}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </div>
            </Popover>
            <Popover
              open={toolOptions.colorPopoverOpen}
              anchorEl={toolOptions.popoverAnchorEl}
              onClose={closeChooseColor}
            >
              <SketchPicker
                disableAlpha={false}
                color={currentColor}
                onChangeComplete={updateColor}
              />
            </Popover>
          </Grid>
        )
      }
      {
          toolState.activeTool === 'text' && (
          <>
            <Typography variant="overline">
              Text
            </Typography>
            { toolState.text ? (
              <TextField
                fullWidth
                onChange={handleTextChange}
              />
            ) : (
              <p>Click on canva to add text</p>
            )}
          </>
          )
      }
      {
        toolState.activeTool === OVERLAY_TOOL.IMAGE && (
          <>
            <Typography variant="overline">
              Add image from URL
            </Typography>
            <Grid container>
              <ImageFormField xs={8} value={toolState.image} onChange={handleImgChange} />
            </Grid>
            <StyledDivButtonImage>
              <Button variant="contained" onClick={addImage}>
                <AddPhotoAlternateIcon />
              </Button>
            </StyledDivButtonImage>
          </>
        )
      }
    </div>
  );
}

AnnotationFormOverlayToolOptions.propTypes = {
  displayMode: PropTypes.string.isRequired,
  setToolState: PropTypes.func.isRequired,
  toolState: PropTypes.shape({
    activeTool: PropTypes.string.isRequired,
    closedMode: PropTypes.bool.isRequired,
    fillColor: PropTypes.string.isRequired,
    image: PropTypes.shape({
      id: PropTypes.string,
    }),
    strokeColor: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    text: PropTypes.string,
    textBody: PropTypes.string,
    updateColor: PropTypes.func.isRequired,
  }).isRequired,
};

export default AnnotationFormOverlayToolOptions;
