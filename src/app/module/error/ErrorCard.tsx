import type { ComponentProps, SVGProps } from "react"
import { AppError, type ErrorInfo } from "./error-primitives"
import { cn } from "lazy-cn"

const ErrorInfoMessages = {
  input: {
    logo: <></>,
    tips: "Please check the input and try again.",
  },
  fetch: {
    logo: <></>,
    tips: "Ensure you have an active internet connection and the server is reachable.",
  },
  server: {
    logo: <></>,
    tips: `The server returned an error. Check the API logs for more details.

    - The server may be misconfigured or throwing an internal error.
    - Verify the request parameters and headers.`,
  },
  parse: {
    logo: <></>,
    tips: `The server response could not be parsed. Please check the server response or try another URL that returns HTML.`,
  },
  other: {
    logo: <></>,
    tips: "An unknown error occurred. Check the console and network logs for details.",
  }
}



export default function ErrorCard(
  props: { error: unknown }
) {
  let error: {
    summary: string,
    type: keyof typeof ErrorInfoMessages,
    detail?: string,
    context: string[]
  } = {
    summary: "An unknown error occurred.",
    type: "other",
    context: [JSON.stringify(props.error)],
  }

  if (props.error instanceof AppError) {
    error = {
      summary: props.error.summary,
      type: props.error.type,
      detail: props.error.detail,
      context: props.error.context
    }
  }

  return (
    <div className="card fadeIn-0">
      <div className="flex flex-col gap-2 items-start">
        <div className="shrink-0 text-red-400 p-2 rounded-md bg-[light-dark(var(--color-red-100),--alpha(var(--color-red-500)/0.2))]">
          <LucideTriangleAlert className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-lg leading-none!">{error.summary}</div>
          <div className="">{ErrorInfoMessages[error.type].tips}</div>
        </div>
      </div>
      {error.detail && (
        <ContextBox>{error.detail}</ContextBox>
      )}
      {!!error.context.length && (error.context.map((context, index) => (
        <ContextBox key={index} className="text-sm">{context}</ContextBox>
      )))}
      {props.error instanceof AppError && props.error.error instanceof Error && (
        <ContextBox className="text-sm">{props.error.error.stack}</ContextBox>
      )}
    </div>
  )
}

function ContextBox({ className, ...props }: ComponentProps<"div">) {
  return (<div className={cn("font-mono p-1 px-2 mt-4 bg-background-tooltip border border-border rounded-md whitespace-pre overflow-auto", className)} {...props} />)
}


function LucideTriangleAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01"></path></svg>
  )
}