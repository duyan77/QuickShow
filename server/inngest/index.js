import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";
import { set } from "mongoose";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    // tạo user mới và lưu xuống csdl
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + (last_name ? " " + last_name : ""),
      image: image_url,
    };
    await User.create(userData);
  }
);

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

// Hàm Inngest để hủy booking và giải phóng ghế của show sau 10 phút nếu thanh toán chưa được thực hiện
const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);

      // nếu thanh toán chưa được thực hiện, giải phóng ghế và xóa booking
      if (!booking.isPaid) {
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });
        show.markModified("occupiedSeats");
        await show.save();
        await Booking.findByIdAndDelete(booking._id);
      }
    });
  }
);

// Hàm Inngest để gửi email xác nhận booking
const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event, step }) => {
    const { bookingId } = event.data;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: { path: "movie", model: "Movie" },
      })
      .populate("user");

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
      body: ` <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                        <h2>Hi ${booking.user.name},</h2>
                        <p>Your booking for <strong style="color: #F84565;">"${
                          booking.show.movie.title
                        }"</strong> is confirmed.</p>
                        <p>
                            <strong>Date:</strong> ${new Date(
                              booking.show.showDateTime
                            ).toLocaleDateString("en-US", {
                              timeZone: "Asia/Kolkata",
                            })}<br/>
                            <strong>Time:</strong> ${new Date(
                              booking.show.showDateTime
                            ).toLocaleTimeString("en-US", {
                              timeZone: "Asia/Kolkata",
                            })}
                        </p>
                        <p>Enjoy the show! 🍿</p>
                        <p>Thanks for booking with us!<br/>— QuickShow Team</p>
                    </div>`,
    });
  }
);

// Hàm để gửi nhắc nhở cho người dùng về các buổi chiếu sắp tới
const sendShowReminders = inngest.createFunction(
  { id: "send-show-reminders" },
  { cron: "0 */8 * * *" }, // Mỗi 8 giờ
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    // Prepare reminder tasks
    const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
      const shows = await Show.find({
        showTime: { $gte: windowStart, $lte: in8Hours },
      }).populate("movie");

      const tasks = [];

      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;

        const userIds = [...new Set(Object.values(show.occupiedSeats))];
        if (userIds.length === 0) continue;

        const users = await User.find({ _id: { $in: userIds } }).select(
          "name email"
        );

        for (const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showTime,
          });
        }
      }
      return tasks;
    });

    if (reminderTasks.length === 0) {
      return { sent: 0, message: "No reminders to send." };
    }

    // Send reminder emails
    const sendShowReminders = inngest.createFunction(
      { id: "send-show-reminders" },
      { cron: "*/10 * * * *" }, // chạy mỗi 10 phút
      async ({ step }) => {
        const now = new Date();
        const in10Min = new Date(now.getTime() + 10 * 60 * 1000); // 10 phút tới

        // Chuẩn bị danh sách nhắc nhở
        const reminderTasks = await step.run("prepare-tasks", async () => {
          const shows = await Show.find({
            showTime: { $gte: now, $lte: in10Min },
          }).populate("movie");

          const tasks = [];
          for (const show of shows) {
            if (!show.movie || !show.occupiedSeats) continue;

            const userIds = [...new Set(Object.values(show.occupiedSeats))];
            if (!userIds.length) continue;

            const users = await User.find({ _id: { $in: userIds } }).select(
              "name email"
            );

            for (const user of users) {
              tasks.push({
                userEmail: user.email,
                userName: user.name,
                movieTitle: show.movie.title,
                showTime: show.showTime,
              });
            }
          }
          return tasks;
        });

        if (!reminderTasks.length) {
          return { sent: 0, message: "No reminders to send." };
        }

        // Gửi email nhắc nhở
        const results = await step.run("send-all-reminders", async () => {
          return await Promise.allSettled(
            reminderTasks.map((task) =>
              sendEmail({
                to: task.userEmail,
                subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
                body: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hello ${task.userName},</h2>
                    <p>This is a quick reminder that your movie:</p>
                    <h3 style="color: #F84565;">"${task.movieTitle}"</h3>
                    <p>
                        is scheduled for 
                        <strong>${new Date(task.showTime).toLocaleDateString(
                          "en-US",
                          {
                            timeZone: "Asia/Ho_Chi_Minh",
                          }
                        )}</strong> at 
                        <strong>${new Date(task.showTime).toLocaleTimeString(
                          "en-US",
                          {
                            timeZone: "Asia/Ho_Chi_Minh",
                          }
                        )}</strong>.
                    </p>
                    <p>It starts in approximately <strong>10 minutes</strong> - make sure you're ready!</p>
                    <br/>
                    <p>Enjoy the show!<br/>QuickShow Team</p>
                  </div>`,
              })
            )
          );
        });

        const sent = results.filter((r) => r.status === "fulfilled").length;
        const failed = results.length - sent;

        return {
          sent,
          failed,
          message: `Sent ${sent} reminder(s), ${failed} failed.`,
        };
      }
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s), ${failed} failed.`,
    };
  }
);

// Inngest Function to send notifications when a new show is added
const sendNewShowNotifications = inngest.createFunction(
  { id: "send-new-show-notifications" },
  { event: "app/show.added" },
  async ({ event }) => {
    const { movieTitle } = event.data;

    const users = await User.find({});

    for (const user of users) {
      const userEmail = user.email;
      const userName = user.name;

      const subject = `🎬 New Show Added: ${movieTitle}`;
      const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hi ${userName},</h2>
                    <p>We've just added a new show to our library:</p>
                    <h3 style="color: #F84565;">"${movieTitle}"</h3>
                    <p>Visit our website</p>
                    <br/>
                    <p>Thanks,<br/>QuickShow Team</p>
                </div>`;

      await sendEmail({
        to: userEmail,
        subject,
        body,
      });
    }

    return { message: "Notifications sent." };
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowReminders,
  sendNewShowNotifications,
];
