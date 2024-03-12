import React from 'react';
import {
  Grid, Link, TextField, Typography,
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
  console.log('manifestNetwork', manifestNetwork);

  return (
    <Grid item container direction="column"  spacing={1}>
        <Grid item>
      <Typography variant="formSectionTitle">
        Document
      </Typography>
        </Grid>
      <Grid item>
        <TextField
          value={manifestNetwork}
          onChange={(event) => onChange(event.target.value.trim())}
          label="Manifest URL"
          type="url"
          error={!isValidUrl(manifestNetwork)}
        />
      </Grid>
        <Grid item>
        {
          isValidUrl(manifestNetwork) && (
            // Add a link
            <Link href={manifestNetwork} target="_blank" rel="noreferrer">
              {manifestNetwork}
            </Link>
          )
        }
        </Grid>
        <Grid item>
        {
          !isValidUrl(manifestNetwork) && (
            <Typography variant="caption" color="error">
              Invalid URL
            </Typography>
          )
        }
        </Grid>
    </Grid>
  );
}

ManifestNetworkFormSection.propTypes = {
  manifestNetwork: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
