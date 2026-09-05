import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080";

function AdminReturns() {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);

    const headers = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
    });

    const fetchReturns = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API}/api/admin/returns`, {
                headers: headers()
            });
            setReturns(response.data);
            setError("");
        } catch (err) {
            console.error("Error loading returns:", err);
            setError(err.response?.data || "Unable to load return requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const action = async (id, method, url, body) => {
        try {
            setBusyId(id);
            await axios({
                method,
                url: `${API}${url}`,
                data: body,
                headers: headers()
            });
            await fetchReturns();
        } catch (err) {
            console.error("Return action failed:", err);
            alert(err.response?.data || "Return action failed.");
        } finally {
            setBusyId(null);
        }
    };

    const approve = (id) => action(
        id,
        "put",
        `/api/admin/returns/${id}/approve`,
        { comment: "Return approved by admin" }
    );

    const reject = (id) => {
        const comment = window.prompt("Reason for rejection:");
        if (comment === null) return;
        action(id, "put", `/api/admin/returns/${id}/reject`, { comment });
    };

    const receive = (id) => action(
        id,
        "put",
        `/api/admin/returns/${id}/receive`,
        { comment: "Returned product received" }
    );

    const inspect = (id, condition) => {
        const comment = window.prompt(`Inspection comment for ${condition}:`) || "";
        action(id, "put", `/api/admin/returns/${id}/inspect`, {
            condition,
            comment
        });
    };

    const refund = (id) => {
        if (!window.confirm("Initiate the refund for this accepted return?")) return;
        action(id, "post", `/api/admin/returns/${id}/refund`);
    };

    const refreshRefund = (id) => action(
        id,
        "post",
        `/api/admin/returns/${id}/refund/status`
    );

    const format = (value) => value
        ? value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
        : "-";

    if (loading) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-xl">Loading return requests...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-blue-700 text-white py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold">Return & Refund Management</h1>
                    <p className="mt-2 text-blue-100">Review returns, inspect products and process refunds.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {error && <div className="bg-red-100 text-red-700 rounded-lg p-4 mb-6">{error}</div>}

                {returns.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-10 text-center">
                        <h2 className="text-2xl font-bold">No return requests</h2>
                        <p className="text-gray-500 mt-2">Customer return requests will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {returns.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow p-6">
                                <div className="flex flex-col lg:flex-row lg:justify-between gap-4 border-b pb-5">
                                    <div>
                                        <h2 className="text-xl font-bold">Return #{item.id} · Order #{item.orderId}</h2>
                                        <p className="text-gray-600 mt-1">Customer: {item.customerName} ({item.customerEmail})</p>
                                        <p className="text-gray-500">Requested: {new Date(item.requestedAt).toLocaleString()}</p>
                                    </div>
                                    <span className="h-fit bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">{format(item.status)}</span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mt-5">
                                    <div>
                                        <p><strong>Product:</strong> {item.productName}</p>
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                        <p><strong>Reason:</strong> {item.reason}</p>
                                        <p><strong>Condition:</strong> {format(item.condition)}</p>
                                        <p><strong>Refund:</strong> {item.refundAmount == null ? "-" : `₹${Number(item.refundAmount).toFixed(2)}`}</p>
                                        <p><strong>Inventory Restocked:</strong> {item.inventoryRestocked ? "Yes" : "No"}</p>
                                    </div>
                                    <div className="text-gray-600">
                                        <p><strong>Admin comment:</strong> {item.adminComment || "-"}</p>
                                        <p><strong>Inspection:</strong> {item.inspectionComment || "-"}</p>
                                        <p><strong>Refund ID:</strong> {item.refundId || "-"}</p>
                                        <p><strong>Payment:</strong> {format(item.paymentStatus)}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-6">
                                    {item.status === "REQUESTED" && <>
                                        <button disabled={busyId === item.id} onClick={() => approve(item.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg">Approve</button>
                                        <button disabled={busyId === item.id} onClick={() => reject(item.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Reject</button>
                                    </>}
                                    {item.status === "RETURNED" && <button disabled={busyId === item.id} onClick={() => receive(item.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Mark Received</button>}
                                    {item.status === "RECEIVED" && <>
                                        <button disabled={busyId === item.id} onClick={() => inspect(item.id, "SELLABLE")} className="bg-green-600 text-white px-4 py-2 rounded-lg">Accept · Sellable</button>
                                        <button disabled={busyId === item.id} onClick={() => inspect(item.id, "DAMAGED")} className="bg-orange-600 text-white px-4 py-2 rounded-lg">Reject · Damaged</button>
                                        <button disabled={busyId === item.id} onClick={() => inspect(item.id, "DEFECTIVE")} className="bg-orange-600 text-white px-4 py-2 rounded-lg">Reject · Defective</button>
                                        <button disabled={busyId === item.id} onClick={() => inspect(item.id, "UNUSABLE")} className="bg-red-600 text-white px-4 py-2 rounded-lg">Reject · Unusable</button>
                                    </>}
                                    {item.status === "ACCEPTED" && <button disabled={busyId === item.id} onClick={() => refund(item.id)} className="bg-purple-600 text-white px-4 py-2 rounded-lg">Process Refund</button>}
                                    {item.status === "REFUND_INITIATED" && <button disabled={busyId === item.id} onClick={() => refreshRefund(item.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Check Refund Status</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminReturns;
