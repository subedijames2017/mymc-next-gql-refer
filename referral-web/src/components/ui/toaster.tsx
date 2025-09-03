import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={3500} swipeDirection="right">
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>

          {action}

          {/* Always-visible close button */}
          <ToastClose
            className="
              absolute right-2 top-2
              opacity-100
              text-foreground/70 hover:text-foreground
              focus:opacity-100
            "
          />
        </Toast>
      ))}

      {/* Top-right viewport */}
      <ToastViewport
        className="
          pointer-events-none fixed top-4 right-4
          z-[100] flex w-full max-w-sm flex-col gap-2 p-4
          sm:top-6 sm:right-6 sm:max-w-md
        "
      />
    </ToastProvider>
  )
}
