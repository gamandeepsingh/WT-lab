import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "findyourvibe24@gmail.com",
    pass: process.env.NODEMAILER,
  },
});

const sendBookingEmail = (
  email,
  username,
  event,
  ticketDetails,
  amount,
  id,
) => {
  const mailOptions = {
    from: '"Find Your Vibe" <findyourvibe24@gmail.com>',
    to: email,
    subject: "Congrats on your Booking with Find Your Vibe 🥳",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Congrats, ${username}!</h2>
        <p>Your booking for <strong>${event.Title}</strong> has been successfully confirmed! 🎉</p>
            <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; line-height: 1.5;">
                <div style="max-width: 600px; margin: auto; background-color: #1d1d1d; padding: 20px; border-radius: 8px;">
                  <img style="width: 20%" src="https://res.cloudinary.com/dpcz9zmob/image/upload/v1726666707/fyv-nav_rw4e4w.png"/>
                  <div style="text-align: center;">
                    <img src="${event.Image[1]}" alt="Event Image" style="width: 100%; height: auto; max-height: 180px; object-fit: cover; border-radius: 8px;">
                  </div>
                  <h3 style="font-size: 20px; font-weight: bold; margin-top: 20px;color: white;">${event.Title}</h3>
                  <p style="font-size: 14px; color: #f4f4f4;">Receipt ID: <strong>${id}</strong></p>
                  <table style="width: 100%; margin-top: 20px;">
                    <tr>
                      <td style="width: 50%; padding: 5px;">
                        <p style="font-size: 14px; color: #f4f4f4;">Name</p>
                        <p style="font-size: 16px; font-weight: bold;color: white;">${username}</p>
                      </td>
                      <td style="width: 50%; padding: 5px; text-align: right;">
                        <p style="font-size: 14px; color: #f4f4f4;">Location</p>
                        <p style="font-size: 16px; font-weight: bold;color: white;">${event.City}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 50%; padding: 5px;">
                        <p style="font-size: 14px; color: #f4f4f4;">Date</p>
                        <p style="font-size: 16px; font-weight: bold;color: white;">${event.Date}</p>
                      </td>
                      <td style="width: 50%; padding: 5px; text-align: right;">
                        <p style="font-size: 14px; color: #f4f4f4;">Time</p>
                        <p style="font-size: 16px; font-weight: bold;color: white;">${event.StartTime}</p>
                      </td>
                    </tr>
                  </table>
                  <table style="width: 100%; margin-top: 20px;">
                    <tr>
                      <td style="width: 50%; padding: 5px;">
                        <p style="font-size: 14px; color: #f4f4f4;">Your Tickets</p>
                        <p style="font-size: 16px; font-weight: bold;color: white;">${ticketDetails}</p>
                      </td>
                      <td style="width: 50%; padding: 5px; text-align: right;">
                        <p style="font-size: 16px; font-weight: bold;color: white;">₹${amount / 100}</p>
                      </td>
                    </tr>
                  </table>
                  <div style="text-align: center; margin-top: 30px;">
                    <p style="font-size: 12px; color: #888;">Cancellation not available for this venue.</p>
                  </div>
                </div>
              </div>
          <p style="margin-top: 20px;">We hope you have a great time at the event! 😊</p>
          <p>Best regards,</p>
          <p>Find Your Vibe Team</p>
      </div>

    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    }
  });
};

export default sendBookingEmail;
