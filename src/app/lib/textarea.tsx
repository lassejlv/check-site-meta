import { useEffect, useRef, type Component, type ComponentProps } from "react";

export function TextArea(props: ComponentProps<'textarea'>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${ textarea.scrollHeight }px`; // Set to scroll height
  };

  useEffect(() => {
    adjustHeight(); // Adjust height on mount (for initial value)
  }, [props.value]);


  return <textarea {...props}
    onChange={(e) => {
      adjustHeight();
      props.onChange?.(e)
    }}
    ref={(ref) => {
      if (ref) {
        textareaRef.current = ref
        const outerRef = props.ref
        if (typeof outerRef === 'function') outerRef(ref)
        else if (outerRef) outerRef.current = ref
      }
    }} />;
}