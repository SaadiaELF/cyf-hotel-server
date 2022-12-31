const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

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

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
