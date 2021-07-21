export enum FieldType {
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

export type QuestionOptions = {
    min?: number;
    max?: number;
    max_size?: number;
    step?: number;
    multiple?: boolean;
    items?: string[];
    url?: string;
    jsonpath?: string;
    type?: 'Star' | 'Table';
    choices?: string | undefined;
}

export type Question = {
    list_order: number;
    visibleIf: string[];
    requiredIf: string[];
    id: string;
    question: string;
    description: string;
    option: QuestionOptions;
    field: FieldType;
    delete?: boolean;
};