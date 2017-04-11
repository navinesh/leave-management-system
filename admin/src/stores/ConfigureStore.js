import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "../reducers/Reducers";

const configureStore = () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware, createLogger())
  );

  return store;
};

export default configureStore;
