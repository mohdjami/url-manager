import { Kafka, Producer } from "kafkajs";
import path from "path";
import fs from "fs";
export const kafka = new Kafka({
  clientId: "url-shortener",
  brokers: [process.env.KAFKA_BROKER || ""],
  ssl: {
    ca: [
      fs.readFileSync(
        path.resolve(process.env.CA_PEM_PATH || "./ca.pem"),
        "utf-8"
      ),
    ],
  },
  sasl: {
    mechanism: "plain",
    username: "avnadmin",
    password: process.env.KAFKA_PASSWORD!,
  },
});

let producer: null | Producer;

export const getProducer = async () => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
  }
  return producer;
};

export const produceMessage = async (topic: string, email: string) => {
  const producer = await getProducer();
  await producer.send({
    topic,
    messages: [{ key: `email- ${Date.now()}`, value: email }],
  });
  return true;
};
