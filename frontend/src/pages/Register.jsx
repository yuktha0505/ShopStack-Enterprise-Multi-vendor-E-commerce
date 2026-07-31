import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await registerUser(user);

            alert(response.data);

            navigate("/");

        } catch (error) {
            alert("Registration Failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-blue-600">
                    ShopStack
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Create your account
                </p>

                <form onSubmit={handleRegister} className="mt-8 space-y-5">

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full border rounded-lg px-4 py-3"
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border rounded-lg px-4 py-3"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border rounded-lg px-4 py-3"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg"
                    >
                        Create Account
                    </button>

                </form>

                <p className="text-center mt-6">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600">
                        Sign In
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;