# xfile_cat_0.0.1

## Descripción del Proyecto
  - **xfile_cat_0.0.1** es una aplicación web diseñada para la administración y comparación de archivos en formatos Excel (.xlsx) y CSV. La aplicación permite a los usuarios     autenticados subir, visualizar, editar, descargar y comparar archivos de manera intuitiva y eficiente. 🚀💻🔥

### Características Principales 🚀
  1. **Autenticación de usuarios:** Los usuarios pueden registrarse e iniciar sesión con `nombre, rol, email. contraseña`.
  2. **Gesatión de archivos:**
      - Menú desplegable para seleccionar el tipo de archivo (XLSX o CSV).
      - Menú adicional con opciones:
          - Subir
          - Descargar
          - Ver
          - Editar
          - Eliminar
      - Posibilidad de arrastrar y soltar archivos o seleccionarlos manualmente desde el explorador de archivos.
  3. **Visualización y comparación de archivos:**
       - Soporte para múltiples archivos simultáneamente (XLSX, CSV o combinación de ambos).
       - Comparación de datos entre archivos para identificar diferencias en los registros.
  4. **Validación e inserción en PostgreSQL:**
       - Una vez subido el archivo, la aplicación validará que los campos cumplen con el formato esperado.
       - En caso de errores, se notificará al usuario para corregirlos.
       - La aplicación tendrá una opción que permite cambiar entre los diferentes formatos de acuerdo al contenido del campo.
       - Si la validación es exitosa, los datos podrán insertarse en una tabla PostgreSQL para su almacenamiento y posterior consulta.

### Tecnologías Utilizadas
#### Frontend
  - **React** con **Next.js**
  - **Ant Design** para la interfaz de usuario
  - **NextAuth** para la autenticación

#### Backend
  - **Express.js** para la API
  - **PostgreSQL** como base de datos
  - **Librerías para manejo de archivos:**
      - **multer** (para manejar la carga de archivos en el backend)
      - **xlsx** (para procesar archivos excel en el backend)
      - **csv-parser** (para procesar archivos csv en el backend)
   


















     
