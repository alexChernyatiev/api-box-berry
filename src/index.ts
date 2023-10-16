import app from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3001;

async () => await app.after();
app.listen(
  { port: FASTIFY_PORT },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
