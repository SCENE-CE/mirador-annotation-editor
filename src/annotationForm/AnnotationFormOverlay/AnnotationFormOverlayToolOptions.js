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
import React, {useState} from 'react';
import ClosedPolygonIcon from '@mui/icons-material/ChangeHistory';
import OpenPolygonIcon from '@mui/icons-material/ShowChart';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { SketchPicker } from 'react-color';

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0.5),
}));

/** All the tools options for the overlay options */
function AnnotationFormOverlayToolOptions({
  changeClosedMode, closedMode, strokeColor, fillColor, activeTool,
  updateColor, currentColor, strokeWidth,
}) {

  // set toolOptionsValue
  const [toolOptions, setToolOptions] = useState({
    colorPopoverOpen: false,
    currentColorType: null,
    lineWeightPopoverOpen: false,
    popoverAnchorEl: null,
    popoverLineWeightAnchorEl: null,
  });

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
            && (
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
        }
        </Grid>
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
  activeTool: PropTypes.string.isRequired,
  changeClosedMode: PropTypes.func.isRequired,
  closeChooseColor: PropTypes.func.isRequired,
  closedMode: PropTypes.bool.isRequired,
  colorPopoverOpen: PropTypes.bool.isRequired,
  currentColor: PropTypes.string.isRequired,
  fillColor: PropTypes.string.isRequired,
  handleCloseLineWeight: PropTypes.func.isRequired,
  handleLineWeightSelect: PropTypes.func.isRequired,
  lineWeightPopoverOpen: PropTypes.bool.isRequired,
  openChooseColor: PropTypes.func.isRequired,
  openChooseLineWeight: PropTypes.func.isRequired,
  popoverAnchorEl: PropTypes.any.isRequired,
  popoverLineWeightAnchorEl: PropTypes.any.isRequired,
  strokeColor: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  updateColor: PropTypes.func.isRequired,
};

export default AnnotationFormOverlayToolOptions;
