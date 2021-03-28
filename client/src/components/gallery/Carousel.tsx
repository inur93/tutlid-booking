import { makeStyles, Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/styles';
import React from 'react';
import NCarousel from 'nuka-carousel';
import classnames from 'classnames';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginLeft: '6px',
            width: 'calc(100% - 12px) !important',
            paddingLeft: '12px',
            paddingRight: '12px'
        },
        item: {
            objectFit: 'contain',
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

const useControlsStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            position: 'relative',
            top: '-10px',
            display: 'flex',
            margin: '0px',
            padding: '0px',
            listStyleType: 'none'
        },
        itemButton: {
            cursor: 'pointer',
            opacity: 0.5,
            background: 'transparent',
            border: 'none',
            fill: theme.palette.primary.main
        },
        active: {
            opacity: 1
        }
    })
)

export type CarouselProps = {
    hideControls?: boolean,
    autoPlay?: boolean,
    className?: string
}

type BottomControlsProps = {
    slideCount: number,
    currentSlide: number
}
function BottomControls({ slideCount, currentSlide }: BottomControlsProps) {
    const classes = useControlsStyles();
    return (<ul className={classes.container}>
        {
            Array(slideCount).fill(null).map((u, i) => (
                <li className="paging-item" key={i}>
                    <button type="button" aria-label={`slide ${i} bullet`} className={classnames(classes.itemButton, i === currentSlide && classes.active)}>
                        <svg className="paging-dot" width="12" height="12">
                            <circle cx="6" cy="6" r="6"></circle>
                        </svg>
                    </button>
                </li>
            ))}
    </ul>)
}
export const Carousel = ({ hideControls, autoPlay, className }: CarouselProps) => {
    const classes = useStyles();
    //easing: https://github.com/chenglou/tween-functions
    return (<NCarousel
        className={classnames(classes.root, className)}
        renderCenterLeftControls={({ previousSlide }) => (<i onClick={previousSlide} className={classnames(classes.arrow, classes.prev)} />)}
        renderCenterRightControls={({ nextSlide }) => (<i onClick={nextSlide} className={classnames(classes.arrow, classes.next)} />)}
        renderBottomCenterControls={({ slideCount, currentSlide }) => (<BottomControls slideCount={slideCount} currentSlide={currentSlide} />)}
        autoplay={autoPlay}
        withoutControls={hideControls}
        pauseOnHover
        framePadding="0 10px"
        cellAlign='center'
        heightMode='first'
        wrapAround
        speed={800}
        autoplayInterval={5000}
        slidesToShow={1}
        cellSpacing={20}>
        <img className={classnames(classes.item, className)} src="/images/tutlid-view.jpg" />
        <img className={classnames(classes.item, className)} src="/images/tutlid.jpg" />
        <img className={classnames(classes.item, className)} src="/images/tutlid-1.jpg" />
        <img className={classnames(classes.item, className)} src="/images/tutlid-2.jpg" />
        <img className={classnames(classes.item, className)} src="/images/tutlid-3.jpg" />
        <img className={classnames(classes.item, className)} src="/images/tutlid-4.jpg" />
        <img className={classnames(classes.item, className)} src="/images/tutlid-5.jpg" />
    </NCarousel>)
};

export default Carousel;