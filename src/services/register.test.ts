import { describe, it, expect } from "vitest"
import { RegisterUseCase } from "./register.js"
import { compare } from "bcryptjs"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js"
import { UserAlreadyExistsError } from "./errors/users-already-exists-error.js"

describe('Register Use Case', () => {
    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            nome: "Juan Frederico",
            email: 'juanFred@gmail.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            nome: "Juan Frederico",
            email: 'juanFred@gmail.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'juanFred@gmail.com'

        await registerUseCase.execute({
            nome: "Juan Frederico",
            email,
            password: '123456'
        })

        await expect(() =>
            registerUseCase.execute({
                nome: "Juan Frederico",
                email,
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})