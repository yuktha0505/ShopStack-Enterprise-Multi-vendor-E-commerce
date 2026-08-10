import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AddProduct() {

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        discount: "",
        stock: "",
        category: "",
        imageUrl: ""
    });

    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

    };


    // Calculate final price
    const finalPrice =
        product.price && product.discount
            ? Number(product.price) -
            (Number(product.price) * Number(product.discount)) / 100
            : Number(product.price || 0);


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const productData = {
                ...product,
                price: Number(product.price),
                discount: Number(product.discount || 0),
                stock: Number(product.stock)
            };

            const response = await axios.post(
                "http://localhost:8080/api/products",
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data);

            setProduct({
                name: "",
                description: "",
                price: "",
                discount: "",
                stock: "",
                category: "",
                imageUrl: ""
            });

        } catch (error) {

            console.error(error);

            if (error.response) {
                alert(error.response.data);
            } else {
                alert("Failed to add product");
            }

        }

    };


    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <div className="max-w-3xl mx-auto pt-10 pb-10">

                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold text-blue-600 mb-8">
                        Add Product
                    </h1>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Product Name */}

                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3"
                        />


                        {/* Description */}

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={product.description}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3"
                        />


                        {/* Price */}

                        <div>

                            <label className="block font-semibold mb-2">
                                Product Price (₹)
                            </label>

                            <input
                                type="number"
                                name="price"
                                placeholder="Enter price"
                                value={product.price}
                                onChange={handleChange}
                                min="0"
                                required
                                className="w-full border rounded-lg p-3"
                            />

                        </div>


                        {/* Discount */}

                        <div>

                            <label className="block font-semibold mb-2">
                                Discount (%)
                            </label>

                            <input
                                type="number"
                                name="discount"
                                placeholder="Enter discount percentage"
                                value={product.discount}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="w-full border rounded-lg p-3"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                Enter a value between 0% and 100%.
                            </p>

                        </div>


                        {/* Final Price */}

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

                            <p className="text-gray-600">
                                Original Price
                            </p>

                            <p className="text-lg font-semibold">
                                ₹ {Number(product.price || 0).toFixed(2)}
                            </p>


                            <p className="text-gray-600 mt-2">
                                Discount
                            </p>

                            <p className="text-lg font-semibold text-red-600">
                                {Number(product.discount || 0)}%
                            </p>


                            <p className="text-gray-600 mt-2">
                                Final Price
                            </p>

                            <p className="text-2xl font-bold text-green-600">
                                ₹ {finalPrice.toFixed(2)}
                            </p>

                        </div>


                        {/* Stock */}

                        <div>

                            <label className="block font-semibold mb-2">
                                Stock Quantity
                            </label>

                            <input
                                type="number"
                                name="stock"
                                placeholder="Enter stock quantity"
                                value={product.stock}
                                onChange={handleChange}
                                min="0"
                                required
                                className="w-full border rounded-lg p-3"
                            />

                        </div>


                        {/* Category */}

                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={product.category}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />


                        {/* Image URL */}

                        <input
                            type="text"
                            name="imageUrl"
                            placeholder="Image URL"
                            value={product.imageUrl}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                        />


                        {/* Submit */}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Add Product
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default AddProduct;