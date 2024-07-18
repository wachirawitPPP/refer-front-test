import { useSession } from 'next-auth/react';

const useUserRole = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return { role: null, loading: true };
  }

  return { role: session?.user?.role || null, loading: false };
};

export default useUserRole;
