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
        manifestNetwork,
        textEditorStateBustingKey,
        textBody,
        currentTime,
        mediaIsVideo,
        setCurrentTime,
        setSeekTo,
        setState,
        tend,
        tstart,
        valueTime,
        videoDuration,
        windowId,
    }) {
  return (
    <Paper style={{ padding: '5px' }}>
      <Typography variant="overline">
        Network
      </Typography>
      <Grid>
        <TextField
          value={manifestNetwork}
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
        <TextFormSection
            textEditorStateBustingKey={textEditorStateBustingKey}
            textBody={textBody}
        />
        <TargetFormSection
            currentTime={currentTime}
            mediaIsVideo={mediaIsVideo}
            setCurrentTime={setCurrentTime}
            setSeekTo={setSeekTo}
            setState={setState}
            tend={tend}
            tstart={tstart}
            value={valueTime}
            videoDuration={videoDuration}
            windowId={windowId}
        />
    </Paper>
  );
}

NetworkCommentTemplate.propTypes = {
  manifestNetwork: PropTypes.string.isRequired,
};

export default NetworkCommentTemplate;
