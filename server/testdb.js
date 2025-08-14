import Booking from "./models/Booking.js";
import mongoose from "mongoose";

await mongoose.connect(
  "mongodb+srv://duyan77:duyan5948%40@cluster0.1jvvpcz.mongodb.net/quickshow"
);

await Booking.create({
  user: "userId",
  show: "showId",
  amount: 100,
  bookedSeats: ["A1", "A2"],
  isPaid: false,
  paymentLink: "http://payment-link.com",
});

console.log("Dummy booking created!");
await mongoose.disconnect();
