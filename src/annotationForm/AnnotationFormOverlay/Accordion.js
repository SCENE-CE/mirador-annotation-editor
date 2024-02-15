import {
  Accordion, AccordionDetails, AccordionSummary, Paper,
} from '@mui/material';
import React from 'react';
import PropTypes, { arrayOf } from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteForever';

/**
 * Renders an accordion of shapes.
 * @returns {JSX.Element} - AccordionShapes component.
 */
function AccordionShapes({ shapes, deleteShape, currentShapeId }) {
  return (
    <Paper>
      {shapes.map((shape) => (
        <Accordion style={shape.id === currentShapeId ? { fontWeight: 'bold' } : {}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {shape.id}
          </AccordionSummary>
          <AccordionDetails>
            <ul>
              {Object.keys(shape).sort().map((key) => (
                <>
                  { key !== 'lines' && key !== 'image' && (
                  <li key={key}>
                    {key}
                    :
                    {shape[key]}
                  </li>
                  )}
                </>
              ))}
            </ul>
            <Button
              onClick={() => deleteShape(shape.id)}
            >
              <DeleteIcon />
            </Button>
          </AccordionDetails>
        </Accordion>

      ))}
    </Paper>
  );
}

const shape = PropTypes.shape(
  {
    closedMode: PropTypes.bool,
    fill: PropTypes.string,
    id: PropTypes.string,
    pointerLength: PropTypes.number,
    pointerWidth: PropTypes.number,
    points: arrayOf(PropTypes.number),
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    text: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string,
    x: null,
    y: null,
  },
);
AccordionShapes.propTypes = {
  currentShapeId: PropTypes.string.isRequired,
  deleteShape: PropTypes.func.isRequired,
  shapes: PropTypes.arrayOf(shape).isRequired,
};

export default AccordionShapes;
