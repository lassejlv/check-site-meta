"use client"

import { logCheckButton } from "@/app/lib/analytics"
import { cn } from "lazy-cn"
import Form from "next/form"
import { useEffect, useRef, type ComponentProps, type SVGProps } from "react"
import { recentSuggestionsLocal } from "../lib/localstorage"
import { useAppNavigation } from "../lib/searchParams"

export function InputForm(props: {
  query: Record<string, string | string[] | undefined>
}) {
  const navigation = useAppNavigation()
  const existingSp = [...navigation.sp.entries()].filter(([key]) => key !== 'url')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const query = Array.isArray(props.query.url) ? props.query.url[0] : props.query.url
    if (query) recentSuggestionsLocal.add(query)
  }, [props.query.url])
  
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  return <div className="flex gap-2 mb-8">
    <Form
      id="lookup_url"
      onSubmit={() => logCheckButton()}
      onKeyDown={(event) => {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) event.currentTarget.requestSubmit()
      }}
      action="/"
      className="grow"
      autoComplete="off"
    >
      <div
        onClick={() => {
          if (inputRef.current) inputRef.current.focus()
        }}
        className="card flex items-center h-11 p-0 rounded-full input-box-shadow input-outline-hover transition-[outline,box-shadow] overflow-hidden">
        <CiSearchMagnifyingGlass className="size-4 ml-4.5 mr-0" />
        <input
          required id="lookup_url_input"
          name="url"
          ref={inputRef}
          className="grow border-none rounded-full focus:outline-0 pl-3 px-1 h-8 ml-1 text-[0.85rem] font-normal placeholder:text-foreground-muted-3/80 placeholder:font-normal placeholder:italic placeholder:whitespace-pre"
          defaultValue={props.query['url'] as string}
          placeholder="localhost:3000              ↪ Enter"
        />
        <div
          className="self-end shrink-0 h-11 closed:w-17.5 w-0 min-w-0 pr-1.5 flex items-center justify-start transition-all overflow-hidden"
          data-closed={props.query.url ? "" : undefined}
        >
          <button type="submit" className="button p-2 rounded-full text-foreground-muted hover:bg-background-muted-2">
            <MaterialSymbolsRefresh className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => navigation.navigate('url', undefined)}
            className="button p-2 rounded-full text-foreground-muted hover:bg-background-muted-2"
          >
            <MaterialSymbolsCloseRounded className="w-4 h-4" />
          </button>
        </div>
      </div>
      {existingSp.map(([key, value]) => <input key={key} readOnly type="hidden" name={key} value={String(value)} />)}
    </Form>
  </div>
}

export function GoToUrlButton({ onClick, className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      onClick={() => {
        const input: HTMLInputElement = document.getElementById("lookup_url_input") as HTMLInputElement
        input.value = String(props.value)
        const form: HTMLFormElement = document.getElementById("lookup_url") as HTMLFormElement
        form.requestSubmit()
      }}
      {...props}
      className={cn("min-w-0 flex text-start break-all py-1.5 text-foreground-muted/80 hover:text-foreground font-medium max-w-full", className)}
    >
      {props.children}
    </button>
  )
}


function CiSearchMagnifyingGlass(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 15l6 6m-11-4a7 7 0 1 1 0-14a7 7 0 0 1 0 14"></path></svg>)
}
function MaterialSymbolsCloseRounded(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"></path></svg>)
}
function MaterialSymbolsRefresh(props: SVGProps<SVGSVGElement>) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20"></path></svg>)
}