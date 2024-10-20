import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Craousal({
  slidesPerView = 1,
  navigation = false,
  pagination = false,
  mousewheel = false,
  className,
  autoplay = false,
}) {
  const [isActive, setIsActive] = useState({
    next: true,
    prev: false,
  });
  const handleSlideChange = ({ isBeginning, isEnd }) => {
    setIsActive({
      next: !isEnd,
      prev: !isBeginning,
    });
  };

  const data = [
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
  ];
  return (
    <div className={`relative ${className} `}>
      <Swiper
        className="mySwiper"
        spaceBetween={5}
        slidesPerView={slidesPerView}
        modules={[Mousewheel, Pagination, Navigation, Autoplay]}
        onSlideChange={handleSlideChange}
        autoplay={{
          enabled: autoplay,
          delay: 3000,
        }}
        mousewheel={{
          enabled: mousewheel,
          forceToAxis: true,
        }}
        navigation={{
          enabled: true,
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{
          enabled: true,
          type: "fraction",
          el: ".custom-pagination",
        }}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center items-center">
              <img src={item} className="w-full h-auto" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {pagination && (
        <div className="custom-pagination absolute top-0 z-10 w-full h-fit text-right text-sm text-white p-3 font-semibold"></div>
      )}

      {navigation && (
        <>
          <button
            className={`custom-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-600 text-white p-2 rounded-full ${
              isActive.prev ? "" : "bg-opacity-40"
            }`}
          >
            <ChevronLeft opacity={isActive.prev ? 1 : 0.4} />
          </button>
          <button
            className={`custom-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-700 text-white rounded-full ${
              isActive.next ? "" : "bg-opacity-50"
            }`}
          >
            <ChevronRight opacity={isActive.next ? 1 : 0.4} />
          </button>
        </>
      )}
    </div>
  );
}

export default Craousal;
