import { useState } from "react";
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string | number;
  user_id?: string | number;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  image?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();

      const decoded: DecodedToken = jwtDecode(res.access);
      console.log("Розшифровані дані токена:", decoded);
      dispatch(
        setCredentials({
          access: res.access,
          user: {
            id: decoded.id || decoded.user_id || 0,
            email: decoded.email,
            phone: decoded.phone,
            image: decoded.image,
            username: decoded.username,
          },
        })
      );

      navigate("/");
    } catch (err) {
      alert("Невірний логін або пароль");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleAccessToken = tokenResponse.access_token;

        // 1. Отримуємо профіль користувача з Google API
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
            },
          }
        );

        const googleUser = await userInfoRes.json();

        // 2. Опціонально: відправляємо цей токен на бекенд для авторизації
        const res = await googleLogin({
          access_token: googleAccessToken,
        }).unwrap();

        // 3. Зберігаємо отриману інформацію в Redux
        dispatch(
          setCredentials({
            access: res.access, // якщо бекенд повертає JWT
            user: {
              id: googleUser.sub,
              email: googleUser.email,
              image: googleUser.picture,
              username: googleUser.name,
            },
          })
        );

        navigate("/");
      } catch (err) {
        console.error("Помилка при Google логіні:", err);
        alert("Помилка Google авторизації");
      }
    },
  });

  const isLoading = isLoginLoading || isGoogleLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Вхід в акаунт
        </h2>

        <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">
          Логін
        </label>
        <input
          type="text"
          placeholder="Ваш логін"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label className="block text-gray-700 dark:text-gray-300 font-semibold">
          Пароль
        </label>
        <input
          type="password"
          placeholder="Ваш пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex mb-2 flex-col items-center gap-3">
          <Link
            to="/password-reset"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600 underline"
          >
            Забули пароль? Запит на відновлення
          </Link>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:bg-indigo-400 mb-4"
        >
          {isLoading ? "Завантаження..." : "Увійти"}
        </button>

        <button
          onClick={(event) => {
            event.preventDefault();
            loginWithGoogle();
          }}
          disabled={isLoading}
          className="mt-4 w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors disabled:bg-indigo-400"
        >
          Зайти через Google
        </button>
      </form>
    </div>
  );
}
