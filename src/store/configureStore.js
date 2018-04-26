import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import promise from './promise';
import { createSession } from 'redux-session';
import logger from 'redux-logger'

const configureStore = () => {
    const session = createSession({
        ns: 'audryroseims',
        throttle: 1,
        onLoad(storedState, dispatch) {
            dispatch({ type: 'LOAD_STORED_STATE', storedState })
        },
        selectState(state) {
            return {
                token: state.auth.token,
                user: state.auth.user
            };
        },
        clearStorage(action) {
            return (action.type === 'CLEAR_STORED_STATE');
        }
    });

    const middleware = [
        thunk,
        promise,
        session,
        logger
    ];
    console.log(process.env)
    const store = createStore(
        rootReducer,
        compose(
            applyMiddleware(...middleware),
            window.devToolsExtension && process.env.NODE_ENV === "development" ? window.devToolsExtension() : f => f
        ));

    return store;
}

export default configureStore;
