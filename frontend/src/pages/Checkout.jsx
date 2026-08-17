import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AddressSection from "../components/AddressSection";

function Checkout() {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);

    const [selectedAddress, setSelectedAddress] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("ONLINE");

    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);


    // --------------------------------------------------
    // FETCH CART
    // --------------------------------------------------

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:8080/api/cart",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setCart(response.data);

            } catch (error) {

                console.error(error);

                alert("Failed to load cart");

            } finally {

                setLoading(false);

            }
        };


        fetchCart();

    }, []);


    // --------------------------------------------------
    // CALCULATE TOTAL
    // --------------------------------------------------

    const getTotalAmount = () => {

        if (!cart) {
            return 0;
        }

        // If your backend already returns total
        if (cart.total !== undefined && cart.total !== null) {
            return Number(cart.total);
        }

        // Fallback calculation
        if (cart.items && Array.isArray(cart.items)) {

            return cart.items.reduce(
                (total, item) => {

                    const price =
                        item.finalPrice ??
                        item.price ??
                        0;

                    const quantity =
                        item.quantity ??
                        1;

                    return total + Number(price) * Number(quantity);

                },
                0
            );
        }

        return 0;
    };


    const totalAmount = getTotalAmount();


    // --------------------------------------------------
    // FORMAT CURRENCY
    // --------------------------------------------------

    const formatPrice = (price) => {

        return Number(price).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        });

    };


    // --------------------------------------------------
    // CREATE SHOPSTACK ORDER
    // --------------------------------------------------

    const createShopStackOrder = async (
        razorpayPaymentId = null,
        razorpayOrderId = null
    ) => {

        const token = localStorage.getItem("token");

        /*
         * This is the information we send to your
         * existing OrderController.
         *
         * We keep addressId so the backend can associate
         * the order with the selected saved address.
         */

        const orderData = {

            addressId: selectedAddress.id,

            paymentMethod: paymentMethod,

            paymentStatus:
                paymentMethod === "ONLINE"
                    ? "PAID"
                    : "PENDING",

            razorpayPaymentId:
            razorpayPaymentId,

            razorpayOrderId:
            razorpayOrderId

        };


        const response = await axios.post(
            "http://localhost:8080/api/orders",
            orderData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    };


    // --------------------------------------------------
    // RAZORPAY PAYMENT
    // --------------------------------------------------

    const startRazorpayPayment = async () => {

        try {

            setPaymentLoading(true);

            const token = localStorage.getItem("token");


            // ------------------------------------------
            // 1. CREATE RAZORPAY ORDER
            // ------------------------------------------

            const orderResponse = await axios.post(
                "http://localhost:8080/api/payment/create-order",
                {
                    amount: totalAmount
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );


            /*
             * Your backend currently returns:
             *
             * return order.toString();
             *
             * Therefore Axios receives a JSON string.
             */

            let razorpayOrder = orderResponse.data;

            if (typeof razorpayOrder === "string") {

                razorpayOrder =
                    JSON.parse(razorpayOrder);

            }


            console.log(
                "Razorpay Order:",
                razorpayOrder
            );


            // ------------------------------------------
            // 2. RAZORPAY CHECKOUT OPTIONS
            // ------------------------------------------

            const options = {

                key: "rzp_test_TPYmZHtZ94GGNi",

                amount: razorpayOrder.amount,

                currency: razorpayOrder.currency,

                name: "ShopStack",

                description: "ShopStack Order",

                order_id: razorpayOrder.id,


                // --------------------------------------
                // PAYMENT SUCCESS
                // --------------------------------------

                handler: async function (response) {

                    try {

                        console.log(
                            "Razorpay response:",
                            response
                        );


                        // ----------------------------------
                        // 3. VERIFY PAYMENT
                        // ----------------------------------

                        const verificationResponse =
                            await axios.post(

                                "http://localhost:8080/api/payment/verify",

                                {
                                    razorpayOrderId:
                                    response.razorpay_order_id,

                                    razorpayPaymentId:
                                    response.razorpay_payment_id,

                                    razorpaySignature:
                                    response.razorpay_signature
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


                        console.log(
                            "Payment verification:",
                            verificationResponse.data
                        );


                        // ----------------------------------
                        // 4. CREATE SHOPSTACK ORDER
                        // ----------------------------------

                        await createShopStackOrder(

                            response.razorpay_payment_id,

                            response.razorpay_order_id

                        );


                        alert(
                            "Payment successful! Order placed successfully."
                        );


                        navigate("/order-success");

                    } catch (error) {

                        console.error(
                            "Payment verification error:",
                            error
                        );

                        alert(
                            error.response?.data ||
                            "Payment verification failed"
                        );

                    } finally {

                        setPaymentLoading(false);

                    }
                },


                // --------------------------------------
                // PAYMENT FAILED
                // --------------------------------------

                modal: {

                    ondismiss: function () {

                        setPaymentLoading(false);

                    }

                },


                prefill: {

                    name:
                        selectedAddress?.fullName || "",

                    contact:
                        selectedAddress?.phone || ""

                },


                notes: {

                    addressId:
                        String(selectedAddress.id)

                },


                theme: {

                    color: "#2563eb"

                }

            };


            // ------------------------------------------
            // 5. OPEN RAZORPAY
            // ------------------------------------------

            if (!window.Razorpay) {

                throw new Error(
                    "Razorpay SDK not loaded"
                );

            }


            const razorpay =
                new window.Razorpay(options);


            razorpay.on(
                "payment.failed",
                function (response) {

                    console.error(
                        "Payment failed:",
                        response.error
                    );

                    alert(
                        "Payment failed: " +
                        response.error.description
                    );

                    setPaymentLoading(false);

                }
            );


            razorpay.open();


        } catch (error) {

            console.error(
                "Razorpay error:",
                error
            );

            alert(
                error.response?.data ||
                error.message ||
                "Unable to start payment"
            );

            setPaymentLoading(false);

        }
    };


    // --------------------------------------------------
    // COD ORDER
    // --------------------------------------------------

    const handleCashOnDelivery = async () => {

        try {

            setPaymentLoading(true);

            await createShopStackOrder();

            alert(
                "Order placed successfully!"
            );

            navigate("/order-success");

        } catch (error) {

            console.error(
                "COD order error:",
                error
            );

            alert(
                error.response?.data ||
                "Failed to place order"
            );

        } finally {

            setPaymentLoading(false);

        }
    };


    // --------------------------------------------------
    // MAIN CHECKOUT HANDLER
    // --------------------------------------------------

    const handlePlaceOrder = async () => {

        // ----------------------------------------------
        // ADDRESS VALIDATION
        // ----------------------------------------------

        if (!selectedAddress) {

            alert(
                "Please select a delivery address"
            );

            return;
        }


        // ----------------------------------------------
        // CART VALIDATION
        // ----------------------------------------------

        if (!cart || totalAmount <= 0) {

            alert(
                "Your cart is empty"
            );

            return;
        }


        // ----------------------------------------------
        // PAYMENT METHOD
        // ----------------------------------------------

        if (paymentMethod === "ONLINE") {

            await startRazorpayPayment();

        } else {

            await handleCashOnDelivery();

        }

    };


    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100">

                <Navbar />

                <div className="flex justify-center items-center h-96">

                    <p className="text-xl font-semibold">
                        Loading checkout...
                    </p>

                </div>

            </div>

        );
    }


    // --------------------------------------------------
    // EMPTY CART
    // --------------------------------------------------

    if (!cart || !cart.items || cart.items.length === 0) {

        return (

            <div className="min-h-screen bg-gray-100">

                <Navbar />

                <div className="flex flex-col justify-center items-center h-96">

                    <h2 className="text-2xl font-bold">
                        Your cart is empty
                    </h2>

                    <button
                        onClick={() => navigate("/products")}
                        className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>

        );
    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />


            <div className="max-w-7xl mx-auto p-6">


                {/* PAGE TITLE */}

                <h1 className="text-3xl font-bold text-blue-600 mb-8">

                    Checkout

                </h1>


                <div className="grid lg:grid-cols-2 gap-8">


                    {/* ==================================
                        LEFT SIDE
                    ================================== */}

                    <div className="space-y-8">


                        {/* ADDRESS */}

                        <AddressSection
                            selectedAddress={
                                selectedAddress
                            }
                            setSelectedAddress={
                                setSelectedAddress
                            }
                        />


                        {/* PAYMENT */}

                        <div className="bg-white rounded-xl shadow-lg p-6">

                            <h2 className="text-2xl font-bold mb-5">

                                Payment Method

                            </h2>


                            {/* ONLINE PAYMENT */}

                            <label
                                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer mb-4 ${
                                    paymentMethod === "ONLINE"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                }`}
                            >

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="ONLINE"
                                    checked={
                                        paymentMethod === "ONLINE"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <div>

                                    <p className="font-semibold">
                                        Online Payment
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Pay securely using Razorpay
                                    </p>

                                </div>

                            </label>


                            {/* COD */}

                            <label
                                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer ${
                                    paymentMethod === "COD"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                }`}
                            >

                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={
                                        paymentMethod === "COD"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                <div>

                                    <p className="font-semibold">
                                        Cash on Delivery
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Pay when your order arrives
                                    </p>

                                </div>

                            </label>

                        </div>

                    </div>


                    {/* ==================================
                        RIGHT SIDE
                    ================================== */}

                    <div>

                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-5">


                            <h2 className="text-2xl font-bold mb-6">

                                Order Summary

                            </h2>


                            {/* CART ITEMS */}

                            <div className="space-y-5">

                                {cart.items.map((item) => {

                                    const product =
                                        item.product || item;

                                    const price =
                                        item.finalPrice ??
                                        product.finalPrice ??
                                        item.price ??
                                        product.price ??
                                        0;

                                    const quantity =
                                        item.quantity ?? 1;


                                    return (

                                        <div
                                            key={
                                                item.id ||
                                                product.id
                                            }
                                            className="flex gap-4 border-b pb-4"
                                        >

                                            <img
                                                src={
                                                    product.imageUrl ||
                                                    item.imageUrl
                                                }
                                                alt={
                                                    product.name ||
                                                    item.name
                                                }
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />


                                            <div className="flex-1">

                                                <h3 className="font-semibold">

                                                    {
                                                        product.name ||
                                                        item.name
                                                    }

                                                </h3>


                                                <p className="text-gray-500">

                                                    Qty: {quantity}

                                                </p>


                                                <p className="font-semibold">

                                                    {formatPrice(
                                                        Number(price) *
                                                        Number(quantity)
                                                    )}

                                                </p>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>


                            {/* TOTAL */}

                            <div className="border-t mt-6 pt-5">

                                <div className="flex justify-between text-lg">

                                    <span>
                                        Subtotal
                                    </span>

                                    <span>
                                        {formatPrice(
                                            totalAmount
                                        )}
                                    </span>

                                </div>


                                <div className="flex justify-between text-lg mt-2">

                                    <span>
                                        Delivery
                                    </span>

                                    <span className="text-green-600">

                                        FREE

                                    </span>

                                </div>


                                <div className="flex justify-between text-2xl font-bold mt-5">

                                    <span>
                                        Total
                                    </span>

                                    <span className="text-blue-600">

                                        {formatPrice(
                                            totalAmount
                                        )}

                                    </span>

                                </div>

                            </div>


                            {/* SELECTED ADDRESS PREVIEW */}

                            {selectedAddress && (

                                <div className="mt-6 bg-gray-50 rounded-lg p-4">

                                    <p className="font-bold mb-2">

                                        Delivering to:

                                    </p>

                                    <p className="font-semibold">

                                        {selectedAddress.fullName}

                                    </p>

                                    <p className="text-gray-600">

                                        {selectedAddress.addressLine}

                                    </p>

                                    <p className="text-gray-600">

                                        {selectedAddress.city},{" "}
                                        {selectedAddress.state}{" "}
                                        -{" "}
                                        {selectedAddress.pincode}

                                    </p>

                                    <p className="text-gray-600">

                                        Phone:{" "}
                                        {selectedAddress.phone}

                                    </p>

                                </div>

                            )}


                            {/* PLACE ORDER */}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={paymentLoading}
                                className={`w-full mt-6 py-4 rounded-lg text-white font-bold text-lg ${
                                    paymentLoading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >

                                {paymentLoading

                                    ? "Processing..."

                                    : paymentMethod === "ONLINE"

                                        ? `Pay ${formatPrice(totalAmount)}`

                                        : `Place Order - ${formatPrice(totalAmount)}`

                                }

                            </button>


                            <p className="text-center text-sm text-gray-500 mt-3">

                                Your payment information is securely
                                processed by Razorpay.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Checkout;