import fastify from "fastify";
import { ZodError } from "zod";
import { appRoutes } from "./http/routes.js";
import { env } from "./env/index.js";

export const app = fastify();

app.register(appRoutes)

app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error.', issues: error.format() })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {
        //Log ferramenta externa
    }

    return reply.status(500).send({ message: 'Internal server error.' })
})