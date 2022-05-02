// https://codeburst.io/node-js-best-practices-smarter-ways-to-manage-config-files-and-variables-893eef56cbef

// module variables
const config = require("./config.json");
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || "development";
const environmentConfig = config[environment];
const finalConfig = Object.assign(defaultConfig, environmentConfig);

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global = Object.assign(global, finalConfig);
