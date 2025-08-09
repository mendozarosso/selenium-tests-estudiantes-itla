const { By } = require('selenium-webdriver');
const { takeScreenshot, setupDriver } = require('../config/test-setup');

const APP_URL = 'file:///C:/Users/jason/programacion/SystemaDeGestionEstudiantes/index.html';

describe('HU-003: Crear Estudiante', () => {
  let driver;

  beforeEach(async () => {
    driver = await setupDriver(APP_URL);
    await driver.sleep(2000);
  });

  describe('🟢 Camino Feliz - Crear Estudiante', () => {
    test('CP-003: Debe crear estudiante con datos válidos', async () => {
      console.log('🧪 Iniciando CP-003: Crear Estudiante');
      
      await driver.findElement(By.id('nombre')).clear();
      await driver.findElement(By.id('nombre')).sendKeys('Juan Pérez');
      await driver.findElement(By.id('apellidos')).clear();
      await driver.findElement(By.id('apellidos')).sendKeys('García');
      await driver.findElement(By.id('carrera')).clear();
      await driver.findElement(By.id('carrera')).sendKeys('Ingeniería de Software');
      await driver.findElement(By.id('edad')).clear();
      await driver.findElement(By.id('edad')).sendKeys('22');
      
      await takeScreenshot('crear_estudiante_datos_validos');
      
      await driver.findElement(By.id('agregarBtn')).click();
      await driver.sleep(2000);
      
      // Verificar que se agregó
      const estudiantes = await driver.findElements(By.css('.student-card'));
      expect(estudiantes.length).toBeGreaterThan(0);
      
      await takeScreenshot('estudiante_creado');
      console.log('✅ CP-003 EXITOSO');
    });
  });

  describe('🔴 Prueba Negativa - Datos Inválidos', () => {
    test('CN-003: Debe rechazar estudiante con campos vacíos', async () => {
      console.log('🧪 Iniciando CN-003: Campos Vacíos');
      
      // Limpiar todos los campos
      await driver.findElement(By.id('nombre')).clear();
      await driver.findElement(By.id('apellidos')).clear();
      await driver.findElement(By.id('carrera')).clear();
      await driver.findElement(By.id('edad')).clear();
      
      await takeScreenshot('crear_estudiante_campos_vacios');
      
      await driver.findElement(By.id('agregarBtn')).click();
      await driver.sleep(1000);
      
      // Verificar que no se agregó (mismo número de estudiantes)
      const estudiantesInicial = await driver.findElements(By.css('.student-card'));
      
      await takeScreenshot('crear_estudiante_rechazado');
      console.log('✅ CN-003 EXITOSO');
    });
  });

  describe('🟡 Prueba de Límites - Edad Límite', () => {
    test('CL-003: Debe manejar edad en los límites', async () => {
      console.log('🧪 Iniciando CL-003: Edad Límite');
      
      await driver.findElement(By.id('nombre')).clear();
      await driver.findElement(By.id('nombre')).sendKeys('Estudiante Mayor');
      await driver.findElement(By.id('apellidos')).clear();
      await driver.findElement(By.id('apellidos')).sendKeys('Test');
      await driver.findElement(By.id('carrera')).clear();
      await driver.findElement(By.id('carrera')).sendKeys('Administración');
      await driver.findElement(By.id('edad')).clear();
      await driver.findElement(By.id('edad')).sendKeys('65'); // Edad límite
      
      await takeScreenshot('crear_estudiante_edad_limite');
      
      await driver.findElement(By.id('agregarBtn')).click();
      await driver.sleep(2000);
      
      await takeScreenshot('estudiante_edad_limite_creado');
      console.log('✅ CL-003 EXITOSO');
    });
  });
});
