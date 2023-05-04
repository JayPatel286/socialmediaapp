const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) => {
	// let testAccount = await nodeMailer.createTestAccount();

	var transporter = nodeMailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.SMPT_MAIL,
			pass: process.env.SMPT_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.SMPT_MAIL,
		to: options.email,
		subject: options.subject,
		html: options.message,
	};

	await transporter.sendMail(mailOptions);
};
