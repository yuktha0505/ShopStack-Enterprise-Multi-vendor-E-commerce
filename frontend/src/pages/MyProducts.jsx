import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function MyProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/products/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("My Products:", response.data);

            setProducts(response.data);

        } catch (error) {

            console.error(error);
            alert("Failed to load products");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this product?")) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/api/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProducts(
                products.filter(product => product.id !== id)
            );

            alert("Product Deleted Successfully");

        } catch (error) {

            console.error(error);
            alert("Failed to delete product");

        }
    };

    if (loading) {

        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />

                <div className="text-center mt-10">
                    <h2 className="text-xl">
                        Loading Products...
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
                    My Products
                </h1>

                {products.length === 0 ? (

                    <div className="bg-white rounded-xl shadow-lg p-10 text-center">

                        <h2 className="text-xl font-semibold">
                            No Products Found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Add a product to see it here.
                        </p>

                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {products.map((product) => (

                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden"
                            >

                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />

                                <div className="p-5">

                                    <h2 className="text-xl font-bold">
                                        {product.name}
                                    </h2>

                                    <p className="text-gray-600 mt-2">
                                        {product.description}
                                    </p>


                                    {/* PRICE */}

                                    {product.discount > 0 ? (

                                        <div className="mt-4">

                                            <div className="flex items-center gap-2">

                                                <span className="text-gray-400 line-through">
                                                    ₹ {product.price}
                                                </span>

                                                <span className="text-red-600 font-semibold">
                                                    {product.discount}% OFF
                                                </span>

                                            </div>

                                            <p className="text-green-600 text-2xl font-bold mt-1">
                                                ₹ {product.finalPrice}
                                            </p>

                                        </div>

                                    ) : (

                                        <p className="text-blue-600 text-2xl font-bold mt-4">
                                            ₹ {product.price}
                                        </p>

                                    )}


                                    {/* STOCK */}

                                    <p className="mt-3">
                                        <span className="font-semibold">
                                            Stock:
                                        </span>{" "}
                                        {product.stock}
                                    </p>


                                    {/* CATEGORY */}

                                    <p className="mt-1">
                                        <span className="font-semibold">
                                            Category:
                                        </span>{" "}
                                        {product.category}
                                    </p>


                                    {/* BUTTONS */}

                                    <div className="flex gap-3 mt-5">

                                        <Link
                                            to={`/vendor/edit-product/${product.id}`}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default MyProducts;