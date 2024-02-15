import React from 'react';
import {
  Grid, TextField, Typography, Link,
} from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { isValidUrl } from '../utils';

const MainTitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.8em',
}));
const MainContainer = styled(Typography)(({ theme }) => ({
  padding: '5px',
}));
/** Form part for edit annotation content and body */
function AnnotationFormNetwork({ manifestNetwork, updateManifestNetwork }) {
  return (
    <MainContainer>
      <MainTitleTypography variant="overline" component="h1">
        Network
      </MainTitleTypography>
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
    </MainContainer>
  );
}

AnnotationFormNetwork.propTypes = {
  manifestNetwork: PropTypes.string.isRequired,
  updateManifestNetwork: PropTypes.func.isRequired,
};

export default AnnotationFormNetwork;
