import config from './config';
import { Parse } from 'parse';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_SERVER_URL;
Parse.initialize(config.parseAppId);
Parse.serverURL = BASE_URL;

// Use axios for submitting jobs
axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
axios.defaults.headers.common['X-Parse-Application-Id'] = process.env.REACT_APP_APP_ID;
axios.defaults.headers.common['X-Parse-Master-Key'] = process.env.REACT_APP_MASTER_KEY;

const delay = function (t) {
    return new Promise(function (resolve) {
        setTimeout(resolve, t)
    });
}

const poll = function (fn, retries, timeoutBetweenAttempts) {
    return Promise.resolve()
        .then(fn)
        .catch(function retry(err) {
            if (retries-- > 0)
                return delay(timeoutBetweenAttempts)
                    .then(fn)
                    .catch(retry);
            throw err;
        });
}

export const signup = (username, password) => Parse.User.signUp(username, password);

export const login = (username, password) => Parse.User.logIn(username, password);

export const logout = (token) => Parse.User.logOut(token);

export const loadSession = (token) => Parse.User.become(token);

export const getOrders = (token, subpage, page, sort, search) => Parse.Cloud.run('getOrders',
    {
        sessionToken: token,
        subpage,
        page,
        sort,
        search
    }
);

export const reloadOrder = (token, orderId) => axios.post('/jobs/reloadOrder', {
    orderId: orderId
}).then(function (response) {
    const jobId = response.headers['x-parse-job-status-id'];
    if (jobId) {
        return poll(() => Parse.Cloud.run('getJobStatus', {
            sessionToken: token,
            jobId: jobId
        }).then(function (result) {
            if (result.status !== 'succeeded') {
                throw result;
            } else {
                return Parse.Cloud.run('getUpdatedOrders', {
                    sessionToken: token,
                    orderIds: [result.params.orderId]
                });
            }
        }).then(function (result) {
            return result;
        })
            , 120, 1000);
    } else {
        return;
    }
}).catch(function (error) {
    return error;
});

export const createShipments = (token, shipmentGroups) => Parse.Cloud.run('createShipments',
    {
        sessionToken: token,
        shipmentGroups
    }
);

export const batchCreateShipments = (token, ordersToShip) => axios.post('/jobs/batchCreateShipments', {
    ordersToShip: ordersToShip
}).then(function (response) {
    const jobId = response.headers['x-parse-job-status-id'];
    let updatedOrders;
    let tabCounts;
    let generatedFile;
    let newFiles;
    if (jobId) {
        return poll(() => Parse.Cloud.run('getJobStatus', {
            sessionToken: token,
            jobId: jobId
        }).then(function (result) {
            if (result.status !== 'succeeded') {
                throw result;
            } else {
                if (result.message) generatedFile = result.message;
                return Parse.Cloud.run('getUpdatedOrders', {
                    sessionToken: token,
                    orderIds: ordersToShip
                });
            }
        }).then(function (result) {
            updatedOrders = result.updatedOrders;
            tabCounts = result.tabCounts;
            return Parse.Cloud.run('getRecentBatchPdfs', {
                sessionToken: token
            });
        }).then(function (result) {
            newFiles = result.newFiles;
            return { updatedOrders: updatedOrders, tabCounts: tabCounts, generatedFile: generatedFile, newFiles: newFiles };
        })
            , 120, 1000);
    } else {
        return;
    }
}).catch(function (error) {
    return error;
});

export const batchPrintShipments = (token, ordersToPrint) => axios.post('/jobs/batchPrintShipments', {
    ordersToPrint: ordersToPrint
}).then(function (response) {
    const jobId = response.headers['x-parse-job-status-id'];
    let updatedOrders;
    let tabCounts;
    let generatedFile;
    let newFiles;
    if (jobId) {
        return poll(() => Parse.Cloud.run('getJobStatus', {
            sessionToken: token,
            jobId: jobId
        }).then(function (result) {
            if (result.status !== 'succeeded') {
                throw result;
            } else {
                if (result.message) generatedFile = result.message;
                return Parse.Cloud.run('getUpdatedOrders', {
                    sessionToken: token,
                    orderIds: ordersToPrint
                });
            }
        }).then(function (result) {
            updatedOrders = result.updatedOrders;
            tabCounts = result.tabCounts;
            return Parse.Cloud.run('getRecentBatchPdfs', {
                sessionToken: token
            });
        }).then(function (result) {
            newFiles = result.newFiles;
            return { updatedOrders: updatedOrders, tabCounts: tabCounts, generatedFile: generatedFile, newFiles: newFiles };
        })
            , 120, 1000);
    } else {
        return;
    }
}).catch(function (error) {
    return error;
});

export const printPickSheet = (token, ordersToPrint) => axios.post('/jobs/printPickSheet', {
    ordersToPrint: ordersToPrint
}).then(function (response) {
    const jobId = response.headers['x-parse-job-status-id'];
    let generatedFile;
    let newFiles;
    if (jobId) {
        return poll(() => Parse.Cloud.run('getJobStatus', {
            sessionToken: token,
            jobId: jobId
        }).then(function (result) {
            if (result.status !== 'succeeded') {
                throw result;
            } else {
                if (result.message) generatedFile = result.message;
                return Parse.Cloud.run('getRecentBatchPdfs', {
                    sessionToken: token
                });
            }
        }).then(function (result) {
            newFiles = result.newFiles;
            return { generatedFile: generatedFile, newFiles: newFiles };
        })
            , 120, 1000);
    } else {
        return;
    }
}).catch(function (error) {
    return error;
});

export const getProduct = (token, productId) => Parse.Cloud.run('getProduct',
    {
        sessionToken: token,
        productId
    }
);

export const addOrderProductToVendorOrder = (token, orders, orderId) => Parse.Cloud.run('addOrderProductToVendorOrder',
    {
        sessionToken: token,
        orders,
        orderId
    }
);

export const createResize = (token, resizes, orderId) => Parse.Cloud.run('createResize',
    {
        sessionToken: token,
        resizes,
        orderId
    }
);

export const saveOrder = (token, data) => Parse.Cloud.run('saveOrder',
    {
        sessionToken: token,
        data
    }
);

export const saveOrderProduct = (token, data) => Parse.Cloud.run('saveOrderProduct',
    {
        sessionToken: token,
        data
    }
);

export const getOrderProductFormData = (token, orderProductId) => Parse.Cloud.run('getOrderProductFormData',
    {
        sessionToken: token,
        orderProductId
    }
);

export const saveResize = (token, data) => Parse.Cloud.run('saveResize',
    {
        sessionToken: token,
        data
    }
);

export const getProducts = (token, subpage, page, sort, search, filters) => Parse.Cloud.run('getProducts',
    {
        sessionToken: token,
        subpage,
        page,
        sort,
        search,
        filters
    }
);

export const getProductFilters = (token) => Parse.Cloud.run('getProductFilters',
    {
        sessionToken: token
    }
);

export const getProductOptions = (token) => Parse.Cloud.run('getProductOptions',
    {
        sessionToken: token
    }
);

export const reloadProduct = (token, productId) => Parse.Cloud.run('reloadProduct',
    {
        sessionToken: token,
        productId
    }
);

export const saveProduct = (token, data) => Parse.Cloud.run('saveProduct',
    {
        sessionToken: token,
        data
    }
);

export const saveVariants = (token, variants) => Parse.Cloud.run('saveVariants',
    {
        sessionToken: token,
        variants
    }
);

export const addToVendorOrder = (token, orders) => Parse.Cloud.run('addToVendorOrder',
    {
        sessionToken: token,
        orders
    }
);

export const getBundleFormData = (token, productId) => Parse.Cloud.run('getBundleFormData',
    {
        sessionToken: token,
        productId
    }
);

export const productBundleSave = (token, data) => Parse.Cloud.run('productBundleSave',
    {
        sessionToken: token,
        data
    }
);

export const getDesigners = (token, subpage, page, search) => axios.post('/functions/getDesigners',
    {
        sessionToken: token,
        subpage,
        page,
        search
    }
);

export const saveVendor = (token, data) => Parse.Cloud.run('saveVendor',
    {
        sessionToken: token,
        data
    }
);

export const saveVendorOrder = (token, data) => axios.post('/jobs/saveVendorOrder', {
    data: data
}).then(function (response) {
    const jobId = response.headers['x-parse-job-status-id'];
    let updatedDesigner;
    let completedVendorOrders;
    if (jobId) {
        return poll(() => Parse.Cloud.run('getJobStatus', {
            sessionToken: token,
            jobId: jobId
        }).then(function (result) {
            if (result.status !== 'succeeded') {
                throw result;
            } else {
                return Parse.Cloud.run('getUpdatedDesigner', {
                    sessionToken: token,
                    data: data
                });
            }
        }).then(function (result) {
            updatedDesigner = result.updatedDesigner;
            completedVendorOrders = result.completedVendorOrders;
            return { updatedDesigner: updatedDesigner, completedVendorOrders: completedVendorOrders, };
        })
            , 120, 1000);
    } else {
        return;
    }
}).catch(function (error) {
    return error;
});

export const sendVendorOrder = (token, data) => Parse.Cloud.run('sendVendorOrder',
    {
        sessionToken: token,
        data
    }
);

export const getDesignerProducts = (token, designerId) => Parse.Cloud.run('getDesignerProducts',
    {
        sessionToken: token,
        designerId
    }
);

export const addDesignerProductToVendorOrder = (token, orders, designerId) => Parse.Cloud.run('addDesignerProductToVendorOrder',
    {
        sessionToken: token,
        orders,
        designerId
    }
);

export const getOptions = (token, subpage) => Parse.Cloud.run('getOptions',
    {
        sessionToken: token,
        subpage
    }
);

export const saveOption = (token, objectId, manualCode) => Parse.Cloud.run('saveOption',
    {
        sessionToken: token,
        objectId,
        manualCode
    }
);

export const getShipments = (token, page) => Parse.Cloud.run('getShipments',
    {
        sessionToken: token,
        page
    }
);

export const getWebhooks = (token) => Parse.Cloud.run('getWebhooks',
    {
        sessionToken: token
    }
);

export const createWebhook = (token, endpoint, destination) => Parse.Cloud.run('createWebhook',
    {
        sessionToken: token,
        endpoint: endpoint,
        destination: destination
    }
);

export const deleteWebhook = (token, id) => Parse.Cloud.run('deleteWebhook',
    {
        sessionToken: token,
        id: id
    }
);

const completeVendorOrder = (token, vendorOrderNumber) => Parse.Cloud.run('completeVendorOrder', {
    sessionToken: token,
    vendorOrderNumber
})

const deleteProductFromVendorOrder = (token, productObjectId, vendorOrderNumber) => Parse.Cloud.run('deleteProductFromVendorOrder', {
    sessionToken: token,
    productObjectId,
    vendorOrderNumber
})

const updateOrderNotes = (token, orderId, orderNotes) => axios.post('/functions/updateOrderNotes', {
    sessionToken: token,
    orderId,
    orderNotes
});

const getOrdersToSendEmails = (token, offset) => axios.post('/functions/getOrdersToSendEmails', {
    sessionToken: token,
    offset
});

const sendOrderEmail = (orderId, emailParams, token) => axios.post('/functions/sendOrderEmail', {
    sessionToken: token,
    orderId,
    emailParams
});

const deleteOrderEmail = (orderId, token) => axios.post('/functions/deleteOrderEmail', {
    sessionToken: token,
    orderId
});

const getRatesForShipment = (parcelParams, orderId, token) => axios.post('/functions/getRatesForOrderShipment', {
    sessionToken: token,
    parcelParams,
    orderId
});

const getAllPendingVendorOrders = (page, sort, direction, ordersToSkip, token) => axios.post('/functions/getAllPendingVendorOrders', {
    sessionToken: token,
    page,
    sort,
    direction,
    ordersToSkip
});

const finishPendingVendorOrderProduct = (vendorOrderObjectId, vendorOrderVariantObjectId, token) => axios.post('/functions/finishPendingVendorOrderProduct', {
    sessionToken: token,
    vendorOrderObjectId,
    vendorOrderVariantObjectId
});

const createReturn = (returnTypeId, products, token) => axios.post('/functions/createReturn', {
    sessionToken: token,
    returnTypeId,
    products
});

const getReturns = (token) => axios.post('/functions/getReturnsWithInformation', {
    sessionToken: token
});

const getReturnsForEmails = (token) => axios.post('/functions/returnsForEmails', {
    sessionToken: token
});

const checkInReturn = (returnId, token) => axios.post('/functions/checkInReturnedProduct', {
    sessionToken: token,
    returnId
});

const updateReturnStatus = (returnId, returnStatusId, token) => axios.post('/functions/updateReturnStatus', {
    sessionToken: token,
    returnId,
    returnStatusId
});

const sendReturnEmail = (returnId, { emailSubject, emailText, emailTo }, token) => axios.post('/functions/sendReturnEmail', {
    sessionToken: token,
    returnId,
    emailSubject,
    emailText,
    emailTo
});

const getProductStats = (token) => axios.post('/functions/getProductStats', {
    sessionToken: token
});

const getProductAndVariants = (token, productId) => axios.post('/functions/getProductAndVariants', {
    sessionToken: token,
    productId
})

const updateVendorOrderProduct = (token, options) => axios.post('/functions/updateVendorOrderProduct', {
    sessionToken: token,
    options
});

export default {
    signup,
    login,
    logout,
    loadSession,
    getOrders,
    reloadOrder,
    createShipments,
    batchCreateShipments,
    batchPrintShipments,
    printPickSheet,
    getProduct,
    addOrderProductToVendorOrder,
    createResize,
    saveOrder,
    saveOrderProduct,
    getOrderProductFormData,
    saveResize,
    getProducts,
    getProductFilters,
    getProductOptions,
    reloadProduct,
    saveProduct,
    saveVariants,
    addToVendorOrder,
    getBundleFormData,
    productBundleSave,
    getDesigners,
    saveVendor,
    saveVendorOrder,
    sendVendorOrder,
    getDesignerProducts,
    addDesignerProductToVendorOrder,
    getOptions,
    saveOption,
    getShipments,
    getWebhooks,
    createWebhook,
    deleteWebhook,
    completeVendorOrder,
    deleteProductFromVendorOrder,
    updateOrderNotes,
    getOrdersToSendEmails,
    sendOrderEmail,
    deleteOrderEmail,
    getRatesForShipment,
    getAllPendingVendorOrders,
    finishPendingVendorOrderProduct,
    createReturn,
    getReturns,
    getReturnsForEmails,
    checkInReturn,
    updateReturnStatus,
    sendReturnEmail,
    getProductStats,
    getProductAndVariants,
    updateVendorOrderProduct
}
