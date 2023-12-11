const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shaliniauroville@gmail.com',
    pass: 'xnwi ymes kloc qsfq'
  }
});

app.post('/schedule-email', (req, res) => {
  const { to, subject, text, date_time, time_zone_id } = req.body;

  if (!date_time || !date_time.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return res.status(400).send('Invalid date_time format or missing date_time');
  }

  const [year, month, day, hour, minute] = date_time.split(/[-T:]/);
  const cronSyntax = `${minute} ${hour} ${day} ${month} *`; // Use '*' for the day of the month

  console.log('Received Parameters:', { to, subject, text, date_time, time_zone_id });

  cron.schedule(cronSyntax, () => {
    const mailOptions = {
      from: 'shaliniauroville@gmail.com',
      to,
      subject,
      text
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('Error sending email:', error);
      }
      console.log('Email sent:', info.response);
    });
  });

  res.send('Email scheduled successfully');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
