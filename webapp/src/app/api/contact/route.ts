// @ts-expect-error no typings for nodemailer
import nodemailer from "nodemailer";
import { redirect } from "next/navigation";
import { i18n } from "@/i18n";

const transporter = nodemailer.createTransport({
  host: process.env.mail_smtp_host,
  port: process.env.mail_smtp_port,
  secure: false,
  requireTLS: process.env.mail_smtp_tls_enable,
  auth: {
    user: process.env.mail_smtp_user,
    pass: process.env.mail_smtp_password,
  },
});

type ContactMailFormData = {
  mail: string;
  message: string;
  name: string | null;
  title: string | null;
};

const createContactMailMessage = (data: ContactMailFormData) => {
  const notSpecified = i18n.t("contact.page.form.title.option1");
  return i18n.t("contact.mail.body", {
    title: data.title || notSpecified,
    name: data.name || notSpecified,
    mail: data.mail,
    message: data.message,
  });
};

const createContactMailSubject = (data: ContactMailFormData) => {
  return i18n.t("contact.mail.subject", { mail: data.mail });
};

function sendContactMail(data: ContactMailFormData) {
  transporter
    .sendMail({
      text: createContactMailMessage(data),
      subject: createContactMailSubject(data),
      from: process.env.mail_smtp_from_address,
      to: process.env.mail_smtp_to_address,
    })
    .then((info: { messageId: string }) => {
      console.log("Message sent: %s", info.messageId);
    })
    .catch((error: unknown) => {
      console.error("Message : %s", error);
    });
}

export async function POST(request: Request) {
  if (process.env.mail_enabled === "true") {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const honeyPotMail = params.get("mail");
    const message = params.get("message");
    const mail = params.get("mail2");
    const name = params.get("name");
    const title = params.get("title");

    // message over 10000 - assume its a bot
    const messageValid = message && message.length < 10000;

    if (!honeyPotMail && messageValid && mail) {
      sendContactMail({ message, mail, name, title });
    }

    redirect("/kontakt/ok");
  }
}
