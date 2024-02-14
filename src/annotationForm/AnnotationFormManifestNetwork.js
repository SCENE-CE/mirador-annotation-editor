import React from 'react';
import {
  Grid, Paper, TextField, Typography, Link,
} from '@mui/material';
import PropTypes from 'prop-types';
import { isValidUrl } from '../utils';

/** Form part for edit annotation content and body */
function AnnotationFormNetwork({ manifestNetwork, updateManifestNetwork }) {
  return (
    <Paper style={{ padding: '5px' }}>
      <Typography variant="overline">
        Network
      </Typography>
      <Grid>
        <TextField
          value={manifestNetwork}
          onChange={(event) => updateManifestNetwork(event.target.value.trim())}
          label="Manifest URL"
          type="url"
        />
        {
          isValidUrl(manifestNetwork) ? (
            <Link
              href={manifestNetwork}
              target="_blank"
            >
              {manifestNetwork}
            </Link>
          ) : (
            <Typography variant="caption">
              Not a valid URL
            </Typography>
          )
        }
      </Grid>
    </Paper>
  );
}

AnnotationFormNetwork.propTypes = {
  manifestNetwork: PropTypes.string.isRequired,
  updateManifestNetwork: PropTypes.func.isRequired,
};

export default AnnotationFormNetwork;
