import { describe, it, expect } from 'vitest';
import {
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
  listProductsQuerySchema,
} from '@/api/v1/products/products.schema';
import type { z } from 'zod';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const objectId = '0123456789abcdef01234567';                // 24‑char stub
const url1 = 'https://cdn.example.com/img1.png';

/**
 * Wraps schema.parse() so we can assert it throws.
 */
function shouldFail<T extends z.ZodTypeAny>(schema: T, payload: unknown) {
  expect(() => schema.parse(payload)).toThrow();
}

/* ------------------------------------------------------------------ */
/* createProductSchema                                                 */
/* ------------------------------------------------------------------ */

describe('createProductSchema', () => {
  const base = {
    name: 'Keyboard',
    description: 'Mechanical keyboard',
    price: 99.99,
    sku: 'KEY001',
    category_id: objectId,
  };

  it('accepts minimal valid payload', () => {
    const parsed = createProductSchema.parse(base);
    expect(parsed.stock).toBe(0);             // default applied
  });

  it('accepts full valid payload', () => {
    const parsed = createProductSchema.parse({
      ...base,
      stock: 12,
      images: [url1],
      brand: 'Logi',
      weight: 800,
      dimensions: { width: 30, height: 2, depth: 14 },
    });
    expect(parsed.images?.length).toBe(1);
  });

  /* ── required string fields ────────────────────────────────────── */
  it.each(['name', 'description', 'sku'] as const)(
    'fails when %s is missing or empty',
    (field) => {
      shouldFail(createProductSchema, { ...base, [field]: '' });
      const copy = { ...base };
      delete copy[field];
      shouldFail(createProductSchema, copy);
    },
  );

  /* ── price ─────────────────────────────────────────────────────── */
  it('fails on non‑positive price', () => {
    shouldFail(createProductSchema, { ...base, price: 0 });
    shouldFail(createProductSchema, { ...base, price: -10 });
  });

  /* ── stock ─────────────────────────────────────────────────────── */
  it('fails on negative or non‑int stock', () => {
    shouldFail(createProductSchema, { ...base, stock: -1 });
    shouldFail(createProductSchema, { ...base, stock: 2.5 });
  });

  /* ── category_id ───────────────────────────────────────────────── */
  it('fails with non‑24‑char category_id', () => {
    shouldFail(createProductSchema, { ...base, category_id: 'abc' });
    shouldFail(createProductSchema, {
      ...base,
      category_id: 'f'.repeat(25),
    });
  });

  /* ── images ────────────────────────────────────────────────────── */
  it('fails if images contain non‑URL', () => {
    shouldFail(createProductSchema, { ...base, images: ['not‑url'] });
  });

  /* ── weight / dimensions typing ────────────────────────────────── */
  it('fails if weight is not number', () => {
    shouldFail(createProductSchema, { ...base, weight: 'heavy' });
  });

  it('fails if dimensions have non‑number values', () => {
    shouldFail(createProductSchema, {
      ...base,
      dimensions: { width: 'wide' },
    });
  });

  /* ── strictness (unknown keys) ─────────────────────────────────── */
  it('rejects unknown keys (strict())', () => {
    shouldFail(createProductSchema, { ...base, foo: 'bar' });
  });
});

/* ------------------------------------------------------------------ */
/* updateProductSchema (partial but strict)                           */
/* ------------------------------------------------------------------ */

describe('updateProductSchema', () => {
  it('accepts empty object (no fields to update)', () => {
    expect(updateProductSchema.parse({})).toEqual({});
  });

  it('accepts subset of valid fields', () => {
    const r = updateProductSchema.parse({ price: 120 });
    expect(r.price).toBe(120);
  });

  it('fails if provided field is invalid', () => {
    shouldFail(updateProductSchema, { price: -5 });
  });

  it('rejects unknown keys', () => {
    shouldFail(updateProductSchema, { foo: 'bar' });
  });
});

/* ------------------------------------------------------------------ */
/* productParamsSchema                                                */
/* ------------------------------------------------------------------ */

describe('productParamsSchema', () => {
  it('accepts 24‑character id', () => {
    expect(productParamsSchema.parse({ id: objectId }).id).toBe(objectId);
  });
  it.each(['short', 'x'.repeat(25)])('fails with invalid id length', (id) => {
    shouldFail(productParamsSchema, { id });
  });
});

/* ------------------------------------------------------------------ */
/* listProductsQuerySchema                                            */
/* ------------------------------------------------------------------ */

describe('listProductsQuerySchema', () => {
  it('casts numeric strings (page, limit, prices)', () => {
    const parsed = listProductsQuerySchema.parse({
      page: '2',
      limit: '5',
      priceMin: '10',
      priceMax: '50',
    });
    expect(parsed.page).toBe(2);
    expect(parsed.limit).toBe(5);
    expect(parsed.priceMin).toBe(10);
    expect(parsed.priceMax).toBe(50);
  });

  it('fails if page or limit is zero / negative', () => {
    shouldFail(listProductsQuerySchema, { page: 0 });
    shouldFail(listProductsQuerySchema, { limit: -1 });
  });

  it('fails if category_id length is not 24', () => {
    shouldFail(listProductsQuerySchema, { category_id: 'bad' });
  });

  it('fails if sortOrder not asc|desc', () => {
    shouldFail(listProductsQuerySchema, { sortOrder: 'up' });
  });
});

