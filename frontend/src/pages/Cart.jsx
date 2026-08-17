import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Cart() {

    const navigate = useNavigate();

    const [cart, setCart] = useState({
        items: [],
        total: 0
    });

    const [loading, setLoading] = useState(true);


    // Fetch cart
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

            console.error("Error loading cart:", error);
            alert("Failed to load cart");

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchCart();
    }, []);


    // Increase quantity
    const increaseQuantity = async (cartItemId) => {

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8080/api/cart/increase/${cartItemId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchCart();

        } catch (error) {

            console.error("Increase quantity error:", error);

            if (error.response) {
                alert(
                    error.response.data?.message ||
                    error.response.data ||
                    "Failed to increase quantity"
                );
            } else {
                alert("Failed to increase quantity");
            }
        }
    };


    // Decrease quantity
    const decreaseQuantity = async (cartItemId) => {

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8080/api/cart/decrease/${cartItemId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchCart();

        } catch (error) {

            console.error("Decrease quantity error:", error);

            if (error.response) {
                alert(
                    error.response.data?.message ||
                    error.response.data ||
                    "Failed to decrease quantity"
                );
            } else {
                alert("Failed to decrease quantity");
            }
        }
    };


    // Remove item
    const removeItem = async (cartItemId) => {

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/api/cart/remove/${cartItemId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchCart();

        } catch (error) {

            console.error("Remove item error:", error);

            if (error.response) {
                alert(
                    error.response.data?.message ||
                    error.response.data ||
                    "Failed to remove item"
                );
            } else {
                alert("Failed to remove item");
            }
        }
    };


    // Loading
    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100">

                <Navbar />

                <h2 className="text-center mt-10 text-xl">
                    Loading cart...
                </h2>

            </div>

        );
    }


    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-6xl mx-auto py-10 px-5">

                <h1 className="text-3xl font-bold text-blue-600 mb-8">
                    My Cart
                </h1>


                {cart.items.length === 0 ? (

                    // Empty cart
                    <div className="bg-white rounded-xl shadow-lg p-10 text-center">

                        <h2 className="text-2xl font-semibold">
                            Your cart is empty
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Add some products to your cart.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Continue Shopping
                        </button>

                    </div>

                ) : (

                    <div className="grid lg:grid-cols-3 gap-8">


                        {/* Cart Items */}

                        <div className="lg:col-span-2 space-y-5">

                            {cart.items.map((item) => (

                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-lg p-5 flex flex-col md:flex-row gap-5"
                                >

                                    {/* Product Image */}

                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="w-full md:w-40 h-40 object-cover rounded-lg"
                                    />


                                    {/* Product Information */}

                                    <div className="flex-1">

                                        <h2 className="text-xl font-bold">
                                            {item.productName}
                                        </h2>


                                        <p className="text-blue-600 text-xl font-bold mt-2">
                                            ₹ {item.price}
                                        </p>


                                        <p className="text-gray-600 mt-2">
                                            Subtotal: ₹ {item.subtotal}
                                        </p>


                                        {/* Quantity */}

                                        <div className="flex items-center gap-4 mt-5">

                                            <button
                                                onClick={() =>
                                                    decreaseQuantity(item.id)
                                                }
                                                className="bg-gray-200 px-4 py-2 rounded-lg font-bold hover:bg-gray-300"
                                            >
                                                −
                                            </button>


                                            <span className="text-lg font-semibold">
                                                {item.quantity}
                                            </span>


                                            <button
                                                onClick={() =>
                                                    increaseQuantity(item.id)
                                                }
                                                className="bg-gray-200 px-4 py-2 rounded-lg font-bold hover:bg-gray-300"
                                            >
                                                +
                                            </button>

                                        </div>


                                        {/* Remove */}

                                        <button
                                            onClick={() =>
                                                removeItem(item.id)
                                            }
                                            className="mt-4 text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* Cart Summary */}

                        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">

                            <h2 className="text-2xl font-bold">
                                Order Summary
                            </h2>


                            <div className="border-t mt-5 pt-5">

                                <div className="flex justify-between text-lg">

                                    <span>
                                        Total
                                    </span>

                                    <span className="font-bold text-blue-600">
                                        ₹ {cart.total}
                                    </span>

                                </div>

                            </div>


                            {/* Checkout */}

                            <button
                                onClick={() => navigate("/checkout")}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700"
                            >
                                Proceed to Checkout
                            </button>


                            {/* Continue Shopping */}

                            <button
                                onClick={() => navigate("/")}
                                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg mt-3 hover:bg-gray-300"
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
}

export default Cart;