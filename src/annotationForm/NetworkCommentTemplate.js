import React from 'react';
import {
  Grid, Paper, TextField, Typography, Link,
} from '@mui/material';
import PropTypes from 'prop-types';
import { isValidUrl } from '../utils';
import TextFormSection from "./TextFormSection";
import TargetFormSection from "./TargetFormSection";

/** Form part for edit annotation content and body */
function NetworkCommentTemplate(
    {
        annoState,
        setAnnoState,
        setCurrentTime,
        setSeekTo,
        windowId,
        commentingType,
        manifestType
    }) {

    const updateAnnotationTextBody = (newBody) =>
    {
        setAnnoState({
            ...annoState,
            textBody:newBody,
        })
    }

  return (
    <Paper style={{ padding: '5px' }}>
      <Typography variant="overline">
        Network
      </Typography>
      <Grid>
        <TextField
          value={annoState.manifestNetwork}
          label="Manifest URL"
          type="url"
        />
        {
          isValidUrl(annoState.manifestNetwork) ? (
            <Link
              href={annoState.manifestNetwork}
              target="_blank"
            >
              {annoState.manifestNetwork}
            </Link>
          ) : (
            <Typography variant="caption">
              Not a valid URL
            </Typography>
          )
        }
      </Grid>
        <TextFormSection
            annoHtml={annoState.textBody}
        updateAnnotationBody={updateAnnotationTextBody}
        />
        <TargetFormSection
            setAnnoState={setAnnoState}
            annoState={annoState}
            setCurrentTime={setCurrentTime}
            setSeekTo={setSeekTo}
            windowId={windowId}
            commentingType={commentingType}
            manifestType={manifestType}
        />
    </Paper>
  );
}

NetworkCommentTemplate.propTypes = {
};

export default NetworkCommentTemplate;
