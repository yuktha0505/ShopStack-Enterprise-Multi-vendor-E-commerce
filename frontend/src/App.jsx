import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import VendorDashboard from "./pages/VendorDashboard";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import Inventory from "./pages/Inventory";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import VendorOrders from "./pages/VendorOrders";
import OrderSuccess from "./pages/OrderSuccess";
import Notifications from "./pages/Notifications";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/vendor/dashboard"
                    element={
                        <ProtectedRoute>
                            <VendorDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/vendor/add-product"
                    element={
                        <ProtectedRoute>
                            <AddProduct />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/vendor/my-products"
                    element={
                        <ProtectedRoute>
                            <MyProducts />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/vendor/edit-product/:id"
                    element={
                        <ProtectedRoute>
                            <EditProduct />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/product/:id"
                    element={
                        <ProtectedRoute>
                            <ProductDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/inventory"
                    element={
                        <ProtectedRoute>
                            <Inventory />
                        </ProtectedRoute>
                    }
                />
                <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />

                <Route path="/my-products" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />

                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

                <Route
                    path="/my-orders"
                    element={<MyOrders />}
                />

                <Route path="/checkout" element={<Checkout />} />
                <Route
                    path="/vendor/orders"
                    element={<VendorOrders />}
                />
                <Route
                    path="/vendor/orders"
                    element={<VendorOrders />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                <Route
                    path="/order-success"
                    element={<OrderSuccess />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;