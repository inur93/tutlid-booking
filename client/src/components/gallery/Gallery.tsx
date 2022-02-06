
//npx browserslist@latest --update-db
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { images } from '../../utils/images';

export function Gallery() {
    return (<ImageGallery items={images} />)
}