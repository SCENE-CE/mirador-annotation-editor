import React from 'react';
import {
  Grid, TextField, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { isValidUrl } from '../utils';

/**
 * Handle Manifest Section
 * @param manifestNetwork
 * @param onChange
 * @returns {Element}
 * @constructor
 */
export default function ManifestNetworkFormSection(
  {
    manifestNetwork,
    onChange,
  },
) {
  return (
    <>
      <Typography variant="overline">
        Network
      </Typography>
      <Grid>
        <TextField
          value={manifestNetwork}
          onChange={(event) => onChange(event.target.value.trim())}
          label="Manifest URL"
          type="url"
          error={!isValidUrl(manifestNetwork)}
        />
      </Grid>
    </>
  );
}

ManifestNetworkFormSection.propTypes = {
  manifestNetwork: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
