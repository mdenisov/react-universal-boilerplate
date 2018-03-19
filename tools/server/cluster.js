#!/usr/bin/env node

// Allows you to precompile ES6 syntax
require('babel-register'); // eslint-disable-line

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const Logger = require('../../server/utils/logger');

// Create logger instance
const logger = Logger.create('CLUSTER');

if (cluster.isMaster) {
  // Fork workers. One per CPU for maximum effectiveness
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  logger.info(`Started ${numCPUs} workers`);

  cluster.on('exit', (deadWorker, code, signal) => {
    // Restart the worker
    const worker = cluster.fork();

    // Note the process IDs
    const newPID = worker.process.pid;
    const oldPID = deadWorker.process.pid;

    // Log the event
    logger.error(`Worker ${oldPID} died "${signal}"`);
    logger.error(`Worker ${newPID} born`);
  });
} else {
  require('../../server'); // eslint-disable-line
}
