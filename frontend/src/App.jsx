import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import NotFound from './Pages/NotFound';
import { RequireAuth, RequireAdmin } from './Components/RouteGuards/RouteGuards';

// Pages are code-split so the login page loads fast.
const AdAuctionProductBids = lazy(() => import('./Pages/AdAuctionProductBids'));
const AdminAddProductPage = lazy(() => import('./Pages/AdminAddProductPage'));
const AdminAllProductPage = lazy(() => import('./Pages/AdminAllProductPage'));
const AdminCreateAuction = lazy(() => import('./Pages/AdminCreateAuction'));
const AdminDashboard = lazy(() => import('./Pages/AdminDashboard'));
const AdminViewAuctionPage = lazy(() => import('./Pages/AdminViewAuctionPage'));
const AllUsers = lazy(() => import('./Pages/AllUsers'));
const AuctionPast = lazy(() => import('./Pages/AuctionPast'));
const AuctionUpcoming = lazy(() => import('./Pages/AuctionUpcoming'));
const AuctionWinProducts = lazy(() => import('./Pages/AuctionWinProducts'));
const AuctionsAll = lazy(() => import('./Pages/AuctionsAll'));
const Favourites = lazy(() => import('./Pages/Favourites'));
const Home = lazy(() => import('./Pages/Home'));
const OneAuction = lazy(() => import('./Pages/OneAuction'));
const OngoingAucAdmin = lazy(() => import('./Pages/OngoingAucadmin'));
const OrderDetailsAdmin = lazy(() => import('./Pages/OrderDetailsAdmin'));
const OrderList = lazy(() => import('./Pages/OrderList'));
const OrderStatus = lazy(() => import('./Pages/OrderStatus'));
const OrderlistAdmin = lazy(() => import('./Pages/OrderlistAdmin'));
const PastAuctionsPage = lazy(() => import('./Pages/PastAuctionspage'));
const PaymentFail = lazy(() => import('./Pages/PaymentFail'));
const PaymentSuccess = lazy(() => import('./Pages/PaymentSuccess'));
const ReviewAddProductPage = lazy(() => import('./Pages/ReviewAddProductPage'));
const UserProfilePage = lazy(() => import('./Pages/UserProfilepage'));
const UserProfilePageAdmin = lazy(() => import('./Pages/UserProfilePageAdmin'));
const ViewAucReqPage = lazy(() => import('./Pages/ViewAucReqPage'));
const ViewProduct = lazy(() => import('./Pages/ViewProduct'));
const EditProductPageAd = lazy(() => import('./Pages/EditProductPageAd'));
const ViewCart = lazy(() => import('./Pages/ViewCart'));
const ViewSellRequestPage = lazy(() => import('./Pages/ViewSellRequestPage'));
const Wishlist = lazy(() => import('./Pages/Wishlist'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="page-loading">Loading…</div>}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          {/* Signed-in users */}
          <Route element={<RequireAuth />}>
            <Route path='/home/:userId' element={<Home />} />
            <Route path='/profile/:userId' element={<UserProfilePage />} />
            <Route path='/viewcart/:userId' element={<ViewCart />} />
            <Route path='/orderlist/:userId' element={<OrderList />} />
            <Route path='/orderstatus/:userId/:orderId' element={<OrderStatus />} />
            <Route path='/auction/upcoming/:userId/:auctionId' element={<AuctionUpcoming />} />
            <Route path='/auction/ongoing/:userId/:auctionId' element={<OneAuction />} />
            <Route path='/auction/completed/:userId/:auctionId' element={<AuctionPast />} />
            <Route path='/auctionsall/:userId' element={<AuctionsAll />} />
            <Route path='/auction/payProducts/:userId/:auctionId' element={<AuctionWinProducts />} />
            <Route path='/payment/success/:transId' element={<PaymentSuccess />} />
            <Route path='/payment/fail/:transId' element={<PaymentFail />} />
            <Route path='/wishlist/:userId' element={<Wishlist />} />
            <Route path='/favourites/:userId' element={<Favourites />} />
            {/* keep last: matches any /<category>/<userId>/<productId> */}
            <Route path='/:category/:userId/:productId' element={<ViewProduct />} />
          </Route>

          {/* Admin only */}
          <Route element={<RequireAdmin />}>
            <Route path='/editproduct/:productId' element={<EditProductPageAd />} />
            <Route path='/admin/createauction' element={<AdminCreateAuction />} />
            <Route path='/admin/viewprofile/:userId' element={<UserProfilePageAdmin />} />
            <Route path='/admin/viewauctions/upcoming/:auctionId/viewrequests' element={<ViewAucReqPage />} />
            <Route path='/admin/orderlist' element={<OrderlistAdmin />} />
            <Route path='/admin/orderlist/order-details/:orderId' element={<OrderDetailsAdmin />} />
            <Route path='/admin/allproducts' element={<AdminAllProductPage />} />
            <Route path='/admin/allproducts/addplant' element={<AdminAddProductPage />} />
            <Route path='/admin/viewauctions' element={<AdminViewAuctionPage />} />
            <Route path='/admin/viewauctions/:catagory/:auctionId' element={<PastAuctionsPage />} />
            <Route path='/admin/viewauctions/ongoing/:auctionId' element={<OngoingAucAdmin />} />
            <Route path='/admin/viewsellrequests' element={<ViewSellRequestPage />} />
            <Route path='/admin/viewsellrequests/review' element={<ReviewAddProductPage />} />
            <Route path='/auction/:auctionId/:productId/bids' element={<AdAuctionProductBids />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/allusers' element={<AllUsers />} />
          </Route>

          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
