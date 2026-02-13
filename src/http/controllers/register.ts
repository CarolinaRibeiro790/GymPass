import { UserAlreadyExistsError } from "@/services/errors/users-already-exists-error.js";
import { makeRegisterUseCase } from "@/services/factories/make-register-use-case.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import z from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        nome: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { nome, email, password } = registerBodySchema.parse(request.body);

    try {

        const registerUseCase = makeRegisterUseCase();

        await registerUseCase.execute({ nome, email, password })

    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: error.message })
        }

        throw error

    }
    return reply.status(201).send()
}