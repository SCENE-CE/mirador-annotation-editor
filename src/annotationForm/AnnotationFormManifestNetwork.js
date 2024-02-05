import React from 'react';
import {
  Grid, Paper, TextField, Typography, Button,
} from '@mui/material';
import PropTypes from 'prop-types';

/** Form part for edit annotation content and body */
function AnnotationFormNetwork({ manifestNetwork, updateManifestNetwork }) {
  const addManifest = () => {
    updateManifestNetwork(manifestNetwork);
  };

  return (
    <Paper style={{ padding: '5px' }}>
      <Typography variant="overline">
        Network
      </Typography>
      <Grid>
        <TextField
          value={manifestNetwork}
          onChange={(ev) => updateManifestNetwork(ev.target.value)}
          label="Manifest URL"
        />
      </Grid>
    </Paper>
  );
}

AnnotationFormNetwork.propTypes = {
  manifestNetwork: PropTypes.string.isRequired,
  updateManifestNetwork: PropTypes.func.isRequired,
};

export default AnnotationFormNetwork;
