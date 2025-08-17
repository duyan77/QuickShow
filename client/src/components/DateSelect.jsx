import React, { useState, useRef, useEffect } from "react";
import BlurCircle from "./BlurCircle";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [showArrows, setShowArrows] = useState(false);

  const scrollRef = useRef(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast("Please select a date");
    }
    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      setShowArrows(el.scrollWidth > el.clientWidth);
    }
  }, [dateTime]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
  };

  return (
    <div id="dateSelect" className="pt-30">
      <div className="flex flex-col gap-8 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        {/* Title */}
        <p className="text-lg font-semibold">Choose Date</p>

        {/* Khối chọn ngày */}
        <div className="flex items-center gap-2">
          {showArrows && (
            <ChevronLeftIcon
              onClick={scrollLeft}
              className="hidden sm:block w-7 h-7 cursor-pointer"
            />
          )}

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide"
          >
            {Object.keys(dateTime).map((date) => (
              <button
                onClick={() => setSelected(date)}
                key={date}
                className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer shrink-0 ${
                  selected === date
                    ? "bg-primary text-white"
                    : "border border-primary/70"
                }`}
              >
                <span className="text-sm font-medium">
                  {new Date(date).getDate()}
                </span>
                <span className="text-xs">
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
              </button>
            ))}
          </div>

          {showArrows && (
            <ChevronRightIcon
              onClick={scrollRight}
              className="hidden sm:block w-7 h-7 cursor-pointer"
            />
          )}
        </div>

        {/* Button Book Now */}
        <div className="flex justify-center">
          <button
            onClick={onBookHandler}
            className="bg-primary text-white px-8 py-2 rounded hover:bg-primary/90 transition-all cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateSelect;
