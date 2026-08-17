import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const statuses = [
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED"
    ];

    const fetchOrders = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("My Orders:", response.data);

            setOrders(response.data);

        } catch (error) {

            console.error("Error loading orders:", error);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchOrders();

    }, []);


    const getStatusIndex = (status) => {

        return statuses.indexOf(status);

    };


    const isCompleted = (orderStatus, status) => {

        const currentIndex = getStatusIndex(orderStatus);
        const statusIndex = getStatusIndex(status);

        return statusIndex <= currentIndex;

    };


    const formatStatus = (status) => {

        return status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());

    };


    if (loading) {

        return (
            <div className="min-h-screen bg-gray-100">

                <Navbar />

                <h2 className="text-center mt-10 text-xl">
                    Loading orders...
                </h2>

            </div>
        );

    }


    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-6xl mx-auto py-10 px-5">

                <h1 className="text-3xl font-bold text-blue-600 mb-8">
                    My Orders
                </h1>


                {orders.length === 0 ? (

                    <div className="bg-white rounded-xl shadow-lg p-10 text-center">

                        <h2 className="text-2xl font-semibold">
                            No Orders Yet
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Your placed orders will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-8">

                        {orders.map((order) => (

                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >

                                {/* ORDER HEADER */}

                                <div className="flex flex-col md:flex-row md:justify-between gap-3 border-b pb-4">

                                    <div>

                                        <h2 className="text-xl font-bold">
                                            Order #{order.id}
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            {new Date(
                                                order.orderDate
                                            ).toLocaleString()}
                                        </p>

                                    </div>


                                    <div>

                                        <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                                            {formatStatus(order.status)}
                                        </span>

                                    </div>

                                </div>


                                {/* ORDER TRACKING */}

                                <div className="mt-8">

                                    <h3 className="text-xl font-bold mb-6">
                                        Order Tracking
                                    </h3>


                                    <div className="relative">

                                        {/* LINE */}

                                        <div className="hidden md:block absolute top-5 left-0 right-0 h-1 bg-gray-200">
                                        </div>


                                        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">

                                            {statuses.map((status) => {

                                                const completed =
                                                    isCompleted(
                                                        order.status,
                                                        status
                                                    );

                                                const current =
                                                    order.status === status;

                                                return (

                                                    <div
                                                        key={status}
                                                        className="relative flex flex-col items-center text-center"
                                                    >

                                                        {/* CIRCLE */}

                                                        <div
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold z-10 ${
                                                                completed
                                                                    ? "bg-blue-600"
                                                                    : "bg-gray-300"
                                                            }`}
                                                        >

                                                            {completed
                                                                ? "✓"
                                                                : ""
                                                            }

                                                        </div>


                                                        {/* STATUS */}

                                                        <p
                                                            className={`mt-3 text-sm font-semibold ${
                                                                current
                                                                    ? "text-blue-600"
                                                                    : completed
                                                                        ? "text-gray-700"
                                                                        : "text-gray-400"
                                                            }`}
                                                        >
                                                            {formatStatus(status)}
                                                        </p>


                                                        {/* CURRENT */}

                                                        {current && (

                                                            <span className="mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                                                Current
                                                            </span>

                                                        )}

                                                    </div>

                                                );

                                            })}

                                        </div>

                                    </div>

                                </div>


                                {/* ORDER ITEMS */}

                                <div className="mt-8 border-t pt-6">

                                    <h3 className="text-xl font-bold mb-4">
                                        Products
                                    </h3>

                                    <div className="space-y-4">

                                        {order.items.map((item) => (

                                            <div
                                                key={item.id}
                                                className="flex flex-col md:flex-row gap-4 border-b pb-4"
                                            >

                                                {/* IMAGE */}

                                                {item.imageUrl ? (

                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.productName}
                                                        className="w-24 h-24 object-cover rounded-lg"
                                                    />

                                                ) : (

                                                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">

                                                        <span className="text-xs text-gray-500">
                                                            No Image
                                                        </span>

                                                    </div>

                                                )}


                                                {/* DETAILS */}

                                                <div className="flex-1">

                                                    <h3 className="text-lg font-bold">
                                                        {item.productName}
                                                    </h3>

                                                    <p className="text-gray-600 mt-1">
                                                        Quantity: {item.quantity}
                                                    </p>

                                                    <p className="text-gray-600">
                                                        Price: ₹ {item.price}
                                                    </p>

                                                </div>


                                                {/* SUBTOTAL */}

                                                <div className="font-bold text-blue-600">

                                                    ₹ {item.subtotal}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>


                                {/* TOTAL */}

                                <div className="flex justify-between items-center mt-5 pt-5 border-t">

                                    <span className="text-xl font-semibold">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold text-blue-600">
                                        ₹ {order.totalAmount}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}

export default MyOrders;