import React from 'react';

export const initialState = {
    pages: [[]],
    activePage: 1
};

export const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'addPage':
            return {...state, pages: [...state.pages, []], activePage: state.activePage + 1};
        case 'setActivePage':
            return {...state, activePage: action.payload};
        case 'removePage':
            const pages = [...state.pages];
            pages.splice(action.payload, 1);
            return {...state, pages, activePage: state.activePage - 1}
        case 'addQuestion':
            state.pages[state.activePage - 1].push({})
            return {...state}
        case 'deleteQuestion':
            state.pages[state.activePage - 1].splice(action.payload, 1);
            return {...state}
        default:
            throw new Error();
    }
}

export const StateContext = React.createContext({
    state: initialState,
    dispatch: (param: {type: string, payload?: any}) => {}
});