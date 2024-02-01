import {
  ClickAwayListener, Divider, Grid, MenuItem, MenuList, Paper, Popover,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StrokeColorIcon from '@mui/icons-material/BorderColor';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import React, { useState } from 'react';
import ClosedPolygonIcon from '@mui/icons-material/ChangeHistory';
import OpenPolygonIcon from '@mui/icons-material/ShowChart';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { SketchPicker } from 'react-color';

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0.5),
}));

/** Utils functions */
const rgbaToObj = (rgba = 'rgba(255,255,255,0.5)') => {
  const rgbaArray = rgba.split(',');
  const r = Number(rgbaArray[0].split('(')[1]);
  const g = Number(rgbaArray[1]);
  const b = Number(rgbaArray[2]);
  const a = Number(rgbaArray[3].split(')')[0]);
  return {
    // eslint-disable-next-line sort-keys
    r, g, b, a,
  };
};

const objToRgba = (obj = {
  // eslint-disable-next-line sort-keys
  r: 255, g: 255, b: 255, a: 0.5,
}) => `rgba(${obj.r},${obj.g},${obj.b},${obj.a})`;

/** All the tools options for the overlay options */
function AnnotationFormOverlayToolOptions({ updateToolState, toolState }) {
  // set toolOptionsValue
  const [toolOptions, setToolOptions] = useState({
    colorPopoverOpen: false,
    currentColorType: null,
    lineWeightPopoverOpen: false,
    popoverAnchorEl: null,
    popoverLineWeightAnchorEl: null,
  });

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
    updateToolState({
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
    console.log('openChooseColor', e.currentTarget.value);
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

  // Update ToolState value
  const changeClosedMode = (e) => {
    updateToolState({
      ...toolState,
      closedMode: e.currentTarget.value,
    });
  };

  /** Update color : fillColor or strokeColor */
  const updateColor = (color) => {
    updateToolState({
      ...toolState,
      [toolOptions.currentColorType]: objToRgba(color.rgb),
    });
  };

  return (
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
          toolState.activeTool === 'freehand'
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
          <Paper>
            <ClickAwayListener onClickAway={handleCloseLineWeight}>
              <MenuList autoFocus role="listbox">
                {[1, 3, 5, 10, 50].map((option, index) => (
                  <MenuItem
                    key={option}
                    onClick={handleLineWeightSelect}
                    value={option}
                    selected={option == toolState.strokeWidth}
                    role="option"
                    aria-selected={option == toolState.strokeWidth}
                  >
                    {option}
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
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
    </div>
  );
}

AnnotationFormOverlayToolOptions.propTypes = {
  updateToolState: PropTypes.func.isRequired,
  toolState: PropTypes.shape({
    activeTool: PropTypes.string.isRequired,
    closedMode: PropTypes.bool.isRequired,
    fillColor: PropTypes.string.isRequired,
    strokeColor: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    updateColor: PropTypes.func.isRequired,
  }).isRequired,
};

export default AnnotationFormOverlayToolOptions;
