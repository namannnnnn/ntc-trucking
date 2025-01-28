// server.js
import app from "./app.js";
import { config } from "./config/constants.js";
import colors from "@colors/colors"

app.listen(config.PORT, () => {
  console.log(`Server is up and running on port ${config.PORT}...`.green.bold);
});
