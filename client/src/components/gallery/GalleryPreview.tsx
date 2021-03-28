import { createStyles, makeStyles } from "@material-ui/core";
import Carousel from "./Carousel";

const useStyles = makeStyles((theme) => createStyles({
    carousel: {
        maxHeight: '300px',
        [theme.breakpoints.up('md')]: {
            maxHeight: '500px'
        }
    }
}))

export function GalleryPreview() {
    const classes = useStyles();
    return <Carousel autoPlay hideControls className={classes.carousel}/>
}