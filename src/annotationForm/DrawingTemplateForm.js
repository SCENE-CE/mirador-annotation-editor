import React from 'react';
import AnnotationFormOverlay from "./AnnotationFormOverlay/AnnotationFormOverlay";
import TextFormSection from "./TextFormSection";
import TargetFormSection from "./TargetFormSection";

export default function DrawingTemplateForm(
    {
        toolState,
        deleteShape,
            setToolState,
        shapes,
        currentShape,
        annoState,
        setCurrentTime,
        setSeekTo,
        setAnnoState,
        windowId,
        commentingType,
        manifestType
    }
)
{

    return(
        <>
            <AnnotationFormOverlay
                toolState={toolState}
                deleteShape={deleteShape}
                setToolState={setToolState}
                shapes={shapes}
                currentShape={currentShape}
            />
            <TextFormSection
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
        </>
    )
}