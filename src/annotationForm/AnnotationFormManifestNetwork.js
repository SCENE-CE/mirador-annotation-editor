import React from 'react';
import {
  Grid, Paper, TextField, Typography, Button, Link,
} from '@mui/material';
import PropTypes from 'prop-types';

/** Form part for edit annotation content and body */
function AnnotationFormNetwork({ manifestNetwork, updateManifestNetwork }) {
  const isValidUrl = (string) => {
    if (string === '') {
      return true;
    }
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const onChangeManifestNetworkInput = (event) => {
      updateManifestNetwork(event.target.value.trim());
  };

  return (
    <Paper style={{ padding: '5px' }}>
      <Typography variant="overline">
        Network
      </Typography>
      <Grid>
        <TextField
          value={manifestNetwork}
          onChange={onChangeManifestNetworkInput}
          label="Manifest URL"
          type="url"
        />
        {
          isValidUrl(manifestNetwork) && (
            <Link
              href={manifestNetwork}
              target="_blank"
            >
              {manifestNetwork}
            </Link>
          )
        }
        {
          !isValidUrl(manifestNetwork) && (
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
