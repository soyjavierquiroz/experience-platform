import { describe,expect,it } from "vitest";
import { rejectDisabledOtpRequest } from "./otp-gate";
describe("OTP endpoint gate",()=>{it("rejects manual OTP requests while disabled",async()=>{const response=rejectDisabledOtpRequest(new Request("https://example.test/api/auth/email-otp/send-verification-otp",{method:"POST"}),false);expect(response?.status).toBe(503);expect(await response?.json()).toEqual({message:"El acceso por email se habilitará próximamente."});});});
