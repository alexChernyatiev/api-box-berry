import app from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 8015;

async () => await app.after();
app.listen(
  { port: FASTIFY_PORT },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`[${process.pid}] Server listening at ${address}.`);
  }
);
