import React from 'react';
import Typography from "@mui/material/Typography";
import {Button, Grid} from "@mui/material";
import ImageFormField from "./AnnotationFormOverlay/ImageFormField";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {styled} from "@mui/material/styles";
import {v4 as uuidv4} from "uuid";
import TextFormSection from "./TextFormSection";
import TargetFormSection from "./TargetFormSection";

const StyledDivButtonImage = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '5px',
}));
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

    /** TODO Code duplicate ?? */
    const handleImgChange = (newUrl, imgRef) => {
        updateToolState({
            ...toolState,
            image: { ...toolState.image, id: newUrl },
        });
    };

    return(
        <>
            <Typography variant="overline">
                Add image from URL
            </Typography>
            <Grid container>
                <ImageFormField xs={8} value={toolState.image} onChange={handleImgChange} />
            </Grid>
            <StyledDivButtonImage>
                <Button variant="contained">
                    <AddPhotoAlternateIcon />
                </Button>
            </StyledDivButtonImage>
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