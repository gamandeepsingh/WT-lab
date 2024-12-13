export const generateOTPEmail = (otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          padding: 20px;
        }
        .content {
          background-color: #ffffff;
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header img {
          max-width: 100px;
        }
        .header h1 {
          margin: 0;
          color: #333333;
        }
        .message {
          text-align: center;
          margin: 20px 0;
        }
        .otp {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: #ffffff;
          border-radius: 5px;
          font-size: 24px;
          letter-spacing: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #777777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <div class="header">
            <h1>FindYourVibe</h1>
          </div>
          <div class="message">
            <p>Dear user,</p>
            <p>Your OTP code is:</p>
            <div class="otp">${otp}</div>
            <p>Please use this code to complete your verification process. This code is valid for the next 10 minutes.</p>
          </div>
          <div class="footer">
            <p>Thank you for using FindYourVibe!</p>
            <p>&copy; ${new Date().getFullYear()} FindYourVibe. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  };