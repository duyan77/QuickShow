// ShowMoreButton.jsx
import { useNavigate } from "react-router-dom";

function ShowMoreButton({ to = "/movies" }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mt-10">
      <div className="button-bg rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100">
        <button
          onClick={() => {
            navigate(to);
            scrollTo(0, 0);
          }}
          className="px-8 text-sm py-2.5 text-white rounded-full font-medium bg-[#f84565] cursor-pointer"
        >
          Show more
        </button>
      </div>
    </div>
  );
}

export default ShowMoreButton;
