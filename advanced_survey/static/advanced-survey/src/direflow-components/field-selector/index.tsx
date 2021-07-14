import React, { FC, useState, useEffect, useContext } from 'react';
import { StateContext } from '../state';

enum FieldType {
    LineEdit,
    TextArea,
    Select,
    Checkbox,
    Radiobox,
    Email,
    URL,
    Phone,
    Boolean,
    Numeric,
    File,
    Image,
    Date,
    Time,
    Rating
}

interface IProps {
    index: number;
    question: any;
}

const FieldSelector: FC<IProps> = ({index, question}) => {
    const [fieldtype, setFieldtype] = useState<string>(question.field);
    const [options, setOptions] = useState<any>(question.options || {});
    const {dispatch} = useContext(StateContext);

    const setOption = (property: string, value: any) => {
        setOptions((old: any) => {
            return {...old, [property]: value};
        })
    }

    useEffect(() => {
        dispatch({type: 'updateQuestion', payload: {
            id: index,
            question: {...question, option: options, field: fieldtype}
        }})
    }, [options, dispatch, fieldtype])

    return (
        <>
            <div className="form-group mb-2">
                <label>Field Type:</label>
                <select value={fieldtype} className="form-control" onChange={e => {
                    setFieldtype(e.target.value);
                    setOptions({});
                }}>
                    {Object.keys(FieldType).map((key: string) => {
                        if (isNaN(parseInt(key))) return null;
                        return <option key={key}>{FieldType[parseInt(key)]}</option>
                    })}
                </select>
            </div>
            {fieldtype === "TextArea" &&
                <>
                    <div className="form-group mb-2">
                        <label>Min characters:</label>
                        <input type="number" className="form-control" value={options.min} onChange={e => setOption("min", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Max characters:</label>
                        <input type="number" className="form-control" value={options.max} onChange={e => setOption("max", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "Select" &&
                <>
                    <div className="form-group mb-2">
                        <label><input type="checkbox" checked={options.multiple} onChange={e => setOption("multiple", e.target.checked)} /> Multiple choice</label>
                    </div>
                    <div className="form-group mb-2">
                        <label>Max choices:</label>
                        <input type="number" className="form-control" value={options.max} onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Choices:</label>
                        <textarea className="form-control" value={options.choices} onChange={e => setOption("choices", e.target.value)}></textarea>
                    </div>
                    <div className="form-group mb-2">
                        <label>Choices URL:</label>
                        <input type="url" className="form-control" value={options.url} onChange={e => setOption("url", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "Checkbox" &&
                <>
                    <div className="form-group mb-2">
                        <label>Min choices:</label>
                        <input type="number" className="form-control" value={options.min} onChange={e => setOption("min", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Max choices:</label>
                        <input type="number" className="form-control" value={options.max} onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Choices:</label>
                        <textarea className="form-control" value={options.choices} onChange={e => setOption("choices", e.target.value)}></textarea>
                    </div>
                    <div className="form-group mb-2">
                        <label>Choices URL:</label>
                        <input type="url" className="form-control" value={options.url} onChange={e => setOption("url", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "Radiobox" &&
                <>
                    <div className="form-group mb-2">
                        <label>Choices:</label>
                        <textarea className="form-control" value={options.choices} onChange={e => setOption("choices", e.target.value)}></textarea>
                    </div>
                    <div className="form-group mb-2">
                        <label>Choices URL:</label>
                        <input type="url" className="form-control" value={options.url} onChange={e => setOption("url", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "Numeric" &&
                <>
                    <div className="form-group mb-2">
                        <label>Min:</label>
                        <input type="number" className="form-control" value={options.min} onChange={e => setOption("min", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Max:</label>
                        <input type="number" className="form-control" value={options.max} onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Step:</label>
                        <input type="number" className="form-control" value={options.step} onChange={e => setOption("step", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "File" &&
                <>
                    <div className="form-group mb-2">
                        <label><input type="checkbox" checked={options.multiple} onChange={e => setOption("multiple", e.target.checked)} /> Multiple files</label>
                    </div>
                    <div className="form-group mb-2">
                        <label>Max files:</label>
                        <input type="number" className="form-control" value={options.max} onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Max file size (kb):</label>
                        <input type="number" className="form-control" value={options.max_size} onChange={e => setOption("max_size", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Allowed exts:</label>
                        <textarea className="form-control" value={options.exts} onChange={e => setOption("exts", e.target.value)}></textarea>
                    </div>
                </>
            }
            {fieldtype === "Image" &&
                <>
                    <div className="form-group mb-2">
                        <label><input type="checkbox" checked={options.multiple} onChange={e => setOption("multiple", e.target.checked)} /> Multiple images</label>
                    </div>
                    <div className="form-group mb-2">
                        <label>Max images:</label>
                        <input type="number" className="form-control" value={options.max} onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Max image size (kb):</label>
                        <input type="number" className="form-control" value={options.max_size} onChange={e => setOption("max_size", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "Date" &&
                <>
                    <div className="form-group mb-2">
                        <label>Min:</label>
                        <input type="date" className="form-control" value={options.min} onChange={e => setOption("min", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Max:</label>
                        <input type="date" className="form-control" value={options.max} onChange={e => setOption("max", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "Rating" &&
                <>
                    <div className="form-group mb-2">
                        <label>Max:</label>
                        <select className="form-control" value={options.max} onChange={e => setOption("max", e.target.value)}>
                            <option>5</option>
                            <option>10</option>
                        </select>
                    </div>
                    <div className="form-group mb-2">
                        <label>Type:</label>
                        <select className="form-control" value={options.type} onChange={e => setOption("type", e.target.value)}>
                            <option>Star</option>
                            <option>Table</option>
                        </select>
                    </div>
                    <div className="form-group mb-2">
                        <label>Items:</label>
                        <textarea className="form-control" value={options.items} onChange={e => setOption("items", e.target.value)}></textarea>
                    </div>
                    <div className="form-group mb-2">
                        <label>Items URL:</label>
                        <input type="url" className="form-control" value={options.url} onChange={e => setOption("url", e.target.value)} />
                    </div>
                </>
            }
        </>
    );
};

export default FieldSelector;
