import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);


    // =========================
    // FETCH PRODUCT
    // =========================

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost:8080/api/products/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log("Product:", response.data);

                setProduct(response.data);

            } catch (error) {

                console.error("Error loading product:", error);

            } finally {

                setLoading(false);

            }
        };

        fetchProduct();

    }, [id]);


    // =========================
    // ADD TO CART
    // =========================

    const handleAddToCart = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                alert("Please login first");

                navigate("/login");

                return;
            }


            const response = await axios.post(
                "http://localhost:8080/api/cart/add",
                {
                    productId: product.id,
                    quantity: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            console.log("Add to cart response:", response.data);

            alert("Product added to cart!");


        } catch (error) {

            console.error("Add to cart error:", error);

            if (error.response) {

                alert(error.response.data);

            } else {

                alert("Failed to add product to cart");

            }
        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100">

                <Navbar />

                <h2 className="text-center mt-10 text-xl">
                    Loading...
                </h2>

            </div>

        );
    }


    if (!product) {

        return (

            <div className="min-h-screen bg-gray-100">

                <Navbar />

                <h2 className="text-center mt-10 text-xl">
                    Product not found
                </h2>

            </div>

        );
    }


    // =========================
    // PRODUCT DETAILS
    // =========================

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />


            <div className="max-w-5xl mx-auto py-10 px-5">

                <div className="bg-white rounded-xl shadow-lg p-8 grid md:grid-cols-2 gap-10">


                    {/* IMAGE */}

                    <div>

                        {product.imageUrl ? (

                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-xl"
                            />

                        ) : (

                            <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">

                                <span className="text-gray-500">
                                    No Image Available
                                </span>

                            </div>

                        )}

                    </div>


                    {/* DETAILS */}

                    <div>

                        <h1 className="text-4xl font-bold">
                            {product.name}
                        </h1>


                        <p className="text-gray-500 mt-4">
                            {product.description}
                        </p>


                        <h2 className="text-3xl text-blue-600 font-bold mt-6">
                            ₹ {product.price}
                        </h2>


                        <p className="mt-4">
                            Category :
                            <b> {product.category}</b>
                        </p>


                        <p className="mt-2">
                            Seller :
                            <b> {product.vendorName}</b>
                        </p>


                        {/* STOCK */}

                        <p className="mt-2">

                            Stock :

                            <b className={
                                product.stock > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            }>

                                {product.stock > 0
                                    ? ` ${product.stock}`
                                    : " Out of Stock"
                                }

                            </b>

                        </p>


                        {/* QUANTITY */}

                        {product.stock > 0 && (

                            <div className="flex items-center gap-4 mt-6">

                                <span className="font-semibold">
                                    Quantity:
                                </span>


                                <button
                                    onClick={() =>
                                        setQuantity(
                                            Math.max(1, quantity - 1)
                                        )
                                    }
                                    className="bg-gray-200 px-4 py-2 rounded-lg font-bold"
                                >
                                    −
                                </button>


                                <span className="text-lg font-semibold">
                                    {quantity}
                                </span>


                                <button
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                product.stock,
                                                quantity + 1
                                            )
                                        )
                                    }
                                    className="bg-gray-200 px-4 py-2 rounded-lg font-bold"
                                >
                                    +
                                </button>

                            </div>

                        )}


                        {/* ADD TO CART */}

                        {product.stock > 0 ? (

                            <button
                                onClick={handleAddToCart}
                                className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                Add to Cart
                            </button>

                        ) : (

                            <button
                                disabled
                                className="w-full mt-8 bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed"
                            >
                                Out of Stock
                            </button>

                        )}


                        {/* GO TO CART */}

                        <button
                            onClick={() => navigate("/cart")}
                            className="w-full mt-3 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50"
                        >
                            View Cart
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default ProductDetails;