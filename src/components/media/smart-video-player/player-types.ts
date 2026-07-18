import type { ContentAsset } from "@/features/content/schema";

export type PlayerEvent="ready"|"play"|"pause"|"progress"|"completed"|"error";
export type CreatorMetadata={displayName:string;avatarAssetRef?:string;avatarUrl?:string;role?:string};
export type PlayerSnapshot={currentTime:number;duration:number;playing:boolean;muted:boolean;volume:number;rate:number;ready:boolean};
export type PlayerController={play:()=>void;pause:()=>void;seek:(seconds:number)=>void;setMuted:(muted:boolean)=>void;setVolume:(volume:number)=>void;setRate:(rate:number)=>void};
export type SmartVideoPlayerProps={asset:ContentAsset;creator:CreatorMetadata;context:"lesson"|"sos";resumePlayback?:boolean;onProgress?:(seconds:number)=>void;onEnded?:()=>void};
