import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface BookingEmailData {
  id: string;
  userEmail: string;
  studentName: string;
  date: Date;
  hour: number;
  slotNumber: number;
  sessionType: string;
  package: string;
  status: string;
}

export async function sendBookingConfirmationEmail(
  userEmail: string,
  booking: BookingEmailData
) {
  const packagePrices = {
    single: "R200",
    weekly: "R600/month",
    monthly: "R1000/month",
  };

  const packagePrice =
    packagePrices[booking.package as keyof typeof packagePrices] ||
    "Price varies";

  const date = new Date(booking.date).toLocaleDateString();

  try {
    await resend.emails.send({
      from: "ABR TUTORS <notifications@abrtutors.co.za>",
      to: userEmail,
      subject: "Booking Confirmation - ABR TUTORS",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #b45309;">Booking Confirmation</h1>
          
          <p>Dear ${booking.studentName},</p>
          
          <p>Thank you for booking a tutoring session with ABR TUTORS. Here are your booking details:</p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Package:</strong> ${booking.package} (${packagePrice})</p>
            <p><strong>Session Type:</strong> ${booking.sessionType}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${booking.hour}:00</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>
          
          <p>We will confirm your booking shortly. If you need to make any changes, please contact us at info@abrtutors.co.za or +27 075 1499977.</p>
          
          <p>Best regards,<br>The ABR TUTORS Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
}

export async function sendBookingStatusUpdateEmail(
  userEmail: string,
  booking: BookingEmailData
) {
  const date = new Date(booking.date).toLocaleDateString();

  try {
    await resend.emails.send({
      from: "Math Mastery <notifications@mathmastery.co.za>",
      to: userEmail,
      subject: `Booking Status Update - ${booking.status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Math Mastery - Booking Update</h1>
          <p>Dear ${booking.studentName},</p>
          <p>Your booking status has been updated. Here are the current details:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Package:</strong> ${booking.package}</p>
            <p><strong>Session Type:</strong> ${booking.sessionType}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${booking.hour}:00</p>
            <p><strong>New Status:</strong> ${booking.status}</p>
          </div>

          <p>If you have any questions about this update, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The Math Mastery Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending status update email:", error);
    throw error;
  }
}

export async function sendBookingCancellationEmail(
  userEmail: string,
  booking: BookingEmailData
) {
  const date = new Date(booking.date).toLocaleDateString();

  try {
    await resend.emails.send({
      from: "Math Mastery <notifications@mathmastery.co.za>",
      to: userEmail,
      subject: "Booking Cancellation - Math Mastery",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Math Mastery - Booking Cancellation</h1>
          <p>Dear ${booking.studentName},</p>
          <p>Your booking has been cancelled. Here are the details of the cancelled session:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Package:</strong> ${booking.package}</p>
            <p><strong>Session Type:</strong> ${booking.sessionType}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${booking.hour}:00</p>
          </div>

          <p>If you'd like to book another session, please visit our website or contact us directly.</p>
          
          <p>Best regards,<br>The Math Mastery Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    throw error;
  }
}
