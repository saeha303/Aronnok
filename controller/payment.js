const User = require("../models/user");
const { Auction, AuctionProduct, RequestedAuctionProduct } = require('../models/auction');
const { SellProduct } = require('../models/sell');
const mongoose = require("mongoose");
const SSLCommerzPayment = require('sslcommerz-lts');

// SSLCommerz credentials come from the environment (see .env.example).
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true'; // false = sandbox

// Public URL of the deployed app. Frontend and API share one origin on Vercel,
// so the API lives under `${APP_URL}/api` and pages under `${APP_URL}/...`.
const APP_URL = (process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '');

// Every payment needs its own transaction id.
const newTransactionId = () => new mongoose.Types.ObjectId().toString();

const gatewayUrls = (tran_id, successPath = `/api/payment/success/${tran_id}`) => ({
  tran_id,
  success_url: `${APP_URL}${successPath}`,
  fail_url: `${APP_URL}/api/payment/fail/${tran_id}`,
  cancel_url: `${APP_URL}/api/payment/fail/${tran_id}`,
  ipn_url: `${APP_URL}/api/payment/ipn`,
});

const startPayment = (data, res) => {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  return sslcz.init(data)
    .then(apiResponse => {
      if (!apiResponse.GatewayPageURL) {
        console.error('SSLCommerz init failed:', apiResponse.failedreason || apiResponse);
        return res.status(502).json({ error: 'Could not start payment' });
      }
      res.status(200).json({ url: apiResponse.GatewayPageURL });
    })
    .catch(err => {
      console.error('SSLCommerz init error:', err);
      res.status(502).json({ error: 'Could not start payment' });
    });
};
exports.paymentOrder = async (req, res) => {
  const order = req.order;
  const user = await User.findById(order.user);
  const tran_id = newTransactionId();
  const data = {
    total_amount: order.amount,
    currency: 'BDT',
    ...gatewayUrls(tran_id, `/api/payment/success/${tran_id}?userId=${user._id}`),
    shipping_method: 'Courier',
    product_name: 'Plants',
    product_category: 'Plants',
    product_profile: 'general',
    cus_name: user.username,
    cus_email: user.email,
    cus_add1: order.address,
    cus_add2: user.present_addr,
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '897987097',
    cus_fax: '01711111111',
    ship_name: user.username,
    ship_add1: order.address,
    ship_add2: user.present_addr,
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
  return startPayment(data, res);
};

exports.success = async (req, res) => {
  const { userId } = req.query;
  res.redirect(userId ? `${APP_URL}/home/${encodeURIComponent(userId)}` : `${APP_URL}/payment/success/${req.params.transId}`);
};
exports.successSell = async (req, res) => {
  const { pname, pdescription, pprice, pphoto,reqId } = req.query;
  res.redirect(`${APP_URL}/admin/viewsellrequests/review?pname=${encodeURIComponent(pname)}&pdescription=${encodeURIComponent(pdescription)}&pprice=${encodeURIComponent(pprice)}&pphoto=${encodeURIComponent(pphoto)}&reqId=${encodeURIComponent(reqId)}`);
};
exports.fail = async (req, res) => {
  res.redirect(`${APP_URL}/payment/fail/${req.params.transId}`);
};

exports.paymentAuction = async (req, res) => {
  const auctionProductId = req.params.productId;
  const auctionProduct = await AuctionProduct.findById(auctionProductId);
  // console.log(auctionProduct);
  const bidderId = auctionProduct.highestBidder;
  const bidder = await User.findById(bidderId);
  const tran_id = newTransactionId();
  const data = {
    total_amount: auctionProduct.currentBid,
    currency: 'BDT',
    ...gatewayUrls(tran_id, `/api/payment/success/${tran_id}?userId=${bidder._id}`),
    shipping_method: 'Courier',
    product_name: 'Plants',
    product_category: 'Plants',
    product_profile: 'general',
    cus_name: bidder.username,
    cus_email: bidder.email,
    cus_add1: bidder.present_addr,
    cus_add2: bidder.present_addr,
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '07198847873',
    cus_fax: '01711111111',
    ship_name: bidder.username,
    ship_add1: bidder.present_addr,
    ship_add2: bidder.present_addr,
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
  return startPayment(data, res);
};

exports.paymentSell = async (req, res) => {
  const sellProductId = req.params.reqProductId;
  const sellProduct = await SellProduct.findById(sellProductId);
  const userId = sellProduct.user;
  const user = await User.findById(userId);
  const tran_id = newTransactionId();
  const sellQuery = new URLSearchParams({
    pname: req.body.pname ?? '',
    pdescription: req.body.pdescription ?? '',
    pprice: req.body.pprice ?? '',
    pphoto: req.body.pphoto ?? '',
    reqId: req.params.reqProductId,
  });
  const data = {
    total_amount: sellProduct.askingPrice,
    currency: 'BDT',
    ...gatewayUrls(tran_id, `/api/payment/success/sell/${tran_id}?${sellQuery}`),
    shipping_method: 'Courier',
    product_name: 'Plants',
    product_category: 'Plants',
    product_profile: 'general',
    cus_name: user.username,
    cus_email: user.email,
    cus_add1: user.present_addr,
    cus_add2: user.present_addr,
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '07198847873',
    cus_fax: '01711111111',
    ship_name: user.username,
    ship_add1: user.present_addr,
    ship_add2: user.present_addr,
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
  return startPayment(data, res);
};