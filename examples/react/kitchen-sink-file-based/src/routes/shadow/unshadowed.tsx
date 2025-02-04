import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shadow/unshadowed')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Route is nested underneath an externally hosted shadow route.</div>
  )
}
