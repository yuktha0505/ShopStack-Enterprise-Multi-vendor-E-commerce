import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const role = localStorage.getItem("role");

    const [unreadCount, setUnreadCount] = useState(0);

    // ==========================================
    // FETCH UNREAD NOTIFICATION COUNT
    // ==========================================

    const fetchUnreadCount = async () => {

        if (role !== "VENDOR") {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            const response = await axios.get(
                "http://localhost:8080/api/notifications/unread-count",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUnreadCount(Number(response.data));

        } catch (error) {

            console.error(
                "Error loading notification count:",
                error
            );

        }
    };

    // ==========================================
    // LOAD NOTIFICATION COUNT
    // ==========================================

    useEffect(() => {

        fetchUnreadCount();

    }, [role, location.pathname]);

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/");

    };

    return (

        <nav className="bg-blue-600 text-white shadow-lg">

            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* LOGO */}

                <Link
                    to="/home"
                    className="text-3xl font-bold"
                >
                    ShopStack
                </Link>


                <div className="flex gap-6 items-center">

                    {/* HOME */}

                    <Link
                        to="/home"
                        className="hover:text-gray-200"
                    >
                        Home
                    </Link>


                    {/* PROFILE */}

                    <Link
                        to="/profile"
                        className="hover:text-gray-200"
                    >
                        Profile
                    </Link>


                    {/* CART */}

                    <Link
                        to="/cart"
                        className="hover:text-gray-200"
                    >
                        Cart
                    </Link>


                    {/* ==================================
                        CUSTOMER MY ORDERS
                    ================================== */}

                    <Link
                        to="/my-orders"
                        className="hover:text-gray-200"
                    >
                        My Orders
                    </Link>


                    {/* ==================================
                        ADMIN RETURN & REFUND MANAGEMENT
                    ================================== */}

                    {role === "ADMIN" && (

                        <Link
                            to="/admin/returns"
                            className="hover:text-gray-200"
                        >
                            Return & Refund Management
                        </Link>

                    )}


                    {/* ==================================
                        VENDOR NOTIFICATIONS
                    ================================== */}

                    {role === "VENDOR" && (

                        <Link
                            to="/notifications"
                            className={`relative px-3 py-2 rounded-lg transition ${
                                unreadCount > 0
                                    ? "bg-red-500 text-white font-bold shadow-lg animate-pulse"
                                    : "hover:text-gray-200"
                            }`}
                        >

                            🔔 Notifications

                            {unreadCount > 0 && (

                                <span
                                    className="absolute -top-2 -right-2 bg-yellow-300 text-red-700 text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1"
                                >
                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}
                                </span>

                            )}

                        </Link>

                    )}


                    {/* ==================================
                        VENDOR DASHBOARD
                    ================================== */}

                    {role === "VENDOR" && (

                        <Link
                            to="/vendor/dashboard"
                            className="hover:text-gray-200"
                        >
                            Vendor Dashboard
                        </Link>

                    )}


                    {/* ==================================
                        ADMIN DASHBOARD
                    ================================== */}

                    {role === "ADMIN" && (

                        <Link
                            to="/admin/dashboard"
                            className="hover:text-gray-200"
                        >
                            Admin Dashboard
                        </Link>

                    )}

                    {role === "ADMIN" && (
                        <Link to="/admin/warehouses" className="hover:text-gray-200">
                            Warehouses
                        </Link>
                    )}

                    {role === "WAREHOUSE_STAFF" && (
                        <Link to="/warehouse-staff/dashboard" className="hover:text-gray-200">
                            Warehouse Operations
                        </Link>
                    )}


                    {/* ==================================
                        LOGOUT
                    ================================== */}

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