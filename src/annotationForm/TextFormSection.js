import React from 'react';
import {Grid, Typography} from "@mui/material";
import TextEditor from "../TextEditor";

export default function TextFormSection(
    {

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
                />
            </Grid>
        </Grid>
    )
}