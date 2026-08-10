import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function ProductDetails() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

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

                console.log("Product received:", response.data);

                setProduct(response.data);

            } catch (error) {

                console.error("Error loading product:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchProduct();

    }, [id]);


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

                <h2 className="text-center mt-10 text-xl text-red-600">
                    Product not found
                </h2>

            </div>
        );

    }


    const isOutOfStock = product.stock <= 0;

    const hasDiscount =
        product.discount != null &&
        product.discount > 0;


    const addToCart = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                alert("Please login to add products to cart");
                return;

            }


            if (isOutOfStock) {

                alert("Product is Out of Stock");
                return;

            }


            const response = await axios.post(
                "http://localhost:8080/api/cart/add",
                {
                    productId: product.id,
                    quantity: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            alert(response.data);

        } catch (error) {

            console.error("Add to cart error:", error);

            if (error.response) {
                alert(error.response.data);
            } else {
                alert("Failed to add product to cart");
            }

        }

    };


    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-5xl mx-auto py-10 px-5">

                <div className="bg-white rounded-xl shadow-lg p-8 grid md:grid-cols-2 gap-10">


                    {/* Product Image */}

                    <div>

                        {product.imageUrl ? (

                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-xl"
                            />

                        ) : (

                            <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                                No Image
                            </div>

                        )}

                    </div>


                    {/* Product Information */}

                    <div>

                        <h1 className="text-4xl font-bold">
                            {product.name}
                        </h1>


                        <p className="text-gray-500 mt-4">
                            {product.description}
                        </p>


                        {/* Pricing */}

                        <div className="mt-6">

                            {hasDiscount ? (

                                <>

                                    <div className="flex items-center gap-3">

                                        <span className="text-gray-500 text-xl line-through">
                                            ₹ {product.price}
                                        </span>

                                        <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                                            {product.discount}% OFF
                                        </span>

                                    </div>


                                    <h2 className="text-4xl text-green-600 font-bold mt-3">
                                        ₹ {product.finalPrice}
                                    </h2>

                                </>

                            ) : (

                                <h2 className="text-4xl text-blue-600 font-bold">
                                    ₹ {product.finalPrice ?? product.price}
                                </h2>

                            )}

                        </div>


                        {/* Category */}

                        <p className="mt-6">

                            Category :

                            <b>
                                {" "}
                                {product.category || "Not specified"}
                            </b>

                        </p>


                        {/* Seller */}

                        <p className="mt-2">

                            Seller :

                            <b>
                                {" "}
                                {product.vendorName}
                            </b>

                        </p>


                        {/* Stock */}

                        <div className="mt-4">

                            {isOutOfStock ? (

                                <p className="text-red-600 font-bold text-lg">
                                    Out of Stock
                                </p>

                            ) : (

                                <p className="text-green-600 font-semibold">
                                    {product.stock} items available
                                </p>

                            )}

                        </div>


                        {/* Add To Cart */}

                        <button
                            onClick={addToCart}
                            disabled={isOutOfStock}
                            className={`w-full mt-6 py-3 rounded-lg text-white font-semibold ${
                                isOutOfStock
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >

                            {isOutOfStock
                                ? "Out of Stock"
                                : "Add to Cart"}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ProductDetails;