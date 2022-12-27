const dsn = process.env.SENTRY_DSN;

export const Init = () => {
  global.sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
  });
  console.log("Sentry initialized! 👍");
};

const isConnected = () => global.sentry?.getCurrentHub().getClient();

// @desc Log error to Sentry
// @param {Error} error - Error object
// @param {Object} options - Options object - sets extra data to Sentry
// @example logErrorToSentry(new Error('Error message'), {
//   username: 'john.doe',
//   userId: '123456',
// })

export const logErrorToSentry = (error, options) => {
  if (isConnected()) {
    if (options && typeof options === "object") {
      global.sentry.configureScope((scope) => {
        Object.keys(options).forEach((key) => {
          scope.setExtra(key, options[key]);
        });
      });
    }
    global.sentry.captureException(error);
    console.log("Error logged to Sentry: ", error);
  }
};

export const logInfoToSentry = (info, options) => {
  if (isConnected()) {
    global.sentry.captureMessage(info);
    console.log("Info logged to Sentry", info);
  }
};
