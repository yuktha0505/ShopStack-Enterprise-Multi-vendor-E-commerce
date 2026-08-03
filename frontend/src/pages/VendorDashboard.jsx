import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function VendorDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="bg-blue-600 text-white p-5 shadow-lg">
                <h1 className="text-3xl font-bold">
                    Vendor Dashboard
                </h1>
            </div>

            <div className="max-w-6xl mx-auto mt-10">

                <h2 className="text-2xl font-semibold mb-8">
                    Welcome Vendor 👋
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <Link
                        to="/vendor/add-product"
                        className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
                    >
                        <h2 className="text-xl font-bold text-blue-600">
                            Add Product
                        </h2>

                        <p className="mt-3 text-gray-600">
                            Add a new product to your store.
                        </p>
                    </Link>

                    <Link
                        to="/vendor/my-products"
                        className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
                    >
                        <h2 className="text-xl font-bold text-green-600">
                            My Products
                        </h2>

                        <p className="mt-3 text-gray-600">
                            View and manage your products.
                        </p>
                    </Link>

                    <Link
                        to="/profile"
                        className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition"
                    >
                        <h2 className="text-xl font-bold text-purple-600">
                            My Profile
                        </h2>

                        <p className="mt-3 text-gray-600">
                            Update your profile information.
                        </p>
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default VendorDashboard;