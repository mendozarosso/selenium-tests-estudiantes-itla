const { By } = require('selenium-webdriver');
const { takeScreenshot, setupDriver } = require('../config/test-setup');

const APP_URL = 'file:///C:/Users/jason/programacion/SystemaDeGestionEstudiantes/index.html';

describe('HU-002: Autenticación de Usuario', () => {
  let driver;

  beforeEach(async () => {
    driver = await setupDriver(APP_URL);
  });

  afterEach(async () => {
    // El driver se cierra automáticamente en test-setup.js
  });

  describe('🟢 Camino Feliz - Login Exitoso', () => {
    test('CP-002: Debe permitir login con credenciales válidas', async () => {
      console.log('🧪 Iniciando CP-002: Login Exitoso');
      
      await driver.sleep(2000);

      await driver.findElement(By.id('username')).sendKeys('admin');
      await driver.findElement(By.id('password')).sendKeys('123456');
      
      await takeScreenshot('login_credenciales_validas');
      
      await driver.findElement(By.id('loginButton')).click();
      await driver.sleep(2000);
      
      // Verificar redirección al dashboard
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('index.html');
      
      await takeScreenshot('login_exitoso');
      console.log('✅ CP-002 EXITOSO');
    });
  });

  describe('🔴 Prueba Negativa - Login Fallido', () => {
    test('CN-002: Debe rechazar credenciales inválidas', async () => {
      console.log('🧪 Iniciando CN-002: Login Fallido');
      
      await driver.sleep(2000);

      await driver.findElement(By.id('username')).sendKeys('usuario_falso');
      await driver.findElement(By.id('password')).sendKeys('password_incorrecto');
      
      await takeScreenshot('login_credenciales_invalidas');
      
      await driver.findElement(By.id('loginButton')).click();
      await driver.sleep(2000);
      
      // Verificar mensaje de error
      const errorMessage = await driver.findElement(By.id('errorMessage')).getText();
      expect(errorMessage).toContain('Credenciales inválidas');
      
      await takeScreenshot('login_error');
      console.log('✅ CN-002 EXITOSO');
    });
  });

  describe('🟡 Prueba de Límites - Campos Vacíos', () => {
    test('CL-002: Debe validar campos obligatorios', async () => {
      console.log('🧪 Iniciando CL-002: Campos Vacíos');
      
      await driver.sleep(2000);

      // Intentar login sin credenciales
      await driver.findElement(By.id('loginButton')).click();
      await driver.sleep(1000);
      
      await takeScreenshot('login_campos_vacios');
      
      // Verificar que no redirige
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('login.html');
      
      console.log('✅ CL-002 EXITOSO');
    });
  });
});
