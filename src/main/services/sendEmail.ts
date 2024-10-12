import { createTransport, Transporter as NodemailerTransporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

class Transporter {
  private transporter: NodemailerTransporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
  private email: string
  constructor(email: string, password: string) {
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password
      }
    })
    this.email = email
  }

  async sendEmail(
    email: string,
    subject: string,
    message: string,
    errors: string[]
  ): Promise<{ success: boolean; message: any }> {
    try {
      const response = await this.transporter.sendMail({
        from: this.email,
        to: email,
        subject,
        html: `
        <div style="padding: 16px; border-radius: 8px; background-color: #ffffff; color: #333; font-family: 'Arial', sans-serif; border: 1px solid #eaeaea;">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${message}</div>
          <div style="margin-top: 12px;">
            ${errors.map(err => `
              <div style="padding: 8px; margin: 4px 0; border: 1px solid #eaeaea; border-radius: 4px; background-color: #f9f9f9; color: #555;">
                ${err}
              </div>
            `).join('')}
          </div>
        </div>
        `
      })
      return { success: true, message: response }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }
}

export const transporter = new Transporter(
  import.meta.env.MAIN_VITE_EMAIL,
  import.meta.env.MAIN_VITE_PASSEMAIL
)
