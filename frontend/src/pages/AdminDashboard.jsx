import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        fetchDashboard();

    }, []);


    const fetchDashboard = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("ADMIN DASHBOARD:", response.data);

            setDashboard(response.data);

        } catch (err) {

            console.error("Dashboard error:", err);

            setError("Unable to load dashboard data.");

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <p className="text-xl text-gray-500">
                    Loading Admin Dashboard...
                </p>

            </div>

        );

    }


    if (error) {

        return (

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <p className="text-red-500 text-xl">
                    {error}
                </p>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-gray-100">

            {/* Header */}

            <div className="bg-blue-700 text-white py-8">

                <div className="max-w-7xl mx-auto px-6">

                    <h1 className="text-4xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-blue-100">
                        Welcome, Administrator
                    </p>

                </div>

            </div>


            {/* Dashboard Content */}

            <div className="max-w-7xl mx-auto px-6 py-10">


                {/* Analytics Cards */}

                <h2 className="text-2xl font-bold mb-6">
                    Marketplace Overview
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">


                    {/* Users */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Total Users
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-blue-600">
                            {dashboard.totalUsers}
                        </h2>

                    </div>


                    {/* Vendors */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Total Vendors
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-green-600">
                            {dashboard.totalVendors}
                        </h2>

                    </div>


                    {/* Products */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Total Products
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-purple-600">
                            {dashboard.totalProducts}
                        </h2>

                    </div>


                    {/* Orders */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Total Orders
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-orange-600">
                            {dashboard.totalOrders}
                        </h2>

                    </div>


                    {/* Sales */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Total Sales
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-red-600">
                            ₹{dashboard.totalSales}
                        </h2>

                    </div>

                </div>


                {/* Management Modules */}

                <h2 className="text-2xl font-bold mt-12 mb-6">
                    Management
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


                    {/* Vendors */}

                    <Link to="/admin/vendors">

                        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl hover:scale-105 transition cursor-pointer">

                            <h2 className="text-xl font-bold">
                                Vendors
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Manage marketplace vendors
                            </p>

                        </div>

                    </Link>


                    {/* Analytics */}

                    <Link to="/admin/analytics">

                        <div className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-xl transition">

                            <h2 className="text-xl font-bold">
                                Analytics
                            </h2>

                            <p className="text-gray-500 mt-2">
                                View marketplace statistics
                            </p>

                        </div>

                    </Link>


                    {/* Orders */}

                    <Link to="/admin/orders">

                        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl hover:scale-105 transition cursor-pointer">

                            <h2 className="text-xl font-bold">
                                Orders
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Monitor all orders
                            </p>

                        </div>

                    </Link>

                    {/* Commissions */}

                    <Link to="/admin/commissions">

                        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl hover:scale-105 transition cursor-pointer">

                            <h2 className="text-xl font-bold">
                                Commissions
                            </h2>

                            <p className="text-gray-500 mt-2">
                                View vendor commissions and payouts
                            </p>

                        </div>

                    </Link>


                    {/* Coupons */}

                    <Link to="/admin/coupons">

                        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl hover:scale-105 transition cursor-pointer">

                            <h2 className="text-xl font-bold">
                                Coupons & Promotions
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Create and manage coupons and offers
                            </p>

                        </div>

                    </Link>


                    {/* Reports */}

                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition cursor-pointer">

                        <h2 className="text-xl font-bold">
                            Reports
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Generate business reports
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default AdminDashboard;