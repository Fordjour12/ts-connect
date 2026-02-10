import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/components/sign-up-form'

export const Route = createFileRoute('/auth/_layout/create')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <SignupForm />
  )
}
