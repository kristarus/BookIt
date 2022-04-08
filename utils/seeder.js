const Room = require("../models/room");
const mongoose = require("mongoose");
const rooms = require("../data/rooms.json");

mongoose.connect(
  "mongodb+srv://kristarus:kris123123@cluster0.gvltt.mongodb.net/bookit?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //   useFindAndModify: false,
    //   useCreateIndexes: true,
  }
);

const seedRooms = async () => {
  try {
    await Room.deleteMany();
    console.log("Rooms are deleted");

    await Room.insertMany(rooms);
    console.log("Rooms are inserted");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedRooms();
