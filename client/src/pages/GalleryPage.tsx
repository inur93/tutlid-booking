import { Grid } from "@mui/material";
import { Gallery } from "../components/gallery/Gallery";
import { UltraWidePage } from "./shared/BasePage";

export function GalleryPage() {
    return <UltraWidePage>
        <Grid container justifyContent="center">
            <Grid item lg={10} style={{maxWidth: '100%'}}>
                <Gallery />
            </Grid>
        </Grid>
    </UltraWidePage>
}