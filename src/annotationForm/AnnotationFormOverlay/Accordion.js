import {
  Accordion, AccordionDetails, AccordionSummary, Paper,
} from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteForever';

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
            {shape.type}
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

AccordionShapes.propTypes = {
  shapes: PropTypes.array.isRequired,
  deleteShape: PropTypes.func.isRequired,
  currentShapeId: PropTypes.string.isRequired,
};

export default AccordionShapes;
