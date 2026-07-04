import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Thin wrapper over shadcn Dialog that preserves the original Modal API
// (`title`, `onClose`, `children`) so every page keeps working unchanged.
// Rendered conditionally by callers, so it's open whenever mounted.
export default function Modal({ title, description, onClose, children }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-h-[90vh] gap-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{title}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
