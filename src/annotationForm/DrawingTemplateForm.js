import React from 'react';
import AnnotationFormOverlay from "./AnnotationFormOverlay/AnnotationFormOverlay";
import TextFormSection from "./TextFormSection";
import TargetFormSection from "./TargetFormSection";

export default function DrawingTemplateForm(
    {
        toolState,
        deleteShape,
        updateToolState,
        shapes,
        currentShape,
        spatialTarget,
        mediaIsVideo,
        commentingTypeId,
        currentTime,
        setCurrentTime,
        setSeekTo,
        setState,
        tend,
        tstart,
        valueTime,
        videoDuration,
        windowId,
    }
)
{

    return(
        <>
            <AnnotationFormOverlay
                toolState={toolState}
                deleteShape={deleteShape}
                updateToolState={updateToolState}
                shapes={shapes}
                currentShape={currentShape}
            />
            <TextFormSection
            />
            <TargetFormSection
            spatialTarget={spatialTarget}
            mediaIsVideo={mediaIsVideo}
            commentingTypeId={commentingTypeId}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            setSeekTo={setSeekTo}
            setState={setState}
            tend={tend}
            tstart={tstart}
            valueTime={valueTime}
            videoDuration={videoDuration}
            windowId={windowId}
            />
        </>
    )
}