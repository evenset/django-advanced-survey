import React, {FC, FormEvent, useState} from 'react'

type Props = {
    options?: string[],
    changeHandler: (options: string[]) => void,
}

const OptionsWidget: FC<Props> = ({options = [], changeHandler}) => {
    const [value, setValue] = useState<string>('');
    const [dragStart, setDragStart] = useState<number>(-1);

    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (value && options.indexOf(value) === -1) {
            changeHandler([...options, value])
            setValue('');
        }
    }

    const removeAt = (index: number) => {
        const new_options = options.filter((_, idx) => {
            return idx !== index;
        })
        changeHandler([...new_options]);
    }

    return (
        <form onSubmit={submitHandler}>
            <input placeholder="Type and press enter to add a new item" type="text" className="form-control" value={value} onChange={e => setValue(e.target.value)} />
            <div className="mt-2">double click to remove, drag and drop to replace</div>
            <div className="clearfix">
                <ul style={{listStyle: "none", paddingInlineStart: 0, marginTop: '10px', marginBottom: '10px'}}>
                    {options.map((option, index) => (
                        <li
                            draggable={true}
                            onDragStart={() => setDragStart(index)}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => {
                                e.preventDefault();
                                if (dragStart !== index) {
                                    const new_options = [...options];
                                    const temp = new_options[index];
                                    new_options[index] = new_options[dragStart];
                                    new_options[dragStart] = temp;
                                    changeHandler([...new_options]);
                                }
                                setDragStart(-1);
                            }}                      
                            key={index}
                            style={{float: "left", marginRight: "10px", cursor: "pointer"}}
                            title="double click to delete"
                            onDoubleClick={() => removeAt(index)}>
                                <h5><span className="badge bg-secondary">{option}</span></h5>
                        </li>
                    ))} 
                </ul>
            </div>
        </form>
    )
}

export default OptionsWidget;