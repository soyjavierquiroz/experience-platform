import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { requireRuntimeValue } from "@/lib/secrets";
import { ensureBetaEnrollment } from "@/features/progress/service";
import { defaultEmailTenant, emailConfig, emailService } from "@/features/email/runtime";

const authSecret=process.env.NEXT_PHASE==="phase-production-build"?"build-only-secret-not-used-at-runtime-32-chars":requireRuntimeValue("BETTER_AUTH_SECRET");
const otpPlugins=emailConfig.AUTH_EMAIL_OTP_ENABLED?[emailOTP({otpLength:6,expiresIn:300,allowedAttempts:3,storeOTP:"hashed",rateLimit:{window:60,max:5},generateOTP:()=>emailConfig.EMAIL_PROVIDER==="test"?(emailConfig.TEST_OTP_CODE??"731946"):undefined,sendVerificationOTP:async({email,otp})=>{await emailService.sendTemplate({tenant:defaultEmailTenant,template:"auth-otp",recipient:email,variables:{code:otp}});}})]:[];
export const auth=betterAuth({
  appName:defaultEmailTenant.productName, baseURL:process.env.APP_URL??"http://localhost:3000", secret:authSecret,
  database:drizzleAdapter(getDb(),{provider:"pg",schema,transaction:true}),
  emailAndPassword:{enabled:false},
  plugins:otpPlugins,
  rateLimit:{enabled:true,storage:"database",window:60,max:20,customRules:{"/email-otp/send-verification-otp":{window:60,max:5},"/sign-in/email-otp":{window:60,max:5}}},
  advanced:{useSecureCookies:process.env.AUTH_SECURE_COOKIES!=="false",cookiePrefix:"mnle",ipAddress:{ipAddressHeaders:["x-forwarded-for"],trustedProxies:(process.env.TRUSTED_PROXY_CIDRS??"").split(",").filter(Boolean)}},
  databaseHooks:{user:{create:{after:async(user)=>{if(process.env.BETA_AUTO_ENROLL==="true")await ensureBetaEnrollment(getDb(),"mnle",user.id);}}}},
});
