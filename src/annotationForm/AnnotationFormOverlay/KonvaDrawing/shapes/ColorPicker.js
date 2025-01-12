import {
  ClickAwayListener, Divider, Grid, MenuItem, MenuList, Popover, Tooltip,
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
import { defaultLineWeightChoices, OVERLAY_TOOL } from '../KonvaUtils';

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
    t,
    toolOptions,
    toolState,
    updateColor,
  },
) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="overline">
          {t('style')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          aria-label={t('style_selection')}
          size="small"
        >
          {
                toolState.activeTool !== OVERLAY_TOOL.TEXT && (
                <>
                  <Tooltip title={t('border_color')}>
                    <ToggleButton
                      value="strokeColor"
                      aria-label={t('border_color')}
                      onClick={openChooseColor}
                    >
                      <StrokeColorIcon style={{ fill: toolState.strokeColor }} />
                      <ArrowDropDownIcon />
                    </ToggleButton>
                  </Tooltip>
                  <Tooltip title={t('line_weight')}>
                    <ToggleButton
                      value="strokeColor"
                      aria-label={t('line_weight')}
                      onClick={openChooseLineWeight}
                    >
                      <LineWeightIcon />
                      <ArrowDropDownIcon />
                    </ToggleButton>
                  </Tooltip>
                </>
                )
}
          <Tooltip title={t('fill_color')}>

            <ToggleButton
              value="fillColor"
              aria-label={t('fill_color')}
              onClick={openChooseColor}
            >
              <FormatColorFillIcon style={{ fill: toolState.fillColor }} />
              <ArrowDropDownIcon />
            </ToggleButton>
          </Tooltip>
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
  t: Proptypes.func.isRequired,
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
