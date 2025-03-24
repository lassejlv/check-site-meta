import type { ResoledMetadata } from "@/app/lib/get-metadata-field-data"
import { AppImage } from "@/app/module/image/Image"
import { Fragment } from "react"
import { MetadataRow } from "../MetadataRow"

export function OpengraphMetadata(
  props: { m: ResoledMetadata }
) {
  const d = props.m
  return (
    <>
      <MetadataRow data={d.og.title} />
      <MetadataRow data={d.og.description} />
      <MetadataRow data={d.og.image} />
      <MetadataRow data={d.og.url} />
      <MetadataRow data={d.og.type} />
      <MetadataRow data={d.og.siteName} />
      <MetadataRow data={d.og.locale} />
      <hr />
      <MetadataRow data={d.og.images}>
        <StructuredOpengraphMetadata d={d} type="images" />
      </MetadataRow>
      <MetadataRow data={d.og.articleAuthor}>
        {d.og.articleAuthor.values.length === 0 && <div className="meta-mute">-</div>}
        {d.og.articleAuthor.values.map((item, i) => {
          return <div key={i}>{item}</div>
        })}
      </MetadataRow>
      <MetadataRow data={d.og.articlePublishedTime} />
      <MetadataRow data={d.og.articleModifiedTime} />
      <MetadataRow data={d.og.articleExpirationTime} />
      <MetadataRow data={d.og.articleSection} />
      <MetadataRow data={d.og.articleTag}>
        {d.og.articleTag.values.length === 0 && <div className="meta-mute">-</div>}
        {d.og.articleTag.values.map((item, i) => {
          return <div key={i}>{item}</div>
        })}
      </MetadataRow>
    </>
  )
}

function StructuredOpengraphMetadata(
  props: { d: ResoledMetadata, type: "images" }
) {
  const d = props.d
  const type = props.type

  return (
    <div className="grid grid-cols-1 gap-2">
      {d.og[type].values.map((item, i) => {
        return (
          <div key={i} className="flex flex-col gap-2 items-start">
            {i !== 0 && <hr className="self-stretch my-3" />}
            {type === "images" && (
              <div className="image-frame w-auto shrink-0 self-start">
                <AppImage src={item.resolvedUrl} className="h-[2lh]" />
              </div>
            )}
            <div className="text-xs meta-info-field-value break-words grid grid-cols-[5rem_1fr] gap-y-1 w-full">
              {item.labels.map((label, i) => {
                return <Fragment key={i}>
                  <div className="text-foreground opacity-100">{label[0]}</div>
                  <div>{label[1] ?? <span className="meta-mute" >-</span>}</div>
                </Fragment>
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}