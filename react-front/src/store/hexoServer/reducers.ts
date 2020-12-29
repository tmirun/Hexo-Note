import {Server, ServerStateActionTypes} from "./types";

const initialState: Server = {
  state: false,
  inProgress: false
};

export function serverReducer(state = initialState, action: ServerStateActionTypes): Server {
  switch (action.type) {
    case "SET_SERVER_STATE":
      return {
        ...state,
        state: action.payload
      }
    case "SET_SERVER_IN_PROGRESS":
      return {
        ...state,
        inProgress: action.payload
      }
    default:
      return { ...state }
  }
}
