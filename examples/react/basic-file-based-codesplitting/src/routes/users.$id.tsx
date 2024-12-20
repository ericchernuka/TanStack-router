import { createShadowFileRoute } from '@tanstack/react-router'

export const Route = createShadowFileRoute('/users/$id')({
  validateSearch: (_search: Record<string, string>): { magic?: boolean } => ({
    magic: true,
  }),
})
