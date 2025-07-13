import { describe, it, expect, beforeEach, vi } from "vitest"
import { ProductService } from "@/api/v1/products/products.service"
import { ProductModel } from "@/api/v1/products/products.model"
import mongoose from "mongoose"

describe("ProductService", () => {
  let productService: ProductService

  beforeEach(() => {
    productService = new ProductService()
    vi.restoreAllMocks()
  })

  const mockProduct = {
    _id: new mongoose.Types.ObjectId(),
    name: "Test Product",
    description: "Desc",
    sku: "SKU123",
    price: 100,
    stock: 10,
    category_id: new mongoose.Types.ObjectId(),
    images: [],
    brand: "Brand",
    weight: 1,
    dimensions: { width: 1, height: 1, depth: 1 },
  }

  it("createProduct calls ProductModel.save and returns product", async () => {
    const saveMock = vi
      .spyOn(ProductModel.prototype, "save")
      .mockResolvedValue(mockProduct as any)
    const result = await productService.createProduct(mockProduct)
    expect(saveMock).toHaveBeenCalled()
    expect(result).toEqual(mockProduct)
  })

  it("getProductById returns product when id valid", async () => {
    const findByIdMock = vi.spyOn(ProductModel, "findById").mockReturnValue({
      exec: () => Promise.resolve(mockProduct),
    } as any)
    const id = mockProduct._id.toHexString()
    const result = await productService.getProductById(id)
    expect(findByIdMock).toHaveBeenCalledWith(id)
    expect(result).toEqual(mockProduct)
  })

  it("getProductById returns null when id invalid", async () => {
    const result = await productService.getProductById("invalid-id")
    expect(result).toBeNull()
  })

  it("updateProduct returns updated product", async () => {
    const findByIdAndUpdateMock = vi
      .spyOn(ProductModel, "findByIdAndUpdate")
      .mockReturnValue({
        exec: () => Promise.resolve(mockProduct),
      } as any)
    const id = mockProduct._id.toHexString()
    const data = { price: 200 }
    const result = await productService.updateProduct(id, data)
    expect(findByIdAndUpdateMock).toHaveBeenCalledWith(id, data, { new: true })
    expect(result).toEqual(mockProduct)
  })

  it("updateProduct returns null when id invalid", async () => {
    const result = await productService.updateProduct("invalid-id", {
      price: 200,
    })
    expect(result).toBeNull()
  })

  it("deleteProduct deletes and returns product", async () => {
    const findByIdAndDeleteMock = vi
      .spyOn(ProductModel, "findByIdAndDelete")
      .mockReturnValue({
        exec: () => Promise.resolve(mockProduct),
      } as any)
    const id = mockProduct._id.toHexString()
    const result = await productService.deleteProduct(id)
    expect(findByIdAndDeleteMock).toHaveBeenCalledWith(id)
    expect(result).toEqual(mockProduct)
  })

  it("deleteProduct returns null when id invalid", async () => {
    const result = await productService.deleteProduct("invalid-id")
    expect(result).toBeNull()
  })

  it("listProducts returns filtered products and total", async () => {
    const filters = {
      category_id: mockProduct.category_id.toHexString(),
      priceMin: 50,
    }
    const pagination = {
      page: 1,
      limit: 10,
      sortBy: "price",
      sortOrder: "asc" as const,
    }

    const findMock = vi.spyOn(ProductModel, "find").mockReturnValue({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            exec: () => Promise.resolve([mockProduct]),
          }),
        }),
      }),
    } as any)

    const countMock = vi.spyOn(ProductModel, "countDocuments").mockReturnValue({
      exec: () => Promise.resolve(1),
    } as any)

    const result = await productService.listProducts(filters, pagination)

    expect(findMock).toHaveBeenCalled()
    expect(countMock).toHaveBeenCalled()
    expect(result).toEqual({ products: [mockProduct], total: 1 })
  })
})
