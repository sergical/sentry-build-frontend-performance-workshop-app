import { useAuth } from '../context/AuthContext';

export default function PromoBanner() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 text-center font-semibold shadow-md">
      🎉 New Customer? Get 10% off your first order! Use code:{' '}
      <span className="font-bold">WELCOME10</span>
    </div>
  );
}
