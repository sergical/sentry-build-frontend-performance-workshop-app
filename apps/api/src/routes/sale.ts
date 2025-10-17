import express, { Request, Response } from 'express';
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
  try {
    console.log('Fetching sale products');

    const result = await db.transaction(async (tx) => {
      const allProducts = await tx.select().from(products);
      const allMetadata = await tx.select().from(productMetadata);
      const allCategories = await tx.select().from(saleCategories);

      const metadataMap = new Map(allMetadata.map((m) => [m.productId, m]));
      const categoryMap = new Map(allCategories.map((c) => [c.name, c]));

      const saleProducts: SaleProduct[] = [];

      console.log(`Checking sale prices for ${allProducts.length} products`);

      for (const product of allProducts) {
        const salePrice = await tx
          .select()
          .from(salePrices)
          .where(eq(salePrices.productId, product.id))
          .limit(1);

        if (salePrice.length > 0) {
          const metadata = metadataMap.get(product.id);
          const categoryInfo = metadata?.saleCategory
            ? categoryMap.get(metadata.saleCategory)
            : null;

          saleProducts.push({
            ...product,
            originalPrice: product.price,
            salePrice: salePrice[0].salePrice,
            discount: metadata?.discount || null,
            saleCategory: metadata?.saleCategory || null,
            featured: metadata?.featured || false,
            priority: metadata?.priority || 0,
            categoryDescription: categoryInfo?.description || null,
          });
        }
      }

      return saleProducts;
    });

    result.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    console.log(`Successfully fetched ${result.length} sale products`);

    res.json(result);
  } catch (err: any) {
    console.error('Error fetching sale products:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch sale products' });
  }
});

router.get('/shop', async (_req: Request, res: Response) => {
  try {
    console.log('Fetching shop products');

    const allProducts = await db.select().from(products);

    console.log(`Successfully fetched ${allProducts.length} shop products`);

    res.json(allProducts);
  } catch (err: any) {
    console.error('Error fetching shop products:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch shop products' });
  }
});

export default router;
