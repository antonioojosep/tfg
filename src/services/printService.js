import Queue from 'bullmq';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const printQueue = new Queue('print', {
    connection: redis
});

export const addToPrintQueue = async (data, type) => {
    await printQueue.add(type, data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    });
};

// Procesar trabajos de impresión
printQueue.process(async (job) => {
    const { data, type } = job;
    
    // Aquí iría la lógica de impresión real
    console.log(`Printing ${type}:`, data);
    
    // Simular impresión
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { printed: true };
});