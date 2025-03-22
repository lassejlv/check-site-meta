"use client"

import { px } from "@/app/lib/unit";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { TabList } from "./TabRoot";
import { useAppNavigation } from "@/app/lib/searchParams";

export function TabsWithContent
  (
    { id, tabs, children, className, ...props }: {
      id: string,
      tabs: { label: ReactNode, content?: ReactNode }[],
      children?: { label: ReactNode, content?: ReactNode }[],
      className?: string,
    } & ComponentProps<'div'>
  ) {
  const navigation = useAppNavigation()
  const [tabNum, setTab] = useState<number>(() => parseInt(navigation.get(id) ?? '0') || 0)
  const { saveContentRect } = useContentHeighTransition(id, tabNum)

  const tab = tabs[tabNum]
  const currentContent = tab.content

  return (
    <>
      <TabList
        id={id}
        className={className}
        tabNum={tabNum}
        onTabChange={(_, index) => {
          saveContentRect()
          setTab(index)
          navigation.softNavigate(id, index.toString())
        }}
        tabs={tabs}
        {...props}
      />
      {currentContent}
    </>
  )
}


// Use ID because virtual dom can't update sibling nodes accurately.
function useContentHeighTransition(
  id: string,
  tabNum: number
) {
  const contentRect = useRef({ height: null as number | null })

  useEffect(() => {
    const tabContainer = document.getElementById(id)
    if (!tabContainer) return
    if (contentRect.current.height === null) return
    const content = tabContainer.nextSibling as HTMLDivElement
    const prev = contentRect.current.height
    const contentFirstChild = content.firstChild as HTMLDivElement
    const curr = contentFirstChild?.scrollHeight
    const delta = curr - prev;

    contentFirstChild?.animate?.([{ marginBottom: px(-delta) }, {}], {
      duration: Math.abs(delta),
      easing: "ease-out",
      composite: "add",
    })
  }, [tabNum, id])

  function saveContentRect() {
    const tabContainer = document.getElementById(id)
    if (!tabContainer) return
    contentRect.current.height = (tabContainer.nextSibling as HTMLDivElement)?.getBoundingClientRect?.().height ?? null
  }

  return { saveContentRect }
}