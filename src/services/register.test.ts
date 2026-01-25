import { describe, it, expect, beforeEach } from "vitest"
import { RegisterUseCase } from "./register.js"
import { compare } from "bcryptjs"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js"
import { UserAlreadyExistsError } from "./errors/users-already-exists-error.js"

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {

    //Criar antes de cada um dos testes
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should be able to register', async () => {
        const { user } = await sut.execute({
            nome: "Juan Frederico",
            email: 'juanFred@gmail.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const { user } = await sut.execute({
            nome: "Juan Frederico",
            email: 'juanFred@gmail.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {

        const email = 'juanFred@gmail.com'

        await sut.execute({
            nome: "Juan Frederico",
            email,
            password: '123456'
        })

        await expect(() =>
            sut.execute({
                nome: "Juan Frederico",
                email,
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})