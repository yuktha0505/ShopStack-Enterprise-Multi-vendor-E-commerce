import { Link, useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div>

            <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">

                <h1 className="text-2xl font-bold">
                    ShopStack
                </h1>

                <div className="space-x-6">

                    <Link to="/home">Home</Link>

                    <Link to="/products">Products</Link>

                    <Link to="/profile">Profile</Link>

                    <button onClick={logout}>
                        Logout
                    </button>

                </div>

            </nav>

            <div className="text-center mt-20">

                <h2 className="text-4xl font-bold">
                    Welcome to ShopStack
                </h2>

                <p className="text-gray-500 mt-4">
                    Enterprise Multi-Vendor E-Commerce Platform
                </p>

            </div>

        </div>
    );
}

export default Home;