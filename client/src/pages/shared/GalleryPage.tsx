import { Grid } from "@material-ui/core";
import { Gallery } from "../../components/gallery/Gallery";
import { UltraWidePage } from "../BasePage";

export function GalleryPage() {
    return <UltraWidePage>
        <Grid container justify="center">
            <Grid item lg={10} style={{maxWidth: '100%'}}>
                <Gallery />
            </Grid>
        </Grid>
    </UltraWidePage>
}