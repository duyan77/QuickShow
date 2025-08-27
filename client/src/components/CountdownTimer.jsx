import { useEffect, useState } from "react";

const CountdownTimer = ({ createdAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const expiry = new Date(createdAt).getTime() + 10 * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = expiry - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        if (onExpire) onExpire(); // báo cho parent biết đã hết hạn
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, onExpire]);

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <p className="text-white text-sm font-medium">
      {timeLeft > 0 ? (
        <>
          Payment due date{" "}
          <span className="text-primary">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </>
      ) : (
        "❌ Payment expired"
      )}
    </p>
  );
};

export default CountdownTimer;
