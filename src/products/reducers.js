// import * as schema from './schema';

// import { normalize } from 'normalizr';

const initialState = {
  isLoadingProducts: false,
  products: [],
  filterData: null
};

const updateProduct = (newProduct, productsState) => {
  const index = productsState.findIndex(p => p.objectId === newProduct.objectId);
  return [
    ...productsState.slice(0, index),
    newProduct,
    ...productsState.slice(index + 1)
  ];
};

const products = (state = initialState, action) => {
  let productsData;
  switch (action.type) {

    case 'PRODUCTS_REQUEST':
    case 'PRODUCT_REQUEST':
      return {
        ...initialState,
        isLoadingProducts: true
      }
    case 'RESET_PRODUCTS_STORAGE':
      return initialState;

    case 'PRODUCTS_SUCCESS':
      productsData = [];
      if (action.res.products) {
        productsData = action.res.products.map(function (product, i) {
          return product.toJSON();
        });
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        isLoadingProducts: false,
        products: productsData,
        totalPages: action.res.totalPages,
        totalProducts: action.res.totalProducts,
        tabCounts: action.res.tabCounts
      };

    case 'PRODUCT_SUCCESS':
      return {
        ...state,
        products: updateProduct(action.res, state.products),
        isLoadingProducts: false
      }

    case 'PRODUCTS_FAILURE':
    case 'PRODUCT_FAILURE':
      return {
        ...state,
        isLoadingProducts: false
      }

    case 'PRODUCT_FILTERS_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_FILTERS_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        filterData: action.res
      };

    case 'PRODUCT_FILTERS_FAILURE':
      return {
        ...state
      }

    case 'PRODUCT_OPTIONS_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_OPTIONS_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        optionsData: action.res
      };

    case 'PRODUCT_OPTIONS_FAILURE':
      return {
        ...state
      }

    case 'PRODUCT_RELOAD_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_RELOAD_SUCCESS':
      if (state.products && action.res.updatedProduct) {
        productsData = state.products.map(function (product, i) {
          if (product.objectId === action.res.updatedProduct.id) {
            product = action.res.updatedProduct.toJSON();
          }
          return product;
        });
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: productsData ? productsData : undefined,
        updatedProducts: action.res.updatedProduct ? [action.res.updatedProduct] : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined
      };

    case 'PRODUCT_RELOAD_FAILURE':
      return {
        ...state
      }

    case 'PRODUCT_SAVE_REQUEST':
      return {
        ...state
      }

    case 'PRODUCT_SAVE_SUCCESS':
      if (state.products && action.res.updatedProduct) {
        productsData = state.products.map(function (product, i) {
          if (product.objectId === action.res.updatedProduct.id) {
            product = action.res.updatedProduct.toJSON();
          }
          return product;
        });
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: productsData ? productsData : undefined,
        updatedProducts: action.res.updatedProduct ? [action.res.updatedProduct] : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined
      };

    case 'PRODUCT_SAVE_FAILURE':
      return {
        ...state
      }

    case 'VARIANT_SAVE_REQUEST':
      return {
        ...state
      }

    case 'VARIANT_SAVE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
        productsData = state.products.map(function (product, i) {
          action.res.updatedProducts.map(function (updatedProduct, j) {
            if (product.objectId === updatedProduct.id) {
              product = updatedProduct.toJSON();
            }
            return updatedProduct;
          });
          return product;
        });
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: productsData ? productsData : undefined,
        updatedProducts: action.res.updatedProduct ? [action.res.updatedProduct] : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined
      };

    case 'VARIANT_SAVE_FAILURE':
      return {
        ...state
      }

    case 'VARIANTS_SAVE_REQUEST':
      return {
        ...state
      }

    case 'VARIANTS_SAVE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
        productsData = state.products.map(function (product, i) {
          action.res.updatedProducts.map(function (updatedProduct, j) {
            if (product.objectId === updatedProduct.id) {
              product = updatedProduct.toJSON();
            }
            return updatedProduct;
          });
          return product;
        });
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: productsData ? productsData : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined
      };

    case 'VARIANTS_SAVE_FAILURE':
      return {
        ...state
      }

    case 'ADD_TO_VENDOR_ORDER_REQUEST':
      return {
        ...state
      }

    case 'ADD_TO_VENDOR_ORDER_SUCCESS':
      if (state.products && action.res.updatedProducts) {
        productsData = state.products.map(function (product, i) {
          action.res.updatedProducts.map(function (updatedProduct, j) {
            if (product.objectId === updatedProduct.id) {
              product = updatedProduct.toJSON();
            }
            return updatedProduct;
          });
          return product;
        });
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: productsData ? productsData : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        updatedDesigners: action.res.updatedDesigners ? action.res.updatedDesigners : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined,
        errors: action.res.errors ? action.res.errors : undefined
      };

    case 'ADD_TO_VENDOR_ORDER_FAILURE':
      return {
        ...state
      }

    case 'CREATE_PRODUCT_RESIZE_REQUEST':
      return {
        ...state
      }

    case 'CREATE_PRODUCT_RESIZE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
        productsData = state.products.map(function (product, i) {
          action.res.updatedProducts.map(function (updatedProduct, j) {
            if (product.objectId === updatedProduct.id) {
              product = updatedProduct.toJSON();
            }
            return updatedProduct;
          });
          return product;
        });
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: productsData ? productsData : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined,
        errors: action.res.errors ? action.res.errors : undefined
      };

    case 'CREATE_PRODUCT_RESIZE_FAILURE':
      return {
        ...state
      }

    case 'SAVE_PRODUCT_RESIZE_REQUEST':
      return {
        ...state
      }

    case 'SAVE_PRODUCT_RESIZE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
        productsData = state.products.map(function (product, i) {
          action.res.updatedProducts.map(function (updatedProduct, j) {
            if (product.objectId === updatedProduct.id) {
              product = updatedProduct.toJSON();
            }
            return updatedProduct;
          });
          return product;
        });
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: productsData ? productsData : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        updatedVariants: action.res.updatedVariants ? action.res.updatedVariants : undefined,
        tabCounts: action.res.tabCounts ? action.res.tabCounts : undefined,
        errors: action.res.errors ? action.res.errors : undefined
      };

    case 'SAVE_PRODUCT_RESIZE_FAILURE':
      return {
        ...state
      }

    case 'GET_BUNDLE_FORM_REQUEST':
      return {
        ...state
      }

    case 'GET_BUNDLE_FORM_SUCCESS':
      if (action.res.timeout) return { ...state, timeout: action.res.timeout };
      return {
        ...state,
        bundleFormData: action.res
      };

    case 'GET_BUNDLE_FORM_FAILURE':
      return {
        ...state
      }

    case 'BUNDLE_SAVE_REQUEST':
      return {
        ...state
      }

    case 'BUNDLE_SAVE_SUCCESS':
      if (state.products && action.res.updatedProducts) {
        productsData = state.products.map(function (product, i) {
          action.res.updatedProducts.map(function (updatedProduct, j) {
            if (product.objectId === updatedProduct.id) {
              product = updatedProduct.toJSON();
            }
            return updatedProduct;
          });
          return product;
        });
      }
      return {
        ...state,
        timeout: action.res.timeout ? action.res.timeout : undefined,
        products: productsData ? productsData : undefined,
        updatedProducts: action.res.updatedProducts ? action.res.updatedProducts : undefined,
        errors: action.res.errors ? action.res.errors : undefined
      };

    case 'BUNDLE_SAVE_FAILURE':
      return {
        ...state
      }

    default:
      return state;
  }
}

export default products;
