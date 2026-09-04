import { useEffect, useState } from "react";
import axios from "axios";

function AdminCommissions() {

    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCommissions = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/admin/commissions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Admin Commissions:", response.data);

            setCommissions(response.data);

        } catch (error) {

            console.error(
                "Error loading commissions:",
                error
            );

            alert(
                error.response?.data ||
                "Failed to load commission information"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchCommissions();

    }, []);


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


    if (loading) {

        return (
            <div className="min-h-screen bg-gray-100">

                <div className="bg-blue-700 text-white py-8">

                    <div className="max-w-7xl mx-auto px-6">

                        <h1 className="text-4xl font-bold">
                            Commission Management
                        </h1>

                    </div>

                </div>

                <div className="flex justify-center items-center h-80">

                    <p className="text-xl font-semibold">
                        Loading commissions...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}

            <div className="bg-blue-700 text-white py-8">

                <div className="max-w-7xl mx-auto px-6">

                    <h1 className="text-4xl font-bold">
                        Commission Management
                    </h1>

                    <p className="mt-2 text-blue-100">
                        Monitor platform commissions and vendor payouts
                    </p>

                </div>

            </div>


            {/* CONTENT */}

            <div className="max-w-7xl mx-auto px-6 py-10">


                {/* SUMMARY */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">


                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Commission Records
                        </p>

                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {commissions.length}
                        </p>

                    </div>


                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Platform Commission
                        </p>

                        <p className="text-3xl font-bold text-green-600 mt-2">
                            ₹{totalCommission.toFixed(2)}
                        </p>

                    </div>


                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Vendor Payout
                        </p>

                        <p className="text-3xl font-bold text-purple-600 mt-2">
                            ₹{totalVendorAmount.toFixed(2)}
                        </p>

                    </div>

                </div>


                {/* TABLE */}

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <div className="p-6 border-b">

                        <h2 className="text-2xl font-bold">
                            Commission Details
                        </h2>

                        <p className="text-gray-500 mt-1">
                            All vendor commission records
                        </p>

                    </div>


                    {commissions.length === 0 ? (

                        <div className="p-10 text-center">

                            <h2 className="text-xl font-bold">
                                No Commission Records
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Commission records will appear here
                                after successful orders.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-4 text-left">
                                        Commission ID
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Order ID
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Vendor
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Sale Amount
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Rate
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Platform Commission
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Vendor Amount
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Date
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {commissions.map((commission) => (

                                    <tr
                                        key={commission.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4 font-semibold">
                                            #{commission.id}
                                        </td>


                                        <td className="px-6 py-4">
                                            #{commission.orderId}
                                        </td>


                                        <td className="px-6 py-4 font-medium">
                                            {commission.vendorName}
                                        </td>


                                        <td className="px-6 py-4 text-right">
                                            ₹{Number(
                                            commission.saleAmount
                                        ).toFixed(2)}
                                        </td>


                                        <td className="px-6 py-4 text-right">
                                            {commission.commissionRate}%
                                        </td>


                                        <td className="px-6 py-4 text-right font-semibold text-green-600">
                                            ₹{Number(
                                            commission.commissionAmount
                                        ).toFixed(2)}
                                        </td>


                                        <td className="px-6 py-4 text-right font-semibold text-purple-600">
                                            ₹{Number(
                                            commission.vendorAmount
                                        ).toFixed(2)}
                                        </td>


                                        <td className="px-6 py-4 text-center">

                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                                                    {commission.status}

                                                </span>

                                        </td>


                                        <td className="px-6 py-4 text-sm text-gray-600">

                                            {commission.commissionDate
                                                ? new Date(
                                                    commission.commissionDate
                                                ).toLocaleString()
                                                : "-"
                                            }

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default AdminCommissions;