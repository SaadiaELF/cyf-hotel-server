const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

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
