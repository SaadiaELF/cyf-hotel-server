const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const e = require("express");

// Functions
function isInvalidId(id, index, response) {
  if (index < 0) {
    response.status(400).send("No booking with the Id '" + id + "' is found");
  }
}

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// Get all bookings
app.get("/bookings", function (request, response) {
  response.status(200).json(bookings);
});

// Search bookings
app.get("/bookings/search", function (request, response) {
  let date = request.query.date;
  if (date) {
    let filteredBookings = bookings.filter(
      (elt) =>
        moment(elt.checkInDate) <= moment(date) &&
        moment(elt.checkOutDate) >= moment(date)
    );
    if (filteredBookings.length == 0) {
      response.status(400).send("No matching results");
    } else {
      response.status(200).json(filteredBookings);
    }
  } else {
    response.status(400).send("Please enter search term");
  }
});

// Get one booking by id
app.get("/bookings/:id", function (request, response) {
  let booking = bookings.find((elt) => elt.id == request.params.id);
  if (booking) {
    response.status(200).json(booking);
  } else {
    response
      .status(400)
      .send("No booking with the Id '" + request.params.id + "' is found");
  }
});

// Create new booking
app.post("/bookings", function (request, response) {
  for (const key in bookings[0]) {
    if (!request.body[key]) {
      response.status(400).send("Please enter all fields");
    }
  }

  const newBooking = {
    id: uuid.v4(),
    roomId: request.body.roomId,
    title: request.body.title,
    firstName: request.body.firstName,
    username: request.body.username,
    email: request.body.email,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };

  bookings.push(newBooking);
  response.status(200).json(bookings);
});

// Delete one booking by id
app.delete("/bookings/:id", function (request, response) {
  let bookingIndex = bookings.findIndex((elt) => elt.id == request.params.id);

  isInvalidId(request.params.id, bookingIndex, response);

  bookings.splice(bookingIndex, 1);
  response.status(200).json({
    msg: "booking successfully deleted",
    bookings: bookings,
  });
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
