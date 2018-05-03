import { schema } from 'normalizr';

export const classification = new schema.Entity('classifications', {}, { idAttribute: 'objectId' });

export const department = new schema.Entity('departments', {}, { idAttribute: 'objectId' });

export const designer = new schema.Entity('designers', {
    // eslint-disable-next-line
    vendors: [vendor]
}, { idAttribute: 'objectId' });

export const resize = new schema.Entity('resizes', {
    // eslint-disable-next-line
    //   variant: productVariant,
    // eslint-disable-next-line
    //   resizeSourceVariant: productVariant,
    // eslint-disable-next-line
    //   orderProduct: orderProduct
}, { idAttribute: 'objectId' });

export const vendorOrderVariant = new schema.Entity('vendorOrderVariants', {
    // eslint-disable-next-line
    //   variant: productVariant,
    // eslint-disable-next-line
    //   resizeVariant: productVariant, // NEED TO REMOVE THIS
    // eslint-disable-next-line
    //   orderProducts: [ orderProduct ]
}, { idAttribute: 'objectId' });

export const vendorOrder = new schema.Entity('vendorOrders', {
    // eslint-disable-next-line
    //   vendor: vendor, // NEED TO REMOVE THIS
    vendorOrderVariants: [vendorOrderVariant]
}, { idAttribute: 'objectId' });

export const vendor = new schema.Entity('vendors', {
    designers: [designer],
    vendorOrders: [vendorOrder]
}, { idAttribute: 'objectId' });

export const colorCode = new schema.Entity('colorCodes', {}, { idAttribute: 'objectId' });

export const stoneCode = new schema.Entity('stoneCodes', {}, { idAttribute: 'objectId' });

export const productVariant = new schema.Entity('productVariants', {
    designer: designer,
    resizes: [resize],
    colorCode: colorCode,
    stoneCode: stoneCode
}, { idAttribute: 'objectId' });

export const orderProduct = new schema.Entity('orderProducts', {
    variants: [productVariant],
    resizes: [resize],
    vendorOrders: [vendorOrder],
    awaitingInventory: [vendorOrderVariant]
}, { idAttribute: 'objectId' });

export const orderShipment = new schema.Entity('orderShipments', {}, { idAttribute: 'objectId' });

export const order = new schema.Entity('orders', {
    orderShipments: [orderShipment],
    orderProducts: [orderProduct]
}, { idAttribute: 'objectId' });

const product = new schema.Entity('products', {
    classification: classification,
    department: department,
    designer: designer,
    resizes: [resize],
    vendor: vendor,
    variants: [productVariant]
}, { idAttribute: 'objectId' });

export const productListSchema = new schema.Array(product);