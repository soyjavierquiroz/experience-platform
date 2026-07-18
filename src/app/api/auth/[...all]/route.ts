import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { emailConfig } from "@/features/email/runtime";
import { rejectDisabledOtpRequest } from "@/features/email/otp-gate";
const handler=toNextJsHandler(auth);
export const GET=handler.GET;
export async function POST(request:Request){return rejectDisabledOtpRequest(request,emailConfig.AUTH_EMAIL_OTP_ENABLED)??handler.POST(request);}
