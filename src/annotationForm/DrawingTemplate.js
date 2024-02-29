import React, {useEffect, useState} from 'react';
import AnnotationDrawing from "./AnnotationDrawing";
import DrawingTemplateForm from "./DrawingTemplateForm";
import {OSDReferences} from "mirador/dist/es/src/plugins/OSDReferences";
import {TARGET_VIEW} from "../AnnotationFormUtils";
import {defaultToolState} from "../AnnotationCreationUtils";

export default function DrawingTemplate(
    {
        annotation,
        windowId,
        mediaIsVideo,
        mediaVideo,
        annoState,
        overlay
    }
)
{
    const [toolState, setToolState] = useState(defaultToolState);
    const [drawingState, setDrawingState] = useState({
        currentShape: null,
        isDrawing: false,
        shapes: [],
    });

    if(annoState.drawingState){
        setDrawingState(annoState.drawingState);
    }
    const [scale, setScale] = useState(1);
    const [isMouseOverSave, setIsMouseOverSave] = useState(false);
    const [viewTool, setViewTool] = useState(TARGET_VIEW);

    useEffect(() => {

    }, [toolState.fillColor, toolState.strokeColor, toolState.strokeWidth]);

    /** Change scale from container / canva */
    const updateScale = () => {
        setScale(overlay.containerWidth / overlay.canvasWidth);
    };

    const updateGeometry = ({ svg, xywh }) => {
        setState((prevState) => ({
            ...prevState,
            svg,
            xywh,
        }));
    };

    /**
     * Updates the tool state by merging the current color state with the existing tool state.
     * @param {object} colorState - The color state to be merged with the tool state.
     * @returns {void}
     */
    const setColorToolFromCurrentShape = (colorState) => {
        setToolState((prevState) => ({
            ...prevState,
            ...colorState,
        }));
    };

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