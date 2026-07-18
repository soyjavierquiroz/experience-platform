export type SosTrafficLight="green"|"yellow"|"red"|"";
export interface SosExperienceState {
  executionId?:string;step:number;startedAt:string;completedAt?:string;pauseEndsAt:string;
  pauseReason:string;initialIntensity:number;emotions:string[];expectedOutcome:string;
  realFact:string;anxietyStory:string;speakingPart:string;safeAction:string;
  unsentMessage:string;expectedResponse:string;messageSaved:boolean;selectedAnchor:string;
  finalIntensity:number;trafficLightResult:SosTrafficLight;status:"in_progress"|"completed";
}
export const createSosState=():SosExperienceState=>({step:0,startedAt:new Date().toISOString(),pauseEndsAt:new Date(Date.now()+600_000).toISOString(),pauseReason:"",initialIntensity:5,emotions:[],expectedOutcome:"",realFact:"",anxietyStory:"",speakingPart:"",safeAction:"",unsentMessage:"",expectedResponse:"",messageSaved:false,selectedAnchor:"",finalIntensity:5,trafficLightResult:"",status:"in_progress"});
