var Order = require("../models/orderModel");

/**
 * create an new order
 * (POST) http://localhost:8080/order/create
 * @param {*} req 
 * @param {*} res 
 */
exports.createNewOrderPost = function(req, res){
    const order = new Order({
        user: req.body.user,
        vendor: req.body.vendor,
        snacks: req.body.snacks,
        prices: req.body.prices,
        discount : false
    })
    saveOrder(res,order)
};

/**
 * save the order details
 * @param {*} res 
 * @param {*} order 
 */
function saveOrder(res,order) {
    order.save((err, createOrder)=>{
        if(err){
            res.status(404).json({success: false, err: err})
        }else{
            res.status(200).json({success: true, order: createOrder})
        }
    })
}

/**
 * get all the order in a vendor
 * (GET) http://localhost:8080/order/:vendorID?status=outstanding
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllOrder = function(req, res){
    Order.find(req.query).populate('vendor').populate('user').then((order) => {
        if(order.length == 0){
            res.status(200).json({success: false, err:"You haven't have any order yet!"})
        }else{
            res.status(200).json({success: true ,order: order})
        }
    })
};


/**
 * Update an order to change the details or update the status
 * (POST) http://localhost:8080/order/update/:orderID
 * @param {*} req 
 * @param {*} res 
 */
exports.updateOrderPost = function(req, res){
    Order.findById(req.params.orderID). then((order) => {
        if(!order){
            res.status(404).json({err:"Can't found that order!"})
        }else{
            updateOrder(req,res)
        }
    })
};

/**
 * update the order details
 * @param {*} req 
 * @param {*} res 
 */
function updateOrder(req,res) {
    Order.findByIdAndUpdate(
        req.params.orderID,
        req.body, {new: true},
        function(err, updatedOrder){
            if(err){
                res.status(404).json({success: false, err: err})
            }else{
                res.status(200).json({success: true, updatedOrder: updatedOrder})
            }
        }
    )
}