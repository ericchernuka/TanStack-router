import ReactDOM from 'react-dom/client'
import {
  ErrorComponent,
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  createShadowRoute,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { NotFoundError, fetchPost, fetchPosts } from './posts'
import type { ErrorComponentProps } from '@tanstack/react-router'
import './styles.css'

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  },
})

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg border-b">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/posts"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Posts
        </Link>{' '}
        <Link
          // @ts-expect-error
          to="/this-route-does-not-exist"
          activeProps={{
            className: 'font-bold',
          }}
        >
          This Route Does Not Exist
        </Link>
        <Link to="/users">Users</Link>
        <Link
          to="/shadow-redirect"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Redirect to Users Shadow
        </Link>{' '}
      </div>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  )
}

export const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'posts',
  loader: () => fetchPosts(),
}).lazy(() => import('./posts.lazy').then((d) => d.Route))

const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '/',
  component: PostsIndexComponent,
})

function PostsIndexComponent() {
  return <div>Select a post.</div>
}

const postRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '$postId',
  errorComponent: PostErrorComponent,
  loader: ({ params }) => fetchPost(params.postId),
  component: PostComponent,
})

function PostErrorComponent({ error }: ErrorComponentProps) {
  if (error instanceof NotFoundError) {
    return <div>{error.message}</div>
  }

  return <ErrorComponent error={error} />
}

function PostComponent() {
  const post = postRoute.useLoaderData()

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold">{post.title}</h4>
      <hr className="opacity-20" />
      <div className="text-sm">{post.body}</div>
    </div>
  )
}

const shadowRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shadow-redirect',
  beforeLoad() {
    throw redirect({ to: '/users/$id', params: { id: '123' }, replace: true })
  },
})

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  beforeLoad: () => ({
    specialUserAttribute: 'foo' as const,
  }),
})

const usersIndexRoute = createRoute({
  getParentRoute: () => usersRoute,
  path: '/',
  component: UsersComponent,
})

function UsersComponent() {
  return (
    <div className="space-x-2">
      <Link to="/users/$id" params={{ id: '123 ' }}>
        Shadow User Detail
      </Link>

      <Link to="/users/$id/activities" params={{ id: '123' }}>
        Client Side Nested Shadow User Activities
      </Link>
    </div>
  )
}

const userDetailShadowRoute = createShadowRoute({
  getParentRoute: () => usersRoute,
  path: '$id',
})

const usersActivitiesRoute = createRoute({
  getParentRoute: () => userDetailShadowRoute,
  path: 'activities',
  component: UserActivitiesComponent,
})

function UserActivitiesComponent() {
  const { specialUserAttribute } = usersActivitiesRoute.useRouteContext()

  return <div>Hello {specialUserAttribute}!</div>
}

const routeTree = rootRoute.addChildren([
  postsRoute.addChildren([postRoute, postsIndexRoute]),
  shadowRedirectRoute,
  usersRoute.addChildren([
    usersIndexRoute,
    userDetailShadowRoute.addChildren([usersActivitiesRoute]),
  ]),
  indexRoute,
])

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  scrollRestoration: true,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(<RouterProvider router={router} />)
}
