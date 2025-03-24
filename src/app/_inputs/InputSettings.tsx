import { cn } from "lazy-cn";
import type { ComponentProps } from "react";
import { FormButton, MaterialSymbolsCloseRounded } from "./InputForm";
import { TextArea } from "../lib/textarea";
import type { UserSettings } from "../page";

export function InputSettingModal(props: ComponentProps<"dialog">) {
  return (
    <dialog {...props} className={cn("flex flex-col gap-2 p-4 w-full m-0", props.className)}>
      <CloseButton />
      <div>
        <h2>Settings</h2>
        <div>Configure how check-site-meta behaves when fetching the data</div>
      </div>
      <div className="flex justify-end">
        <button type="button">Cancel</button>
        <button type="button">Save Changes</button>
      </div>
    </dialog>
  )
}

function CloseButton(props: ComponentProps<"button">) {
  return (
    <button {...props} className={cn("close-button", props.className)}>
      <span aria-hidden="true">✕</span>
    </button>
  )
}


export function InputSettings(props: {
  settings: UserSettings
  onSettingsClose: () => void
}) {
  return (
    <div className="card mt-4 relative flex flex-col gap-4">
      <FormButton className="absolute p-1 top-2 right-2" type="button" onClick={props.onSettingsClose}>
        <MaterialSymbolsCloseRounded className="w-5 h-5" />
      </FormButton>

      <header className="text-xs">
        <h2 className="font-semibold text-foreground-muted">Settings</h2>
        <div className="text-foreground-muted">Configure how check-site-meta behaves when fetching website metadata</div>
      </header>

      <label className="flex flex-col font-mono">
        <span className="text-xs text-foreground-muted">user agent <button>(reset)</button></span>

        <div className="relative flex flex-col mt-1">
          <TextArea className="border border-border rounded-md p-2 text-sm  focus:outline-border  font-normal tracking-tight overflow-hidden resize-none"
            defaultValue={props.settings.userAgent}
            onChange={(e) => {
              document.cookie = `userAgent=${ encodeURIComponent(e.target.value) }`
            }}
          />
        </div>
      </label>
      
      <div className="flex gap-2 justify-end">
          <button type="button" className="p-2 px-4 bg-foreground text-background rounded-md">Reset All</button>
      </div>
    </div>
  )
}
