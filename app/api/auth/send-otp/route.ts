import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email wajib diisi." }, { status: 400 });
    }

    // Buat kode OTP 6 digit
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await transporter.sendMail({
      from: `"ChanThecno" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Kode Verifikasi ChanThecno",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>ChanThecno</h1>

          <p>Kode verifikasi kamu:</p>

          <h2 style="font-size: 32px; letter-spacing: 8px;">
            ${otp}
          </h2>

          <p>
            Gunakan kode ini untuk melanjutkan pendaftaran.
          </p>

          <p>
            Jangan bagikan kode ini kepada siapa pun.
          </p>
        </div>
      `,
    });

    console.log("OTP:", otp);

    return Response.json({
      success: true,
      message: "OTP berhasil dikirim.",
    });
  } catch (error) {
    console.error("Gagal mengirim email:", error);

    return Response.json({ error: "Gagal mengirim email." }, { status: 500 });
  }
}
