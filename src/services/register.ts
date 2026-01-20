import { prisma } from "@/lib/prisma.js";
import type { UserRepository } from "@/repositories/users-repository.js";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/users-already-exists-error.js";

interface RegisterUseCaseRequest {
    nome: string,
    email: string,
    password: string
}

//SOLID - Principio de Inversão de Dependencia
export class RegisterUseCase {

    constructor(private usersRepository: UserRepository) { }

    async execute({ nome, email, password }: RegisterUseCaseRequest) {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        await this.usersRepository.create({
            nome,
            email,
            password_hash
        })

    }
}
