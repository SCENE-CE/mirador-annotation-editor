import React from 'react';
import Typography from "@mui/material/Typography";
import {Button, Grid} from "@mui/material";
import ImageFormField from "./AnnotationFormOverlay/ImageFormField";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {styled} from "@mui/material/styles";
import {v4 as uuidv4} from "uuid";
import TextFormSection from "./TextFormSection";
import TargetFormSection from "./TargetFormSection";
import ImageFormSection from "./ImageFormSection";


export default function ImageCommentTemplate(
    {
        toolState,
        updateToolState,
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
    })
{


    return(
        <>
            <ImageFormSection
            toolState={toolState}
            updateToolState={updateToolState}
            />
            <TextFormSection
                textEditorStateBustingKey
                textBody
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
        </>
    )
}