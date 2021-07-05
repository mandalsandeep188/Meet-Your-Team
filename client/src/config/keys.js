// config keys based on production or dev environment
let config;
if (process.env.NODE_ENV === "production") {
  const prodConfig = require("./prod");
  config = prodConfig;
} else {
  const devConfig = require("./dev");
  config = devConfig;
}
export default config;
