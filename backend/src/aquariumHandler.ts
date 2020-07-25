import moment from "moment";
import SerialPort from "serialport";
import Readline = SerialPort.parsers.Readline;
import { createTimeout } from "./helper";

function setLight(
  serialPort: SerialPort,
  lineStream: Readline,
  address: string,
  on: boolean
) {
  console.log("switching ligh", on ? "on" : "off");
  const responsePromise = new Promise<string>((resolve) => {
    lineStream.once("data", (data) => resolve(data));
  });
  const command = `is${address}${on ? "FFFF" : "0000"}\n`;
  serialPort.write(command);

  return Promise.race([responsePromise, createTimeout(500)])
    .then((data) => {
      return data === command.substr(0, 14);
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}

const aquariums = [
  {
    name: "the small one",
    address: "0FFF0FFF",
    lightOn: [
      { from: "8:00", to: "11:00" },
      { from: "13:00", to: "20:00" },
    ],
  },
];

export default (serialPort: SerialPort, lineStream: Readline): void => {
  const now = moment(moment().format("H:m"), ["h:m a", "H:m"]);

  aquariums.forEach((aquarium) => {
    console.log("----------");
    console.log(aquarium.name);
    let isOn = false;

    aquarium.lightOn.forEach((range) => {
      const tFrom = moment(range.from, ["h:m a", "H:m"]);
      const tTo = moment(range.to, ["h:m a", "H:m"]);
      if (now.isSame(tFrom) || now.isSame(tTo) || now.isBetween(tFrom, tTo)) {
        isOn = true;
      }
    });

    setLight(serialPort, lineStream, aquarium.address, isOn).then((result) =>
      console.log(result ? "success" : "fail")
    );
  });
};
