import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await loginUser({
                email,
                password,
            });

            console.log("Response:", response);
            console.log("Token from Backend:", response.data);

            localStorage.setItem("token", response.data);

            console.log("Stored Token:", localStorage.getItem("token"));

            alert("Login Successful!");

            navigate("/profile");

        } catch (error) {

            console.error(error);

            alert("Invalid Email or Password");

        }

    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-blue-600">
                    ShopStack
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Welcome Back
                </p>

                <form onSubmit={handleLogin} className="mt-8 space-y-5">

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded-lg px-4 py-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-lg px-4 py-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Sign In
                    </button>

                </form>

                <p className="text-center mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Create Account
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;