import React, { FC, useContext } from 'react';
import {StateContext} from '../state';

const PageManager: FC = () => {
    const {state, dispatch} = useContext(StateContext);

    const AddPage = (event: React.MouseEvent) => {
        event.preventDefault();
        dispatch({type: 'addPage'});
    }

    return (
        <ul className="nav nav-tabs">
            {state.pages.map((_, page) => {
                const activeClass = page + 1 === state.activePage;
                return (
                    <li className="nav-item" key={page} onClick={() => {
                        dispatch({type: 'setActivePage', payload: page + 1})
                    }}>
                        <a className={`nav-link ${activeClass ? 'active' : ''}`} href="#">
                            Page {page + 1}
                            {activeClass && page > 0 &&
                                <button 
                                    onDoubleClick={() => {
                                        if (page > 0) {
                                            dispatch({type: "removePage", payload: page});
                                        }
                                    }}
                                    title="double click to delete"
                                    className="btn btn-sm btn-outline-danger"
                                    style={{
                                        marginLeft: '5px',
                                        padding: '1px',
                                        height: '22px',
                                        width: '22px'
                                    }}>
                                        X
                                </button>
                            }
                        </a>
                    </li>
                )
            })}
            <li className="nav-item">
                <a className="nav-link" href="#" onClick={AddPage}>+ Add a new page</a>
            </li>
        </ul>
    );
};

export default PageManager;
