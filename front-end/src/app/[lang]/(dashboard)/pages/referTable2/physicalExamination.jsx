import { Grid, Typography } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import React, { useEffect, useState } from 'react'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
export default function PhysicalExamination({ formValues, setFormValues, isViewOnly }) {


    const initializeEditorState = (formValues) => {
        if (formValues?.ga && formValues?.pe && formValues?.docNote) {
            try {
                const contentStateGA = convertFromRaw(JSON.parse(formValues.ga));
                const contentStatePE = convertFromRaw(JSON.parse(formValues.pe));
                const contentStateDocNote = convertFromRaw(JSON.parse(formValues.docNote));

                return {
                    editorStateGA: EditorState.createWithContent(contentStateGA),
                    editorStatePE: EditorState.createWithContent(contentStatePE),
                    editorStateDocNote: EditorState.createWithContent(contentStateDocNote),

                };
            } catch (e) {
                // console.error("Failed to parse editor content:", e);
                return {
                    editorStateGA: EditorState.createEmpty(),
                    editorStatePE: EditorState.createEmpty(),
                    editorStateDocNote: EditorState.createEmpty(),

                };
            }
        }

        return {
            editorStateGA: EditorState.createEmpty(),
            editorStatePE: EditorState.createEmpty(),
            editorStateDocNote: EditorState.createEmpty(),
        };
    };

    const { editorStateGA, editorStatePE, editorStateDocNote } = initializeEditorState(formValues);
    const [value1, setValue1] = useState(editorStateGA);
    const [value2, setValue2] = useState(editorStatePE);
    const [value3, setValue3] = useState(editorStateDocNote)

    useEffect(() => {
        const content1 = JSON.stringify(convertToRaw(value1.getCurrentContent()));
        const content2 = JSON.stringify(convertToRaw(value2.getCurrentContent()));
        const content3 = JSON.stringify(convertToRaw(value3.getCurrentContent()));
        setFormValues((prevValues) => ({
            ...prevValues,
            ga: content1,
            pe: content2,
            docNote: content3,
        }));
    }, [value1, value2, value3, setFormValues]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => {
            const newValues = {
                ...prevValues,
                [name]: value,
            };
            // console.log(formValues, "formValues---");
            return newValues;
        });
    }
    const handleEditChange = (editorState, name) => {

        // const contentState = editorState.getCurrentContent();
        const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

        setFormValues((prevValues) => {
            const newValues = {
                ...prevValues,
                [name]: content,
            };
            // console.log(newValues, 'formValues');
            return newValues;
        });
    }

    const toolbarOptions = {
        options: ['inline', 'list', 'textAlign'],
        inline: {
            options: ['bold'],
        },
        list: {
            options: ['unordered', 'ordered'],
        },
        textAlign: {
            options: ['left', 'center', 'right', 'justify'],
        }
    };

    return (
        <>
            <Grid container spacing={2} className='p-3'>
                <Grid item xs={12} md={6} style={{ paddingRight: "1em" }} className='space-y-3'>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={4} md={2}>
                        </Grid>
                        <Grid item xs={4} md={5}>
                            <Typography className='file-name' align='center'>RE</Typography>
                        </Grid>
                        <Grid item xs={4} md={5}>
                            <Typography className='file-name' align='center'>LE</Typography>
                        </Grid>


                    </Grid>
                    <Grid container spacing={3} >
                        <Grid item xs={3} md={2} className='space-y-7' style={{ textAlign: "right" }}>
                            <Typography className='file-name'>VA sc</Typography>
                            <Typography className='file-name'>VA cc</Typography>
                            <Typography className='file-name'>IOP at</Typography>
                        </Grid>
                        <Grid item xs={5} md={5} className='space-y-3'>

                            <CustomTextField name="VAscRE" value={formValues.VAscRE} onChange={handleChange} fullWidth disabled={isViewOnly} />
                            <CustomTextField name="VAccRE" value={formValues.VAccRE} onChange={handleChange} fullWidth disabled={isViewOnly} />
                            <CustomTextField name="IOPatRE" value={formValues.IOPatRE} onChange={handleChange} fullWidth disabled={isViewOnly} />
                        </Grid>
                        <Grid item xs={4} md={5} className='space-y-3'>
                            <CustomTextField name="VAscLE" value={formValues.VAscLE} onChange={handleChange} fullWidth disabled={isViewOnly} />
                            <CustomTextField name="VAccLE" value={formValues.VAccLE} onChange={handleChange} fullWidth disabled={isViewOnly} />
                            <CustomTextField name="IOPatLE" value={formValues.IOPatLE} onChange={handleChange} fullWidth disabled={isViewOnly} />
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={12} md={6} className='space-y-3'>

                    <Editor
                        placeholder="GA:"
                        editorState={value1}
                        toolbar={toolbarOptions}
                        onEditorStateChange={(data) => {
                            setValue1(data);
                            handleEditChange(data, 'ga');
                        }}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        readOnly={isViewOnly}
                    />
                    <Editor
                        placeholder="PE:"
                        editorState={value2}
                        toolbar={toolbarOptions}
                        onEditorStateChange={(data) => {
                            setValue2(data);
                            handleEditChange(data, 'pe');
                        }}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        readOnly={isViewOnly}
                    />
                    <Editor
                        placeholder="Doctor Note"
                        editorState={value3}
                        toolbar={toolbarOptions}
                        onEditorStateChange={(data) => {
                            setValue3(data);
                            handleEditChange(data, 'docNote');
                        }}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        readOnly={isViewOnly}
                    />
                </Grid>
            </Grid>
        </>
    )
}
