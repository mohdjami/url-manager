import { Kafka, Producer, logLevel } from "kafkajs";
export const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER!],
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME!,
    password: process.env.KAFKA_PASSWORD!,
  },
  logLevel: logLevel.ERROR,
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
