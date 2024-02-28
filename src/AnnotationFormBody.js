import React, {useEffect, useState} from 'react';
import {
    template,
    TARGET_VIEW
} from './AnnotationFormUtils';
import AnnotationFormContent from "./annotationForm/AnnotationFormContent";
import AnnotationImageUrlField from "./annotationForm/AnnotationImageUrlField";
import AnnotationFormTarget from "./annotationForm/AnnotationFormTarget";
import AnnotationFormNetwork from "./annotationForm/AnnotationFormManifestNetwork";
import AnnotationDrawing from "./annotationForm/AnnotationDrawing";
import {OSDReferences} from "mirador/dist/es/src/plugins/OSDReferences";
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
    windowId,
    toolState,
    updateToolState,
    manifestNetwork,
    updateManifestNetwork,
    overlay,
    annotation,
    mediaVideo,
    setDrawingState,
    setShapeProperties,
    setToolState,
    drawingState
    })
{
    const [scale, setScale] = useState(1);
    const [isMouseOverSave, setIsMouseOverSave] = useState(false);
    const [viewTool, setViewTool] = useState(TARGET_VIEW);

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

    const isCommentingTypeValid = commentingType.id === template.MANIFEST_TYPE ||
        commentingType.id === template.KONVA_TYPE ||
        commentingType.id === template.IMAGE_TYPE ||
        commentingType.id === template.TEXT_TYPE;

    const spatialTarget = commentingType.id === template.TEXT_TYPE ||
        commentingType.id === template.TAGGING_TYPE

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
                commentingType.id === template.IMAGE_TYPE &&(
                <AnnotationImageUrlField
                toolState={toolState}
                updateToolState={updateToolState}
                />
              )
            }
            {
                commentingType.id === template.KONVA_TYPE &&(
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
                            setShapeProperties={setShapeProperties}
                            updateScale={updateScale}
                            imageEvent={toolState.imageEvent}
                            setColorToolFromCurrentShape={setColorToolFromCurrentShape}
                            drawingState={drawingState}
                            isMouseOverSave={isMouseOverSave}
                            mediaVideo={mediaVideo}
                            setDrawingState={setDrawingState}
                            tabView={viewTool}
                        />
                    </>
              )
            }
            {
                commentingType.id === template.MANIFEST_TYPE &&(
                        <AnnotationFormNetwork
                         manifestNetwork={manifestNetwork}
                         updateManifestNetwork={updateManifestNetwork}
                        />
              )
            }
            <AnnotationFormTarget
            spatialTarget={spatialTarget}
            commentingTypeId={commentingType.id}
            mediaIsVideo={mediaIsVideo}
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
        </div>
    )
}