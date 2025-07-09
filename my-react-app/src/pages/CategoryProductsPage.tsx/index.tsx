import React from "react";
<<<<<<< HEAD
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import {
  useGetProductsByCategoryQuery,
  useDeleteProductMutation,
} from "../../services/apiProduct";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CategoryProductsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || "0");
  const navigate = useNavigate();
=======
import { useParams } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../../services/apiProduct";

const CategoryProductsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91

  const {
    data: products,
    isLoading,
    error,
<<<<<<< HEAD
    refetch,
  } = useGetProductsByCategoryQuery(categoryId);

  const [deleteProduct] = useDeleteProductMutation();

  const handleAddProduct = () => {
    navigate(`/category/${categoryId}/products/add`);
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/products/${productId}/edit`);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm("Ви дійсно хочете видалити цей товар?")) {
      try {
        await deleteProduct(productId).unwrap();
        refetch();
      } catch (e) {
        alert("Помилка при видаленні товару.");
        console.error(e);
      }
    }
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка при отриманні товарів</div>;

  // Налаштування слайдера
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Товари категорії #{categoryId}</h1>
        <button
          onClick={handleAddProduct}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Додати товар
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
          >
            {product.images.length > 0 && (
              <div className="mb-3">
                <Slider {...sliderSettings}>
                  {product.images.map((img) => (
                    <div key={img.id}>
                      <img
                        src={img.url}
                        alt={img.alt_text || product.name}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
            <p className="text-indigo-600 mt-2 font-bold">
              {product.price} грн
            </p>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => handleEditProduct(product.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                Редагувати
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Видалити
              </button>
=======
  } = useGetProductsByCategoryQuery(categoryId);

  if (isLoading) return <div>Завантаження товарів...</div>;
  if (error) return <div>Помилка при завантаженні товарів</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Товари категорії</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded shadow p-4 flex flex-col"
          >
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-2">{product.description}</p>
            <div className="mt-3 flex space-x-2 overflow-x-auto">
              {product.images?.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
