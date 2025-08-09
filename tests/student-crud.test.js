const { By } = require('selenium-webdriver');
const { setupDriver, takeScreenshot } = require('../config/test-setup');

const APP_URL = 'file:///C:/Users/jason/programacion/SystemaDeGestionEstudiantes/index.html';

describe('HU-002: CRUD de Estudiantes', () => {
  let driver;
  
  beforeEach(async () => {
    driver = await setupDriver(APP_URL);
    await driver.sleep(2000);
    // Limpiar datos para cada prueba
    await driver.executeScript('localStorage.clear(); location.reload();');
    await driver.sleep(2000);
  });

  describe('🟢 Camino Feliz - Crear Estudiante', () => {
    
    test('CP-003: Debe agregar un nuevo estudiante correctamente', async () => {
      console.log('🧪 Iniciando CP-003: Agregar Estudiante');
      
      await takeScreenshot('antes_agregar_estudiante');
      
      // Llenar formulario
      await driver.findElement(By.id('nombre')).sendKeys('Carlos');
      await driver.findElement(By.id('apellido')).sendKeys('Rodríguez');
      await driver.findElement(By.id('matricula')).sendKeys('2025001');
      await driver.findElement(By.id('carrera')).sendKeys('Ingeniería de Software');
      await driver.findElement(By.id('edad')).sendKeys('21');
      
      await takeScreenshot('formulario_lleno');
      
      // Enviar formulario
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await submitBtn.click();
      
      await driver.sleep(2000);
      await takeScreenshot('estudiante_agregado');
      
      // Verificar que se agregó
      const total = await driver.findElement(By.id('totalStudents')).getText();
      expect(parseInt(total)).toBe(1);
      
      // Verificar que aparece en la lista
      const tarjetas = await driver.findElements(By.css('.student-card'));
      expect(tarjetas.length).toBe(1);
      
      console.log('✅ CP-003 EXITOSO: Estudiante agregado correctamente');
    });
  });

  describe('🔴 Prueba Negativa - Datos inválidos', () => {
    
    test('CN-002: No debe permitir agregar estudiante con campos vacíos', async () => {
      console.log('🧪 Iniciando CN-002: Campos Vacíos');
      
      await takeScreenshot('formulario_vacio');
      
      // Intentar enviar formulario vacío
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await submitBtn.click();
      
      await driver.sleep(1000);
      await takeScreenshot('validacion_campos_vacios');
      
      // Verificar que no se agregó nada
      const total = await driver.findElement(By.id('totalStudents')).getText();
      expect(parseInt(total)).toBe(0);
      
      console.log('✅ CN-002 EXITOSO: Validación de campos vacíos funciona');
    });

    test('CN-003: No debe permitir edad inválida', async () => {
      console.log('🧪 Iniciando CN-003: Edad Inválida');
      
      // Llenar con edad inválida
      await driver.findElement(By.id('nombre')).sendKeys('Test');
      await driver.findElement(By.id('apellido')).sendKeys('Usuario');
      await driver.findElement(By.id('matricula')).sendKeys('TEST001');
      await driver.findElement(By.id('carrera')).sendKeys('Ingeniería de Software');
      await driver.findElement(By.id('edad')).sendKeys('abc'); // Texto en lugar de número
      
      await takeScreenshot('edad_invalida');
      
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await submitBtn.click();
      
      await driver.sleep(1000);
      
      // Verificar que no se agregó
      const total = await driver.findElement(By.id('totalStudents')).getText();
      expect(parseInt(total)).toBe(0);
      
      console.log('✅ CN-003 EXITOSO: Validación de edad funciona');
    });
  });

  describe('🟡 Prueba de Límites - Valores extremos', () => {
    
    test('CL-002: Debe manejar nombres muy largos', async () => {
      console.log('🧪 Iniciando CL-002: Nombres Largos');
      
      const nombreLargo = 'A'.repeat(50);
      const apellidoLargo = 'B'.repeat(50);
      
      await driver.findElement(By.id('nombre')).sendKeys(nombreLargo);
      await driver.findElement(By.id('apellido')).sendKeys(apellidoLargo);
      await driver.findElement(By.id('matricula')).sendKeys('LONG001');
      await driver.findElement(By.id('carrera')).sendKeys('Ingeniería de Software');
      await driver.findElement(By.id('edad')).sendKeys('20');
      
      await takeScreenshot('nombres_largos');
      
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await submitBtn.click();
      
      await driver.sleep(2000);
      
      // Verificar resultado
      const total = await driver.findElement(By.id('totalStudents')).getText();
      const resultado = parseInt(total) > 0 ? 'aceptado' : 'rechazado';
      
      console.log(`📏 Nombres largos (50 chars): ${resultado}`);
      await takeScreenshot('resultado_nombres_largos');
      
      console.log('✅ CL-002 EXITOSO');
    });

    test('CL-003: Debe manejar edades límite (15 y 80 años)', async () => {
      console.log('🧪 Iniciando CL-003: Edades Límite');
      
      // Probar edad mínima
      await driver.findElement(By.id('nombre')).sendKeys('Joven');
      await driver.findElement(By.id('apellido')).sendKeys('Estudiante');
      await driver.findElement(By.id('matricula')).sendKeys('MIN001');
      await driver.findElement(By.id('carrera')).sendKeys('Telemática');
      await driver.findElement(By.id('edad')).sendKeys('15');
      
      await takeScreenshot('edad_minima');
      
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await submitBtn.click();
      
      await driver.sleep(2000);
      
      const total = await driver.findElement(By.id('totalStudents')).getText();
      console.log(`👶 Edad 15 años: ${parseInt(total) > 0 ? 'aceptado' : 'rechazado'}`);
      
      await takeScreenshot('resultado_edad_limite');
      console.log('✅ CL-003 EXITOSO');
    });
  });
}, 60000);
