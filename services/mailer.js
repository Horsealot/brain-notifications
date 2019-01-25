const config = require('config');
const mandrill = require('mandrill-api/mandrill');
const mandrill_client = new mandrill.Mandrill(config.get('mailer.key'));

const sendMail = (subject, from, to, content) => {
    var message = {
        "html": content,
        "text": content,
        "subject": subject,
        "from_email": from.email,
        "from_name": from.name,
        "to": to,
    };
    mandrill_client.messages.send({"message": message}, function(result) {
        console.log(result);
    }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
};

module.exports = {
    sendSignupLink: (basePath, email, token) => {
        const from = {
            "email": "brain@horsealot.com",
            "name": "The Brain",
        };
        const to =[{
            "email": email,
            "name": "New brain member",
            "type": "to"
        }];
        sendMail("You are invited on the Brain", from, to, `<a href="${basePath}${token}">Join the Brain Tribe</a>`);
    },
    sendPasswordResetLink: (basePath, email, name, token) => {
        const from = {
            "email": "brain@horsealot.com",
            "name": "The Brain",
        };
        const to =[{
            "email": email,
            "name": name,
            "type": "to"
        }];
        sendMail("Restore your brain password", from, to, `<a href="${basePath}${token}">Reset your Brain password</a>`);
    }
};