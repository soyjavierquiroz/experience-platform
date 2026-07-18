export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  tags?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface EmailSendResult {
  provider: "disabled" | "ses" | "test";
  messageId?: string;
  accepted: boolean;
  skipped: boolean;
  reason?: string;
}

export interface EmailProvider { send(message: EmailMessage): Promise<EmailSendResult> }
