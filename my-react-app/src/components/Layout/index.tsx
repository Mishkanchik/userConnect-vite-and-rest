import React, { useEffect, useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { APP_ENV } from "../../env/index";
import { UseAppSelector } from "../../store";
import { removeFromCart, clearCart } from "../../slices/cartSlice";

const BASE_URL = APP_ENV.API_BASE_URL;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Layout = () => {
  const user = UseAppSelector((state) => state.auth.user);
  const cartItems = UseAppSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const userImageSrc = user?.image
    ? user.image.startsWith("http")
      ? user.image
      : `${BASE_URL}${user.image}`
    : "/images/user/owner.jpg";

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <div className="min-h-full relative">
      <Disclosure as="nav" className="bg-gray-800">
        {() => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Logo"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-1">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                  <button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white">
                    <BellIcon className="h-6 w-6" />
                  </button>

                  {user ? (
                    <Menu as="div" className="relative ml-3">
                      <MenuButton className="flex rounded-full bg-gray-800 text-sm">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={userImageSrc}
                          alt="avatar"
                        />
                      </MenuButton>
                      <MenuItems className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        <MenuItem>
                          {({ active }) => (
                            <a
                              href="/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Профіль
                            </a>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "w-full text-left px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Вийти
                            </button>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate("/login")}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-lg"
                      >
                        Увійти
                      </button>
                      <button
                        onClick={() => navigate("/register")}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg"
                      >
                        Зареєструватися
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      {/* Cart Sidebar */}
      <Transition show={isCartOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="transition duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-0 flex justify-end z-40">
            <div className="w-80 bg-white p-6 flex flex-col rounded-l-2xl overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Кошик</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="cursor-pointer text-gray-500 hover:text-black"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1">
                {cartItems.length === 0 ? (
                  <p className="text-gray-600">Кошик порожній</p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-b py-2 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.price} грн
                        </p>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        Видалити
                      </button>
                    </div>
                  ))
                )}
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={() => dispatch(clearCart())}
                  className="mt-4 bg-red-500 text-white py-2 rounded-lg"
                >
                  Очистити кошик
                </button>
              )}
            </div>
          </div>
        </Transition.Child>
      </Transition>

      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
