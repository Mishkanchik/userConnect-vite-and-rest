import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { APP_ENV } from "../../env";

const BASE_URL = APP_ENV.API_BASE_URL;

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <p className="text-center text-red-600 mt-20 text-lg font-semibold">
        Користувач не знайдений. Будь ласка, увійдіть.
      </p>
    );
  }

  const avatarSrc = user.image
    ? user.image.startsWith("http")
      ? user.image
      : `${BASE_URL}${user.image}`
    : "/images/user/owner.jpg";

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900 shadow-lg rounded-2xl mt-16">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 text-center">
        Профіль користувача
      </h1>

      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 mb-10">
        <img
          src={avatarSrc}
          alt="User avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-md"
        />
        <div className="text-center sm:text-left">
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            {user.username}
          </p>
          <p className="text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            ID: {user.id}
          </p>
        </div>
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg">
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
          <span className="font-semibold">Електронна пошта:</span>
          <span className="text-gray-900 dark:text-gray-100">
            {user.email || "Не вказано"}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
          <span className="font-semibold">Телефон:</span>
          <span className="text-gray-900 dark:text-gray-100">
            {user.phone || "Не вказано"}
          </span>
        </div>

        {Object.entries(user).map(([key, value]) => {
          if (
            ["username", "email", "phone", "image", "id"].includes(key) ||
            value === null ||
            value === undefined
          )
            return null;
          return (
            <div
              key={key}
              className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3"
            >
              <span className="font-semibold capitalize">{key}:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ProfilePage;
