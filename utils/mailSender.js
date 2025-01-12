const nodemailer = require('nodemailer');

const mailSender = async (email, title, bodyContent) => {
    try {
        // Create the transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // Create the HTML body with a template that works for any type of email
        const htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f7fc;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 50px auto;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                    }
                    .header {
                        background-color: #4caf50;
                        color: white;
                        text-align: center;
                        padding: 10px 0;
                        border-radius: 8px 8px 0 0;
                    }
                    .header h1 {
                        margin: 0;
                    }
                    .content {
    padding: 30px;
    text-align: center;
    color: #444;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    font-size: 16px;
    line-height: 1.6;
}

.content h2 {
    font-size: 24px;
    font-weight: 600;
    color: #4caf50;
    margin-bottom: 15px;
}

.content p {
    font-size: 16px;
    color: #555;
}

.content .otp {
    font-size: 28px;
    font-weight: bold;
    color: #007bff;
    padding: 10px 20px;
    background-color: #e6f7ff;
    border-radius: 6px;
    margin-top: 15px;
}

.content .cta-button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
}

.content .cta-button:hover {
    background-color: #45a049;
}

                    .footer {
                        text-align: center;
                        color: #888;
                        font-size: 12px;
                        margin-top: 20px;
                    }
                    .footer p {
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${title}</h1>
                    </div>
                    <div class="content">
                        <p>${bodyContent}</p>
                    </div>
                    <div class="footer">
                        <p>If you have any questions, contact us at <a href="mailto:support@studynest.com">support@studynest.com</a></p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send the email
        let info = await transporter.sendMail({
            from: 'StudyNest || Nitin', // Sender address
            to: `${email}`, // Recipient's email address
            subject: title, // Subject line
            html: htmlTemplate, // HTML body content
        });

        return info;
    } catch (error) {
        console.log(error);
        return { success: false, msg: "Error in sending mail" };
    }
};

module.exports = mailSender;
