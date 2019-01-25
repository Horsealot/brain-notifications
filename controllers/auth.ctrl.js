const MailerService = require('./../services/mailer');

module.exports = {
    handle:  (payload) => {
        switch(payload.type) {
            case 'signup_invite':
                MailerService.sendSignupLink(payload.basePath, payload.email, payload.token);
                break;
            case 'password_reset_request':
                MailerService.sendPasswordResetLink(payload.basePath, payload.email, payload.name,payload.token);
                break;
            default:
                console.log("[authCtrl] Unhandled payload type");
                break;
        }
    }
};