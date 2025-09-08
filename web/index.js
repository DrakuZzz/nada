import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// Dominio
import AuthService from '../domain/services/auth.service.js';

// Aplicación
import RegisterUserCase from '../application/use-cases/register-user.use-case.js';
import LoginUserCase from '../application/use-cases/login-user.use-case.js';

// Adaptadores
import AuthController from '../adapters/in/web/auth.controller.js';
import createAuthRoutes from '../adapters/in/web/routes/auth.routes.js';

// Para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repositorio Mock en memoria
class MockUserRepository {
    constructor() {
        this.users = [];
    }

    async findByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    async create(userData) {
        const user = { id: Date.now(), ...userData };
        this.users.push(user);
        return user;
    }
}

class Application {
    constructor() {
        this.app = express();
    }

    async initialize() {
        // Servicios y repositorios
        const authService = new AuthService(process.env.JWT_SECRET || 'defaultsecret');
        const userRepo = new MockUserRepository();

        // Casos de uso
        const registerUserUseCase = new RegisterUserCase(userRepo, authService);
        const loginUserUseCase = new LoginUserCase(userRepo, authService);

        // Controladores
        const authController = new AuthController(registerUserUseCase, loginUserUseCase);

        // Middleware básico
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));

        this.app.get(['/', '/login'], (req, res) => {
            res.sendFile(path.join(__dirname, 'public/login.html'));
        });

        this.app.get('/register', (req, res) => {
            res.sendFile(path.join(__dirname, 'public/register.html'));
        });

        // Rutas API
        this.app.use('/api/auth', createAuthRoutes(authController));

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
        });

        // Manejo de errores
        this.app.use((err, req, res, next) => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });

        // Manejo de rutas no encontradas
        this.app.use((req, res) => {
            res.sendFile(path.join(__dirname, 'public/login.html'));
        });

        await this.start();
    }

    async start() {
        const port = process.env.PORT || 3000;
        this.server = this.app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}

// Iniciar aplicación
new Application().initialize().catch(console.error);