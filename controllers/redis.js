const express = require('express'); 
const redis = require('redis');
const { clients } = require('../utils/websocket');
const { constants } = require('../utils/constants');

const publisher = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

const subscriber = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

(async () => {
    try {
        await publisher.connect();
        console.log(`Publisher connected to Redis server at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    } catch (error) {
        console.error('Publisher error connecting to Redis server:', error);
    }

    try {
        await subscriber.connect();
        console.log(`Subscriber connected to Redis server at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    } catch (error) {
        console.error('Subscriber error connecting to Redis server:', error);
    }
})();

const channel = 'MESSAGES';

subscriber.subscribe(channel, (message) => {
    console.log(`Received message from ${channel}: ${message}`);
});
subscriber.on('message', (channel, message) => {
    console.log(`Received message from ${channel}: ${message}`);
    clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    });
});
subscriber.on('error', (error) => {
    console.error('Redis subscriber error:', error);
});

async function publishMessage(req, res) {
    console.log('Publishing message');
    const { channel, message } = req.body;
    console.log('Channel:', channel);
    console.log('Message:', message);

    try {
        await publisher.publish(channel, message);
        console.log(`Message sent to channel ${channel}: ${message}`);
        res.send({ status: constants.operation.status.SUCCESS });
    } catch (error) {
        console.error('Error publishing message:', error);
        res.status(500).send({ status: 'Error publishing message' });
    }
}

module.exports = { publishMessage };
