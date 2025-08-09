const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

class DriverSetup {
  constructor() {
    this.driver = null;
  }

  async createDriver(url) {
    // Configurar opciones de Chrome
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--disable-web-security');
    options.addArguments('--allow-running-insecure-content');
    options.addArguments('--disable-features=VizDisplayCompositor');
    options.addArguments('--window-size=1920,1080');
    
    console.log('🚀 Iniciando ChromeDriver...');

    try {
      // Crear el driver
      this.driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
      
      console.log('✅ ChromeDriver iniciado exitosamente');
      
      if (url) {
        console.log(`🚀 Navegando a: ${url}`);
        await this.driver.get(url);
        console.log('✅ Página cargada exitosamente');
      }
    } catch (error) {
      console.error('❌ Error al iniciar ChromeDriver:', error.message);
      throw error;
    }

    // Configurar timeouts
    await this.driver.manage().setTimeouts({
      implicit: 10000,    // 10 segundos para encontrar elementos
      pageLoad: 30000,    // 30 segundos para cargar páginas
      script: 30000       // 30 segundos para scripts
    });

    return this.driver;
  }

  async takeScreenshot(testName) {
    if (!this.driver) return;

    try {
      // Crear directorio si no existe
      const screenshotsDir = path.resolve('./reports/screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      // Tomar captura
      const screenshot = await this.driver.takeScreenshot();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${testName}_${timestamp}.png`;
      const filepath = path.join(screenshotsDir, filename);

      // Guardar archivo
      fs.writeFileSync(filepath, screenshot, 'base64');
      console.log(`📸 Captura guardada: ${filename}`);
      return filepath;
    } catch (error) {
      console.error('❌ Error al tomar captura:', error);
    }
  }

  async closeDriver() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }

  // Métodos de ayuda para interactuar con elementos
  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForElementVisible(locator, timeout = 10000) {
    const element = await this.waitForElement(locator, timeout);
    return await this.driver.wait(until.elementIsVisible(element), timeout);
  }

  async waitForElementClickable(locator, timeout = 10000) {
    const element = await this.waitForElement(locator, timeout);
    return await this.driver.wait(until.elementIsEnabled(element), timeout);
  }

  async clearAndSendKeys(element, keys) {
    await element.clear();
    await element.sendKeys(keys);
  }
}

module.exports = DriverSetup;
