import { useAuth } from '../context/AuthContext';

export default function PromoBanner() {
  const { isAuthenticated, isLoading } = useAuth();

  // ✅ Always render container to reserve space
  return (
    <div
      className="banner-container"
      style={{ minHeight: isAuthenticated ? '0px' : '48px' }}
    >
      {!isLoading && !isAuthenticated && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 text-center font-semibold shadow-md">
          🎉 New Customer? Get 10% off your first order! Use code: WELCOME10
        </div>
      )}
    </div>
  );
}
