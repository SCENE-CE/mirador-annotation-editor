import React from 'react';
import Typography from "@mui/material/Typography";
import {Button, Grid} from "@mui/material";
import ImageFormField from "./AnnotationFormOverlay/ImageFormField";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {styled} from "@mui/material/styles";
import {v4 as uuidv4} from "uuid";

const StyledDivButtonImage = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '5px',
}));
export default function AnnotationImageUrlField(
    {
        toolState,
        updateToolState
    })
{

    const addImage = () => {
        const data = {
            id: toolState?.image?.id,
            uuid: uuidv4(),
        };

        updateToolState({
            ...toolState,
            image: { id: null },
            imageEvent: data,
        });
    };

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
                <Button variant="contained" onClick={addImage}>
                    <AddPhotoAlternateIcon />
                </Button>
            </StyledDivButtonImage>
        </>
    )
}