import {ThunkAction} from "@reduxjs/toolkit";
import {
  ServerStateActionTypes,
  SET_SERVER_STATE,
  SetServerStateAction,
  SET_SERVER_IN_PROGRESS, SetServerProgressAction
} from "./types";
import {IPC_HANDLES} from "common/ipc";
import {RootState} from "../index";

const electron = window.require("electron")
const { ipcRenderer } = electron;

type ThunkResult<R> = ThunkAction<R, RootState, undefined, ServerStateActionTypes>;

export const getServerStateAction = () : ThunkResult<void> => async (dispatch, getState) => {
  const serverState = await ipcRenderer.invoke(IPC_HANDLES.getHexoServerStatus);
  dispatch(setServerStateAction(serverState));
}


export const toggleServerStateAction = () : ThunkResult<void> => async (dispatch, getState) => {
  const state = getState()
  console.log(state)
  if(!state.hexoServer.state) {
    dispatch(startServerAction());
  }
  if(state.hexoServer.state) {
    dispatch(stopServerAction());
  }
}

export const startServerAction = (): ThunkResult<void> => async dispatch => {
  console.log('start server');
  try {
    dispatch(setServerInProgressAction(true))
    ipcRenderer.invoke(IPC_HANDLES.startHexoServer);
    dispatch(setServerStateAction(true));
  } finally {
    dispatch(setServerInProgressAction(false))
  }
}

export const stopServerAction = (): ThunkResult<void> => async dispatch => {
  try {
    dispatch(setServerInProgressAction(true))
    await ipcRenderer.invoke(IPC_HANDLES.stopHexoServer);
    dispatch(setServerStateAction(false));
  } finally {
    dispatch(setServerInProgressAction(false))
  }
}

export const setServerInProgressAction = (inProgress: boolean): SetServerProgressAction => {
  return {
    type: SET_SERVER_IN_PROGRESS,
    payload: inProgress
  }
}

export const setServerStateAction = (serverState: boolean): SetServerStateAction => {
  return {
    type: SET_SERVER_STATE,
    payload: serverState
  }
}
