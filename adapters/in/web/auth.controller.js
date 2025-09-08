class AuthController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async register(req, res, next) {
    try {
      const user = await this.registerUserUseCase.execute(req.body);
      res.status(201).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const token = await this.loginUserUseCase.execute(req.body);
      res.json({ success: true, token });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
