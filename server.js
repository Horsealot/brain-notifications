var amqp = require('amqplib/callback_api');

const rabbitmqConfig = require('./config/rabbitmq');
const authController = require('./controllers/auth.ctrl');

amqp.connect(rabbitmqConfig.host, function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = rabbitmqConfig.queue;

        ch.assertQueue(q, {durable: true});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            const parsedContent = JSON.parse(msg.content.toString());
            switch (parsedContent.type) {
                case 'auth':
                    authController.handle(parsedContent.payload);
                    break;
                default:
                    console.error("Unhandled type");
                    break;
            }
        }, {noAck: true});
    });
});