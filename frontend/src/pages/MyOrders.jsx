import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = "http://localhost:8080";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [returnForm, setReturnForm] = useState(null);
    const [reason, setReason] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const headers = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersResponse, returnsResponse] = await Promise.all([
                axios.get(`${API}/api/orders`, { headers: headers() }),
                axios.get(`${API}/api/returns/my`, { headers: headers() })
            ]);
            setOrders(ordersResponse.data);
            setReturns(returnsResponse.data);
            setError("");
        } catch (err) {
            console.error("Error loading orders/returns:", err);
            setError(err.response?.data || "Unable to load your orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const findReturn = (orderId, productId) => returns.find(
        item => item.orderId === orderId && item.productId === productId
    );

    const openReturnForm = (order, item) => {
        setReturnForm({
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            maxQuantity: item.quantity
        });
        setQuantity(1);
        setReason("");
    };

    const submitReturn = async (event) => {
        event.preventDefault();
        if (!returnForm || !reason.trim()) {
            alert("Please provide a return reason.");
            return;
        }

        try {
            setBusy(true);
            await axios.post(`${API}/api/returns`, {
                orderId: returnForm.orderId,
                productId: returnForm.productId,
                quantity: Number(quantity),
                reason: reason.trim()
            }, { headers: headers() });

            setReturnForm(null);
            await fetchData();
            alert("Return request submitted successfully.");
        } catch (err) {
            console.error("Return request failed:", err);
            alert(err.response?.data || "Failed to submit return request.");
        } finally {
            setBusy(false);
        }
    };

    const markReturned = async (id) => {
        try {
            setBusy(true);
            await axios.put(`${API}/api/returns/${id}/returned`, {}, { headers: headers() });
            await fetchData();
            alert("Return marked as handed over. The admin can now receive and inspect it.");
        } catch (err) {
            alert(err.response?.data || "Unable to update return status.");
        } finally {
            setBusy(false);
        }
    };

    const formatStatus = (status) => status
        ? status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
        : "-";

    const orderStatuses = [
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "RETURNED",
        "REFUNDED"
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <h2 className="text-center mt-10 text-xl">Loading orders...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-6xl mx-auto py-10 px-5">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">My Orders</h1>

                {error && <div className="bg-red-100 text-red-700 rounded-lg p-4 mb-6">{error}</div>}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                        <h2 className="text-2xl font-semibold">No Orders Yet</h2>
                        <p className="text-gray-500 mt-3">Your placed orders will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row md:justify-between gap-3 border-b pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">Order #{order.id}</h2>
                                        <p className="text-gray-500 mt-1">{new Date(order.orderDate).toLocaleString()}</p>
                                    </div>
                                    <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold h-fit">
                                        {formatStatus(order.status)}
                                    </span>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xl font-bold mb-6">Order Tracking</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                                        {orderStatuses.map(status => {
                                            const currentIndex = orderStatuses.indexOf(order.status);
                                            const statusIndex = orderStatuses.indexOf(status);
                                            const completed = statusIndex !== -1 && currentIndex !== -1 && statusIndex <= currentIndex;
                                            return (
                                                <div key={status} className="flex flex-col items-center text-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${completed ? "bg-blue-600" : "bg-gray-300"}`}>
                                                        {completed ? "✓" : ""}
                                                    </div>
                                                    <p className={`mt-3 text-sm font-semibold ${order.status === status ? "text-blue-600" : completed ? "text-gray-700" : "text-gray-400"}`}>
                                                        {formatStatus(status)}
                                                    </p>
                                                    {order.status === status && <span className="mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Current</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-8 border-t pt-6">
                                    <h3 className="text-xl font-bold mb-4">Products</h3>
                                    <div className="space-y-4">
                                        {order.items.map(item => {
                                            const returnRequest = findReturn(order.id, item.productId);
                                            return (
                                                <div key={item.id} className="border-b pb-5">
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt={item.productName} className="w-24 h-24 object-cover rounded-lg" />
                                                        ) : (
                                                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">No Image</div>
                                                        )}
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold">{item.productName}</h3>
                                                            <p className="text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                                            <p className="text-gray-600">Price: ₹{Number(item.price).toFixed(2)}</p>
                                                            <p className="font-bold text-blue-600 mt-1">Subtotal: ₹{Number(item.subtotal).toFixed(2)}</p>
                                                        </div>
                                                    </div>

                                                    {order.status === "DELIVERED" && !returnRequest && (
                                                        <button
                                                            onClick={() => openReturnForm(order, item)}
                                                            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                                                        >
                                                            Request Return
                                                        </button>
                                                    )}

                                                    {returnRequest && (
                                                        <div className="mt-4 bg-gray-50 border rounded-lg p-4">
                                                            <div className="flex flex-wrap gap-3 items-center">
                                                                <span className="font-semibold">Return status:</span>
                                                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">{formatStatus(returnRequest.status)}</span>
                                                                {returnRequest.refundAmount != null && <span>Refund: ₹{Number(returnRequest.refundAmount).toFixed(2)}</span>}
                                                            </div>
                                                            {returnRequest.status === "APPROVED" && (
                                                                <button
                                                                    disabled={busy}
                                                                    onClick={() => markReturned(returnRequest.id)}
                                                                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
                                                                >
                                                                    I Have Returned the Product
                                                                </button>
                                                            )}
                                                            {returnRequest.status === "REFUND_INITIATED" && <p className="text-indigo-700 mt-2">Refund initiated. Awaiting gateway processing.</p>}
                                                            {returnRequest.status === "REFUNDED" && <p className="text-green-700 mt-2 font-semibold">Refund completed successfully.</p>}
                                                            {returnRequest.status === "REJECTED" && <p className="text-red-700 mt-2">Return rejected: {returnRequest.adminComment || "No reason provided."}</p>}
                                                            {returnRequest.status === "REJECTED_AFTER_INSPECTION" && <p className="text-red-700 mt-2">Returned product was rejected after inspection: {returnRequest.inspectionComment || "Product was not eligible for resale/refund."}</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-5 pt-5 border-t">
                                    <span className="text-xl font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-blue-600">₹{Number(order.totalAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {returnForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">
                    <form onSubmit={submitReturn} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-2">Request Product Return</h2>
                        <p className="text-gray-600 mb-5">{returnForm.productName}</p>

                        <label className="block font-semibold mb-2">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            max={returnForm.maxQuantity}
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            className="w-full border rounded-lg p-3 mb-4"
                        />

                        <label className="block font-semibold mb-2">Return Reason</label>
                        <textarea
                            required
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="Tell us why you want to return this product"
                            className="w-full border rounded-lg p-3 h-28 mb-5"
                        />

                        <div className="flex gap-3 justify-end">
                            <button type="button" onClick={() => setReturnForm(null)} className="border px-4 py-2 rounded-lg">Cancel</button>
                            <button disabled={busy} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit Return</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default MyOrders;
