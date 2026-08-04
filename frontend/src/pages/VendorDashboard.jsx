import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function VendorDashboard() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            {/* Header */}

            <div className="bg-blue-600 text-white py-8">

                <div className="max-w-7xl mx-auto px-5">

                    <h1 className="text-5xl font-bold">
                        Vendor Dashboard
                    </h1>

                </div>

            </div>

            {/* Dashboard */}

            <div className="max-w-7xl mx-auto py-12 px-5">

                <h2 className="text-4xl font-bold mb-10">
                    Welcome Vendor 👋
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Add Product */}

                    <Link to="/add-product">

                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 cursor-pointer">

                            <h2 className="text-3xl font-bold text-blue-600">
                                Add Product
                            </h2>

                            <p className="text-gray-500 mt-4">
                                Add a new product to your store.
                            </p>

                        </div>

                    </Link>

                    {/* My Products */}

                    <Link to="/my-products">

                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 cursor-pointer">

                            <h2 className="text-3xl font-bold text-green-600">
                                My Products
                            </h2>

                            <p className="text-gray-500 mt-4">
                                View and manage your products.
                            </p>

                        </div>

                    </Link>

                    {/* Profile */}

                    <Link to="/profile">

                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 cursor-pointer">

                            <h2 className="text-3xl font-bold text-purple-600">
                                My Profile
                            </h2>

                            <p className="text-gray-500 mt-4">
                                Update your profile information.
                            </p>

                        </div>

                    </Link>

                </div>

                {/* Inventory Button */}

                <div className="mt-10">

                    <button
                        onClick={() => navigate("/inventory")}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition"
                    >
                        Inventory Management
                    </button>

                </div>

            </div>

        </div>

    );
}

export default VendorDashboard;