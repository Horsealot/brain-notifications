var amqp = require('amqplib/callback_api');

const config = require('config');
const authController = require('./controllers/auth.ctrl');

amqp.connect(config.get('rabbitmq.host'), function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = config.get('rabbitmq.queue_prefix') + "notifications";

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