import type { ComponentProps } from "react";
import type { ResoledMetadata } from "../lib/get-metadata-field-data";
import { cn } from "lazy-cn";
import { AppImage } from "../module/image/Image";
import { appFetch } from "../lib/fetch";
import imageSize from "image-size";
import { MessageList, PreviewMenu, PreviewPanelContent, type PreviewMessages } from "./Preview";
import { validateHex } from "../lib/hex";
import { PreviewFrame, PreviewThemeSwitcher } from "./Preview.client";
import { MaterialSymbolsDarkModeOutline, MaterialSymbolsLightModeOutline } from "../theme-switch";

export async function PreviewDiscord(
  { metadata, className, ...props }: ComponentProps<"div"> & {
    metadata: ResoledMetadata
  }
) {
  const { messages, data, crashed } = await getDiscordPreview(metadata)

  const PreviewSection = (() => {
    if (!data) return null
    if (crashed) return null
    return <PreviewFrame themeId="t-discord" {...props} className={cn("bg-[var(--bg)] font-discord", className)}
      style={{}}
      themes={{
        default: {
          "--bg": "oklab(0.321044 -0.000249296 -0.00927344)",
          "--embed-bg": "oklab(0.296709 -0.000735492 -0.00772537)",
          "--embed-border": data.themeColor ?? "oklab(0.239468 0.000131123 -0.00589392)",
          "--embed-link": "oklab(0.705515 -0.0795695 -0.144235)",
          "--embed-text": "oklab(0.89908 -0.00192907 -0.0048306)",
          "--embed-site-name": "oklab(0.787067 -0.00258079 -0.0110391)",
          "--embed-author": "oklab(0.963876 -0.000228494 -0.00284719)",
        },
        light: {
          "--bg": "oklab(0.999994 0.0000455678 0.0000200868)",
          "--embed-bg": "oklab(0.963876 -0.000228494 -0.00284719)",
          "--embed-border": data.themeColor ?? "oklab(0.921147 -0.000889629 -0.00448376)",
          "--embed-link": "oklab(0.553338 -0.042478 -0.200934)",
          "--embed-text": "oklab(0.321044 -0.000249296 -0.00927344)",
          "--embed-site-name": "oklab(0.432341 0.00109924 -0.0133243)",
          "--embed-author": "oklab(0.122749 0.000796985 -0.00276326)",
        },
      }}
    >
      <div className={cn(
        "fadeIn-100",
        "bg-[var(--embed-bg)] border-l-[0.25rem] border-(--embed-border) rounded-[0.25rem] grid",
        "max-w-max"
      )}>
        <div className={cn(
          "pt-[.5rem] pr-[1rem] pb-[1rem] pl-[.75rem]  grid",
          "grid-cols-[auto_min-content]",
          "grid-rows-[auto]",
          "max-w-[27rem]"
        )}>
          {data.site && (
            <div className="fadeIn-0 mt-2 col-[1/1] text-(--embed-site-name) text-[.75rem] font-[400] leading-[1rem]">
              {data.site}
            </div>
          )}
          <div className="fadeIn-50 mt-2 col-[1/1] break-words min-w-0">
            <a className="text-(--embed-link) text-[1rem] font-[600] leading-[1.375rem] min-w-0 line-clamp-2">
              {data.title}
            </a>
          </div>
          <div className="fadeIn-100 mt-2 col-[1/1] text-(--embed-text) text-[0.875rem] font-[400] leading-[1.125rem] whitespace-pre-wrap break-words min-w-0">
            {data.description}
          </div>
          {data.image && data.type === "summary" && (
            <div className="fadeIn-150 row-[1/8] col-[2/2] ml-4 mt-2 max-w-20 max-h-20 justify-items-end h-full flex rounded-[.25rem]">
              <AppImage src={data.image} alt="" className="w-min h-min max-w-none max-h-[inherit] object-contain object-top rounded-[.25rem] overflow-hidden" />
            </div>
          )}
          {data.image && data.type === "summary_large_image" && (
            <div className="fadeIn-150 col-[1/1] mt-4 w-full flex object-contain rounded-[.25rem] overflow-hidden max-w-fit">
              <div className="">
                <AppImage src={data.image} alt="" className="max-w-none w-full max-h-[300px]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </PreviewFrame>

  })

  return (
    <PreviewPanelContent
      PreviewSection={
        <>
          <PreviewSection />
          <PreviewMenu>
            <PreviewThemeSwitcher
              themeId="t-discord"
              themes={[
                { key: "default", icon: <MaterialSymbolsDarkModeOutline /> },
                { key: "light", icon: <MaterialSymbolsLightModeOutline /> },
              ]}
            />
          </PreviewMenu>
        </>
      }
      PreviewInfoContent={
        <MessageList messages={messages} />
      }
    />
  )
}

async function getDiscordPreview(metadata: ResoledMetadata) {
  const m = metadata

  const messages: PreviewMessages = []
  let crashed = false

  const data = {
    site: m.og.siteName.value, // check if it fallbacks to twitter.site.value
    title: m.twitter.title.value ?? m.og.title.value ?? m.general.title.value,
    description: m.og.description.value ?? m.twitter.description.value ?? m.general.description.value,
    image: m.twitter.image.resolvedUrl ?? m.og.images.values.at(-1)?.resolvedUrl ?? m.og.image.resolvedUrl,
    type: m.twitter.card.value ?? "summary",
    themeColor: m.general.colorTheme.values.at(-1)?.value
  }

  if (!data.title) {
    return { messages: [["error", "Title Metadata is required to show a preview."]] as PreviewMessages }
  }

  // Kudos to @riskymh
  if (data.title.length > 67) {
    data.title = data.title.slice(0, 67) + "..."
    messages.push(["info", "Title was shortened to 67 characters."])
  }
  if ((data.description?.length ?? 0) > 347) {
    data.description = data.description?.slice(0, 347) + "..."
    messages.push(["info", "Description was shortened to 347 characters."])
  }
  if ((data.site?.length ?? 0) > 256) {
    data.site = data.site?.slice(0, 256) + "..."
    messages.push(["error", "Site name is too long. Embed will not show if site name is longer than 256 characters."])
  }

  try {
    if (!data.image) throw 0
    const res = await appFetch(data.image)
    const buffer = Buffer.from(await res.arrayBuffer()); // Convert once
    const { type } = imageSize(buffer)

    if (type === "png") {
      messages.push(["info", "If the image is animated (APNG), Only the first frame will be shown."])
    }
  } catch (error) { }

  if (data.themeColor) {
    const res = validateHex(data.themeColor)
    if (!res.valid) {
      messages.push(["error", `Invalid color theme value: ${ data.themeColor }`])
      data.themeColor = undefined
    }
    if (res.valid) {
      if (res.shortHex || (res.shortHex && res.withAlpha)) {
        messages.push(["warn", `Short Hex values (${ data.themeColor }) will be parsed incorrectly by Discord. Consider using full hex values.`])
        data.themeColor = '#' + data.themeColor?.split('#')[1].padStart(6, '0')
      }
      if (!res.shortHex && res.withAlpha) {
        messages.push(["error", `8 digit hex values (${ data.themeColor }) will cause the preview to not show up. Consider using 6 digit hex values.`])
        data.themeColor = undefined
        crashed = true
      }
      if (['#000', '#000000'].includes(data.themeColor ?? "")) {
        messages.push(["warn", `Black color theme values (${ data.themeColor }) will be parsed incorrectly by Discord. Consider using a different color.`])
        data.themeColor = undefined
      }
    }
  }

  return {
    messages,
    data,
    crashed
  }

}