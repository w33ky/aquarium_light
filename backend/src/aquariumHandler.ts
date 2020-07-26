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
      lineStream.removeAllListeners();
      return false;
    });
}

// todo load dynamically
const aquariums = [
  {
    name: "12l Quarantäne Becken",
    address: "0FFF0FFF",
    lightOn: [
      { from: "8:00", to: "11:00" },
      { from: "13:00", to: "20:00" },
    ],
  },
  {
    name: "24l Wohnzimmer Becken",
    address: "0FFFF0FF",
    lightOn: [
      { from: "7:00", to: "12:00" },
      { from: "15:00", to: "19:00" },
    ],
  },
  {
    name: "60l Wohnzimmer Becken",
    address: "0FFFFF0F",
    lightOn: [{ from: "7:00", to: "19:00" }],
  },
];

export default async (
  serialPort: SerialPort,
  lineStream: Readline
): Promise<void> => {
  const now = moment(moment().format("H:m"), ["h:m a", "H:m"]);
  console.log(`-----${moment().format("DD.MM.YYYY HH:mm:ss")}------`);

  for (let i = 0; i < aquariums.length; i++) {
    const aquarium = aquariums[i];
    console.log(aquarium.name);

    let isOn = false;

    aquarium.lightOn.forEach((range) => {
      const tFrom = moment(range.from, ["h:m a", "H:m"]);
      const tTo = moment(range.to, ["h:m a", "H:m"]);
      if (now.isSame(tFrom) || now.isSame(tTo) || now.isBetween(tFrom, tTo)) {
        isOn = true;
      }
    });

    await setLight(
      serialPort,
      lineStream,
      aquarium.address,
      isOn
    ).then((result) => console.log(result ? "success" : "fail"));
  }
};
