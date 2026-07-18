import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { readRuntimeValue } from "@/lib/secrets";
import type { EmailConfig } from "./config";
import type { EmailMessage, EmailProvider, EmailSendResult } from "./types";

export class DisabledEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<EmailSendResult> { void message;return {provider:"disabled",accepted:false,skipped:true,reason:"email_disabled"}; }
}

export class TestEmailProvider implements EmailProvider {
  readonly messages: EmailMessage[] = [];
  constructor(nodeEnv: EmailConfig["NODE_ENV"]) { if (nodeEnv !== "test") throw new Error("Test email provider is only allowed in tests"); }
  async send(message: EmailMessage): Promise<EmailSendResult> { this.messages.push(structuredClone(message));return {provider:"test",accepted:true,skipped:false,messageId:`test-${this.messages.length}`}; }
  lastMessage(): EmailMessage | undefined { return this.messages.at(-1); }
  lastOtp(): string | undefined { return this.lastMessage()?.text.match(/\b\d{6}\b/)?.[0]; }
}

export class SesEmailProvider implements EmailProvider {
  private readonly client: SESv2Client;
  constructor(private readonly config: EmailConfig, source: Record<string,string|undefined> = process.env) {
    const accessKeyId=readRuntimeValue("AWS_ACCESS_KEY_ID",source);const secretAccessKey=readRuntimeValue("AWS_SECRET_ACCESS_KEY",source);
    if(!config.AWS_REGION||!config.SES_FROM_EMAIL||!accessKeyId||!secretAccessKey)throw new Error("SES runtime configuration is incomplete");
    this.client=new SESv2Client({region:config.AWS_REGION,credentials:{accessKeyId,secretAccessKey}});
  }
  async send(message: EmailMessage): Promise<EmailSendResult> {
    try { const result=await this.client.send(new SendEmailCommand({FromEmailAddress:this.config.SES_FROM_EMAIL,ReplyToAddresses:message.replyTo?[message.replyTo]:this.config.SES_REPLY_TO_EMAIL?[this.config.SES_REPLY_TO_EMAIL]:undefined,Destination:{ToAddresses:[message.to]},EmailTags:message.tags?Object.entries(message.tags).map(([Name,Value])=>({Name,Value})):undefined,Content:{Simple:{Subject:{Data:message.subject,Charset:"UTF-8"},Body:{Html:{Data:message.html,Charset:"UTF-8"},Text:{Data:message.text,Charset:"UTF-8"}}}}}));return {provider:"ses",messageId:result.MessageId,accepted:true,skipped:false}; }
    catch { throw new Error("SES could not deliver the transactional email"); }
  }
}

export function createEmailProvider(config: EmailConfig, source: Record<string,string|undefined> = process.env): EmailProvider {
  if (!config.EMAIL_ENABLED || config.EMAIL_PROVIDER === "disabled") return new DisabledEmailProvider();
  if (config.EMAIL_PROVIDER === "test") return new TestEmailProvider(config.NODE_ENV);
  return new SesEmailProvider(config,source);
}
