"use client";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Italic, Essentials, Heading, Link, Paragraph, List } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function CKEditorWrapper({ value, onChange }: Props) {
    return (
        <CKEditor
            editor={ClassicEditor}
            config={{
                licenseKey: 'GPL',
                plugins: [Essentials, Bold, Italic, Heading, Link, Paragraph, List],
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
            }}
            data={value}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
}
