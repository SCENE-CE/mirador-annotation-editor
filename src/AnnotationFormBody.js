import React, {useEffect, useState} from 'react';
import {
    template,
    TARGET_VIEW
} from './AnnotationFormUtils';
import TextCommentTemplate from "./annotationForm/TextCommentTemplate";
import ImageCommentTemplate from "./annotationForm/ImageCommentTemplate";
import TargetFormSection from "./annotationForm/TargetFormSection";
import NetworkCommentTemplate from "./annotationForm/NetworkCommentTemplate";
import AnnotationDrawing from "./annotationForm/AnnotationDrawing";
import {OSDReferences} from "mirador/dist/es/src/plugins/OSDReferences";
import DrawingTemplate from "./annotationForm/DrawingTemplate";
export default function AnnotationFormBody(
    {commentingType,
    textBody,
    textEditorStateBustingKey,
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
    overlay,
    annotation,
    mediaVideo,
    setDrawingState,
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
    return(
        <div>
            {
                commentingType.id === template.TEXT_TYPE && (
                    <TextCommentTemplate textBody={textBody}
                                         textEditorStateBustingKey={textEditorStateBustingKey}
                                         currentTime={currentTime}
                                         mediaIsVideo={mediaIsVideo}
                                         setCurrentTime={setCurrentTime}
                                         setSeekTo={setSeekTo}
                                         setState={setState}
                                         tend={tend}
                                         tstart={tstart}
                                         valueTime={valueTime}
                                         videoDuration={videoDuration}
                                         windowId={windowId}
                    />
                )
            }
            {
                commentingType.id === template.IMAGE_TYPE &&(
                <ImageCommentTemplate
                currentTime={currentTime}
                mediaIsVideo={mediaIsVideo}
                setCurrentTime={setCurrentTime}
                setSeekTo={setSeekTo}
                setState={setState}
                tend={tend}
                tstart={tstart}
                valueTime={valueTime}
                videoDuration={videoDuration}
                windowId={windowId}
                toolState={toolState}
                updateToolState={updateToolState}
                />
              )
            }
            {
                commentingType.id === template.KONVA_TYPE &&(
                    <>
                        <DrawingTemplate/>
                    </>
              )
            }
            {
                commentingType.id === template.MANIFEST_TYPE &&(
                        <NetworkCommentTemplate
                            currentTime={currentTime}
                            mediaIsVideo={mediaIsVideo}
                            setCurrentTime={setCurrentTime}
                            setSeekTo={setSeekTo}
                            setState={setState}
                            tend={tend}
                            tstart={tstart}
                            valueTime={valueTime}
                            videoDuration={videoDuration}
                            windowId={windowId}
                            textEditorStateBustingKey={textEditorStateBustingKey}
                            textBody={textBody}
                         manifestNetwork={manifestNetwork}

                        />
              )
            }
        </div>
    )
}