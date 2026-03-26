export default function LoadingSpinner({ message = "Loading your schedule..." }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-primary">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="text-sm font-medium text-primary/80">{message}</p>
    </div>
  )
}
