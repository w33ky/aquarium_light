import express from "express";
import SerialPort from "serialport";
import { createTimeout } from "./helper";
import aquariumHandler from "./aquariumHandler";
import Readline = SerialPort.parsers.Readline;

const app = express();

const serialPort = new SerialPort("/dev/ttyUSB0", {
  baudRate: 38400,
  autoOpen: false,
});

const lineStream = serialPort.pipe(new Readline({ delimiter: "\r\n" }));

serialPort.open((err) => {
  if (err) {
    console.error(err);
  }
  console.log("serial port opened");
});

app.get("/identify", async (req, res) => {
  const identifyPromise = new Promise((resolve) => {
    lineStream.once("data", (data) => resolve(data));
  });
  serialPort.write("V\n");

  const identification = await Promise.race([
    identifyPromise,
    createTimeout(100),
  ]).catch((err) => err);

  res.end(identification);
});

app.listen(8000, () => console.log("server is running on port 8000"));

setInterval(() => aquariumHandler(serialPort, lineStream), 10000);
