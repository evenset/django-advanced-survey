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

export type Question = {
    list_order: number;
    visibleIf: string[];
    id: string;
    question: string;
    description: string;
    option: {
        choices?: string | undefined;
    };
    field: FieldType;
    delete?: boolean;
};