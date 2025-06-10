// import React from 'react'
// MUI Imports
'use client'
import { useState } from 'react'

// Third-party Imports
import { toast } from 'react-toastify'

// MUI Imports

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports

import { useDropzone } from 'react-dropzone'
import { Grid } from '@mui/material'

export default function UploadFiles({ files, setFiles, isViewOnly }) {

    // States
    const [uploading, setUploading] = useState(false);

    // Hooks
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 10,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.pdf']
            // 'application/*':['.pdf']
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file)))
        },
        onDropRejected: () => {
            toast.error('You can only upload 10 files & maximum size of 2 MB.', {
                autoClose: 3000
            })
        },
    })

    const renderFilePreview = file => {
        if (file.type.startsWith('image')) {
            return <img style={{ borderRadius: "6px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} width={150} height={150} alt={file.name} src={URL.createObjectURL(file)} />
        } else {
            return <div><i className='tabler-file-description text-[100px]' /> <Typography className='file-name'>{file.name}</Typography> </div>
        }
    }

    const handleRemoveFile = file => {
        const uploadedFiles = files
        const filtered = uploadedFiles.filter(i => i.name !== file.name)

        setFiles([...filtered])
    }

    const handleUpload = () => {
        const formData = new FormData();
        files.forEach((file) => {
            // formData.append('files[]', file as unknown as FileType);
            formData.append('files[]', file);
        });

        // console.log(files,'formData')

        setUploading(true);
        // You can use any AJAX library you like
        fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then(() => {
                setFiles([]);
                // message.success('upload successfully.');
                toast.success('upload successfully.')
            })
            .catch(() => {
                // message.error('upload failed.');
                toast.error('upload failed.')
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const handleRemoveAllFiles = () => {
        setFiles([])
    }

    return (
        <>
            <Grid className='space-y-3'>
                {files.length ? (
                    // <>
                    <Grid container spacing={6} justifyContent="center" alignItems="center">
                        {files.map(file => (
                            <Grid item xs={12} sm={3} md={2} key={file.name}>
                                <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div className='file-details' style={{ textAlign: 'center' }}>
                                        <div className='file-preview' >{renderFilePreview(file)}</div>
                                        {/* <div>
                                                <Typography className='file-name'>{file.name}</Typography>
                                                <Typography className='file-size' variant='body2'>
                                                    {Math.round(file.size / 100) / 10 > 1000
                                                        ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                                                        : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                                                </Typography>
                                            </div> */}
                                    </div>
                                    {!isViewOnly &&
                                        <IconButton onClick={() => handleRemoveFile(file)}>
                                            <i className='tabler-x text-xl' />
                                        </IconButton>
                                    }
                                </ListItem>
                            </Grid>
                        ))}

                    </Grid>
                ) : null}

                {files.length >= 10 ? null :
                    !isViewOnly && (
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <div className='flex items-center flex-col'>
                                <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                                    <i className='tabler-upload' />
                                </Avatar>
                                <Typography variant='h4' className='mbe-2.5'>
                                    Drop files here or click to upload.
                                </Typography>
                                <Typography>Allowed *.jpeg, *.jpg, *.png, *.pdf</Typography>
                                <Typography>Max 10 files</Typography>
                            </div>
                        </div>)

                }
                {files.length ? (
                    !isViewOnly && (
                        <Grid container spacing={3} justifyContent="center" alignItems="center">
                            <div className='buttons space-x-3'>
                                <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                                    Remove All
                                </Button>
                                <Button variant='contained' disabled={uploading} onClick={handleUpload}>{uploading ? 'Uploading' : 'Start Upload'}</Button>
                            </div>
                        </Grid>
                    )
                    // </>
                ) : null}


            </Grid>
        </>
    )
}
