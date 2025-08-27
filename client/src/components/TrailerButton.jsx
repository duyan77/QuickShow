import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { PlayCircleIcon, XIcon } from "lucide-react";

const TrailerButton = ({ videoKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false); // trạng thái hover
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoKey}`;

  // Khi modal mở, ẩn scroll; khi đóng, bật lại
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Nút mở trailer */}
      <button
        className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95"
        onClick={() => setIsOpen(true)}
      >
        <PlayCircleIcon className="w-5 h-5" />
        Watch Trailer
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div
            className="relative w-full max-w-4xl p-4"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Nút đóng chỉ hiện khi hover */}
            {isHovering && (
              <button
                className="absolute top-2 right-5 text-white hover:text-gray-300 cursor-pointer text-sm transition-opacity duration-300"
                onClick={() => setIsOpen(false)}
              >
                <XIcon className="w-6 h-6" />
              </button>
            )}

            {/* Video player */}
            <ReactPlayer url={youtubeUrl} controls width="100%" height="80vh" />
          </div>
        </div>
      )}
    </>
  );
};

export default TrailerButton;
