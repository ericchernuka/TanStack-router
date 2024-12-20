import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$id/activities')({
  component: RouteComponent,
})

function RouteComponent() {
  const { specialUserAttribute } = Route.useRouteContext()

  return <div>Hello {specialUserAttribute}!</div>
}
