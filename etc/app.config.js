var config = {
    deployment: {
        base_path: ''
    }
};

if (typeof(process.env.NODE_ENV) === 'undefined') process.env.NODE_ENV = 'development';
var environment = process.env.NODE_ENV;

/*
Override config with environment config
*/
Object.assign(config, require('./app.config.' + environment).default);

// If there are any custom config settings then add them but only if we are running in development mode
if (environment === 'development') {
  Object.assign(config, require('./app.config.custom.js').default);
}

config.deployment.runningEnvironment = environment;
console.log('Config:', config);

export default config;
