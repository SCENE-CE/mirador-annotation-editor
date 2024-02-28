import React from 'react';
import { Paper} from '@mui/material';
import PropTypes from 'prop-types';
import TextFormSection from "./TextFormSection";
import TargetFormSection from "./TargetFormSection";

/** Form part for edit annotation content and body */
function TextCommentTemplate(
    {
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
    //TODO:May need to be but in a state
    const textEditorStateBustingKey = 0;

    return (
        <Paper style={{padding: '5px'}}>
            <TextFormSection
                textEditorStateBustingKey={textEditorStateBustingKey}
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

TextCommentTemplate.propTypes = {
    textBody: PropTypes.string.isRequired,
    textEditorStateBustingKey: PropTypes.string.isRequired,
};

export default TextCommentTemplate;
