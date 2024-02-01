import { Divider, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StrokeColorIcon from '@mui/icons-material/BorderColor';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import React from 'react';
import ClosedPolygonIcon from '@mui/icons-material/ChangeHistory';
import OpenPolygonIcon from '@mui/icons-material/ShowChart';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0.5),
}));

/** All the tools options for the overlay options */
function AnnotationFormOverlayToolOptions({
  openChooseLineWeight, changeClosedMode, closedMode, strokeColor, fillColor, onClick, activeTool,
}) {
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
              onClick={onClick}
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
              onClick={onClick}
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
      </Grid>
    </div>
  );
}

AnnotationFormOverlayToolOptions.propTypes = {
  activeTool: PropTypes.string.isRequired,
  changeClosedMode: PropTypes.func.isRequired,
  closedMode: PropTypes.bool.isRequired,
  fillColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  openChooseLineWeight: PropTypes.func.isRequired,
  strokeColor: PropTypes.string.isRequired,
};

export default AnnotationFormOverlayToolOptions;
