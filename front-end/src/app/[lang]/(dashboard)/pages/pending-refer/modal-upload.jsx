'use client'
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
    List,
    Card,
    Grid,
    Box,
    CardContent
} from '@mui/material';


// MUI Imports

import classnames from 'classnames'

// MUI Imports 
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { toast } from 'react-toastify'
import axios from 'axios'; 
// Icon Imports
import { useDropzone } from 'react-dropzone'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'
import { styled } from '@mui/material/styles'
import { useSession } from 'next-auth/react';
import { useRouter, useParams, useSearchParams } from 'next/navigation'
const Dropzone = styled(AppReactDropzone)(({ theme }) => ({
    '& .dropzone': {
        minHeight: 'unset',
        padding: theme.spacing(12),
        [theme.breakpoints.down('sm')]: {
            paddingInline: theme.spacing(5)
        },
        '&+.MuiList-root .MuiListItem-root .file-name': {
            fontWeight: theme.typography.body1.fontWeight
        }
    }
}))

const ModalUpload = ({ open, handleClose, referId, dataRefer, onUpdate }) => {
    const [files, setFiles] = useState([])
    const { data: session, status } = useSession();
    const router = useRouter()
    // Hooks
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 10,
        maxSize: 5 * 1024 * 1024,
        accept: {
            // 'image/*': ['.png', '.jpg', '.jpeg', '.gif']
            'image/*':[],
            'application/*':['.pdf']
        },
        onDrop: acceptedFiles => {
          // ตรวจสอบว่ามีไฟล์ที่ชื่อเป็นภาษาไทยหรือไม่
          const thaiFile = acceptedFiles.find(file => /[\u0E00-\u0E7F]/.test(file.name));
  
          if (thaiFile) {
              toast.warning('กรุณาตั้งชื่อไฟล์เป็นภาษาอังกฤษ (a-z, 0-9, _, -)!', { autoClose: 3000 });
              return;
          }
  
          // ถ้าไม่มีไฟล์ภาษาไทย ก็เซ็ตค่าปกติ
          setFiles(acceptedFiles.map(file => Object.assign(file)));
      },
      onDropRejected: () => {
          toast.error('You can only upload 10 files & maximum size of 5 MB.', { autoClose: 3000 });
      }
    })
    //console.log(referId)
    const renderFilePreview = file => {
        if (file.type.startsWith('image')) {
            return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
        } else {
            return <i className='tabler-file-description' />
        }
    }

    const UploadFiles = async () => {
        //const uploadedFiles = files
        //const filtered = uploadedFiles.filter(i => i.name !== file.name)
        const formData = new FormData();

        //console.log(files) 
       
        const addHours = (dateString, hours) => {
          const date = new Date(dateString);
          date.setHours(date.getHours() + hours);
          return date.toISOString(); 
        };
        files.forEach((file, index) => {
          formData.append(`img`, file);  // Use `files[]` for array-style uploads
          formData.append(`file_name`, file.name); 
          formData.append(`img_url`, file.path);
        });
        formData.append(`upload_type`, "2");  
        formData.append(`s3Path`, 'refer'); 
        formData.append(`refer_id`, referId); 

        //console.log("upload", upload)
        // const img = new FormData();
        // img.append('img', files[0].name);
        // img.append('path', files[0].path);
        // img.append('s3Path', 'refer') 
        const response = await axios
          .post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/upload/refer_img`, formData, {
            headers: {
              Authorization: `${session.user?.token}`,
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            if (response.data.length > 0) {
              //alert('Upload Success')
              toast.success('Upload Success', { autoClose: 3000 })
            }
            onUpdate()
            handleClose()
            router.push('/pages/pending-refer')
            console.log(response)
          })
        
         
       
       
      
      // const array = []
      //   files.forEach(item => {
      //     const data = {
      //       refer_id: referId,
      //       customer_id: dataRefer.customer_id,
      //       file_name: item.name,
      //       file_path: "refer/img/",
      //       createdate: addHours(new Date().toISOString(), 7 ) 
      //     }
      //     array.push(data)
      //   })
        
      //   console.log("Upload", array)

    }

    const handleRemoveFile = file => {
        const uploadedFiles = files
        const filtered = uploadedFiles.filter(i => i.name !== file.name)

        setFiles([...filtered])
    }

    const fileList = files.map(file => (
        <ListItem key={file.name}>
            <div className='file-details'>
                <div className='file-preview'>{renderFilePreview(file)}</div>
                <div>
                    <Typography className='file-name'>{file.name}</Typography>
                    <Typography className='file-size' variant='body2'>
                        {Math.round(file.size / 100) / 10 > 1000
                            ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                            : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                    </Typography>
                </div>
            </div>
            <IconButton onClick={() => handleRemoveFile(file)}>
                <i className='tabler-x text-xl' />
            </IconButton>
        </ListItem>
    ))

    const handleRemoveAllFiles = () => {
        setFiles([])
    }

    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }} 
        >
          <Box className='pt-2'>
            <DialogTitle component='span'>
              <span>อัปโหลดรูปภาพ</span>
            </DialogTitle>
          </Box>
          <span className='pt-2 pr-2' style={{ fontSize: '0.875rem', color: 'gray' }}>Refer-ID: {dataRefer.id}</span>
        </Box>
        <DialogContent dividers>
          <>
            <Dropzone>
              <Card>
                <CardContent>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className='flex items-center flex-col'>
                      <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                        <i className='tabler-upload' />
                      </Avatar>
                      <Typography variant='h4' className='mbe-2.5'>
                        ลากไฟล์หรือกดเพื่ออัปโหลด
                      </Typography>
                      <Typography>ชนิดไฟล์ที่อัปโหลดได้ *.jpeg, *.jpg, *.png, *.gif *.pdf</Typography>
                      <Typography>สูงสุด 10 ไฟล์ และขนาดไม่เกิน 5 MB</Typography>
                      <Typography className='text-error'>หากเป็น .pdf อัปโหลดได้ครั้งละ 1 ไฟล์และขนาดไม่เกิน 5 MB</Typography>
                    </div>
                  </div>
                  {files.length ? (
                    <>
                      <List>{fileList}</List>
                      <div className='buttons'>
                        <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                          Remove All
                        </Button>
                      </div>
                    </>
                  ) : null}
                </CardContent>
              </Card>
            </Dropzone>
          </>
        </DialogContent>
        <DialogActions className={classnames('dialog-actions-dense', { '!pt-3': scroll === 'paper' })}>
          {files.length ? (
            <>
              <div className='buttons pt-3'>
                <Button color='primary' variant='outlined' onClick={()=>{handleRemoveAllFiles(), handleClose()}}>
                  Cancel
                </Button>
                <Button onClick={UploadFiles} variant='contained'>
                  Upload Files
                </Button>
              </div>
            </>
          ) : (
            <div className='buttons pt-3'>
              <Button onClick={()=>{handleRemoveAllFiles(), handleClose()}} color='primary' variant='outlined'>
                Cancel
              </Button>
            </div>
          )}
        </DialogActions>
      </Dialog>
    )
}

export default ModalUpload