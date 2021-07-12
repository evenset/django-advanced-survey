import React from 'react';

export const initialState = {
    pages: 1,
    activePage: 1
};

export const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'addPage':
            return {...state, pages: state.pages + 1};
        case 'setActivePage':
            return {...state, activePage: action.payload};
        default:
            throw new Error();
    }
}

export const StateContext = React.createContext({
    state: initialState,
    dispatch: (param: {type: string, payload?: any}) => {}
});