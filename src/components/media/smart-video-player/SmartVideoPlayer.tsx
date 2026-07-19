"use client";
import {useCallback,useEffect,useReducer,useRef,useState} from "react";
import {normalizeYouTubeMediaId} from "@/features/content/video";
import {PlayerControls} from "./PlayerControls";
import {PlayerPausedCover} from "./PlayerPausedCover";
import {PlayerPoster} from "./PlayerPoster";
import type {PlayerController,PlayerEvent,PlayerSnapshot,SmartVideoPlayerProps} from "./player-types";
import {usePlayerProgress} from "./use-player-progress";
import {YouTubePlayerAdapter} from "./YouTubePlayerAdapter";

const initialSnapshot:PlayerSnapshot={currentTime:0,duration:0,playing:false,muted:false,volume:1,rate:1,ready:false};
export type PlayerView={phase:"poster"|"active"|"paused";pausedAt:number;mount:number};
export type PlayerViewAction={type:"start"}|{type:"pause";seconds:number;behavior:"provider_ui"|"branded_cover"}|{type:"resume"};
export function playerViewReducer(state:PlayerView,action:PlayerViewAction):PlayerView{if(action.type==="start")return {...state,phase:"active"};if(action.type==="pause")return action.behavior==="branded_cover"?{...state,phase:"paused",pausedAt:action.seconds}:state;return {...state,phase:"active",mount:state.mount+1}}

export function SmartVideoPlayer({asset,creator,context,resumePlayback=false,onProgress,onEnded}:SmartVideoPlayerProps){
  const container=useRef<HTMLDivElement>(null),controller=useRef<PlayerController|null>(null);
  const [fallback,setFallback]=useState(false),[snapshot,setSnapshot]=useState(initialSnapshot),[view,dispatch]=useReducer(playerViewReducer,{phase:"poster",pausedAt:0,mount:0});
  let id="";try{id=asset.provider==="youtube"?normalizeYouTubeMediaId(asset.providerMediaId??""):""}catch{}
  const behavior=asset.pausedBehavior??"provider_ui",storageKey=`experience-player:${context}:${asset.key}`;
  const {resumeAt,save,clear}=usePlayerProgress(storageKey,resumePlayback);
  const ratio=asset.aspectRatio.type==="custom"?`${asset.aspectRatio.width} / ${asset.aspectRatio.height}`:asset.aspectRatio.type.replace(":"," / ");
  const onController=useCallback((value:PlayerController)=>{controller.current=value},[]),onFailure=useCallback(()=>setFallback(true),[]);
  const onEvent=useCallback((event:PlayerEvent,next:Partial<PlayerSnapshot>={})=>{setSnapshot(old=>({...old,...next}));if(event==="play")window.dispatchEvent(new CustomEvent("smart-video-play",{detail:asset.key}));if(event==="progress"&&typeof next.currentTime==="number"){save(next.currentTime);onProgress?.(next.currentTime)}if(event==="pause"&&behavior==="branded_cover"){const seconds=next.currentTime??0;save(seconds);dispatch({type:"pause",seconds,behavior})}if(event==="completed"){clear();onEnded?.()}},[asset.key,behavior,clear,onEnded,onProgress,save]);
  useEffect(()=>{const pauseOther=(event:Event)=>{if((event as CustomEvent<string>).detail!==asset.key)controller.current?.pause()};window.addEventListener("smart-video-play",pauseOther);return()=>window.removeEventListener("smart-video-play",pauseOther)},[asset.key]);
  const toggleFullscreen=()=>{if(container.current?.requestFullscreen)void container.current.requestFullscreen()},iframeSrc=`https://www.youtube-nocookie.com/embed/${id}?controls=1&playsinline=1&rel=0`,posterUrl=id?`https://i.ytimg.com/vi/${id}/hqdefault.jpg`:undefined;
  return <section ref={container} className="smart-video-player" style={{aspectRatio:ratio}} data-provider={asset.provider} data-loaded={view.phase!=="poster"}>
    {view.phase==="poster"&&<PlayerPoster creator={creator} title={asset.title} onPlay={()=>dispatch({type:"start"})}/>}
    {view.phase==="paused"&&<PlayerPausedCover creator={creator} currentTime={view.pausedAt} posterUrl={posterUrl} onResume={()=>dispatch({type:"resume"})}/>}
    {view.phase==="active"&&!id&&<div className="smart-player-error" role="alert">Este video no está disponible por el momento.</div>}
    {view.phase==="active"&&id&&!fallback&&<YouTubePlayerAdapter key={view.mount} videoId={id} title={asset.title} resumeAt={view.pausedAt||resumeAt} onEvent={onEvent} onController={onController} onFailure={onFailure}/>}
    {view.phase==="active"&&id&&fallback&&<iframe title={asset.title} src={iframeSrc} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>}
    {view.phase==="active"&&id&&!fallback&&<PlayerControls state={snapshot} controller={{play:()=>controller.current?.play(),pause:()=>controller.current?.pause(),seek:n=>controller.current?.seek(n),setMuted:value=>{controller.current?.setMuted(value);setSnapshot(old=>({...old,muted:value}))},setVolume:value=>{controller.current?.setVolume(value);setSnapshot(old=>({...old,volume:value,muted:value===0}))},setRate:value=>{controller.current?.setRate(value);setSnapshot(old=>({...old,rate:value}))}}} onFullscreen={toggleFullscreen}/>}
    {view.phase==="active"&&!snapshot.ready&&!fallback&&id&&<span className="smart-player-loading" role="status">Preparando el video…</span>}
  </section>
}
