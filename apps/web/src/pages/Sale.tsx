import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { productService } from '../services/api';
import { SaleProduct } from '../types';

function Sale() {
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSaleProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getSaleProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load sale products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  const calculateSavings = (original: string, sale: string) => {
    const originalPrice = parseFloat(original);
    const salePrice = parseFloat(sale);
    const savings = originalPrice - salePrice;
    const percentage = ((savings / originalPrice) * 100).toFixed(0);
    return { savings: savings.toFixed(2), percentage };
  };

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchSaleProducts}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-red-500 hover:text-black"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto py-16 px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Amazing Deals on Developer Tools
          </h2>
          <p className="text-xl text-gray-600">
            Don't miss out on these incredible savings
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-4">No Sale Items Available</h2>
            <p className="text-gray-600">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-testid="sale-product-grid"
          >
            {products.map((product) => {
              const { savings, percentage } = calculateSavings(
                product.originalPrice,
                product.salePrice
              );
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl border-2 border-red-500">
                    {product.featured && (
                      <div className="bg-red-500 text-white text-center py-1 font-bold text-sm">
                        FEATURED DEAL
                      </div>
                    )}
                    <div className="relative">
                      <img
                        src={
                          product.image ||
                          'https://via.placeholder.com/300x200?text=Product'
                        }
                        alt={product.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full font-bold text-lg">
                        -{percentage}%
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-red-500 transition-colors">
                        {product.name}
                      </h3>
                      {product.saleCategory && (
                        <div className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs mb-3">
                          {product.saleCategory}
                        </div>
                      )}
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 line-through text-sm">
                            ${parseFloat(product.originalPrice).toFixed(2)}
                          </p>
                          <p className="text-3xl font-bold text-red-500">
                            ${parseFloat(product.salePrice).toFixed(2)}
                          </p>
                          <p className="text-green-600 font-semibold text-sm">
                            Save ${savings}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default Sale;
