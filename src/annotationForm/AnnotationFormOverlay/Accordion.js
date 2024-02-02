import {
  Accordion, AccordionDetails, AccordionSummary, Paper,
} from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AccordionShapes({ shapes }) {
  return (
    <Paper>
      {shapes.map((shape) => (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >

            <Typography>{shape.id}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ul>
              {Object.keys(shape).sort().map((key) => (
                <li key={key}>
                  {key}
                  :
                  {shape[key]}
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>

      ))}
    </Paper>
  );
}

AccordionShapes.propTypes = {
  shapes: PropTypes.array.isRequired,
};

export default AccordionShapes;
