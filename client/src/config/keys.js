// config keys based on production or dev environment
import devConfig from "./dev";
import prodConfig from "./prod";
let config;
if (process.env.NODE_ENV === "production") {
  config = prodConfig;
} else {
  config = devConfig;
}
console.log(config);
export default config;
