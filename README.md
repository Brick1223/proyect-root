Proyecto de Autenticación de Usuarios

Este proyecto es un servicio web para el registro e inicio de sesión de usuarios, desarrollado con Node.js, Express y MySQL. Permite a los usuarios registrarse y autenticarse mediante un nombre de usuario y una contraseña. A continuación, se detalla la estructura del proyecto, las tecnologías usadas y las instrucciones para ejecutar el proyecto y realizar pruebas.

Estructura del Proyecto

arduino

proyect-root/
│
├── config/
│   └── db.mjs
│
├── controllers/
│   └── authController.mjs
│
├── middleware/
│   └── authMiddleware.mjs
│
├── models/
│   └── User.mjs
│
├── routes/
│   └── authRoutes.mjs
│
├── .env
├── App.mjs
├── Server.mjs
├── package.json
└── README.md

Descripción de Archivos
Configuración

    config/db.mjs:

    javascript

    import { Sequelize } from 'sequelize';
    import dotenv from 'dotenv';

    dotenv.config();

    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST,
      dialect: 'mysql'
    });

    try {
      await sequelize.authenticate();
      console.log('Database connected...');
    } catch (error) {
      console.log('Error: ' + error);
    }

    export default sequelize;

Modelos

    models/User.mjs:

    javascript

    import { DataTypes } from 'sequelize';
    import sequelize from '../Config/db.mjs';

    const User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });

    try {
      await sequelize.sync();
      console.log('Users table has been synced');
    } catch (error) {
      console.log('Error: ' + error);
    }

    export default User;

Controladores

    controllers/authController.mjs:

    javascript

    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import User from '../Models/User.mjs';
    import dotenv from 'dotenv';

    dotenv.config();

    export const register = async (req, res) => {
      const { username, password } = req.body;
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

    export const login = async (req, res) => {
      const { username, password } = req.body;
      try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Authentication successful', token });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

Rutas

    routes/authRoutes.mjs:

    javascript

    import express from 'express';
    import { register, login } from '../Controllers/authController.mjs';

    const router = express.Router();

    router.post('/register', register);
    router.post('/login', login);

    export default router;

Middleware

    middleware/authMiddleware.mjs:

    javascript

    import jwt from 'jsonwebtoken';
    import dotenv from 'dotenv';

    dotenv.config();

    const authMiddleware = (req, res, next) => {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ error: 'Access denied' });

      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
      } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
      }
    };

    export default authMiddleware;

Aplicación Principal

    App.mjs:

    javascript

    import express from 'express';
    import authRoutes from './Routes/authRoutes.mjs';

    const app = express();

    app.use(express.json());
    app.use('/api/auth', authRoutes);

    export default app;

Servidor

    Server.mjs:

    javascript

    import app from './App.mjs';
    import dotenv from 'dotenv';

    dotenv.config();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

Variables de Entorno

    .env:

    env

    DB_NAME=auth_db
    DB_USER=root
    DB_PASS=
    DB_HOST=localhost
    DB_PORT=3305
    JWT_SECRET=your_jwt_secret
    PORT=3001

Instalación

    Clona el repositorio desde GitHub.

    bash

git clone <URL_DE_TU_REPOSITORIO>
cd proyect-root

Instala las dependencias.

bash

npm install

Crea un archivo .env en la raíz del proyecto con las variables de entorno necesarias.

Asegúrate de que tu servidor MySQL esté corriendo y de que hayas creado la base de datos auth_db.

Inicia el servidor.

bash

    npm start

Pruebas en Postman
Registro

    Abre Postman y crea una nueva petición POST a http://localhost:3001/api/auth/register.
    En la pestaña "Body", selecciona "raw" y "JSON".
    Introduce el siguiente JSON:

    json

    {
      "username": "testuser",
      "password": "testpassword"
    }

    Haz clic en "Send". Deberías recibir una respuesta de éxito indicando que el usuario ha sido registrado.

Inicio de Sesión

    Crea una nueva petición POST a http://localhost:3001/api/auth/login.
    En la pestaña "Body", selecciona "raw" y "JSON".
    Introduce el siguiente JSON:

    json

    {
      "username": "testuser",
      "password": "testpassword"
    }

    Haz clic en "Send". Deberías recibir un token JWT como respuesta, indicando que el inicio de sesión fue exitoso.

Tecnologías Usadas

    Node.js
    Express
    MySQL
    Sequelize
    bcryptjs
    jsonwebtoken
    dotenv

Link al Repositorio de GitHub

