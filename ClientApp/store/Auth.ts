import { fetch } from 'domain-task';
import { Action, Reducer } from 'redux';
import { push, RouterAction } from 'react-router-redux';
import { jwtDecode } from 'jwt-decode';
import { AppThunkAction } from './';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AuthState {
    token: null,
    userName: null,
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null
}


export interface Payload {
    token: string,
    status: number,
    statusText: string
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
interface LoginUser { type: 'LOGIN_USER' }
interface LoginUserRequest { type: 'LOGIN_USER_REQUEST' }
interface LoginUserSuccess { type: 'LOGIN_USER_SUCCESS'
    ,payload: Payload
}
interface LoginUserFailure { type: 'LOGIN_USER_FAILURE' 
    ,payload: Payload
}
interface LogoutUser { type: 'LOGOUT_USER' }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = LoginUserRequest | LoginUserSuccess | LoginUserFailure | LogoutUser;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
const _payload:Payload = {token:'', status: null, statusText: ''};
export const actionCreators = {
    loginUserRequest: () => <LoginUserRequest> { type: 'LOGIN_USER_REQUEST' },
    loginUserSuccess: (token: string) : AppThunkAction<any> => (dispatch, getState) => {
        localStorage.setItem('token', token);
        let payload = Object.assign({}, _payload, {token: token});
        dispatch (<LoginUserSuccess>{ type: 'LOGIN_USER_SUCCESS', payload: payload });
        try{
            console.log('trying to dispatch RouterAction');
        dispatch(<RouterAction>push('/fetchdata'));}catch(err){
            console.log(err);
        }
    },
    loginUserFailure: (error: any) : AppThunkAction<KnownAction> => (dispatch, getState) =>{
        localStorage.removeItem('token');
        let payload = Object.assign({}, _payload, {status: error.response.status, statusText: error.response.statusText});
        dispatch(<LoginUserFailure> { type: 'LOGIN_USER_FAILURE', payload: payload });
    },
    logoutUser: (): AppThunkAction<KnownAction> => (dispatch, getState) =>{
        localStorage.removeItem('token');
        dispatch( <LogoutUser> { type: 'LOGOUT_USER' });
        //dispatch(push('/login'));
    },
    loginUser: (username: string, password:string, redirect:string): AppThunkAction<any> => (dispatch, getState) => {
        dispatch(<LoginUserRequest> { type: 'LOGIN_USER_REQUEST' });
        let config = {
            method: 'POST',
            header: { 'Content-Type':'application/x-www-form-urlencoded' },
            body: `username=${username}&password=${password}`
        };
        let payload = Object.assign({}, _payload);
        fetch('/api/Login', config)
            .then(response => response.json()
                .then(data => ({data, response}))
            ).then(({data, response}) => {
                if(!response.ok) {
                    payload = Object.assign({}, payload, {
                        status: response.status,
                        statusText: response.statusText
                    });
                    dispatch(<LoginUserFailure> { type: 'LOGIN_USER_FAILURE', payload: payload });
                } else {
                    payload = Object.assign({}, payload, {
                        token: data.token,
                        status: response.status,
                        statusText: response.statusText
                    });
                    localStorage.setItem('token', data.token);
                    dispatch (<LoginUserSuccess>{ type: 'LOGIN_USER_SUCCESS', payload: payload });
                    dispatch(<RouterAction>push(redirect));
                }
            }).catch(err => {
                console.log(err);
                dispatch(<LoginUserFailure> { type: 'LOGIN_USER_FAILURE', payload: err });
        });
    },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.


const unloadedState: AuthState = { 
    token: null,
    userName: null,
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null 
};

export const reducer: Reducer<AuthState> = (state: AuthState, action: KnownAction) => {
    switch (action.type) {
        case 'LOGIN_USER_REQUEST':
            return Object.assign({}, state, {
                isAuthenticating: true,
                statusText: null
            });
        case 'LOGIN_USER_SUCCESS':
            return Object.assign({}, state, {
                isAuthenticating: false,
                isAuthenticated: true,
                token: action.payload.token,
                userName: 'Rahul', //jwtDecode(action.payload.token).userName,
                statusText: 'You have been successfully logged in.'
            });
        case 'LOGIN_USER_FAILURE': 
            return Object.assign({}, state, {
                isAuthenticating: false,
                isAuthenticated: false,
                token: null,
                userName: null,
                statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
            });
        case 'LOGOUT_USER': 
            return Object.assign({}, state, {
            isAuthenticated: false,
            token: null,
            userName: null,
            statusText: 'You have been successfully logged out.'
        });
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || unloadedState;
};
