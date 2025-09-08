import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
    constructor(jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            this.jwtSecret,
            { expiresIn: '1h' }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (err) {
            return null;
        }
    }
}

export default AuthService;
