import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080";

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponFinalAmount, setCouponFinalAmount] = useState(null);
    const [couponMessage, setCouponMessage] = useState("");
    const [couponError, setCouponError] = useState("");

    const [loading, setLoading] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);

    const token = localStorage.getItem("token");

    // =========================================================
    // LOAD CART + ADDRESSES
    // =========================================================

    useEffect(() => {
        fetchCart();
        fetchAddresses();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get(
                `${API}/api/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCartItems(response.data);
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(
                `${API}/api/addresses`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAddresses(response.data);

            if (response.data.length > 0) {
                setSelectedAddress(response.data[0]);
            }
        } catch (error) {
            console.error("Error loading addresses:", error);
        }
    };

    // =========================================================
    // CALCULATE CART TOTAL
    // =========================================================

    const totalAmount = cartItems.reduce(
        (total, item) =>
            total +
            Number(item.product?.finalPrice || item.product?.price || 0) *
            Number(item.quantity || 1),
        0
    );

    const formatPrice = (amount) => {
        return `₹${Number(amount || 0).toFixed(2)}`;
    };

    // =========================================================
    // APPLY COUPON
    // =========================================================

    const handleApplyCoupon = async () => {

        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            setCouponMessage("");
            return;
        }

        try {

            setLoading(true);
            setCouponError("");
            setCouponMessage("");

            const response = await axios.post(
                `${API}/api/coupons/apply`,
                {
                    couponCode: couponCode.trim(),
                    cartAmount: totalAmount
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Coupon response:", response.data);

            const discount =
                Number(response.data.discountAmount || 0);

            const finalAmount =
                Number(response.data.finalAmount || totalAmount);

            setCouponDiscount(discount);
            setCouponFinalAmount(finalAmount);

            setCouponMessage(
                `Coupon applied successfully! You saved ${formatPrice(discount)}`
            );

        } catch (error) {

            console.error(
                "Coupon error:",
                error.response?.data || error
            );

            setCouponDiscount(0);
            setCouponFinalAmount(null);

            setCouponError(
                error.response?.data?.message ||
                error.response?.data ||
                "Invalid coupon"
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // REMOVE COUPON
    // =========================================================

    const handleRemoveCoupon = () => {

        setCouponCode("");
        setCouponDiscount(0);
        setCouponFinalAmount(null);
        setCouponMessage("");
        setCouponError("");
    };

    // =========================================================
    // FINAL PAYABLE AMOUNT
    // =========================================================

    const payableAmount =
        couponFinalAmount !== null
            ? Number(couponFinalAmount)
            : Number(totalAmount);

    // =========================================================
    // PLACE ORDER
    // =========================================================

    const handlePlaceOrder = async () => {

        if (!selectedAddress) {
            alert("Please select an address");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        try {

            setPlacingOrder(true);

            // -------------------------------------------------
            // RAZORPAY
            // -------------------------------------------------

            if (paymentMethod === "RAZORPAY") {

                // IMPORTANT:
                // Use payableAmount instead of totalAmount.
                // This makes Razorpay charge the discounted amount.

                const orderResponse = await axios.post(
                    `${API}/api/payment/create-order`,
                    {
                        amount: payableAmount
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                console.log(
                    "Razorpay order:",
                    orderResponse.data
                );

                const razorpayOrderId =
                    orderResponse.data.id;

                const options = {

                    key: orderResponse.data.key,

                    amount:
                    orderResponse.data.amount,

                    currency:
                        orderResponse.data.currency || "INR",

                    name: "ShopStack",

                    description:
                        "ShopStack Order",

                    order_id:
                    razorpayOrderId,

                    handler: async function (paymentResponse) {

                        try {

                            // -----------------------------------------
                            // CREATE SHOPSTACK ORDER AFTER PAYMENT
                            // -----------------------------------------

                            await axios.post(
                                `${API}/api/orders`,
                                {
                                    addressId:
                                    selectedAddress.id,

                                    paymentMethod:
                                    paymentMethod,

                                    paymentStatus:
                                        "PAID",

                                    razorpayPaymentId:
                                    paymentResponse.razorpay_payment_id,

                                    razorpayOrderId:
                                    paymentResponse.razorpay_order_id,

                                    couponCode:
                                        couponCode || null,

                                    couponDiscount:
                                    couponDiscount,

                                    finalAmount:
                                    payableAmount
                                },
                                {
                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,

                                        "Content-Type":
                                            "application/json"
                                    }
                                }
                            );

                            alert(
                                "Order placed successfully!"
                            );

                            window.location.href =
                                "/orders";

                        } catch (error) {

                            console.error(
                                "Order creation error:",
                                error.response?.data || error
                            );

                            alert(
                                "Payment succeeded, but order creation failed. Please contact support."
                            );
                        }
                    },

                    prefill: {
                        name:
                            localStorage.getItem("userName") || "",

                        email:
                            localStorage.getItem("userEmail") || ""
                    },

                    theme: {
                        color: "#2563eb"
                    }
                };

                const razorpay =
                    new window.Razorpay(options);

                razorpay.open();

                return;
            }

            // -------------------------------------------------
            // COD
            // -------------------------------------------------

            if (paymentMethod === "COD") {

                await axios.post(
                    `${API}/api/orders`,
                    {
                        addressId:
                        selectedAddress.id,

                        paymentMethod:
                            "COD",

                        paymentStatus:
                            "PENDING",

                        couponCode:
                            couponCode || null,

                        couponDiscount:
                        couponDiscount,

                        finalAmount:
                        payableAmount
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );

                alert(
                    "Order placed successfully!"
                );

                window.location.href =
                    "/orders";
            }

        } catch (error) {

            console.error(
                "Place order error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Failed to place order"
            );

        } finally {

            setPlacingOrder(false);
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ================================================= */}
                    {/* LEFT SIDE */}
                    {/* ================================================= */}

                    <div className="lg:col-span-2 space-y-6">

                        {/* ADDRESS */}

                        <div className="bg-white rounded-lg shadow p-6">

                            <h2 className="text-xl font-semibold mb-4">
                                Delivery Address
                            </h2>

                            {addresses.length === 0 ? (

                                <p className="text-gray-500">
                                    No addresses available.
                                </p>

                            ) : (

                                <div className="space-y-3">

                                    {addresses.map((address) => (

                                        <label
                                            key={address.id}
                                            className="flex items-start gap-3 border rounded-lg p-4 cursor-pointer"
                                        >

                                            <input
                                                type="radio"
                                                name="address"
                                                checked={
                                                    selectedAddress?.id ===
                                                    address.id
                                                }
                                                onChange={() =>
                                                    setSelectedAddress(
                                                        address
                                                    )
                                                }
                                            />

                                            <div>

                                                <p className="font-medium">
                                                    {address.name}
                                                </p>

                                                <p className="text-gray-600">
                                                    {address.addressLine1}
                                                </p>

                                                <p className="text-gray-600">
                                                    {address.city},{" "}
                                                    {address.state}{" "}
                                                    {address.pincode}
                                                </p>

                                            </div>

                                        </label>

                                    ))}

                                </div>

                            )}

                        </div>

                        {/* CART ITEMS */}

                        <div className="bg-white rounded-lg shadow p-6">

                            <h2 className="text-xl font-semibold mb-4">
                                Your Items
                            </h2>

                            {cartItems.length === 0 ? (

                                <p className="text-gray-500">
                                    Your cart is empty.
                                </p>

                            ) : (

                                <div className="space-y-4">

                                    {cartItems.map((item) => {

                                        const price =
                                            Number(
                                                item.product?.finalPrice ||
                                                item.product?.price ||
                                                0
                                            );

                                        const quantity =
                                            Number(
                                                item.quantity || 1
                                            );

                                        return (

                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center border-b pb-4"
                                            >

                                                <div>

                                                    <p className="font-medium">
                                                        {
                                                            item.product?.name
                                                        }
                                                    </p>

                                                    <p className="text-gray-500">
                                                        Qty: {quantity}
                                                    </p>

                                                </div>

                                                <p className="font-semibold">
                                                    {formatPrice(
                                                        price * quantity
                                                    )}
                                                </p>

                                            </div>

                                        );
                                    })}

                                </div>

                            )}

                        </div>

                        {/* ================================================= */}
                        {/* COUPON */}
                        {/* ================================================= */}

                        <div className="bg-white rounded-lg shadow p-6">

                            <h2 className="text-xl font-semibold mb-4">
                                Apply Coupon
                            </h2>

                            <div className="flex gap-3">

                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="Enter coupon code"
                                    className="flex-1 border rounded-lg px-4 py-3"
                                    disabled={
                                        couponFinalAmount !== null
                                    }
                                />

                                {couponFinalAmount === null ? (

                                    <button
                                        onClick={
                                            handleApplyCoupon
                                        }
                                        disabled={loading}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                                    >
                                        {loading
                                            ? "Applying..."
                                            : "Apply"}
                                    </button>

                                ) : (

                                    <button
                                        onClick={
                                            handleRemoveCoupon
                                        }
                                        className="bg-red-500 text-white px-6 py-3 rounded-lg"
                                    >
                                        Remove
                                    </button>

                                )}

                            </div>

                            {couponMessage && (

                                <p className="text-green-600 mt-3">
                                    {couponMessage}
                                </p>

                            )}

                            {couponError && (

                                <p className="text-red-600 mt-3">
                                    {couponError}
                                </p>

                            )}

                        </div>

                        {/* ================================================= */}
                        {/* PAYMENT METHOD */}
                        {/* ================================================= */}

                        <div className="bg-white rounded-lg shadow p-6">

                            <h2 className="text-xl font-semibold mb-4">
                                Payment Method
                            </h2>

                            <div className="space-y-3">

                                <label className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="RAZORPAY"
                                        checked={
                                            paymentMethod ===
                                            "RAZORPAY"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    Razorpay
                                </label>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={
                                            paymentMethod ===
                                            "COD"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    Cash on Delivery
                                </label>

                            </div>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* ORDER SUMMARY */}
                    {/* ================================================= */}

                    <div>

                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">

                            <h2 className="text-xl font-semibold mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4">

                                <div className="flex justify-between">
                                    <span>
                                        Subtotal
                                    </span>

                                    <span>
                                        {formatPrice(
                                            totalAmount
                                        )}
                                    </span>
                                </div>

                                {couponDiscount > 0 && (

                                    <div className="flex justify-between text-green-600">

                                        <span>
                                            Coupon Discount
                                        </span>

                                        <span>
                                            - {formatPrice(
                                            couponDiscount
                                        )}
                                        </span>

                                    </div>

                                )}

                                <div className="flex justify-between">
                                    <span>
                                        Delivery
                                    </span>

                                    <span>
                                        FREE
                                    </span>
                                </div>

                                <hr />

                                <div className="flex justify-between text-xl font-bold">

                                    <span>
                                        Total
                                    </span>

                                    <span className="text-blue-600">

                                        {formatPrice(
                                            payableAmount
                                        )}

                                    </span>

                                </div>

                            </div>

                            <button
                                onClick={
                                    handlePlaceOrder
                                }
                                disabled={
                                    placingOrder ||
                                    cartItems.length === 0 ||
                                    !selectedAddress
                                }
                                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-lg font-semibold disabled:bg-gray-400"
                            >

                                {placingOrder
                                    ? "Processing..."
                                    : `Pay ${formatPrice(
                                        payableAmount
                                    )}`}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Checkout;