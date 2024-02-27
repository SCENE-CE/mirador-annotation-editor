import React from 'react';
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import {Card, CardActionArea, CardContent} from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import HubIcon from '@mui/icons-material/Hub';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArticleIcon from '@mui/icons-material/Article';
export default function AnnotationFormTemplateSelector()
{
    return(
<CardContainer>
    <Card>
        <CardActionArea>
            <CardContent>
                <CardTypography component="div">
                    Text comment
                    <TextFieldsIcon/>
                </CardTypography>
            </CardContent>
        </CardActionArea>
    </Card>
    <Card>
        <CardActionArea>
            <CardContent>
                <CardTypography component="div">
                    Image comment
                    <ImageIcon/>
                </CardTypography>
            </CardContent>
        </CardActionArea>
    </Card>
    <Card>
        <CardActionArea>
            <CardContent>
                <CardTypography component="div">
                    Konva comment
                    <ImageIcon/>
                </CardTypography>
            </CardContent>
        </CardActionArea>
    </Card>
    <Card>
        <CardActionArea>
            <CardContent>
                <CardTypography component="div">
                    Manifest comment
                    <HubIcon/>
                </CardTypography>
            </CardContent>
        </CardActionArea>
    </Card>
    <Card>
        <CardActionArea>
            <CardContent>
                <CardTypography component="div">
                    Tagging
                    <LocalOfferIcon/>
                </CardTypography>
            </CardContent>
        </CardActionArea>
    </Card>
    <Card>
        <CardActionArea>
            <CardContent>
                <CardTypography component="div">
                    Manifest IIIF
                    <ArticleIcon/>
                </CardTypography>
            </CardContent>
        </CardActionArea>
    </Card>
</CardContainer>
)
}

const CardTypography = styled(Typography)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between'
}));
const CardContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection:'column',
    gap:'30px',
    margin:'10px',
}));
