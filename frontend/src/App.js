import Signup from "./pages/Signup";
import "./App.css";
import Login from "./pages/Login";
import ForgetPwd from "./pages/ForgetPwd";
import Dashboard from "./pages/Dashboard";
import Users from "./components/Users";
import Products from "./components/Products";
import Analytics from "./components/Analytics";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ProducstList from "./pages/ProductsList";
import FavoriteProducts from "./pages/FavoriteProducts";
import OrderConfirmation from "./pages/OrderConfirmation";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./components/Checkout";
import Cart from "./pages/Cart";
import Footer from "./pages/Footer";
import Main from "./pages/Main";
import AccountSettings from "./pages/AccountSettings";
import Order from "./pages/Order";
import SellerChatDashboard from "./pages/SellerChatDashboard";
import UserChatDashboard from "./pages/UserChatDashboard";
// const PrivateRoute = ({ children }) => {
//   const { user } = React.useContext(AuthContext);
//   return user ? children : <Navigate to="/login" />;
// };
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div style={{ marginTop: "80px" }}>
          {/* To prevent content from going under header */}
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgetpwd" element={<ForgetPwd />} />
            <Route path="/productList" element={<ProducstList />} />
            <Route path="/favorites" element={<FavoriteProducts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/accountsettings" element={<AccountSettings />} />
            <Route path="/chatseller" element={<SellerChatDashboard />} />
            <Route path="/chatuser" element={<UserChatDashboard />} />
            
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="users" element={<Users />} />
              <Route path="products" element={<Products />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
