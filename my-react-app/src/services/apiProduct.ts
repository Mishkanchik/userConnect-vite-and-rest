import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery.ts";

export interface ProductImage {
  id: number;
  url: string;
  alt_text: string;
}

export interface Product {
  id: number;
  category: number;
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  images: ProductImage[];
}

export const apiProduct = createApi({
  reducerPath: "apiProduct",
  baseQuery: createBaseQuery("products"),
  tagTypes: ["Products"],
  endpoints: (build) => ({
    getProductsByCategory: build.query<Product[], number>({
      query: (categoryId) => ({
        url: `/?category=${categoryId}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    getProduct: build.query<Product, number>({
      query: (id) => ({
        url: `/${id}/`,
        method: "GET",
      }),
      providesTags: (_error, _result, id) => [{ type: "Products", id }],
    }),

    updateProduct: build.mutation<Product, FormData>({
      query: (formData) => {
        const id = formData.get("id");
        return {
          url: `/${id}/`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Products"],
    }),

    createProduct: build.mutation<Product, FormData>({
      query: (formData) => ({
        url: `/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: build.mutation<void, number>({
      query: (id) => ({
        url: `/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsByCategoryQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = apiProduct;
