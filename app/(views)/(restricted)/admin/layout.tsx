
import UserMenu from '@/components/admin/menuAdmin/employedMenu'; // Ou o menu correto
import { AdminHeaderContainer, AdminMainContent } from '@/components/admin/AdminLayoutStyles';
import { getUserOrRedirect } from '@/lib/actions/authUtils';




export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getUserOrRedirect();
  console.log("User loged: ", user);
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

