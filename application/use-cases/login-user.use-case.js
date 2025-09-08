class LoginUserCase {

    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await this.authService.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = this.authService.generateToken({ user });
        return { user: user.toJSON(), token };
    }

}

export default LoginUserCase;