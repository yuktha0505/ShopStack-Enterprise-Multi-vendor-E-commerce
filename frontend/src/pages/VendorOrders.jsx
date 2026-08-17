import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function VendorOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/orders/vendor",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOrders(response.data);

        } catch (error) {

            console.error("Error loading vendor orders:", error);
            alert("Failed to load orders");

        } finally {

            setLoading(false);

        }
    };


    const updateStatus = async (orderId, newStatus) => {

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8080/api/orders/${orderId}/status`,
                null,
                {
                    params: {
                        status: newStatus
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Order status updated successfully");

            fetchOrders();

        } catch (error) {

            console.error("Status update failed:", error);

            const message =
                error.response?.data ||
                "Failed to update order status";

            alert(message);
        }
    };


    const getNextStatuses = (status) => {

        switch (status) {

            case "PLACED":
                return ["CONFIRMED", "CANCELLED"];

            case "CONFIRMED":
                return ["PROCESSING", "CANCELLED"];

            case "PROCESSING":
                return ["SHIPPED"];

            case "SHIPPED":
                return ["OUT_FOR_DELIVERY"];

            case "OUT_FOR_DELIVERY":
                return ["DELIVERED"];

            default:
                return [];
        }
    };


    if (loading) {

        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />

                <div className="flex justify-center items-center h-96">
                    <h2 className="text-xl">
                        Loading Orders...
                    </h2>
                </div>
            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-7xl mx-auto py-10 px-5">

                <h1 className="text-3xl font-bold text-blue-600 mb-8">
                    My Orders
                </h1>

                {orders.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-10 text-center">

                        <h2 className="text-xl text-gray-500">
                            No orders received yet
                        </h2>

                    </div>

                ) : (

                    <div className="space-y-6">

                        {orders.map((order) => (

                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >

                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                                    <div>

                                        <h2 className="text-xl font-bold">
                                            Order #{order.id}
                                        </h2>

                                        <p className="text-gray-500">
                                            {new Date(
                                                order.orderDate
                                            ).toLocaleString()}
                                        </p>

                                    </div>


                                    <div>

                                        <span className="font-semibold">
                                            Status:
                                        </span>

                                        <span className="ml-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                            {order.status}
                                        </span>

                                    </div>

                                </div>


                                <div className="border-t mt-5 pt-5">

                                    <h3 className="font-semibold mb-3">
                                        Products
                                    </h3>

                                    <div className="space-y-3">

                                        {order.items.map((item) => (

                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 border rounded-lg p-3"
                                            >

                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />

                                                <div className="flex-1">

                                                    <p className="font-semibold">
                                                        {item.productName}
                                                    </p>

                                                    <p className="text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>

                                                </div>

                                                <p className="font-semibold">
                                                    ₹ {item.price}
                                                </p>

                                            </div>

                                        ))}

                                    </div>

                                </div>


                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-t mt-5 pt-5">

                                    <p className="text-xl font-bold">
                                        Total: ₹ {order.totalAmount}
                                    </p>


                                    {getNextStatuses(order.status).length > 0 && (

                                        <div className="flex items-center gap-3">

                                            <label className="font-semibold">
                                                Update Status:
                                            </label>

                                            <select
                                                className="border rounded-lg px-4 py-2"
                                                defaultValue=""
                                                onChange={(e) => {

                                                    if (e.target.value) {

                                                        updateStatus(
                                                            order.id,
                                                            e.target.value
                                                        );

                                                    }
                                                }}
                                            >

                                                <option value="">
                                                    Select status
                                                </option>

                                                {getNextStatuses(
                                                    order.status
                                                ).map((status) => (

                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status.replaceAll(
                                                            "_",
                                                            " "
                                                        )}
                                                    </option>

                                                ))}

                                            </select>

                                        </div>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default VendorOrders;