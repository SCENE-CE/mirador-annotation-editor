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
        annoState,
        setAnnoState,
        setCurrentTime,
        setSeekTo,
        windowId,
        commentingType,
        manifestType,
    })
{


    return(
        <>
            <ImageFormSection
            annoState={annoState}
            setAnnoState={setAnnoState}
            />
            <TextFormSection
                textEditorStateBustingKey
                textBody
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