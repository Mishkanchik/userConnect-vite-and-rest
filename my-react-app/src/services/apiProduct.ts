<<<<<<< HEAD
<<<<<<< HEAD
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery.ts";
=======
import { apiCategory } from "./apiCategory";
import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts"; // якщо у тебе є базовий api з apiCategory, injectEndpoints додаємо сюди
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91

export interface ProductImage {
  id: number;
  url: string;
  alt_text: string;
=======
import { apiCategory } from "./apiCategory";
import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts"; // якщо у тебе є базовий api з apiCategory, injectEndpoints додаємо сюди

// Оголошуємо типи (приклад)
export interface ProductImage {
  id: number;
  url: string;
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
}

export interface Product {
  id: number;
<<<<<<< HEAD
  category: number;
  name: string;
  slug?: string;
=======
  categoryId: number;
  name: string;
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
  description?: string;
  price?: number;
  images: ProductImage[];
}

export const apiProduct = createApi({
<<<<<<< HEAD
<<<<<<< HEAD
  reducerPath: "apiProduct",
=======
  reducerPath: 'api',
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
  baseQuery: createBaseQuery("products"),
  tagTypes: ["Products"],
  endpoints: (build) => ({
    getProductsByCategory: build.query<Product[], number>({
<<<<<<< HEAD
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
=======
      query: (categoryId) => `/?category=${categoryId}`,
      providesTags: ['Products'],
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
=======
  reducerPath: 'api',
  baseQuery: createBaseQuery("products"),
  tagTypes: ["Products"],
  endpoints: (build) => ({
    // Запит на отримання товарів конкретної категорії
    getProductsByCategory: build.query<Product[], number>({
      query: (categoryId) => `/?category=${categoryId}`,
      providesTags: ['Products'],
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
    }),
  }),
});

<<<<<<< HEAD
<<<<<<< HEAD
export const {
  useGetProductsByCategoryQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = apiProduct;
=======
export const { useGetProductsByCategoryQuery } = apiProduct;
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
=======
export const { useGetProductsByCategoryQuery } = apiProduct;
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
