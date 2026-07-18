import { PlayIcon } from "@/components/icons";
import Image from "next/image";
import type { CreatorMetadata } from "./player-types";

export function CreatorAvatar({creator}:{creator:CreatorMetadata}){const initials=creator.displayName.split(/\s+/).map(word=>word[0]).join("").slice(0,2).toUpperCase();return <span className="creator-avatar">{creator.avatarUrl?<Image unoptimized src={creator.avatarUrl} width={52} height={52} alt={`${creator.displayName}, ${creator.role??"creador"}`}/>:<span aria-label={`Avatar de ${creator.displayName}`}>{initials}</span>}</span>}
export function PlayerPoster({creator,title,onPlay}:{creator:CreatorMetadata;title:string;onPlay:()=>void}){return <button type="button" className="smart-video-poster" onClick={onPlay} aria-label={`Reproducir ${title}`}><span className="poster-light" aria-hidden="true"/><span className="poster-play"><PlayIcon/></span><span className="poster-copy"><small>Un mensaje de {creator.displayName}</small><strong>{title}</strong><span>{creator.role}</span></span><CreatorAvatar creator={creator}/></button>}
