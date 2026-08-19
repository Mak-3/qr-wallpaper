import { ReactNode } from "react"

type PhoneFrameProps = {
  children: ReactNode
  className?: string
}

export default function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  return (
    <div
      className={`relative mx-auto aspect-[9/19.5] w-full max-w-[320px] rounded-[2.75rem] bg-neutral-950 p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-black">
        {children}
        <div className="pointer-events-none absolute top-2 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}
