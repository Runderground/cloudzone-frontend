import { useEffect, useState } from "react";
import { BsCaretRightFill, BsCaretLeftFill } from "react-icons/bs";
import style from "./ImageSlider.module.css";
export default function ImageSlider({ images }) {
  const [slides, setSlides] = useState([]);
  const [indexImage, setIndexImage] = useState(0);
  useEffect(() => {
    setSlides(images);
  }, []);
  const previousSlide = () => {
    if (indexImage != 0) {
      setIndexImage(indexImage - 1);
    }
  };

  const nextSlide = () => {
    if (indexImage !== slides.length - 1) {
      setIndexImage(indexImage + 1);
    }
  };
  return (
    <div className={style.imageSlider_container}>
      <img
        className={style.imageSlider_image}
        src={`https://b2c980b6-2b44-4b66-896d-8474a0a41bc7-00-1m6l13xxgg2ud.janeway.replit.dev/Posts/${slides[indexImage]?.filename}`}
      ></img>
      <div className={style.imageSlider_button}>
      <button className={style.leftButton} 
        onClick={previousSlide}>
        <BsCaretLeftFill/>
      </button>
      <button className={style.rightButton} onClick={nextSlide}>
        <BsCaretRightFill />
      </button>
        </div>
    </div>
  );
}
