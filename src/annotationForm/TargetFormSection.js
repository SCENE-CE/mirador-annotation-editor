import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { manifestTypes, template } from '../AnnotationFormUtils';
import TargetTimeInput from './TargetTimeInput';

/**
 * Section of Time and Space Target
 * @param annoState
 * @param commentingType
 * @param currentTime
 * @param manifestType
 * @param setAnnoState
 * @param setCurrentTime
 * @param setSeekTo
 * @param spatialTarget
 * @param windowId
 * @returns {Element}
 * @constructor
 */
export default function TargetFormSection(
  {
    annoState,
    commentingType,
    currentTime,
    manifestType,
    setAnnoState,
    setCurrentTime,
    setSeekTo,
    spatialTarget,
    windowId,
  },
) {
  useEffect(() => {
    console.log('annoState', annoState);
  }, []);

  return (
    <div>
      {
            spatialTarget && (
            <p>PLACE HOLDER SPATIAL TARGET</p>
            )
        }
      {
            commentingType.id !== template.IIIF_TYPE && manifestType === manifestTypes.VIDEO && (
            <TargetTimeInput
              windowId={windowId}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              setSeekTo={setSeekTo}
              setAnnoState={setAnnoState}
              annoState={annoState}
            />
            )
        }
    </div>
  );
}

TargetFormSection.propTypes = {
  annoState: PropTypes.shape(
    {
      textBody: PropTypes.string,
    },
  ).isRequired,
  commentingType: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
  manifestType: PropTypes.string.isRequired,
  setAnnoState: PropTypes.func.isRequired,
  setCurrentTime: PropTypes.func.isRequired,
  setSeekTo: PropTypes.func.isRequired,
  spatialTarget: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};
