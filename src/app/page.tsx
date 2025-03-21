import { Fragment, Suspense, type ComponentProps } from "react";
import { getRawMeta, fetchRoot } from "./lib/get-metadata";
import { parseUrlFromQuery } from "./lib/parse-url";
import type { SearchParamsContext } from "./lib/next-types";
import { getResolvedMeta } from "./lib/get-metadata-field-data";
import { MetaInfoPanel } from "./comp.meta-info";
import { LinkPreviewPanel } from "./comp.meta-preview";
import { cn } from "lazy-cn";
import { getVersion } from "./lib/version";
import { ThemeSwitcher } from "./theme-switch";
import { InputForm } from "./_inputs/InputForm";
import { RecentSuggestions } from "./_inputs/InputSuggestions";
import { changelog } from "../../changelog"

// Structure:
// 
//  query
//   ↓
//  url
//   ↓
//  root
//   ↓
//  metadata    
//   ↓
//  resolved metadata  ← descriptions
//   ↓             ↓
//  fields       previews
// 

export default async function Home(context: SearchParamsContext) {
  const query = await context.searchParams;

  const getMetadata = async () => {
    const url = parseUrlFromQuery(query.url)
    if (!url) return null
    const { root } = await fetchRoot(url.toString())
    const metadata = getRawMeta(root, url.toString())
    const resolvedMetadata = getResolvedMeta(metadata)
    return resolvedMetadata
  }

  const getHead = async () => {
    const url = parseUrlFromQuery(query.url)
    if (!url) return null
    const { html } = await fetchRoot(url.toString())
    return html
  }

  const searchId = Math.random()

  return (
    <>
      <main className="container-sm lg:container-2xl px-8 lg:px-12 xl:px-24 *:py-12 font-medium lg:grid lg:grid-cols-2 gap-x-8 font-sans">
        <div className="flex flex-col min-h-screen">
          <Header hidden={!!query.url} />
          <InputForm query={query} />
          <RecentSuggestions hidden={!!query.url} />
          <div className="flex flex-col gap-8">
            <Suspense key={searchId} fallback={<Loading />}>
              <MetaInfoPanel metadata={getMetadata()} head={getHead()} />
            </Suspense>
          </div>
        </div>
        <div className="flex flex-col items-center gap-8 pt-15! pb-40!">
          <Changelog hidden={!!query.url} />
          <Suspense key={searchId}>
            <LinkPreviewPanel metadata={getMetadata()} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Components -----------------------------


function Header(props: {
  hidden: boolean
}) {
  return <header className="grid grid-rows-[1fr] closed:grid-rows-[0fr] group overflow-hidden transition-[grid-template-rows] duration-700" data-closed={props.hidden ? "" : undefined}>
    <div className="min-h-0">
      <div className="mb-12 mt-20 text-center lg:text-start flex flex-col items-center lg:block g-closed:opacity-0 g-closed:translate-y-10 transition duration-700">
        <div className="text-6xl tracking-[-0.08em] font-mono header-fill font-bold">
          check-site-meta
        </div>
        <div className="text-foreground-muted max-w-100 mt-2 font-sans text-xl g-closed:opacity-0 g-closed:translate-y-10 transition duration-700">
          100% local site metadata checker
        </div>
      </div>
    </div>
  </header>
}

function Footer(
  props: ComponentProps<"footer">
) {
  return (
    <footer {...props} className={cn(" w-full col-span-2 pb-[100vh] pt-10 border-t border-border bg-background shadow-2xl", props.className)}>
      <div className="container-md lg:container-2xl px-8 lg:px-12 xl:px-24 text-foreground-body flex flex-wrap gap-y-8">
        <div className="flex flex-col grow font-mono">
          <div className="text-[1rem] font-semibold tracking-tight leading-none ">
            npx check-site-meta
          </div>
          <div className="text-xs">
            {getVersion()}
          </div>
          <div className="mt-10 flex flex-wrap gap-6">
            {[
              ['npm', 'https://www.npmjs.com/package/check-site-meta'],
              ['github', 'https://github.com/alfonsusac/check-site-meta'],
              ['twitter', 'https://x.com/alfonsusac/status/1899798175512412648'],
              ['discord', 'https://discord.gg/DCNgFtCm'],
            ].map(e => (
              <a key={e[0]} className="button transition underline" href={e[1]} target="_blank">{e[0]}</a>
            ))}
          </div>
          <div className="mt-4">
            Made by <a href="https://alfon.dev">alfonsusac</a> • ©{new Date().getFullYear()} alfonsusac. All rights reserved.
          </div>
        </div>
        <div className="shrink-0">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  )
}

function Loading() {
  return (
    <div>
      <div className="fadeIn-200">Loading...</div>
      <div className="fadeIn-2000">This takes longer than expected...</div>
    </div>
  )
}


// Components -----------------------------


function Changelog(props: {
  hidden?: boolean
}) {
  return (
    <div className="w-full grid grid-rows-[1fr] closed:grid-rows-[0fr] overflow-hidden group transition-[grid-template-rows] duration-700" data-closed={props.hidden ? "" : undefined}>
      <div className="min-h-0 closed:opacity-0 transition-all duration-300 delay-100" data-closed={props.hidden ? "" : undefined}>
        <div className="pt-20 pb-4 text-foreground-muted-3 font-medium">changelog</div>
        <div className="grid grid-cols-[6rem_1fr] gap-y-4 text-foreground-muted text-base">
          {Object.entries(changelog).map(([version, changes]) => (
            <Fragment key={version}>
              <div className="text-foreground-muted-3">{version}</div>
              <ul className="">
                {changes.map((change, i) => (
                  <li key={i} className="text-foreground-muted-2/80 py-0.5 list-['-___']">{change}</li>
                ))}
              </ul>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}






















// DEBUG

async function RawHTML(
  prop: { url: string | string[] | undefined }
) {
  const getHTML = async () => {
    const url = parseUrlFromQuery(prop.url)
    if (!url) return null
    const { html } = await fetchRoot(url.toString())
    return html
  }

  return (
    <Suspense>
      <div className="fadeIn-500">
        <pre className="whitespace-pre-wrap break-all">{await getHTML().catch(err => null)}</pre>
      </div>
    </Suspense>
  )
}


