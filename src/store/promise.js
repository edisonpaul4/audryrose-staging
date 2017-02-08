import { resetError } from '../actions/error';

const promise = store => next => action => {

  const { promise, types, ...rest } = action;

  if (!promise || !types) {
    return next(action);
  }

  store.dispatch(resetError());

  const [REQUEST, SUCCESS, FAILURE] = types;

  next({
    type: REQUEST
  });

  return promise.then(res => {
    next({
      ...rest,
      type: SUCCESS,
      res
    });
  }).catch(err => {
    console.error(err);
    next({
      type: FAILURE,
      ...rest,
      err
    });
  });
};

export default promise;
