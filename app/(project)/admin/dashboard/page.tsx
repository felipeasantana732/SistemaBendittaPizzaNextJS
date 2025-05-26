import { getUserOrRedirect } from '@/app/utils/authUtils'

export default async function DashboardPage() {
  const user = await getUserOrRedirect();

    return (
    <>
    <p>Hello {user.email}</p>
    
    </>
  )
  }