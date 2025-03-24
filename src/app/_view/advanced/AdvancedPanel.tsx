import { tab } from "@/app/module/tab/tab-primitives";
import { TabsWithContent } from "@/app/module/tab/Tabs";
import type { SiteMetadata } from "@/app/page";
import { MetaCard } from "../MetaInfo";

export function AdvancedPanel(props: {
  metadata: SiteMetadata
}) {
  return (
    <TabsWithContent
      className="self-start mb-8"
      id={"advanced"}
      tabs={[
        tab("Raw",
          <MetaCard>
            {/* <div className="pt-4">raw HTML</div> */}
            <pre key="r" className="card-content fadeBlurIn-100 overflow-auto text-xs text-foreground-body">
              {`Only <head> is shown: \n\n`}{props.metadata.html?.split('<body')[0].replaceAll('/><', '/>\n<').replaceAll(/<style[^>]*>[\s\S]*?<\/style>/g, '<style>...</style>')}
            </pre>
          </MetaCard>
        ),
        tab("Sitemap", 
          <MetaCard>
            Coming Soon
          </MetaCard>
        ),
        tab("JSON-LD", 
          <MetaCard>
            Coming Soon
          </MetaCard>
        )
      ]}
    >
    </TabsWithContent>
  )
}