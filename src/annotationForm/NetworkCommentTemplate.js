import React from 'react';
import {
  Grid, Paper, TextField, Typography, Link,
} from '@mui/material';
import PropTypes from 'prop-types';
import { isValidUrl } from '../utils';
import TextFormSection from './TextFormSection';
import TargetFormSection from './TargetFormSection';
import ManifestNetworkFormSection from './ManifestNetworkFormSection';

/** Form part for edit annotation content and body */
function NetworkCommentTemplate(
  {
    annoState,
    templateType,
    manifestType,
    setAnnoState,
    setCurrentTime,
    setSeekTo,
    windowId,
  },
) {
  /**
     * handle Body text update
     * @param newBody
     */
  const updateAnnotationTextBody = (newBody) => {
    setAnnoState({
      ...annoState,
      textBody: newBody,
    });
  };

  /**
     * Updates the manifest network in annoState.
     * @param {Object} manifestNetwork The new manifest network object to update.
     */
  const updateManifestNetwork = (manifestNetwork) => {
    setAnnoState((prevState) => ({
      ...prevState,
      manifestNetwork,
    }));
  };

  return (
    <div style={{ padding: '5px' }}>
      <ManifestNetworkFormSection
        manifestNetwork={annoState.manifestNetwork}
        onChange={updateManifestNetwork}
      />
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
        commentingType={templateType}
        manifestType={manifestType}
      />
    </div>
  );
}

NetworkCommentTemplate.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  annoState: PropTypes.object.isRequired,
  templateType: PropTypes.string.isRequired,
  manifestType: PropTypes.string.isRequired,
  setAnnoState: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default NetworkCommentTemplate;
