import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { images } from '../../utils/images';

type Props = {
    autoPlay?: boolean,
    hideNav?: boolean
}
export function Gallery({ autoPlay, hideNav }: Props) {
    return (<ImageGallery
        autoPlay={autoPlay}
        showNav={!hideNav}
        showFullscreenButton={!hideNav}
        showPlayButton={!hideNav}
        showThumbnails={!hideNav}
        items={images} />)
}