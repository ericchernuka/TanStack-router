import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-x-2">
      <Link to="/users/$id" params={{ id: '123' }}>
        Shadow User Detail
      </Link>

      <Link to="/users/$id/activities" params={{ id: '123' }}>
        Client Side Nested Shadow User Activities
      </Link>
    </div>
  )
}
