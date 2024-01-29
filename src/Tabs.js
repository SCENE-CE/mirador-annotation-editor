import Tab from "@mui/material/Tab";
import Tabs from '@mui/material/Tabs';
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import LayersIcon from "@mui/icons-material/Layers";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import HubIcon from "@mui/icons-material/Hub";
import React, {useState} from "react";


export default function ToolTabs(){
    const [value, setValue] = useState(0);

    const tabHandler = (event, newValue) => {
        setValue(newValue);
    };

    const tabStyle = {
    }

    return(
        <Tabs value={value} onChange={tabHandler} aria-label="icon tabs">
            <Tab
                icon={<HighlightAltIcon/>}
                aria-label="TargetSelector"
                style={{minWidth:"0px"}}
            >
            </Tab>
            <Tab
                icon={<LayersIcon/>}
                aria-label="TargetSelector"
                style={{minWidth:"0px"}}
            >
            </Tab>
            <Tab
                icon={<CategoryIcon/>}
                aria-label="TargetSelector"
                style={{minWidth:"0px"}}
            >
            </Tab>
            <Tab
                icon={<LocalOfferIcon/>}
                aria-label="TargetSelector"
                style={{minWidth:"0px"}}
            >
            </Tab>
            <Tab
                icon={<HubIcon/>}
                aria-label="TargetSelector"
                style={{minWidth:"0px"}}
            >
            </Tab>
        </Tabs>
    )
}
