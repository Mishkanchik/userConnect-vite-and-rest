import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useGetProductsByCategoryQuery } from "../../services/apiProduct";
import { UseAppDispatch } from "../../store";
import { addToCart } from "../../slices/cartSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CategoryProductsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || "0");
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsByCategoryQuery(categoryId);
  const dispatch = UseAppDispatch();
  const navigate = useNavigate();

  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка при отриманні товарів</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Товари категорії #{categoryId}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow p-4">
            {product.images.length > 0 && (
              <Slider {...sliderSettings} className="mb-3">
                {product.images.map((img) => (
                  <div key={img.id}>
                    <img
                      src={img.url}
                      alt={img.alt_text || product.name}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                ))}
              </Slider>
            )}
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-500">{product.description}</p>
            <p className="text-indigo-600 font-bold mt-2">
              {product.price} грн
            </p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Додати в кошик
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
