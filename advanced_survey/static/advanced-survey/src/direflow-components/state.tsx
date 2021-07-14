import React from 'react';

export const initialState = {
    pages: [[]],
    activePage: 1,
    drag: -1
};

const sortByListOrder = (arr: any[]) => {
    arr.sort((a: any, b: any) => {
        if ( a.list_order < b.list_order ){
            return -1;
        }
        if ( a.list_order > b.list_order ){
            return 1;
        }
        return 0;  
    })
}

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
            state.pages[state.activePage - 1].push({list_order: state.pages[state.activePage - 1].length})
            sortByListOrder(state.pages[state.activePage - 1]);
            return {...state}
        case 'deleteQuestion':
            state.pages[state.activePage - 1].splice(action.payload, 1);
            sortByListOrder(state.pages[state.activePage - 1]);
            return {...state}
        case 'dragStart':
            return {...state, drag: action.payload}
        case 'dropEnd':
            if (state.drag !== action.payload) {
                state.pages[state.activePage - 1][state.drag].list_order = action.payload;
                state.pages[state.activePage - 1][action.payload].list_order = state.drag;
                sortByListOrder(state.pages[state.activePage - 1])
            }
            return {...state, drag: -1};
        default:
            throw new Error();
    }
}

export const StateContext = React.createContext({
    state: initialState,
    dispatch: (param: {type: string, payload?: any}) => {}
});