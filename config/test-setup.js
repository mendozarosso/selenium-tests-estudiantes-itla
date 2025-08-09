
const DriverSetup = require('../utils/driver-setup');

const driverSetup = new DriverSetup();

async function setupDriver(url) {
  return await driverSetup.createDriver(url);
}

async function takeScreenshot(name) {
  return await driverSetup.takeScreenshot(name);
}

async function closeDriver() {
  await driverSetup.closeDriver();
}

// Setup para Jest
beforeEach(async () => {
  const testName = expect.getState().currentTestName;
  console.log(`🧪 Iniciando prueba: ${testName}`);
});

afterEach(async () => {
  await closeDriver();
  const testName = expect.getState().currentTestName;
  console.log(`✅ Finalizó prueba: ${testName}`);
});

module.exports = {
  setupDriver,
  takeScreenshot,
  closeDriver
};
