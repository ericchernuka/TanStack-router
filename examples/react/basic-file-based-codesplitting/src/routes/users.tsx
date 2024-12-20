import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users')({
  beforeLoad: () => ({
    specialUserAttribute: 'foo' as const,
  }),
})
