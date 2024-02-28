import React from 'react';
import AnnotationDrawing from "./AnnotationDrawing";
import DrawingTemplateForm from "./DrawingTemplateForm";
import {OSDReferences} from "mirador/dist/es/src/plugins/OSDReferences";

export default function DrawingTemplate(
    {
        annotation,
        windowId,
        mediaIsVideo,
        mediaVideo,
    }
)
{

    return(
    <>
        <AnnotationDrawing
            scale={scale}
            activeTool={toolState.activeTool}
            annotation={annotation}
            fillColor={toolState.fillColor}
            strokeColor={toolState.strokeColor}
            strokeWidth={toolState.strokeWidth}
            closed={toolState.closedMode === 'closed'}
            updateGeometry={updateGeometry}
            windowId={windowId}
            player={mediaIsVideo ? mediaVideo : OSDReferences.get(windowId)}
            // we need to pass the width and height of the image to the annotation drawing component
            width={overlay ? overlay.containerWidth : 1920}
            height={overlay ? overlay.containerHeight : 1080}
            originalWidth={overlay ? overlay.canvasWidth : 1920}
            originalHeight={overlay ? overlay.canvasHeight : 1080}
            updateScale={updateScale}
            imageEvent={toolState.imageEvent}
            setColorToolFromCurrentShape={setColorToolFromCurrentShape}
            drawingState={drawingState}
            isMouseOverSave={isMouseOverSave}
            mediaVideo={mediaVideo}
            setDrawingState={setDrawingState}
            tabView={viewTool}
            />
        <DrawingTemplateForm
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