
import {applyMiddleware, combineReducers, createStore} from "redux";
import ReduxThunk from 'redux-thunk';
import {serverReducer} from "./hexoServer/reducers";

const rootReducer = combineReducers({
  hexoServer: serverReducer
})

export type RootState = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
