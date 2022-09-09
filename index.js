import Fastify from "fastify";
import dotenv from "dotenv";
import axios from "axios";
import cors from "@fastify/cors";
dotenv.config();

const fastify = Fastify();

fastify.register(cors, {
  origin: ["http://localhost:3000", "https://kyotomanga.live"],
});

fastify.get("/proxy", async function (request, reply) {
  try {
    const { src, url } = request.query;

    const options = {
      responseType: "stream",
      headers: {
        referer: String(url),
      },
    };

    const response = await axios.get(String(src), options);

    return reply.status(200).send(response.data);
  } catch (error) {
    reply.status(400).send({
      message: `Bad request ${err}`,
    });
  }
});

(async function () {
  try {
    await fastify.ready();

    const address = await fastify.listen({
      port: process.env.PORT || 5069,
      host: "0.0.0.0",
    });
    // eslint-disable-next-line no-console
    console.log(`Server listening at ${address}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
})();
