const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const OrderModel = require('../models/Order'); // Import the order model
const qs = require('qs');

const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

router.post('/payment', async (req, res) => {
    const embed_data = {
        redirecturl: "https://docs.zalopay.vn/result",
      
    };
    

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, 
        app_user: "user123",
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 50000,
        description: `Đơn hàng: #${transID}`,
        bank_code: "zalopayapp",
        callback_url: 'https://f3c7-113-22-221-150.ngrok-free.app/callback'
    };

    const data = config.app_id + "|" 
        + order.app_trans_id + "|" 
        + order.app_user + "|" 
        + order.amount + "|" 
        + order.app_time + "|"
        + order.embed_data + "|"
        + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        console.log(result.data);
        res.json(result.data);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});


router.post('/callback', async (req, res) => {
    let result = {};

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log("mac =", mac);

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            let dataJson = JSON.parse(dataStr);
            console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
            await updateOrderStatus(dataJson["app_trans_id"], "success"); // Cập nhật trạng thái đơn hàng thành công

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0;
        result.return_message = ex.message;
    }

    res.json(result);
});

router.post('/order-status/:app_trans_id', async(req,res)=>{
    const app_trans_id = req.params.app_trans_id;
    let postData = {
        appid: config.app_id,
        apptransid: app_trans_id, // Input your apptransid
    }
    
    let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    
    
    let postConfig = {
        method: 'post',
        url: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
    };
    
    try {
       const  result = await axios(postConfig);
       return res.status(200).json(result.data);
    } catch (error) {
        console.log(error)
    }
       
})

  
async function updateOrderStatus(app_trans_id, status) {
    // Logic để cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
    console.log(`Updating order status: ${app_trans_id} to ${status}`);
    try {
        await OrderModel.updateOne({ app_trans_id }, { status });
        console.log(`Order ${app_trans_id} status updated to ${status}`);
    } catch (error) {
        console.error(`Error updating order status: ${error.message}`);
    }
}

module.exports = router;
