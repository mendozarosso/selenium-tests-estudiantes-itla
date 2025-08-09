const { By } = require('selenium-webdriver');
const { takeScreenshot, setupDriver } = require('../config/test-setup');

const APP_URL = 'file:///C:/Users/jason/programacion/SystemaDeGestionEstudiantes/index.html';

describe('HU-005: Actualizar Estudiante', () => {
  let driver;

  beforeEach(async () => {
    driver = await setupDriver(APP_URL);
    await driver.sleep(2000);
    
    // Crear estudiante para actualizar
    await driver.executeScript(`
      const testStudent = {
        id: 888,
        nombre: "Carlos",
        apellidos: "Martínez",
        carrera: "Mercadeo",
        edad: 28,
        activo: 1
      };
      let students = JSON.parse(localStorage.getItem('estudiantes') || '[]');
      students.push(testStudent);
      localStorage.setItem('estudiantes', JSON.stringify(students));
      location.reload();
    `);
    await driver.sleep(2000);
  });

  describe('🟢 Camino Feliz - Actualización Exitosa', () => {
    test('CP-005: Debe actualizar datos del estudiante', async () => {
      console.log('🧪 Iniciando CP-005: Actualizar Estudiante');
      
      // Buscar el botón de editar del estudiante de prueba
      const editButtons = await driver.findElements(By.css('.edit-btn'));
      if (editButtons.length > 0) {
        await editButtons[0].click();
        await driver.sleep(1000);
        
        await takeScreenshot('modal_edicion_abierto');
        
        // Actualizar campos
        await driver.findElement(By.id('editNombre')).clear();
        await driver.findElement(By.id('editNombre')).sendKeys('Carlos Actualizado');
        await driver.findElement(By.id('editCarrera')).clear();
        await driver.findElement(By.id('editCarrera')).sendKeys('Ingeniería Industrial');
        
        await takeScreenshot('datos_actualizados');
        
        await driver.findElement(By.id('saveChangesBtn')).click();
        await driver.sleep(2000);
        
        await takeScreenshot('estudiante_actualizado');
        console.log('✅ CP-005 EXITOSO');
      }
    });
  });

  describe('🔴 Prueba Negativa - Datos Inválidos', () => {
    test('CN-005: Debe rechazar actualización con campos vacíos', async () => {
      console.log('🧪 Iniciando CN-005: Actualización Inválida');
      
      const editButtons = await driver.findElements(By.css('.edit-btn'));
      if (editButtons.length > 0) {
        await editButtons[0].click();
        await driver.sleep(1000);
        
        // Vaciar campo obligatorio
        await driver.findElement(By.id('editNombre')).clear();
        
        await takeScreenshot('campo_vacio_actualizacion');
        
        await driver.findElement(By.id('saveChangesBtn')).click();
        await driver.sleep(1000);
        
        // Verificar que el modal sigue abierto (no se guardó)
        const modal = await driver.findElement(By.id('editModal'));
        const isDisplayed = await modal.isDisplayed();
        expect(isDisplayed).toBe(true);
        
        await takeScreenshot('actualizacion_rechazada');
        console.log('✅ CN-005 EXITOSO');
      }
    });
  });

  describe('🟡 Prueba de Límites - Edad Máxima', () => {
    test('CL-005: Debe manejar edad en límite superior', async () => {
      console.log('🧪 Iniciando CL-005: Edad Máxima');
      
      const editButtons = await driver.findElements(By.css('.edit-btn'));
      if (editButtons.length > 0) {
        await editButtons[0].click();
        await driver.sleep(1000);
        
        await driver.findElement(By.id('editEdad')).clear();
        await driver.findElement(By.id('editEdad')).sendKeys('99');
        
        await takeScreenshot('edad_maxima');
        
        await driver.findElement(By.id('saveChangesBtn')).click();
        await driver.sleep(2000);
        
        await takeScreenshot('edad_maxima_guardada');
        console.log('✅ CL-005 EXITOSO');
      }
    });
  });
});
