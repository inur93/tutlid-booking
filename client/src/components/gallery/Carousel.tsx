import { makeStyles, Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/styles';
import React from 'react';
import NCarousel from 'nuka-carousel';
import classnames from 'classnames';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // maxHeight: '500px'
        },
        item: {
            // maxHeight: 'calc(100vh - 130px)',
            objectFit: 'contain',
            maxHeight: '100%'
        },
        arrow: {
            border: "solid",
            borderColor: theme.palette.primary.light,
            borderWidth: "0 6px 6px 0",
            display: "inline-block",
            padding: "12px"
        },
        next: {
            transform: "rotate(-45deg)",
            "-webkit-transform": "rotate(-45deg)"
        },
        prev: {
            transform: "rotate(135deg)",
            "-webkit-transform": "rotate(135deg)"
        }
    })
)
export type CarouselProps = {
    hideControls?: boolean,
    autoPlay?: boolean
}
export const Carousel = ({ hideControls, autoPlay }: CarouselProps) => {
    const classes = useStyles();
    //easing: https://github.com/chenglou/tween-functions
    return (<NCarousel
        className={classes.root}
        renderCenterLeftControls={({ previousSlide }) => (<i onClick={previousSlide} className={classnames(classes.arrow, classes.prev)} />)}
        renderCenterRightControls={({ nextSlide }) => (<i onClick={nextSlide} className={classnames(classes.arrow, classes.next)} />)}
        autoplay={autoPlay}
        withoutControls={hideControls}
        pauseOnHover
        framePadding="0 22px"
        cellAlign='center'
        wrapAround
        speed={800}
        autoplayInterval={5000}
        slidesToShow={1}
        cellSpacing={20}>
        <img className={classes.item} src="/images/tutlid-view.jpg" />
        <img className={classes.item} src="/images/tutlid.jpg" />
        <img className={classes.item} src="/images/tutlid-1.jpg" />
        <img className={classes.item} src="/images/tutlid-2.jpg" />
        <img className={classes.item} src="/images/tutlid-3.jpg" />
        <img className={classes.item} src="/images/tutlid-4.jpg" />
        <img className={classes.item} src="/images/tutlid-5.jpg" />
    </NCarousel>)
};

export default Carousel;