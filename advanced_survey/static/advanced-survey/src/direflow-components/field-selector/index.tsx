import React, { FC, useState, useEffect, useContext } from 'react';

import OptionsWidget from '../options-widget';
import { StateContext } from '../state';
import {FieldType, FieldTypeNames, QuestionOptions, Question} from '../types';

type OptionKey = keyof QuestionOptions

interface IProps {
    index: number;
    question: Question;
}

const FieldSelector: FC<IProps> = ({index, question}) => {
    const [fieldtype, setFieldtype] = useState<FieldType>(question.field);
    const [options, setOptions] = useState<QuestionOptions>(question.option || {});
    const {dispatch} = useContext(StateContext);
    
    function setOption<K extends OptionKey>(property: OptionKey, value: QuestionOptions[K]) {
        setOptions((old: QuestionOptions) => {
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
                    setFieldtype(e.target.value as FieldType);
                    setOptions({});
                }}>
                    {Object.keys(FieldType).map((key: string) => (
                        <option key={key} value={key}>{FieldTypeNames[key as FieldType]}</option>)
                    )}
                </select>
            </div>
            {fieldtype === FieldType.TextArea &&
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
            {fieldtype === FieldType.Select &&
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
                        <OptionsWidget options={options.items} changeHandler={(ops: string[])=> setOption("items", ops)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Choices URL:</label>
                        <input type="url" className="form-control" value={options.url} onChange={e => setOption("url", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>JSON field path:</label>
                        <input type="text" className="form-control" value={options.jsonpath} onChange={e => setOption("jsonpath", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === FieldType.Checkbox &&
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
                        <OptionsWidget options={options.items} changeHandler={(ops: string[])=> setOption("items", ops)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Choices URL:</label>
                        <input type="url" className="form-control" value={options.url} onChange={e => setOption("url", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>JSON field path:</label>
                        <input type="text" className="form-control" value={options.jsonpath} onChange={e => setOption("jsonpath", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === FieldType.Radiobox &&
                <>
                    <div className="form-group mb-2">
                        <label>Choices:</label>
                        <OptionsWidget options={options.items} changeHandler={(ops: string[])=> setOption("items", ops)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Choices URL:</label>
                        <input type="url" className="form-control" value={options.url} onChange={e => setOption("url", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>JSON field path:</label>
                        <input type="text" className="form-control" value={options.jsonpath} onChange={e => setOption("jsonpath", e.target.value)} />
                    </div>
                </>
            }
            {fieldtype === FieldType.Numeric &&
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
            {fieldtype === FieldType.File &&
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
                        <OptionsWidget options={options.items} changeHandler={(ops: string[])=> setOption("items", ops)} />
                    </div>
                </>
            }
            {fieldtype === FieldType.Image &&
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
            {fieldtype === FieldType.Date &&
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
            {fieldtype === FieldType.Rating &&
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
                        <OptionsWidget options={options.items} changeHandler={(ops: string[])=> setOption("items", ops)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>Items URL:</label>
                        <input type="url" className="form-control" value={options.url} onChange={e => setOption("url", e.target.value)} />
                    </div>
                    <div className="form-group mb-2">
                        <label>JSON field path:</label>
                        <input type="text" className="form-control" value={options.jsonpath} onChange={e => setOption("jsonpath", e.target.value)} />
                    </div>
                </>
            }
        </>
    );
};

export default FieldSelector;
