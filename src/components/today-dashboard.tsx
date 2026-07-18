import Link from "next/link";
import { ArrowIcon,PauseIcon } from "./icons";

export function TodayHero({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){return <header className="today-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p><span className="hero-orb" aria-hidden="true"/></header>}

export function NextStepCard({label,title,description,href,action,duration}:{label:string;title:string;description:string;href?:string;action?:string;duration?:string|null}){return <section className="next-step-card"><div className="next-step-art" aria-hidden="true"><span/><span/></div><div className="next-step-content"><div className="next-step-meta"><span className="eyebrow">{label}</span>{duration&&<span>{duration}</span>}</div><h2>{title}</h2><p>{description}</p>{href&&action&&<Link className="next-step-cta" href={href}><span>{action}</span><ArrowIcon/></Link>}</div></section>}

export function CompactProgress({completed,total,percent,message}:{completed:number;total:number;percent:number;message:string}){return <section className="compact-progress" aria-label="Progreso del recorrido"><div className="progress-summary"><strong>{completed} de {total}</strong><span>{percent} %</span></div><div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={`${percent}% completado`}><span style={{"--progress":`${percent}%`} as React.CSSProperties}/></div><p>{message}</p></section>}

export function SosQuickAction({question,action,href}:{question:string;action:string;href:string}){return <Link href={href} className="sos-quick-action"><span className="sos-icon"><PauseIcon/></span><span><strong>{question}</strong><small>{action}</small></span><ArrowIcon className="sos-arrow"/></Link>}
