import React from 'react';
import {Grid, Typography} from "@mui/material";
import TextEditor from "../TextEditor";

export default function TextFormSection(
    {
        annoHtml,
        updateAnnotationBody,
    }
    )
{

    return(
        <Grid>
            <Typography variant="overline">
                Infos
            </Typography>
            <Grid>
                <TextEditor
                    annoHtml={annoHtml}
                    updateAnnotationBody={updateAnnotationBody}
                />
            </Grid>
        </Grid>
    )
}