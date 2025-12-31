exports.getNow = (req) => {
  if (!req || !req.headers) {
    return Date.now();
  }

  const isTestMode = process.env.TEST_MODE === 1;

  if (isTestMode) {
    const headerTime = req.headers["x-test-now-ms"];
    if (headerTime && !isNaN(headerTime)) {
      return Number(headerTime);
    }
  }

  return Date.now();
};
