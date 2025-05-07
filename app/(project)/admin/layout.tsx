import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';
import UserMenu from '@/app/components/userMenu/employedMenu'; // Ou o menu correto

import { AdminHeaderContainer, AdminMainContent } from '@/app/components/admin/AdminLayoutStyles';




export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }



  return (
    <div>
      <AdminHeaderContainer>
        <div>Admin Panel</div> 
        <UserMenu />
      </AdminHeaderContainer>
  
      <AdminMainContent>
        {children}
      </AdminMainContent>
    </div>
  );
}

