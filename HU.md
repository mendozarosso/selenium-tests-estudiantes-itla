\# Historias de Usuario – Sistema de Gestión de Estudiantes (ITLA)



> Este documento describe las funcionalidades probadas con Selenium, con criterios de aceptación (✅) y rechazo (❌), y su mapeo a casos de prueba (CP = Camino Feliz, CN = Negativo, CL = Límite).



---



\## HU-001: Visualización del Dashboard

\*\*Como\*\* administrador  

\*\*Quiero\*\* ver estadísticas de total de estudiantes y activos  

\*\*Para\*\* tener una visión rápida del estado del sistema



\### Criterios de aceptación ✅

\- Se muestra el total de estudiantes.

\- Se muestran los estudiantes activos.

\- Si no hay datos, ambos valores deben ser “0”.



\### Criterios de rechazo ❌

\- No deben mostrarse valores vacíos/NaN.

\- No deben existir errores en consola al cargar.



\*\*Pruebas asociadas:\*\*  

\- CP-001: Dashboard con datos → `tests/dashboard-complete.test.js`  

\- CN-001: Dashboard sin datos (valores 0) → `tests/dashboard-complete.test.js`  

\- CL-001: Manejo de muchos registros (20) → `tests/dashboard-complete.test.js`



---



\## HU-002: Autenticación de Usuario

\*\*Como\*\* usuario autorizado  

\*\*Quiero\*\* acceder con credenciales válidas  

\*\*Para\*\* usar el sistema de forma segura



\### Criterios de aceptación ✅

\- Con credenciales válidas redirige al dashboard.

\- El botón de login responde y no se bloquea.



\### Criterios de rechazo ❌

\- Con credenciales inválidas muestra mensaje de error/no redirige.

\- Campos vacíos deben ser validados.



\*\*Pruebas asociadas:\*\*  

\- CP-002: Login exitoso → `tests/login.test.js`  

\- CN-002: Credenciales inválidas → `tests/login.test.js`  

\- CL-002: Campos vacíos → `tests/login.test.js`



---



\## HU-003: Crear Estudiante

\*\*Como\*\* administrador  

\*\*Quiero\*\* registrar un estudiante con datos válidos  

\*\*Para\*\* mantener actualizado el padrón



\### Criterios de aceptación ✅

\- Al guardar, el estudiante aparece en la lista.

\- Los campos obligatorios son validados.



\### Criterios de rechazo ❌

\- No se permiten campos obligatorios vacíos o formatos inválidos.

\- No debe duplicar matrícula.



\*\*Pruebas asociadas:\*\*  

\- CP-003: Crear estudiante válido → `tests/create-student.test.js`  

\- CN-003: Rechazar campos vacíos → `tests/create-student.test.js`  

\- CL-003: Edades en el límite → `tests/create-student.test.js`



---



\## HU-004: Buscar Estudiante

\*\*Como\*\* administrador  

\*\*Quiero\*\* buscar estudiantes por nombre o matrícula  

\*\*Para\*\* encontrarlos rápidamente



\### Criterios de aceptación ✅

\- Al buscar por término exacto aparece el estudiante.

\- Búsqueda parcial devuelve coincidencias.



\### Criterios de rechazo ❌

\- Si no existe coincidencia, mostrar estado “sin resultados” (o mantener lista vacía) sin error.



\*\*Pruebas asociadas:\*\*  

\- CP-004: Búsqueda exitosa → `tests/search-student.test.js`  

\- CN-004: Sin resultados → `tests/search-student.test.js`  

\- CL-004: Búsqueda parcial → `tests/search-student.test.js`



---



\## HU-005: Actualizar Estudiante

\*\*Como\*\* administrador  

\*\*Quiero\*\* editar los datos de un estudiante  

\*\*Para\*\* corregir o actualizar su información



\### Criterios de aceptación ✅

\- Los cambios se reflejan en el listado.

\- Validación de campos obligatorios.



\### Criterios de rechazo ❌

\- No aceptar valores inválidos ni dejar campos requeridos vacíos.



\*\*Pruebas asociadas:\*\*  

\- CP-005: Actualización exitosa → `tests/update-student.test.js`  

\- CN-005: Datos inválidos → `tests/update-student.test.js`  

\- CL-005: Límite superior de edad → `tests/update-student.test.js`



---



\## HU-006: Eliminar Estudiante

\*\*Como\*\* administrador  

\*\*Quiero\*\* eliminar un estudiante  

\*\*Para\*\* mantener limpia la base de datos



\### Criterios de aceptación ✅

\- El estudiante desaparece del listado tras confirmar eliminación.

\- Si era el último, la lista queda vacía sin errores.



\### Criterios de rechazo ❌

\- Si se cancela la eliminación, no debe borrarse.

\- No deben quedar registros “huérfanos”.



\*\*Pruebas asociadas:\*\*  

\- CP-006: Eliminación exitosa → `tests/delete-student.test.js`  

\- CN-006: Cancelar eliminación → `tests/delete-student.test.js`  

\- CL-006: Eliminar último estudiante → `tests/delete-student.test.js`



---



\## Evidencia y Entregables

\- \*\*Código de pruebas (Selenium):\*\* carpeta `tests/`  

\- \*\*Configuración y utilidades:\*\* `config/`, `utils/`  

\- \*\*Reporte HTML:\*\* `reports/test-results.html`  

\- \*\*Capturas por escenario:\*\* `reports/screenshots/`  

\- \*\*Video demostrativo (público/no listado):\*\* enlace en `README.md`  



