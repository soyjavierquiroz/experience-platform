import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { appendFile } from "node:fs/promises";
import { requireRuntimeValue } from "./secrets";

export async function sendOtpEmail(email:string,otp:string){
  const provider=process.env.EMAIL_PROVIDER??"ses";
  if(provider==="test"){
    if(process.env.ALLOW_TEST_EMAIL_PROVIDER!=="true")throw new Error("Unsafe test email provider is disabled");
    const target=requireRuntimeValue("TEST_OTP_FILE"); await appendFile(target,JSON.stringify({email,otp})+"\n",{mode:0o600}); return;
  }
  const region=requireRuntimeValue("AWS_REGION"); const from=requireRuntimeValue("SES_FROM_EMAIL"); const replyTo=process.env.SES_REPLY_TO_EMAIL?.trim();
  const client=new SESv2Client({region,credentials:{accessKeyId:requireRuntimeValue("AWS_ACCESS_KEY_ID"),secretAccessKey:requireRuntimeValue("AWS_SECRET_ACCESS_KEY")}});
  await client.send(new SendEmailCommand({FromEmailAddress:from,ReplyToAddresses:replyTo?[replyTo]:undefined,Destination:{ToAddresses:[email]},Content:{Simple:{Subject:{Data:"Tu código de acceso",Charset:"UTF-8"},Body:{Text:{Data:`Tu código para entrar es ${otp}. Expira en 5 minutos. Si no lo solicitaste, puedes ignorar este mensaje.`,Charset:"UTF-8"},Html:{Data:`<div style="font-family:Arial,sans-serif;color:#30272a"><h1 style="font-size:24px">Tu espacio está aquí</h1><p>Tu código para entrar es:</p><p style="font-size:32px;font-weight:700;letter-spacing:8px">${otp}</p><p>Expira en 5 minutos. Si no lo solicitaste, puedes ignorar este mensaje.</p></div>`,Charset:"UTF-8"}}}}}));
}
