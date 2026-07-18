import { describe,expect,it } from "vitest";
import { parseEmailConfig } from "./config";

describe("email configuration",()=>{
  it("defaults to disabled without AWS",()=>expect(parseEmailConfig({NODE_ENV:"production"})).toMatchObject({EMAIL_ENABLED:false,EMAIL_PROVIDER:"disabled",AUTH_EMAIL_OTP_ENABLED:false}));
  it("requires a region for SES",()=>expect(()=>parseEmailConfig({NODE_ENV:"production",EMAIL_ENABLED:"true",EMAIL_PROVIDER:"ses",AWS_ACCESS_KEY_ID_FILE:"/secret/id",AWS_SECRET_ACCESS_KEY_FILE:"/secret/key",SES_FROM_EMAIL:"from@example.test"})).toThrow(/AWS_REGION/));
  it("requires credential secret paths for SES",()=>expect(()=>parseEmailConfig({NODE_ENV:"production",EMAIL_ENABLED:"true",EMAIL_PROVIDER:"ses",AWS_REGION:"us-east-1",SES_FROM_EMAIL:"from@example.test"})).toThrow(/AWS_ACCESS_KEY_ID_FILE/));
  it("accepts test only in NODE_ENV=test",()=>{expect(parseEmailConfig({NODE_ENV:"test",EMAIL_ENABLED:"true",EMAIL_PROVIDER:"test",AUTH_EMAIL_OTP_ENABLED:"true"}).EMAIL_PROVIDER).toBe("test");expect(()=>parseEmailConfig({NODE_ENV:"production",EMAIL_ENABLED:"true",EMAIL_PROVIDER:"test"})).toThrow(/only allowed/);});
});
