import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function VendorDashboard() {

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


                    {/* ADD PRODUCT */}

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


                    {/* MY PRODUCTS */}

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


                    {/* MY ORDERS */}

                    <Link to="/vendor/orders">

                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 cursor-pointer">

                            <h2 className="text-3xl font-bold text-orange-600">
                                Customer Orders
                            </h2>

                            <p className="text-gray-500 mt-4">
                                View orders containing your products
                                and update their status.
                            </p>

                        </div>

                    </Link>

                    <Link to="/vendor/coupons">

                        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition cursor-pointer">

                            <h2 className="text-xl font-bold">
                                Coupons
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Review and manage your coupons
                            </p>

                        </div>

                    </Link>


                    {/* NOTIFICATIONS */}

                    <Link to="/notifications">

                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 cursor-pointer">

                            <h2 className="text-3xl font-bold text-red-600">
                                Notifications
                            </h2>

                            <p className="text-gray-500 mt-4">
                                View new order notifications and
                                important updates.
                            </p>

                        </div>

                    </Link>


                    {/* PROFILE */}

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


                    {/* INVENTORY */}

                    <Link to="/inventory">

                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 cursor-pointer">

                            <h2 className="text-3xl font-bold text-pink-600">
                                Inventory Management
                            </h2>

                            <p className="text-gray-500 mt-4">
                                Monitor and manage your product stock.
                            </p>

                        </div>

                    </Link>

                </div>

            </div>

        </div>

    );
}

export default VendorDashboard;