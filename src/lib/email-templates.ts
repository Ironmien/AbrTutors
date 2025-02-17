interface BookingEmailData {
  parentName: string;
  learnerName: string;
  date: Date;
  hour: number;
  package: string;
  sessionType: string;
  status: string;
}

export const getBookingConfirmationEmail = ({
  parentName,
  learnerName,
  date,
  hour,
  package: packageType,
  sessionType,
}: BookingEmailData) => {
  return {
    subject: "Booking Confirmation - AbrTutors",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Booking Confirmation</h1>
        <p>Dear ${parentName},</p>
        <p>Your booking for ${learnerName} has been confirmed. Here are the details:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 8px 0;"><strong>Date:</strong> ${date.toLocaleDateString()}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${hour}:00</p>
          <p style="margin: 8px 0;"><strong>Package:</strong> ${packageType}</p>
          <p style="margin: 8px 0;"><strong>Session Type:</strong> ${sessionType}</p>
        </div>
        <p>We look forward to helping ${learnerName} achieve their academic goals!</p>
        <p>Best regards,<br>AbrTutors Team</p>
      </div>
    `,
  };
};

export const getBookingStatusUpdateEmail = ({
  parentName,
  learnerName,
  date,
  hour,
  package: packageType,
  sessionType,
  status,
}: BookingEmailData) => {
  return {
    subject: `Booking ${
      status.charAt(0).toUpperCase() + status.slice(1)
    } - AbrTutors`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Booking ${
          status.charAt(0).toUpperCase() + status.slice(1)
        }</h1>
        <p>Dear ${parentName},</p>
        <p>The status of your booking for ${learnerName} has been updated to <strong>${status}</strong>.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 8px 0;"><strong>Date:</strong> ${date.toLocaleDateString()}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${hour}:00</p>
          <p style="margin: 8px 0;"><strong>Package:</strong> ${packageType}</p>
          <p style="margin: 8px 0;"><strong>Session Type:</strong> ${sessionType}</p>
        </div>
        ${
          status === "cancelled"
            ? "<p>If you have any questions about the cancellation, please contact us.</p>"
            : status === "completed"
            ? "<p>Thank you for choosing AbrTutors. We hope the session was beneficial!</p>"
            : "<p>We look forward to the upcoming session!</p>"
        }
        <p>Best regards,<br>AbrTutors Team</p>
      </div>
    `,
  };
};
