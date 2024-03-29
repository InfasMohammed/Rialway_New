import express from "express";
const router = express.Router();
import Booking from "../models/Booking.js";
import Train from "../models/Train.js";
import mongoose from "mongoose";
import { generateMailTransporter } from "../utils/Mail.js";
import { Authenticate } from "../middleware/Auth.js";

// router.get("/trains", async (req, res) => {
//   try {
//     const trains = await Train.find();
//     res.json(trains);
//   } catch (error) {
//     console.error("Error fetching trains:", error);
//     res.status(500).json({ message: "Error fetching trains" });
//   }
// });

// router.post("/trains/:trainId/book", async (req, res) => {
//   const { trainId } = req.params;
//   const { passengerName } = req.body;

//   try {
//     const train = await Train.findById(trainId);

//     if (!train) {
//       res.status(404).json({ message: "Train not found" });
//       return;
//     }

//     if (train.availableSeats <= 0) {
//       res.status(400).json({ message: "No available seats" });
//       return;
//     }

//     train.availableSeats -= 1;
//     await train.save();

//     res.json({ message: `Booking confirmed for ${passengerName}` });
//   } catch (error) {
//     console.error("Error booking train:", error);
//     res.status(500).json({ message: "Error booking train" });
//   }
// });

// router.use(Authenticate);
router.post("/bookings", async (req, res) => {
  try {
    const {
      trainId,
      seatNumber,
      bookingDate,
      bookingTime,
      passengerName,
      passengerEmail,
      contactNumber,
      orderId,
      passengerId,
    } = req.body;

    // Check if the train exists
    // const train = await Train.findById(trainId);
    // if (!train) {
    //   return res.status(400).send('Invalid train ID. Train not found.');
    // }

    const isValidTrainId = mongoose.Types.ObjectId.isValid(trainId);
    if (!isValidTrainId) {
      return res.status(400).send("No Train available like that.");
    }
    const train = await Train.findById(trainId);

    // Check if the seat is available
    const selectedSeat = train.seats.find((seat) => seat.number === seatNumber);
    if (!selectedSeat || selectedSeat.isBooked) {
      return res.status(400).send("Seat not available.");
    }

    // Check if the seat is already booked
    const existingBooking = await Booking.findOne({ trainId, seatNumber });
    if (existingBooking) {
      return res.status(400).send("This seat is already booked.");
    }

    const newBooking = new Booking({
      trainId,
      seatNumber,
      bookingDate,
      bookingTime,
      passengerName,
      passengerEmail,
      contactNumber,
      orderId,
      passengerId,
    });

    await newBooking.save();

    // Mark the seat as booked in the train schema
    await Train.updateOne(
      { _id: trainId, "seats.number": seatNumber },
      { $set: { "seats.$.isBooked": true } }
    );

    // let transport = generateMailTransporter();

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "089be7d930becc",
        pass: "26aa41a60df5aa",
      },
    });

    var mailOptions = {
      from: "inmohammedinfas@gmail.com",
      to: {passengerEmail},
      subject: "Sending Email using Node.js",
      text: "That was easy!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).send("Booking created successfully.");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while creating a booking.");
  }
});

router.get("/allbookings", async (req, res) => {
  const bookings = await Booking.find();

  try {
    res.status(201).json(bookings);
  } catch (error) {
    res.status(422).json({
      error: error,
    });
  }
});

router.get("/bookingsById/:id", async (req, res) => {
  const bookings = await Booking.find({
    passengerId: req.params.id,
  });

  // const bookings = await Booking.findAll({
  //   where: { passengerId: req.params.id },
  // });

  const bookingIds = bookings.map((booking) => booking.trainId);

  const trains = await Train.find({
    _id: bookingIds,
  });

  const bookingsWithTrainDetails = bookings.map((booking) => {
    const train = trains.find((train) => train._id === booking.trainId);
    return {
      ...booking.toJSON(),
      train,
    };
  });
  try {
    res.status(201).json(bookingsWithTrainDetails);
  } catch (error) {
    res.status(422).json({
      error: error,
    });
  }
});

export { router as BookingRoute };
