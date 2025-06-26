import { useState } from "react";
import { useLoginMutation } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({ username, password }).unwrap();
            console.log("Login response:", res);

            dispatch(
                setCredentials({
                    username: res.username ?? username,
                    access: res.access,
                })
            );

            navigate("/"); // перенаправлення на головну після логіну
        } catch (err) {
            alert("Невірний логін або пароль");
        }
    };

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

                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">
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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:bg-indigo-400"
                >
                    {isLoading ? "Завантаження..." : "Увійти"}
                </button>
            </form>
        </div>
    );
}