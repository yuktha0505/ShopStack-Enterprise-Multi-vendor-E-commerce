import { useEffect, useState } from "react";
import axios from "axios";
import { getErrorMessage } from "../utils/errorHandler";

function AdminCommissions() {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [payingId, setPayingId] = useState(null);

    const fetchCommissions = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/admin/commissions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCommissions(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Unable to load commission information. Please try again."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    // =========================================================
    // MARK COMMISSION AS PAID
    // =========================================================

    const handleMarkAsPaid = async (commissionId) => {
        try {
            setPayingId(commissionId);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");

            await axios.patch(
                `http://localhost:8080/api/admin/commissions/${commissionId}/pay`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccess("Commission marked as paid successfully.");
            await fetchCommissions();
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Unable to mark the commission as paid. Please try again."
                )
            );
        } finally {
            setPayingId(null);
        }
    };

    const totalCommission = commissions.reduce(
        (total, commission) =>
            total + Number(commission.commissionAmount || 0),
        0
    );

    const totalVendorAmount = commissions.reduce(
        (total, commission) =>
            total + Number(commission.vendorAmount || 0),
        0
    );

    const getStatusClasses = (status) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="bg-blue-700 text-white py-6 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                            Commission Management
                        </h1>
                    </div>
                </div>

                <div className="flex justify-center items-center min-h-[60vh] px-4">
                    <div className="text-center">
                        <p className="text-lg sm:text-xl font-semibold text-gray-700">
                            Loading commissions...
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Please wait.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* HEADER */}
            <div className="bg-blue-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                        Commission Management
                    </h1>

                    <p className="mt-2 text-sm sm:text-base text-blue-100">
                        Monitor platform commissions and vendor payouts
                    </p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">

                {/* ERROR */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm sm:text-base text-red-700"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <span className="break-words">
                                {error}
                            </span>

                            <button
                                onClick={fetchCommissions}
                                className="w-full sm:w-auto shrink-0 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* SUCCESS */}
                {success && (
                    <div
                        role="status"
                        className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm sm:text-base text-green-700"
                    >
                        {success}
                    </div>
                )}

                {/* SUMMARY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">

                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                        <p className="text-sm sm:text-base text-gray-500">
                            Commission Records
                        </p>

                        <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
                            {commissions.length}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                        <p className="text-sm sm:text-base text-gray-500">
                            Platform Commission
                        </p>

                        <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2 break-words">
                            ₹{totalCommission.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                        <p className="text-sm sm:text-base text-gray-500">
                            Vendor Payout
                        </p>

                        <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2 break-words">
                            ₹{totalVendorAmount.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* COMMISSION DETAILS */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            Commission Details
                        </h2>

                        <p className="text-gray-500 text-sm sm:text-base mt-1">
                            All vendor commission records
                        </p>
                    </div>

                    {commissions.length === 0 ? (
                        <div className="p-6 sm:p-10 text-center">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                No Commission Records
                            </h2>

                            <p className="text-gray-500 text-sm sm:text-base mt-2">
                                Commission records will appear here after
                                successful orders.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* MOBILE CARDS */}
                            <div className="block lg:hidden divide-y divide-gray-200">
                                {commissions.map((commission) => {
                                    const isPaying =
                                        payingId === commission.id;

                                    return (
                                        <div
                                            key={commission.id}
                                            className="p-4 sm:p-6"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-gray-800">
                                                        Commission #
                                                        {commission.id}
                                                    </h3>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Order #
                                                        {commission.orderId}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`self-start px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusClasses(
                                                        commission.status
                                                    )}`}
                                                >
                                                    {commission.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-sm">
                                                <div>
                                                    <p className="text-gray-500">
                                                        Vendor
                                                    </p>
                                                    <p className="font-medium text-gray-800 break-words">
                                                        {commission.vendorName ||
                                                            "-"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-500">
                                                        Sale Amount
                                                    </p>
                                                    <p className="font-semibold text-gray-800">
                                                        ₹
                                                        {Number(
                                                            commission.saleAmount ||
                                                            0
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-500">
                                                        Commission Rate
                                                    </p>
                                                    <p className="font-medium text-gray-800">
                                                        {commission.commissionRate ??
                                                            0}
                                                        %
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-500">
                                                        Platform Commission
                                                    </p>
                                                    <p className="font-semibold text-green-600">
                                                        ₹
                                                        {Number(
                                                            commission.commissionAmount ||
                                                            0
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-500">
                                                        Vendor Amount
                                                    </p>
                                                    <p className="font-semibold text-purple-600">
                                                        ₹
                                                        {Number(
                                                            commission.vendorAmount ||
                                                            0
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-500">
                                                        Date
                                                    </p>
                                                    <p className="text-gray-700">
                                                        {commission.commissionDate
                                                            ? new Date(
                                                                commission.commissionDate
                                                            ).toLocaleString()
                                                            : "-"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                {commission.status ===
                                                "PAID" ||
                                                commission.status ===
                                                "CANCELLED" ? (
                                                    <span className="text-gray-400 text-sm">
                                                        No action required
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleMarkAsPaid(
                                                                commission.id
                                                            )
                                                        }
                                                        disabled={isPaying}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
                                                    >
                                                        {isPaying
                                                            ? "Marking..."
                                                            : "Mark as Paid"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* DESKTOP TABLE */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full min-w-[1100px]">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Commission ID
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Order ID
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Vendor
                                        </th>

                                        <th className="px-5 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Sale Amount
                                        </th>

                                        <th className="px-5 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Rate
                                        </th>

                                        <th className="px-5 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Platform Commission
                                        </th>

                                        <th className="px-5 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Vendor Amount
                                        </th>

                                        <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Status
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Date
                                        </th>

                                        <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            Action
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {commissions.map((commission) => {
                                        const isPaying =
                                            payingId === commission.id;

                                        return (
                                            <tr
                                                key={commission.id}
                                                className="border-t border-gray-200 hover:bg-gray-50 transition"
                                            >
                                                <td className="px-5 py-4 font-semibold whitespace-nowrap">
                                                    #{commission.id}
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    #{commission.orderId}
                                                </td>

                                                <td className="px-5 py-4 font-medium max-w-[180px] break-words">
                                                    {commission.vendorName ||
                                                        "-"}
                                                </td>

                                                <td className="px-5 py-4 text-right whitespace-nowrap">
                                                    ₹
                                                    {Number(
                                                        commission.saleAmount ||
                                                        0
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="px-5 py-4 text-right whitespace-nowrap">
                                                    {commission.commissionRate ??
                                                        0}
                                                    %
                                                </td>

                                                <td className="px-5 py-4 text-right font-semibold text-green-600 whitespace-nowrap">
                                                    ₹
                                                    {Number(
                                                        commission.commissionAmount ||
                                                        0
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="px-5 py-4 text-right font-semibold text-purple-600 whitespace-nowrap">
                                                    ₹
                                                    {Number(
                                                        commission.vendorAmount ||
                                                        0
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(
                                                                commission.status
                                                            )}`}
                                                        >
                                                            {commission.status ||
                                                                "-"}
                                                        </span>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                    {commission.commissionDate
                                                        ? new Date(
                                                            commission.commissionDate
                                                        ).toLocaleString()
                                                        : "-"}
                                                </td>

                                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                                    {commission.status ===
                                                    "PAID" ||
                                                    commission.status ===
                                                    "CANCELLED" ? (
                                                        <span className="text-gray-400 text-sm">
                                                                —
                                                            </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleMarkAsPaid(
                                                                    commission.id
                                                                )
                                                            }
                                                            disabled={
                                                                isPaying
                                                            }
                                                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition"
                                                        >
                                                            {isPaying
                                                                ? "Marking..."
                                                                : "Mark as Paid"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminCommissions;