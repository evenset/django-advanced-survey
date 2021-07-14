import React from 'react';

export const initialState = {
    pages: [[]],
    activePage: 1,
    drag: -1
};

export const sortByListOrder = (arr: any[]) => {
    arr.sort((a: any, b: any) => {
        if (a.list_order < b.list_order) {
            return -1;
        }
        if (a.list_order > b.list_order) {
            return 1;
        }
        return 0;
    })
}

const makeID = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export const reducer = (state: any, action: any) => {
    const current_page = state.pages[state.activePage - 1];
    switch (action.type) {
        case 'addPage':
            return { ...state, pages: [...state.pages, []], activePage: state.activePage + 1 };
        case 'setActivePage':
            return { ...state, activePage: action.payload };
        case 'removePage':
            const pages = [...state.pages];
            pages.splice(action.payload, 1);
            return { ...state, pages, activePage: state.activePage - 1 }
        case 'addQuestion':
            current_page.push({ id: makeID(12), list_order: current_page.length })
            sortByListOrder(current_page);
            return { ...state }
        case 'deleteQuestion':
            current_page.splice(action.payload, 1);
            sortByListOrder(current_page);
            return { ...state }
        case 'updateQuestion':
            current_page[action.payload.id] = action.payload.question
            return { ...state }
        case 'dragStart':
            return { ...state, drag: action.payload }
        case 'dropEnd':
            if (state.drag !== action.payload) {
                const temp = { ...current_page[state.drag], list_order: action.payload }
                current_page[state.drag] = { ...current_page[action.payload], list_order: state.drag }
                current_page[action.payload] = temp;
                sortByListOrder(current_page)
            }
            return { ...state, drag: -1 };
        default:
            throw new Error("Invalid Action");
    }
}

export const StateContext = React.createContext({
    state: initialState,
    dispatch: (param: { type: string, payload?: any }) => { }
});