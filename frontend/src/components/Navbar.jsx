import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/");
    };

    return (

        <nav className="bg-blue-600 text-white shadow-lg">

            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link
                    to="/home"
                    className="text-3xl font-bold"
                >
                    ShopStack
                </Link>

                <div className="flex gap-6 items-center">

                    <Link
                        to="/home"
                        className="hover:text-gray-200"
                    >
                        Home
                    </Link>

                    <Link
                        to="/profile"
                        className="hover:text-gray-200"
                    >
                        Profile
                    </Link>

                    {role === "VENDOR" && (

                        <Link
                            to="/vendor/dashboard"
                            className="hover:text-gray-200"
                        >
                            Vendor Dashboard
                        </Link>

                    )}

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;