import React from 'react';
import Typography from "@mui/material/Typography";
import {Button, Grid} from "@mui/material";
import ImageFormField from "./AnnotationFormOverlay/ImageFormField";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {styled} from "@mui/material/styles";
export default function ImageFormSection(
    {
        setAnnoState,
        annoState
    }
)
{

    /** TODO Code duplicate ?? */
    const handleImgChange = (newUrl, imgRef) => {
        setAnnoState({
            ...annoState,
            image: { ...annoState.image, id: newUrl },
        });
    };

    return(
        <>
        <Typography variant="overline">
            Add image from URL
        </Typography>
    <Grid container>
        <ImageFormField xs={8} value={annoState.image} onChange={handleImgChange} />
    </Grid>
    <StyledDivButtonImage>
        <Button variant="contained">
            <AddPhotoAlternateIcon />
        </Button>
    </StyledDivButtonImage>
        </>
    )
}

const StyledDivButtonImage = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '5px',
}));