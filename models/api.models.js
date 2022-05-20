const db = require("../db/connection");
const fs = require("fs");

exports.fetchDescription = () => {
  return fs.readFile("../endpoints.json", "utf-8").then((endpoints) => {
    const parsedEndpoints = JSON.parse(endpoints);
    console.log(parsedEndpoints);
    return endpoints;
  });
};
