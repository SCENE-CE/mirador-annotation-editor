import React from 'react';
import { Paper} from '@mui/material';
import PropTypes from 'prop-types';
import TextFormSection from "./TextFormSection";
import TargetFormSection from "./TargetFormSection";

/** Form part for edit annotation content and body */
function TextCommentTemplate(
    {
        setCurrentTime,
        setSeekTo,
        setAnnoState,
        annoState,
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
        <Paper style={{padding: '5px'}}>
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

TextCommentTemplate.propTypes = {
};

export default TextCommentTemplate;
