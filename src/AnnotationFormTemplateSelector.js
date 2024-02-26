import React from 'react';
import {Card, CardActionArea, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";

export default function AnnotationFormTemplateSelector()
{
    return(
<div>
       <CardContainer>
           <CardActionArea>
               <CardContent>
                   <Typography component="div">
                       Text Comment
                   </Typography>
               </CardContent>
           </CardActionArea>
       </CardContainer>
</div>
    )
}


const CardContainer = styled(Card)(({ theme }) => ({
    minWidth:'350px',
    Width:'400px'
}));
