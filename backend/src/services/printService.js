import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { printTicketIPP } from './ippPrintService.js';
import { getDefaultPrinter } from './defaultPrinterService.js';

const redis = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

export const printQueue = new Queue('printQueue', {
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

// Store failed prints in memory (for demo; use DB in production)
export const failedPrints = new Set();

const worker = new Worker(
  'printQueue',
  async (job) => {
    const { command, products } = job.data;
    const fakeCommand = {
      _id: command,
      table: { number: '??' },
      products
    };

    let printerUrl = null;
    const defaultPrinter = await getDefaultPrinter();
    if (defaultPrinter && defaultPrinter.url) {
      printerUrl = defaultPrinter.url;
    }

    try {
      await printTicketIPP(fakeCommand, printerUrl);
    } catch (err) {
      // Mark as failed
      failedPrints.add(command);
      throw err;
    }
  },
  {
    connection: new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null }),
  }
);

worker.on('completed', (job) => {
  console.log(`✅ Print job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Print job ${job.id} failed:`, err);
});