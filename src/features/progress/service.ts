import { and, count, eq } from "drizzle-orm";
import type { AppDatabase } from "@/db/client";
import { dayProgress, enrollments, programDays, programs, reflectionResponses, tenantMemberships } from "@/db/schema";
import { z } from "zod";
import { contentBlockSchema } from "@/features/content/schema";

export const reflectionInputSchema=z.string().trim().min(10,"Escribe al menos 10 caracteres.").max(2000,"Tu reflexión puede tener hasta 2000 caracteres.");
export const reflectionPromptKey="day-1-trigger";
export function calculateProgress(completed:number,total:number){const safeTotal=Math.max(1,total);const safeCompleted=Math.min(Math.max(0,completed),safeTotal);return {completed:safeCompleted,total:safeTotal,percent:Math.round(safeCompleted/safeTotal*100)};}

export async function ensureBetaEnrollment(db:AppDatabase, tenantId:string, userId:string){
  return db.transaction(async(tx)=>{
    await tx.insert(tenantMemberships).values({tenantId,userId,role:"member"}).onConflictDoNothing({target:[tenantMemberships.tenantId,tenantMemberships.userId]});
    const program=(await tx.select().from(programs).where(and(eq(programs.tenantId,tenantId),eq(programs.slug,"reto-7-dias"))).limit(1))[0];
    if(!program)throw new Error("Active beta program not found");
    const inserted=await tx.insert(enrollments).values({tenantId,programId:program.id,userId}).onConflictDoNothing({target:[enrollments.programId,enrollments.userId]}).returning();
    return inserted[0] ?? (await tx.select().from(enrollments).where(and(eq(enrollments.tenantId,tenantId),eq(enrollments.programId,program.id),eq(enrollments.userId,userId))).limit(1))[0];
  });
}

async function context(db:AppDatabase,tenantId:string,userId:string,dayNumber=1){
  const enrollment=(await db.select().from(enrollments).innerJoin(programs,and(eq(enrollments.programId,programs.id),eq(programs.tenantId,tenantId))).where(and(eq(enrollments.tenantId,tenantId),eq(enrollments.userId,userId),eq(enrollments.status,"active"))).limit(1))[0]?.enrollments;
  if(!enrollment)throw new Error("Enrollment not found");
  const day=(await db.select().from(programDays).where(and(eq(programDays.programId,enrollment.programId),eq(programDays.dayNumber,dayNumber))).limit(1))[0];
  if(!day)throw new Error("Program day not found"); return {enrollment,day};
}

export async function getDayOne(db:AppDatabase,tenantId:string,userId:string){const {enrollment,day}=await context(db,tenantId,userId);const parsed=z.array(contentBlockSchema).parse(day.contentBlocks);const reflection=(await db.select().from(reflectionResponses).where(and(eq(reflectionResponses.tenantId,tenantId),eq(reflectionResponses.userId,userId),eq(reflectionResponses.enrollmentId,enrollment.id),eq(reflectionResponses.programDayId,day.id),eq(reflectionResponses.promptKey,reflectionPromptKey))).limit(1))[0];const progress=(await db.select().from(dayProgress).where(and(eq(dayProgress.tenantId,tenantId),eq(dayProgress.enrollmentId,enrollment.id),eq(dayProgress.programDayId,day.id))).limit(1))[0];return {day,blocks:parsed,response:reflection?.responseText??"",status:progress?.status??"not_started"};}

export async function saveReflection(db:AppDatabase,tenantId:string,userId:string,text:string){const responseText=reflectionInputSchema.parse(text);const {enrollment,day}=await context(db,tenantId,userId);return db.transaction(async(tx)=>{await tx.insert(reflectionResponses).values({tenantId,userId,enrollmentId:enrollment.id,programDayId:day.id,promptKey:reflectionPromptKey,responseText}).onConflictDoUpdate({target:[reflectionResponses.enrollmentId,reflectionResponses.programDayId,reflectionResponses.promptKey],set:{responseText,updatedAt:new Date()}});await tx.insert(dayProgress).values({tenantId,enrollmentId:enrollment.id,programDayId:day.id,status:"in_progress",startedAt:new Date()}).onConflictDoUpdate({target:[dayProgress.enrollmentId,dayProgress.programDayId],set:{status:"in_progress",startedAt:new Date(),updatedAt:new Date()},setWhere:eq(dayProgress.status,"not_started")});});}

export async function completeDayOne(db:AppDatabase,tenantId:string,userId:string,text:string){const responseText=reflectionInputSchema.parse(text);const {enrollment,day}=await context(db,tenantId,userId);return db.transaction(async(tx)=>{await tx.insert(reflectionResponses).values({tenantId,userId,enrollmentId:enrollment.id,programDayId:day.id,promptKey:reflectionPromptKey,responseText}).onConflictDoUpdate({target:[reflectionResponses.enrollmentId,reflectionResponses.programDayId,reflectionResponses.promptKey],set:{responseText,updatedAt:new Date()}});await tx.insert(dayProgress).values({tenantId,enrollmentId:enrollment.id,programDayId:day.id,status:"completed",startedAt:new Date(),completedAt:new Date()}).onConflictDoUpdate({target:[dayProgress.enrollmentId,dayProgress.programDayId],set:{status:"completed",completedAt:new Date(),updatedAt:new Date()}});});}

export async function getProgressSummary(db:AppDatabase,tenantId:string,userId:string){const enrollment=(await db.select().from(enrollments).where(and(eq(enrollments.tenantId,tenantId),eq(enrollments.userId,userId))).limit(1))[0];if(!enrollment)return {...calculateProgress(0,7),startedAt:null};const result=await db.select({value:count()}).from(dayProgress).where(and(eq(dayProgress.tenantId,tenantId),eq(dayProgress.enrollmentId,enrollment.id),eq(dayProgress.status,"completed")));return {...calculateProgress(Number(result[0]?.value??0),7),startedAt:enrollment.startedAt};}
