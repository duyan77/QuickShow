import React from "react";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { shows, image_base_url } = useAppContext();

  if (!shows || shows.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <p>No shows available</p>
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={false}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {shows.slice(0, 6).map((movie) => (
        <SwiperSlide key={movie._id}>
          <div
            className="relative flex flex-col justify-center gap-6 px-6 md:px-16 lg:px-36 h-screen bg-cover bg-center"
            style={{
              backgroundImage: `url(${image_base_url + movie.backdrop_path})`,
            }}
          >
            {/* Overlay mờ */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Nội dung */}
            <div className="relative z-10 flex flex-col gap-4">
              <h1 className="text-5xl md:text-[70px] md:leading-[1.2] font-semibold max-w-2xl text-white drop-shadow-lg line-clamp-2">
                {movie.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-200 drop-shadow-md">
                <span>
                  {movie.genres
                    .slice(0, 3)
                    .map((g) => g.name)
                    .join(" | ")}
                </span>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4.5 h-4.5" />{" "}
                  {new Date(movie.release_date).getFullYear()}
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4.5 h-4.5" />{" "}
                  {timeFormat(movie.runtime)}
                </div>
              </div>

              <p className="max-w-md text-gray-200 drop-shadow-md line-clamp-3">
                {movie.overview}
              </p>

              <button
                onClick={() => {
                  navigate(`/movies/${movie._id}`);
                  scrollTo(0, 0);
                }}
                className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer max-w-fit"
              >
                Explore Movie
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSection;
