import { describe,expect,it,vi } from "vitest";
import { parseEmailConfig } from "./config";
import { createEmailProvider,DisabledEmailProvider,TestEmailProvider } from "./providers";
import { EmailService } from "./service";
import { tenants } from "@/features/tenants/config";

const message={to:"person@example.test",subject:"Test",html:"<p>secret 123456</p>",text:"secret 123456"};
describe("email providers",()=>{
  it("disabled skips without sending",async()=>expect(await new DisabledEmailProvider().send(message)).toEqual({provider:"disabled",accepted:false,skipped:true,reason:"email_disabled"}));
  it("disabled does not read AWS secret paths or instantiate SES",()=>{const provider=createEmailProvider(parseEmailConfig({NODE_ENV:"production",AWS_ACCESS_KEY_ID_FILE:"/does/not/exist",AWS_SECRET_ACCESS_KEY_FILE:"/does/not/exist"}));expect(provider).toBeInstanceOf(DisabledEmailProvider);});
  it("test stores messages and exposes OTP only internally",async()=>{const provider=new TestEmailProvider("test");await provider.send(message);expect(provider.lastOtp()).toBe("123456");});
  it("test cannot be constructed in production",()=>expect(()=>new TestEmailProvider("production")).toThrow(/only allowed/));
  it("does not log OTP content",async()=>{const log=vi.spyOn(console,"log");const error=vi.spyOn(console,"error");await new EmailService(new TestEmailProvider("test")).sendTemplate({tenant:tenants[0],template:"auth-otp",recipient:"person@example.test",variables:{code:"654321"}});expect(log).not.toHaveBeenCalled();expect(error).not.toHaveBeenCalled();log.mockRestore();error.mockRestore();});
});
