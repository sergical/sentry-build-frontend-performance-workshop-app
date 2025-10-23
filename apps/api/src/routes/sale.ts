import express, { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { db } from '../db';
import {
  products,
  salePrices,
  productMetadata,
  saleCategories,
} from '../db/schema';
import { eq } from 'drizzle-orm';
import { SaleProduct } from '../types';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  // Wrap the entire route handler in a Sentry span
  return await Sentry.startSpan(
    {
      name: 'GET /api/sale',
      op: 'http.server',
    },
    async (span) => {
      try {
        console.log('Fetching sale products with optimized query');

        // Track the database query with a child span
        const saleProductsRaw = await Sentry.startSpan(
          {
            name: 'db.query.sale_products_optimized',
            op: 'db.query',
          },
          async () => {
            // ✅ OPTIMIZED: Single query with JOINs - no N+1!
            return await db
              .select({
                // Product fields
                id: products.id,
                name: products.name,
                description: products.description,
                image: products.image,
                price: products.price,
                // Sale price from JOIN
                salePrice: salePrices.salePrice,
                // Metadata from JOIN
                discount: productMetadata.discount,
                saleCategory: productMetadata.saleCategory,
                featured: productMetadata.featured,
                priority: productMetadata.priority,
                // Category description from JOIN
                categoryDescription: saleCategories.description,
              })
              .from(products)
              .innerJoin(salePrices, eq(products.id, salePrices.productId))
              .leftJoin(
                productMetadata,
                eq(products.id, productMetadata.productId)
              )
              .leftJoin(
                saleCategories,
                eq(productMetadata.saleCategory, saleCategories.name)
              );
          }
        );

        // Transform to SaleProduct type
        const result: SaleProduct[] = saleProductsRaw.map((row) => ({
          ...row,
          category: 'Sale', // All products in this endpoint are sale items
          originalPrice: row.price,
          discount: row.discount || null,
          saleCategory: row.saleCategory || null,
          featured: row.featured || false,
          priority: row.priority || 0,
          categoryDescription: row.categoryDescription || null,
        }));

        // Sort by priority
        result.sort((a, b) => (b.priority || 0) - (a.priority || 0));

        // Add span attributes to track query results
        span.setAttributes({
          'products.count': result.length,
          'db.queries.total': 1, // Down from 50+!
        });

        console.log(
          `Successfully fetched ${result.length} sale products with 1 query`
        );

        res.json(result);
      } catch (err: any) {
        Sentry.captureException(err);
        console.error('Error fetching sale products:', err.message, err.stack);
        res.status(500).json({ error: 'Failed to fetch sale products' });
      }
    }
  );
});

router.get('/shop', async (_req: Request, res: Response) => {
  try {
    console.log('Fetching shop products');
    const allProducts = await db.select().from(products);
    console.log(`Successfully fetched ${allProducts.length} shop products`);
    res.json(allProducts);
  } catch (err: any) {
    Sentry.captureException(err);
    console.error('Error fetching shop products:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch shop products' });
  }
});

export default router;
