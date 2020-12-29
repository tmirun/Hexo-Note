// Type keys
export const SET_SERVER_STATE = 'SET_SERVER_STATE';
export const SET_SERVER_IN_PROGRESS = 'SET_SERVER_IN_PROGRESS';

// Type Actions
export interface SetServerStateAction {
  type: typeof SET_SERVER_STATE,
  payload: boolean;
}

export interface SetServerProgressAction {
  type: typeof SET_SERVER_IN_PROGRESS,
  payload: boolean
}

export type ServerStateActionTypes = SetServerStateAction | SetServerProgressAction;

// Other types
export type Server = {
  state: boolean,
  inProgress: boolean
}
