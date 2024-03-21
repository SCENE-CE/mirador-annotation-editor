import {
  ClickAwayListener, Divider, Grid, MenuItem, MenuList, Popover,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import StrokeColorIcon from '@mui/icons-material/BorderColor';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ClosedPolygonIcon from '@mui/icons-material/ChangeHistory';
import OpenPolygonIcon from '@mui/icons-material/ShowChart';
import { SketchPicker } from 'react-color';
import React from 'react';
import { styled } from '@mui/material/styles';
import * as Proptypes from 'prop-types';
import PropTypes from 'prop-types';
import { defaultLineWeightChoices } from '../KonvaUtils';
/** Display color picker and border * */
export default function ColorPicker(
  {
    changeClosedMode,
    closeChooseColor,
    currentColor,
    handleCloseLineWeight,
    handleLineWeightSelect,
    openChooseColor,
    openChooseLineWeight,
    toolOptions,
    toolState,
    updateColor,
  },
) {
  return (
    <Grid container spacing={1}>
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
          {
                toolState.activeTool !== 'text' && (
                <>

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
                </>
                )
}
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
            /* TODO: When does this happen ? */
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
  );
}

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0.5),
}));

ColorPicker.propTypes = {
  changeClosedMode: Proptypes.func.isRequired,
  closeChooseColor: Proptypes.func.isRequired,
  currentColor: Proptypes.string.isRequired,
  handleCloseLineWeight: Proptypes.func.isRequired,
  handleLineWeightSelect: Proptypes.func.isRequired,
  openChooseColor: Proptypes.func.isRequired,
  openChooseLineWeight: Proptypes.func.isRequired,
  toolOptions: Proptypes.oneOfType(
    Proptypes.bool,
    Proptypes.string,
    Proptypes.bool,
    Proptypes.string,
    Proptypes.string,
  ).isRequired,
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
  updateColor: Proptypes.func.isRequired,
};
