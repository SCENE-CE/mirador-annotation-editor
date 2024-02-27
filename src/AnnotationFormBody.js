import React, {useEffect} from 'react';
import {
    template, defaultToolState,
} from './AnnotationFormUtils';
import AnnotationFormContent from "./annotationForm/AnnotationFormContent";
import AnnotationFormTarget from "./annotationForm/AnnotationFormTarget";
export default function AnnotationFormBody(
    {commentingType,
    textBody,
    textEditorStateBustingKey,
    updateTextBody,
    currentTime,
    mediaIsVideo,
    setCurrentTime,
    setSeekTo,
    setState,
    tend,
        tstart,
        valueTime,
        videoDuration,
        windowid
    })
{
    const isCommentingTypeValid = commentingType.id === template.MANIFEST_TYPE ||
        commentingType.id === template.KONVA_TYPE ||
        commentingType.id === template.IMAGE_TYPE ||
        commentingType.id === template.TEXT_TYPE;

    useEffect(() => {
console.log('valueTime',valueTime)
    }, []);

    return(
        <div>
            {
                isCommentingTypeValid && (
                    <AnnotationFormContent textBody={textBody}
                                           textEditorStateBustingKey={textEditorStateBustingKey}
                                           updateTextBody={updateTextBody}
                    />
                )
            }
            {
                commentingType.id !== template.IIIF_TYPE && (
                    <AnnotationFormTarget
                     currentTime={currentTime}
                     mediaIsVideo={mediaIsVideo}
                     setCurrentTime={setCurrentTime}
                     setSeekTo={setSeekTo}
                     setState={setState}
                     tend={tend}
                     tstart={tstart}
                     value={valueTime}
                     videoDuration={videoDuration}
                     windowid={windowid}
                    />
                )
            }

        </div>
    )
}