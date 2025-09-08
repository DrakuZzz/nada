class RegisterUserUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute(userData){
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("Email already in use");
        }

        const hashedPassword = await this.authService.hashPassword(userData.password);
        const user = await this.userRepository.create({
            ...userData,
            password: hashedPassword
        });

        return await this.userRepository.create(user);
    }
}

export default RegisterUserUseCase;