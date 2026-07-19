import {PlayIcon} from "@/components/icons";
import type {CreatorMetadata} from "./player-types";
import {CreatorAvatar} from "./PlayerPoster";

function time(seconds:number){return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,"0")}`}
export function PlayerPausedCover({creator,currentTime,posterUrl,onResume}:{creator:CreatorMetadata;currentTime:number;posterUrl?:string;onResume:()=>void}){return <button type="button" className="smart-player-paused-cover" onClick={onResume} aria-label={`Continuar el mensaje de ${creator.displayName}`} style={posterUrl?{backgroundImage:`linear-gradient(180deg,transparent,color-mix(in srgb,var(--primary) 88%,transparent)),url(${posterUrl})`}:undefined}><span className="paused-cover-copy"><CreatorAvatar creator={creator}/><strong>Continuar el mensaje de {creator.displayName}</strong><small>{time(currentTime)}</small></span><span className="paused-cover-play" aria-hidden="true"><PlayIcon/></span></button>}
