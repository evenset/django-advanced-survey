import React, { FC, useState, useEffect } from 'react';

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
    OnFieldSet: (options: any) => void;
}

const FieldSelector: FC<IProps> = ({OnFieldSet}) => {
    const [fieldtype, setFieldtype] = useState<string>();
    const [options, setOptions] = useState<any>({});

    const setOption = (property: string, value: any) => {
        setOptions((old: any) => {
            return {...old, [property]: value};
        })
    }

    useEffect(() => {
        OnFieldSet({fieldtype, options})
    }, [options, OnFieldSet])

    return (
        <>
            <div className="form-group">
                <label>Field Type:</label>
                <select className="form-control" onChange={e => {
                    setFieldtype(e.target.value);
                    setOptions({});
                }}>
                    {Object.keys(FieldType).map((key: string) => {
                        if (isNaN(parseInt(key))) return;
                        return <option key={key}>{FieldType[parseInt(key)]}</option>
                    })}
                </select>
            </div>
            {fieldtype === "TextArea" &&
                <>
                    <div className="form-group">
                        <label>Min characters:</label>
                        <input type="number" className="form-control" onChange={e => setOption("min", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Max characters:</label>
                        <input type="number" className="form-control" onChange={e => setOption("max", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "Select" &&
                <>
                    <div className="form-group">
                        <label><input type="checkbox" onChange={e => setOption("multiple", e.target.checked)} /> Multiple choice</label>
                    </div>
                    <div className="form-group">
                        <label>Max choices:</label>
                        <input type="number" className="form-control" onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Choices:</label>
                        <textarea className="form-control" onChange={e => setOption("choices", e.target.value)}></textarea>
                    </div>
                </>
            }
            {fieldtype === "Checkbox" &&
                <>
                    <div className="form-group">
                        <label>Min choices:</label>
                        <input type="number" className="form-control" onChange={e => setOption("min", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Max choices:</label>
                        <input type="number" className="form-control" onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Choices:</label>
                        <textarea className="form-control" onChange={e => setOption("choices", e.target.value)}></textarea>
                    </div>
                </>
            }
            {fieldtype === "Radiobox" &&
                <>
                    <div className="form-group">
                        <label>Choices:</label>
                        <textarea className="form-control" onChange={e => setOption("choices", e.target.value)}></textarea>
                    </div>
                </>
            }
            {fieldtype === "Numeric" &&
                <>
                    <div className="form-group">
                        <label>Min:</label>
                        <input type="number" className="form-control" onChange={e => setOption("min", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Max:</label>
                        <input type="number" className="form-control" onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Step:</label>
                        <input type="number" className="form-control" onChange={e => setOption("step", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "File" &&
                <>
                    <div className="form-group">
                        <label><input type="checkbox" onChange={e => setOption("multiple", e.target.checked)} /> Multiple files</label>
                    </div>
                    <div className="form-group">
                        <label>Max files:</label>
                        <input type="number" className="form-control" onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Max file size (kb):</label>
                        <input type="number" className="form-control" onChange={e => setOption("max_size", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Allowed exts:</label>
                        <textarea className="form-control" onChange={e => setOption("exts", e.target.value)}></textarea>
                    </div>
                </>
            }
            {fieldtype === "Image" &&
                <>
                    <div className="form-group">
                        <label><input type="checkbox" onChange={e => setOption("multiple", e.target.checked)} /> Multiple images</label>
                    </div>
                    <div className="form-group">
                        <label>Max images:</label>
                        <input type="number" className="form-control" onChange={e => setOption("max", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Max image size (kb):</label>
                        <input type="number" className="form-control" onChange={e => setOption("max_size", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "Date" &&
                <>
                    <div className="form-group">
                        <label>Min:</label>
                        <input type="date" className="form-control" onChange={e => setOption("min", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Max:</label>
                        <input type="date" className="form-control" onChange={e => setOption("max", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === "Rating" &&
                <>
                    <div className="form-group">
                        <label>Max:</label>
                        <select className="form-control" onChange={e => setOption("max", e.target.value)}>
                            <option>5</option>
                            <option>10</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Type:</label>
                        <select className="form-control" onChange={e => setOption("type", e.target.value)}>
                            <option>Star</option>
                            <option>Table</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Items:</label>
                        <textarea className="form-control" onChange={e => setOption("items", e.target.value)}></textarea>
                    </div>
                </>
            }
        </>
    );
};

export default FieldSelector;
