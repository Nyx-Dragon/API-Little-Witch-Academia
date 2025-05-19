# 🧙‍♀️ Little Witch Academia API

¡Bienvenido a la API de **Little Witch Academia**!  
Esta API RESTful proporciona información detallada sobre personajes, relaciones mágicas, hechizos, niveles de poder y más del universo de _Little Witch Academia_.

🌐 **Demo en vivo**:  
[https://api-little-witch-academia.onrender.com](https://api-little-witch-academia.onrender.com)

---

## ✨ Características

-   📜 Listado completo de personajes con:
    -   Nombre, edad y descripción
    -   Relación con otras brujas
    -   Hechizos dominados
    -   Nivel de poder y afinidad mágica
-   ⚙️ API RESTful organizada por rutas
-   🔄 Soporte para CORS (ideal para frontends)
-   📬 Formulario de contacto con almacenamiento en base de datos (MySQL) ("En proceso")

---

## 📂 Estructura del proyecto

```bash
server/
│
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│
├── public/         # Archivos HTML, CSS, JS del frontend
├── .env            # Configuración sensible (no se sube)
├── server.js       # Entrada principal del servidor

```

## 🚀 Instalación y uso local

```
Clona el repositorio:

bash
git clone https://github.com/tuusuario/api-little-witch-academia.git
Entra a la carpeta:

bash
cd api-little-witch-academia
Instala las dependencias:

bash
npm install
Crea un archivo .env con tu configuración de base de datos:

dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=contactmessage
PORT=3000 (o casi cualquier otro)
Inicia el servidor:

bash
npm start
```

## 📬 Contacto

```
El proyecto incluye un formulario de contacto funcional.
Los mensajes se almacenan en una base de datos MySQL para futuras consultas.
("En proceso")
```

## 📖 Licencia

```
Este proyecto es solo con fines educativos y sin fines de lucro.
Little Witch Academia es propiedad de Studio Trigger.

```
