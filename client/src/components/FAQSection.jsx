import { useState } from "react";
import BlurCircle from "./BlurCircle";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqsData = [
    {
      question: "How can I book tickets on Quick Show?",
      answer:
        "Simply choose your movie, showtime, preferred seats, and complete the online payment. Your e-ticket will be instantly sent to your email or Quick Show account.",
    },
    {
      question: "Can I select my seats in advance?",
      answer:
        "Yes. Quick Show provides an interactive seating chart, allowing you to pick your favorite seats before confirming your booking.",
    },
    {
      question: "Is online payment secure on Quick Show?",
      answer:
        "Absolutely. We integrate trusted payment gateways with advanced security technology to ensure every transaction is safe and reliable.",
    },
    {
      question: "Can I watch movie trailers on Quick Show?",
      answer:
        "Yes. Every movie comes with a trailer so you can preview it before booking your tickets.",
    },
    {
      question: "What if I cannot attend the show I booked?",
      answer:
        "You can contact Quick Show support for assistance with changing your showtime or requesting a refund, depending on the cinema’s cancellation policy.",
    },
  ];

  return (
    <div className="relative w-full px-6 md:px-16 lg:px-36 py-12">
      {/* Blur circles background */}
      <BlurCircle top="100px" left="165px" />
      <BlurCircle bottom="-60px" right="20px" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start relative z-10">
        {/* Cột trái: tiêu đề */}
        <div className="flex flex-col items-start text-left">
          <p className="text-base font-medium text-primary">FAQ</p>
          <h3 className="text-3xl md:text-4xl font-semibold mt-2">
            You Ask, Quick Show Answers
          </h3>
          <p className="text-sm text-zinc-400 mt-4 max-w-sm">
            Have questions about Quick Show? Find answers to common queries
            about booking tickets, seat selection, payments, trailers, and
            cancellations.
          </p>
        </div>

        {/* Cột phải: danh sách FAQ */}
        <div className="flex flex-col gap-4 items-start text-left">
          {faqsData.map((faq, index) => (
            <div key={index} className="flex flex-col items-start w-full">
              <div
                className="flex items-center justify-between w-full cursor-pointer bg-[#1e1e1e] border border-primary-dull p-4 rounded-lg hover:border-primary transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h2 className="text-sm font-medium">{faq.question}</h2>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${
                    openIndex === index ? "rotate-180" : ""
                  } transition-all duration-500 ease-in-out`}
                >
                  <path
                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                    stroke="var(--color-primary)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className={`text-sm text-zinc-400 px-4 transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "opacity-100 max-h-[300px] translate-y-0 pt-4"
                    : "opacity-0 max-h-0 -translate-y-2"
                }`}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
