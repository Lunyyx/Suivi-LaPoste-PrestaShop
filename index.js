require('dotenv').config();

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL;
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY;

const headers = {
    "Output-Format": "JSON",
    "Authorization": "Basic " + btoa(PRESTASHOP_API_KEY + ":")
}

const testAPI = async () => {
    console.log("↺ Testing PrestaShop API...");

    const response = await fetch(PRESTASHOP_API_URL, { headers: { "Authorization": "Basic " + btoa(PRESTASHOP_API_KEY + ":") } }); // Don't use the default headers because "Output-Format" is broking the API
    
    response.ok ? console.log("✓ API connected successfully !") : console.error(`API error : ${response.status} ${response.statusText}`);
}

const fetchShippingData = async () => {
    let shippingData = [];

    const fetchOrders = await fetch(PRESTASHOP_API_URL + '/orders', { headers });
    const ordersData = await fetchOrders.json();

    for (const order of ordersData.orders) {
        const fetchOrderData = await fetch(PRESTASHOP_API_URL + `/orders/${order.id}`, { headers });
        const jsonData = await fetchOrderData.json();

        shippingData.push({ order_id: jsonData.order.id, shipping_code: jsonData.order.shipping_number });
    }

    return shippingData;
}

(async () => {
    await testAPI();
    const shippingData = await fetchShippingData();
    console.log(shippingData);
})();