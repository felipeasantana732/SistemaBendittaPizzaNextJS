import { getUserOrRedirect } from '@/lib/actions/authUtils'

export default async function RelatoriosHomePage() {
  const user = await getUserOrRedirect();

    return (
    <>
    <p>Hello {user.email}</p>
    
    </>
  )
  }