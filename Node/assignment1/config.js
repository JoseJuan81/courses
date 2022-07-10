var enviroment = {};

enviroment.staging = {
  port: 4000,
  envName: 'staging',
};

enviroment.production = {
  port: 8000,
  envName: 'production',
}

// if NODE_ENV is not defined, default to 'staging'
var env = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'staging';

// if NODE_ENV is not equal to 'staging' or 'production', default to staging enviroment.
var currentEnv = enviroment[env] || enviroment.staging;

module.exports = currentEnv;
