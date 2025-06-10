import { useEffect, useState, useMemo } from 'react'
import {
  Card,
  Typography,
  Chip,
  IconButton,
  styled,
  TablePagination,
  MenuItem,
  Tooltip,
  CardHeader,
  Button,
  Divider,
  Grid
} from '@mui/material'
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import axios from 'axios'
import { getInitials } from '@/utils/getInitials'
import tableStyles from '@core/styles/table.module.css'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import DataNotFound from '@/views/DataNotFound'

import PendingReferTableFilter from './pending-refer-table-filter'
import ModalUpload from './modal-upload'
// import StepperCustomHorizontal from '@/views/pages/refer/step-refer-modal'; // Import the new EditDialog component
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
const Viewer = dynamic(() => import('react-viewer'), { ssr: false })
const Icon = styled('i')({})

import { toast } from 'react-toastify'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
//   const [value, setValue] = useState(initialValue);

//   useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value);
//     }, debounce);

//     return () => clearTimeout(timeout);
//   }, [value]);

//   return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
// };

const columnHelper = createColumnHelper()

const userStatusObj = {
  0: 'secondary',
  1: 'warning',
  2: 'error'
}

const statusObj = {
  1: 'warning',
  2: 'success',
  6: 'info'
}

const getAvatar = ({ avatar }) => {
  if (avatar) {
    return <CustomAvatar src={avatar} size={34} />
  }
}

const formatDate = string => {
  if (string != null) {
    let year = string.substring(0, 4)
    let sumYear = year.substring(0, 10)
    let mount = string.substring(5, 7)
    let day = string.substring(8, 10)
    const time = new Date(string).toLocaleString('th-TH').substring(9, 15)
    var months_th_mini = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '12', '12']
    let date = sumYear + '-' + months_th_mini[mount - 1] + '-' + day + ' '
    return date
  } else {
    return string
  }
}

const fotmatTime = string => {
  if (!string) return string

  try {
    const date = new Date(string)
    // แปลงเป็นเวลาไทย
    const thaiTime = date.toLocaleTimeString('th-TH', {
      timeZone: 'Asia/Bangkok',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    return thaiTime
  } catch (error) {
    console.error('Error formatting time:', error)
    return string
  }
}

const Modal = ({ isOpen, onClose, content, onSave, referid, refreshData }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState(content)
  const { data: session } = useSession()

  const handleEditClick = () => {
    setIsEditing(true)
  }
  useEffect(() => {
    setEditableContent(content)
  }, [content])

  //console.log(content)

  const handleSaveClick = async () => {
    const dateEdit = new Date().toISOString()

    const date_ = formatDate(dateEdit)
    const time_ = formatDate(dateEdit)
    const dataForm = `${editableContent} วันที่:${date_} ${time_}`
    //onSave(editableContent);
    console.log(dataForm)
    setIsEditing(false)
    onClose() // Close the modal after saving

    try {
      const dataEdit = { note: dataForm } // Adjust the structure of your data as necessary

      // Save the edited data with axios POST request
      const refer = await axios.put(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${referid}`,
        {
          ...dataEdit
        },
        {
          headers: {
            Authorization: `${session.user?.token}`
          }
        }
      )
      console.log('Response:', refer)
      if (refer.status === 200) {
        refreshData()
        console.log('Response:', refer) // Log the API response for debugging
        setIsEditing(false)
        toast.success('บันทึกข้อมูลสำเร็จ')
        onClose() // Close the modal after saving
      }
    } catch (error) {
      console.error('Error saving data:', error) // Log the error for debugging
    }
  }

  const handleCancelClick = () => {
    setEditableContent(content) // Reset the content if editing is cancelled
    setIsEditing(false)
  }

  if (!isOpen) return null // Don't render if not open

  return (
    <>
      <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50'>
        <div className='bg-white p-6 rounded shadow-lg max-w-2xl w-full'>
          <h3>Consultation Note</h3>
          <Divider className='my-2' />
          {/* Editable content */}
          {isEditing ? (
            <textarea
              value={editableContent}
              onChange={e => setEditableContent(e.target.value)}
              className='w-full h-40 p-2 border border-gray-300 rounded'
              style={{ whiteSpace: 'pre-wrap', overflowY: 'auto' }}
            />
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: '300px' }}>{editableContent}</div>
          )}
          <Divider className='my-2' />
          {/* Action buttons */}
          <div className='mt-4'>
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveClick}
                  variant='contained'
                  color='success'
                  className='mr-2 px-4 py-2 text-white rounded hover:bg-green-700'
                >
                  บันทึก
                </Button>
                <Button
                  onClick={handleCancelClick}
                  variant='contained'
                  color='secondary'
                  className='px-4 py-2 text-white  rounded hover:bg-red-700'
                >
                  ยกเลิก
                </Button>
              </>
            ) : (
              ''
            )}
            <Button onClick={onClose} className='px-4 py-2 ' variant='outlined' color='secondary'>
              ปิด
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

const ReciveModal = ({ isOpen, onClose, content, onSave, referid, refreshData }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState(content)
  const { data: session } = useSession()
  const handleEditClick = () => {
    setIsEditing(true)
  }
  useEffect(() => {
    setEditableContent(content)
  }, [content])
  //console.log(content)

  const handleSaveClick = async () => {
    const dateEdit = new Date().toISOString().substring(0, 10)
    const timeEdit = new Date().toISOString()

    //const date_ = fotmatDate(dateEdit)
    const time_ = fotmatTime(timeEdit)
    const dataForm = `${editableContent} วันที่:${dateEdit} ${time_}`
    //onSave(editableContent);
    //console.log(dataEdit)
    setIsEditing(false)
    onClose() // Close the modal after saving

    try {
      const dataEdit = { doctor_note: dataForm } // Adjust the structure of your data as necessary

      // Save the edited data with axios POST request
      const refer = await axios.put(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${referid}`,
        {
          ...dataEdit
        },
        {
          headers: {
            Authorization: `${session.user?.token}`
          }
        }
      )
      console.log('Response:', refer)
      if (refer.status === 200) {
        refreshData()
        console.log('Response:', refer) // Log the API response for debugging
        setIsEditing(false)
        toast.success('บันทึกข้อมูลสำเร็จ')
        onClose() // Close the modal after saving
      }
    } catch (error) {
      console.error('Error saving data:', error) // Log the error for debugging
    }
  }

  const handleCancelClick = () => {
    setEditableContent(content) // Reset the content if editing is cancelled
    setIsEditing(false)
  }

  if (!isOpen) return null // Don't render if not open

  return (
    <>
      <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50'>
        <div className='bg-white p-6 rounded shadow-lg max-w-2xl w-full'>
          <h3>Doctor Note</h3>
          <Divider className='my-2' />
          {/* Editable content */}
          {isEditing ? (
            <textarea
              value={editableContent}
              onChange={e => setEditableContent(e.target.value)}
              className='w-full h-40 p-2 border border-gray-300 rounded'
              style={{ whiteSpace: 'pre-wrap', overflowY: 'auto' }}
            />
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: '300px' }}>{editableContent}</div>
          )}
          <Divider className='my-2' />
          {/* Action buttons */}
          <div className='mt-4'>
            {isEditing ? (
              <>
                <Button onClick={handleSaveClick} variant='outlined' color='primary' className='mr-2 px-4 py-2 rounded'>
                  บันทึก
                </Button>
                <Button onClick={handleCancelClick} className='px-4 py-2 ' variant='outlined' color='secondary'>
                  ยกเลิก
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleEditClick}
                  variant='outlined'
                  color='primary'
                  className='px-4 py-2 text-whitehover:bg-blue-700'
                >
                  แก้ไข
                </Button>
                <Button onClick={onClose} className='ml-2 px-4 py-2 ' variant='outlined' color='secondary'>
                  ปิด
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const NotesCell = ({ data, index, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const maxLength = 20 // Define the maximum length before truncation
  // Safely handle null or undefined note
  const safeNote = data.original.note || ''
  const referid = data.original.id

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <>
      <div className='flex items-center gap-4 p-2'>
        <div
          style={{
            whiteSpace: 'no-wrap',
            overflow: 'auto',
            maxHeight: '150px', // Adjust height for limited view
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#333'
          }}
        >
          {safeNote.length <= maxLength ? safeNote : `${safeNote.slice(0, maxLength)}...`}
          {safeNote.length > maxLength && safeNote ? (
            // <Chip
            //   variant='tonal'
            //   className='capitalize mx-2'
            //   label={'Show More'}
            //   color='info'
            //   size='small'
            //   onClick={toggleModal}
            //   icon={<i className='tabler-eye text-[18px] text-info' />}
            // />
            <Tooltip title='ดูเพิ่มเติม'>
              <IconButton onClick={toggleModal}>
                <i className='tabler-eye text-[25px]  text-primary hover:text-secondary cursor-pointer' />
              </IconButton>
            </Tooltip>
          ) : (
            ''
          )}
        </div>
        {/* Modal  */}
        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          content={safeNote || 'No content available'}
          maxWidth='lg'
          referid={referid}
          index={index}
          refreshData={refreshData}
        />
      </div>
    </>
  )
}

const DoctorNotesCell = ({ data, index, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const maxLength = 20 // Define the maximum length before truncation
  // Safely handle null or undefined note
  const safeNote = data.original.doctor_note || ''
  const referid = data.original.id

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <>
      <div className='flex items-center gap-4 p-2'>
        <div
          style={{
            whiteSpace: 'no-wrap',
            overflow: 'auto',
            maxHeight: '150px', // Adjust height for limited view
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#333'
          }}
        >
          {safeNote.length <= maxLength ? safeNote : `${safeNote.slice(0, maxLength)}...`}
          {safeNote.length > maxLength && safeNote ? (
            // <Chip
            //   variant='tonal'
            //   className='capitalize mx-2'
            //   label={'Edit'}
            //   color='info'
            //   size='small'
            //   onClick={toggleModal}
            //   icon={<i className='tabler-pencil text-[18px] text-info' />}
            // />
            <Tooltip title='ดูเพิ่มเติม'>
              <IconButton onClick={toggleModal}>
                <i className='tabler-edit text-[25px] text-warning hover:text-secondary cursor-pointer' />
              </IconButton>
            </Tooltip>
          ) : (
            safeNote && (
              // <Chip
              //   variant='tonal'
              //   className='capitalize mx-2'
              //   label={'Edit'}
              //   color='info'
              //   size='small'
              //   onClick={toggleModal}
              //   icon={<i className='tabler-pencil text-[18px] text-info' />}
              // />
              <Tooltip title='แก้ไข'>
                <i
                  onClick={toggleModal}
                  className='tabler-edit text-[25px] ml-2 pt-2 text-warning hover:text-secondary cursor-pointer'
                />
              </Tooltip>
            )
          )}
        </div>
        {/* Modal  */}
        <ReciveModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          content={safeNote || 'No content available'}
          maxWidth='lg'
          referid={referid}
          index={index}
          refreshData={refreshData}
        />
      </div>
    </>
  )
}

const ImageCell = ({ row }) => {
  const [visible, setVisible] = useState(false) // สำหรับแสดง/ซ่อน Modal
  const [viewerVisible, setViewerVisible] = useState(false) // สำหรับแสดง/ซ่อน Viewer image
  const [activeIndex, setActiveIndex] = useState(0)
  const [images, setImages] = useState([])
  const { data: session } = useSession()
  const [visible_pdf, setVisible_pdf] = useState(false)
  const [pdffiles, setPdfFiles] = useState([])
  // ฟังก์ชันเพื่อดึง URL พร้อมโทเคนจาก S3
  const GetImageToken = async img_url => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/getfileupload`, {
        params: { file_name: img_url },
        headers: {
          Authorization: `${session.user?.token}`
        }
      })
      return response.data.img // คืนค่า URL ใหม่ที่มีโทเคน
    } catch (error) {
      console.error('Fetch image token failed:', error)
      return img_url // หากมีข้อผิดพลาด ให้ใช้ URL เดิม
    }
  }

  useEffect(() => {
    const fetchImagesWithToken = async () => {
      const newImages = await Promise.all(
        row.original.refer_img.map(async file => {
          if (file) {
            const urlWithToken = await GetImageToken(file.path)
            return { src: urlWithToken, alt: file.file_name }
          } else {
            return null // Exclude image if upload_type is not 1
          }
        })
      )
      const filteredImages = newImages.filter(image => image !== null && image.alt.slice(-3) !== 'pdf')
      const filteredPdfFile = newImages.filter(image => image !== null && image.alt.slice(-3) === 'pdf')

      setImages(filteredImages) // อัปเดตรายการรูปภาพพร้อมโทเคน
      setPdfFiles(filteredPdfFile)
    }

    fetchImagesWithToken()
  }, [row])

  // Handle view image modal click
  const handleViewImageClick = () => {
    setVisible(true) // เปิด Modal เมื่อคลิก "View Image"
  }

  // Handle image selection
  const handleImageSelection = index => {
    setActiveIndex(index) // ตั้งค่ารูปภาพที่ต้องการดู
    setVisible(false) // ปิด Modal แรก
    setViewerVisible(true) // เปิด Viewer image
  }

  const handleViewerClose = () => {
    setViewerVisible(false) // ปิด Viewer image
    setVisible(true) // เปิด Modal เลือกรูปภาพอีกครั้ง
  }
  // Handle view image modal click
  const handleViewPdfClick = () => {
    setVisible_pdf(true) // เปิด Modal เมื่อคลิก "View Image"
  }

  // Handle link pdffile
  const handleIPdfSelection = index => {
    window.open(pdffiles[index].src, '_blank')
  }

  return (
    <>
      {images.length > 0 ? (
        <>
          {/* ปุ่ม View Image */}

          {/* <Chip
            variant='tonal'
            className='capitalize mx-2'
            label={'View Image'}
            color='primary'
            size='small'
            onClick={handleViewImageClick}
            icon={<i className='tabler-photo text-[18px] text-textSecondary' />}
          /> */}
          <Tooltip title='ดูรูปภาพ'>
            <IconButton onClick={handleViewImageClick}>
              <i className='tabler-photo text-[25px] text-primary hover:text-secondary cursor-pointer'></i>
            </IconButton>
          </Tooltip>

          {/* Modal สำหรับแสดงรูปภาพที่เลือก */}
          {visible && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
              <div className='bg-white rounded-lg p-4 max-w-lg w-full'>
                <h2 className='text-lg font-semibold mb-4'>เลือกรูปภาพที่ต้องการดู</h2>
                <Divider className='my-2' />
                <div className='flex items-center gap-4'>
                  <Grid className='flex flex-wrap gap-4'>
                    {images.map((file, index) => (
                      <img
                        key={index}
                        src={file.src}
                        alt={file.alt}
                        className='w-24 h-24 object-contain  cursor-pointer rounded-lg shadow-lg hover:opacity-90'
                        onClick={() => handleImageSelection(index)}
                      />
                    ))}
                  </Grid>
                </div>
                <Divider className='my-2' />

                {/* ปุ่มปิด Modal */}
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => setVisible(false)}
                  className='mt-4 px-4 py-2 rounded-lg'
                >
                  ปิด
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <span></span>
      )}

      {pdffiles.length > 0 ? (
        <>
          {/* ปุ่ม View Image */}

          {/* <Chip
            variant='tonal'
            className='capitalize mx-2'
            label={'View Image'}
            color='primary'
            size='small'
            onClick={handleViewImageClick}
            icon={<i className='tabler-photo text-[18px] text-textSecondary' />}
          /> */}
          <Tooltip title='ดูรูปภาพ'>
            <IconButton onClick={handleViewPdfClick}>
              <i className='tabler-file-type-pdf text-[25px] text-error hover:text-secondary cursor-pointer'></i>
            </IconButton>
          </Tooltip>

          {/* Modal สำหรับแสดงรูปภาพที่เลือก */}
          {visible_pdf && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-4xl w-full'>
              <h2 className='text-lg font-semibold mb-4'>เลือกไฟล์ที่ต้องการดู</h2>
              <Divider className='my-2' />
              
              {/* ปรับ Grid ให้มีขนาดคงที่ */}
              <div className='overflow-auto max-h-[60vh]'>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2'>
                  {pdffiles.map((file, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleIPdfSelection(index)} 
                      className='group cursor-pointer flex flex-col items-center'
                    >
                      {/* กำหนดขนาดคงที่สำหรับ container */}
                      <div className='w-[140px] h-[180px] relative rounded-lg overflow-hidden 
                                    border border-gray-200 bg-gray-50 flex items-center justify-center'>
                          <div className='w-full h-full flex items-center justify-center'>
                            <div className='w-24 h-24 relative flex items-center justify-center'>
                              <img 
                                src='/images/logos/pdf-icon.png' 
                                alt='PDF icon' 
                                className='w-full h-full object-contain'
                              />
                            </div>
                          </div>

                        {/* Hover Overlay */}
                        <div className='absolute inset-0 bg-black/5 opacity-0 
                                      group-hover:opacity-100 transition-opacity 
                                      flex items-center justify-center'>
                          <i className='tabler-eye text-primary text-2xl' />
                        </div>
                      </div>

                      {/* File Name with fixed width */}
                      <div className='mt-2 w-[140px]'>
                        <Typography 
                          variant='caption' 
                          className='text-gray-600 block text-center truncate px-2'
                        >
                          {file.alt.slice(0, 20)}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Divider className='my-4' />

              {/* Footer */}
              <div className='flex justify-end mt-2'>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => setVisible_pdf(false)}
                  className='px-4 py-2 rounded-lg'
                  startIcon={<i className='tabler-x' />}
                >
                  ปิด
                </Button>
              </div>
            </div>
          </div>
          )}
        </>
      ) : (
        <></>
      )}

      {/* React Viewer สำหรับการแสดงรูปแบบ fullscreen */}
      <Viewer
        visible={viewerVisible}
        onClose={handleViewerClose} // ปิด viewer
        images={images} // ส่งรายการรูปภาพไปยัง viewer
        activeIndex={activeIndex} // ตั้งค่ารูปภาพที่แอคทีฟ
        zIndex={5000}
      />
    </>
  )
}

const ImageCellRecive = ({ row }) => {
  const [visible, setVisible] = useState(false) // สำหรับแสดง/ซ่อน Modal
  const [viewerVisible, setViewerVisible] = useState(false) // สำหรับแสดง/ซ่อน Viewer image
  const [activeIndex, setActiveIndex] = useState(0)
  const [visible_pdf, setVisible_pdf] = useState(false) // สำหรับแสดง/ซ่อน Modal
  const [images, setImages] = useState([])
  const [pdffiles, setPdfFiles] = useState([])
  const { data: session } = useSession()

  // ฟังก์ชันเพื่อดึง URL พร้อมโทเคนจาก S3
  const GetImageToken = async img_url => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/getfileupload`, {
        params: { file_name: img_url },
        headers: {
          Authorization: `${session.user?.token}`
        }
      })
      return response.data.img // คืนค่า URL ใหม่ที่มีโทเคน
    } catch (error) {
      console.error('Fetch image token failed:', error)
      return img_url // หากมีข้อผิดพลาด ให้ใช้ URL เดิม
    }
  }

  useEffect(() => {
    const fetchImagesWithToken = async () => {
      const newImages = await Promise.all(
        row.original.recive_img.map(async file => {
          if (file) {
            const urlWithToken = await GetImageToken(file.path)
            return { src: urlWithToken, alt: file.file_name }
          } else {
            return null // Exclude image if upload_type is not 1
          }
        })
      )
      const filteredImages = newImages.filter(image => image !== null && image.alt.slice(-3) !== 'pdf')
      const filteredPdfFile = newImages.filter(image => image !== null && image.alt.slice(-3) === 'pdf')
      //console.log('pdf', filteredPdfFile)
      setImages(filteredImages) // อัปเดตรายการรูปภาพพร้อมโทเคน
      setPdfFiles(filteredPdfFile)
    }

    fetchImagesWithToken()
  }, [row])

  // Handle view image modal click
  const handleViewImageClick = () => {
    setVisible(true) // เปิด Modal เมื่อคลิก "View Image"
  }

  // Handle image selection
  const handleImageSelection = index => {
    setActiveIndex(index) // ตั้งค่ารูปภาพที่ต้องการดู
    setVisible(false) // ปิด Modal แรก
    setViewerVisible(true) // เปิด Viewer image
  }

  const handleViewerClose = () => {
    setViewerVisible(false) // ปิด Viewer image
    setVisible(true) // เปิด Modal เลือกรูปภาพอีกครั้ง
  }

  // Handle view image modal click
  const handleViewPdfClick = () => {
    setVisible_pdf(true) // เปิด Modal เมื่อคลิก "View Image"
  }

  // Handle image selection
  const handleIPdfSelection = index => {
    // setActiveIndex_pdf(index) // ตั้งค่ารูปภาพที่ต้องการดู
    // setVisible_pdf(false) // ปิด Modal แรก
    // setViewerVisible_pdf(true) // เปิด Viewer image
    window.open(pdffiles[index].src, '_blank')
  }

  

  return (
    <>
      {images.length > 0 ? (
        <>
          {/* ปุ่ม View Image */}

          {/* <Chip
            variant='tonal'
            className='capitalize mx-2'
            label={'View Image'}
            color='primary'
            size='small'
            onClick={handleViewImageClick}
            icon={<i className='tabler-photo text-[18px] text-textSecondary' />}
          /> */}
          <Tooltip title='ดูรูปภาพ'>
            <IconButton onClick={handleViewImageClick}>
              <i className='tabler-photo text-[25px] text-primary hover:text-secondary cursor-pointer'></i>
            </IconButton>
          </Tooltip>

          {/* Modal สำหรับแสดงรูปภาพที่เลือก */}
          {visible && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
              <div className='bg-white rounded-lg p-4 max-w-lg w-full'>
                <h2 className='text-lg font-semibold mb-4'>เลือกรูปภาพที่ต้องการดู</h2>
                <Divider className='my-2' />
                <div className='flex items-center gap-4'>
                  <Grid className='flex flex-wrap gap-4'>
                    {images.map((file, index) => (
                      <img
                        key={index}
                        src={file.src}
                        alt={file.alt}
                        className='w-24 h-24 object-contain  cursor-pointer rounded-lg shadow-lg hover:opacity-90'
                        onClick={() => handleImageSelection(index)}
                      />
                    ))}
                  </Grid>
                </div>
                <Divider className='my-2' />

                {/* ปุ่มปิด Modal */}
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => setVisible(false)}
                  className='mt-4 px-4 py-2 rounded-lg'
                >
                  ปิด
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <span></span>
      )}

      {pdffiles.length > 0 ? (
        <>
          {/* ปุ่ม View Image */}

          {/* <Chip
            variant='tonal'
            className='capitalize mx-2'
            label={'View Image'}
            color='primary'
            size='small'
            onClick={handleViewImageClick}
            icon={<i className='tabler-photo text-[18px] text-textSecondary' />}
          /> */}
          <Tooltip title='ดูรูปภาพ'>
            <IconButton onClick={handleViewPdfClick}>
              <i className='tabler-file-type-pdf text-[25px] text-error hover:text-secondary cursor-pointer'></i>
            </IconButton>
          </Tooltip>

          {/* Modal สำหรับแสดงรูปภาพที่เลือก */}
          {visible_pdf && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-4xl w-full'>
              <h2 className='text-lg font-semibold mb-4'>เลือกไฟล์ที่ต้องการดู</h2>
              <Divider className='my-2' />
              
              {/* ปรับ Grid ให้มีขนาดคงที่ */}
              <div className='overflow-auto max-h-[60vh]'>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2'>
                  {pdffiles.map((file, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleIPdfSelection(index)} 
                      className='group cursor-pointer flex flex-col items-center'
                    >
                      {/* กำหนดขนาดคงที่สำหรับ container */}
                      <div className='w-[120px] h-[140px] relative rounded-lg overflow-hidden 
                                    border border-gray-200 bg-gray-50 flex items-center justify-center'>
                          <div className='w-full h-full flex items-center justify-center'>
                            <div className='w-24 h-24 relative flex items-center justify-center'>
                              <img 
                                src='/images/logos/pdf-icon.png' 
                                alt='PDF icon' 
                                className='w-full h-full object-contain'
                              />
                            </div>
                          </div>

                        {/* Hover Overlay */}
                        <div className='absolute inset-0 bg-black/5 opacity-0 
                                      group-hover:opacity-100 transition-opacity 
                                      flex items-center justify-center'>
                          <i className='tabler-eye text-primary text-2xl' />
                        </div>
                      </div>

                      {/* File Name with fixed width */}
                      <div className='mt-2 w-[140px]'>
                        <Typography 
                          variant='caption' 
                          className='text-gray-600 block text-center truncate px-2'
                        >
                          {file.alt.slice(0, 20)}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Divider className='my-4' />

              {/* Footer */}
              <div className='flex justify-end mt-2'>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => setVisible_pdf(false)}
                  className='px-4 py-2 rounded-lg'
                  startIcon={<i className='tabler-x' />}
                >
                  ปิด
                </Button>
              </div>
            </div>
          </div>
          )}
        </>
      ) : (
        <span></span>
      )}

      {/* React Viewer สำหรับการแสดงรูปแบบ fullscreen */}
      <Viewer
        visible={viewerVisible}
        onClose={handleViewerClose} // ปิด viewer และเปิด Modal เลือกรูปภาพ
        images={images} // ส่งรายการรูปภาพไปยัง viewer
        activeIndex={activeIndex} // ตั้งค่ารูปภาพที่แอคทีฟ
        zIndex={5000}
      />
    </>
  )
}

const Columns = ({ columnHelper, locale, handleEdit, UploadImage, refreshData }) =>
  useMemo(
    () => [
      {
        header: 'NO',
        cell: ({ row }) => row.index + 1
      },
      columnHelper.accessor('name', {
        header: 'ชื่อ-นามสกุล',
        cell: ({ row }) => (
          <div className='flex items-start gap-4'>
            <div className='flex flex-col'>
              <a href={`refer-detail/${row.original.id}?id_card=${row.original.id_card}&refer=false`}>
                <b className='custom-font-size'>{row.original.name}</b> <br />
                <span className='font-small text-secondary'>{row.original.hn}</span>
              </a>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('referDate', {
        header: 'เวลาที่ส่งปรึกษา',
        cell: ({ row }) => (
          <div className='flex-row items-center gap-4'>
            {row.original.refer_by ? (
              <>
                <b>Doctor:</b>
                {` ${row.original.refer_by}`} <br />
                <b>วันที่:</b>
                {` ${formatDate(row.original.referDate)}`} <br />
                <b>เวลา:</b>
                {` ${row.original.referDate ? `${fotmatTime(row.original.referDate)} น.` : ''}`}
              </>
            ) : (
              <>
                <b>วันที่:</b>
                {` ${formatDate(row.original.referDate)}`} <br />
                <b>เวลา:</b>
                {` ${row.original.referDate ? `${fotmatTime(row.original.referDate)} น.` : ''}`}
              </>
            )}
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'สถานะ',
        cell: ({ row }) => (
          <div className='flex-row  items-center gap-3'>
            <b>Doctor:</b>
            <Chip
              variant='tonal'
              className='capitalize mx-1'
              label={
                row.original.status == 1
                  ? 'รอรับปรึกษา'
                  : row.original.status == 2
                    ? 'ตอบปรึกษาแล้ว'
                    : row.original.status == 6
                      ? 'ส่งกลับ'
                      : ''
              }
              color={statusObj[row.original.status]}
              size='small'
            />
            <br />
            {(row.original.nurse_note === null || row.original.nurse_note === '') & (row.original.pt_type === 'OPD') ? (
              <>
                <b>Nurse:</b>
                <Chip variant='tonal' className='capitalize mx-2 mt-1' label='รอทำใบนัด' color='warning' size='small' />
                <br />
                <b>type:</b>
                <Chip
                  variant='tonal'
                  className='capitalize mx-4 mt-1'
                  label={row.original.pt_type}
                  color='primary'
                  size='small'
                />
              </>
            ) : (row.original.nurse_note === null || row.original.nurse_note === '') &
              (row.original.pt_type === 'IPD') ? (
              <>
                <b>Nurse:</b>
                <Chip
                  variant='tonal'
                  className='capitalize mx-2 mt-1'
                  label='รอรับเป็น IPD'
                  color='warning'
                  size='small'
                  deleteIcon={<i className='tabler-edit' />}
                />
                <br />
                <b>type:</b>
                <Chip
                  variant='tonal'
                  className='capitalize mx-4 mt-1'
                  label={row.original.pt_type}
                  color='error'
                  size='small'
                />
              </>
            ) : (row.original.nurse_note !== null) & (row.original.pt_type === 'OPD') ? (
              <>
                <b>Nurse:</b>
                <Chip
                  variant='tonal'
                  className='capitalize mx-2 mt-1'
                  label={row.original.nurse_note}
                  color='success'
                  size='small'
                />
                <br />
                <b>type:</b>
                <Chip
                  variant='tonal'
                  className='capitalize mx-4 mt-1'
                  label={row.original.pt_type}
                  color='primary'
                  size='small'
                />
              </>
            ) : (row.original.nurse_note !== null) & (row.original.pt_type === 'IPD') ? (
              <>
                <b>Nurse:</b>
                <Chip
                  variant='tonal'
                  className='capitalize mx-2 mt-1'
                  label={row.original.nurse_note}
                  color='success'
                  size='small'
                  deleteIcon={<i className='tabler-edit' />}
                />
                <br />
                <b>type:</b>
                <Chip
                  variant='tonal'
                  className='capitalize mx-4 mt-1'
                  label={row.original.pt_type}
                  color='error'
                  size='small'
                />
              </>
            ) : (
              ''
            )}
          </div>
        )
      }),
      columnHelper.accessor('Hospital', {
        header: 'โรงพยาบาลต้นทาง',
        cell: ({ row }) => (
          <div className='flex-row items-center gap-4'>
            {row.original.department ? (
              <>
                <b>สถานที่: </b>
                {`${row.original.Hospital?.name}`}
                <br />
                <b>แผนก:</b> {`${row.original.department}`} <br />
                <b>รูปภาพ/ใบส่งตัว:</b> <ImageCell row={row} />
              </>
            ) : (
              <>
                <b>สถานที่: </b>
                {`${row.original.Hospital?.name}`}
                <br />
                <b>แผนก:</b> {`${row.original.department}`} <br />
                <b>รูปภาพ/ใบส่งตัว:</b> <ImageCell row={row} />
              </>
            )}
          </div>
        )
      }),
      columnHelper.accessor('urgent', {
        header: 'ความเร่งด่วน',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={
                row.original.urgent === 0
                  ? 'elective'
                  : row.original.urgent === 1
                    ? 'urgency'
                    : row.original.urgent === 2
                      ? 'emergency'
                      : ''
              }
              color={userStatusObj[row.original.urgent]}
              size='small'
            />
          </div>
        )
      }),
      // {
      //   header: 'รูปภาพ/ใบส่งตัว',
      //   cell: ({ row }) => <ImageCell row={row} />
      // },

      {
        header: 'Consultation Notes',
        cell: ({ row, index }) => <NotesCell data={row} index={index} refreshData={refreshData} />
      },
      {
        header: 'โรงพยาบาลปลายทาง',
        cell: ({ row }) => (
          <div className='flex-row items-center gap-4'>
            {row.original.Destination_hospital !== null ? (
              <>
                <b>สถานที่:</b> {`${row.original.Destination_hospital?.name}`}
                <br />
                <b>แผนก:</b> {`${row.original.Dest_department?.name}`} <br />
                <b>รูปภาพ/ใบนัด:</b> <ImageCellRecive row={row} />
              </>
            ) : (
              <>
                <b>สถานที่:</b> {`${row.original.Destination_hospital?.name || ''}`}
                <br />
                <b>แผนก:</b> {`${row.original.Dest_department?.name || ''}`} <br />
                <b>รูปภาพ/ใบนัด:</b> <ImageCellRecive row={row} />
              </>
            )}
          </div>
        )
      },
      // {
      //   header: 'รูปภาพ/ใบนัด',
      //   cell: ({ row }) => <ImageCellRecive row={row} />
      // },
      // {
      //   header: 'แพทย์ที่รับปรึกษา',
      //   cell: ({ row }) => <div className='flex items-center gap-4'>{row.original.recive_by}</div>
      // },
      {
        header: 'เวลาที่รับปรึกษา',
        cell: ({ row }) => (
          <div className='flex-row items-center gap-4'>
            {row.original.recive_by ? (
              <>
                <b>Doctor:</b>
                {` ${row.original.recive_by}`} <br />
                <b>วันที่:</b>
                {` ${row.original.confirmDate ? formatDate(row.original.confirmDate) : ''}`} <br />
                <b>เวลา:</b>
                {` ${row.original.confirmDate ? row.original.confirmDate.slice(11, 16) : ''} น.`}
              </>
            ) : (
              ''
            )}
          </div>
        )
      },
      {
        header: 'Reply - Consultation Notes',
        cell: ({ row, index }) => <DoctorNotesCell data={row} index={index} refreshData={refreshData} />
      },

      {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <a href={`refer-detail/${row.original.id}?id_card=${row.original.id_card}&refer=false`}>
              <Tooltip title='ดูข้อมูล'>
                <IconButton>
                  <i data-bs-toggle='modal' className='tabler-eye text-[22px] text-textSecondary' />
                </IconButton>
              </Tooltip>
            </a>
            <Tooltip title='อัปโหลดรูปภาพ'>
              <IconButton onClick={() => UploadImage(row.original)}>
                <i data-bs-toggle='modal' className='tabler-cloud-upload text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    ],
    [columnHelper, locale]
  )

const PendingReferTable = ({ tableData, refreshData }) => {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [status, setStatus] = useState('')
  const [isModalOpenAddUser, setModalOpenAddUser] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [filterData, setFilterData] = useState([])
  const [modalupload, setModalupload] = useState(false)
  const [referId, setReferId] = useState('')
  const [dataRefer, setDateRefer] = useState([])
  const { data: session } = useSession()

  const filteredData = useMemo(() => {
    return tableData?.filter(user => user.status === '1' || user.status === '2' || user.status === '6')
  }, [tableData])

  useEffect(() => {
    // const filteredData = tableData?.filter(
    //   user => user.Hospital.id === session?.user?.hospitalId && (user.status === '2' || user.status === '1')
    // )
    //setData(filteredData)
    setFilterData(filteredData)
  }, [tableData, session])

  const { lang: locale } = useParams()

  const handleEdit = data => {
    setSelectedUser(data)
    setEditDialog(true)
  }

  const handleClose = () => {
    setEditDialog(false)
  }

  const UploadImage = data => {
    setModalupload(true)
    setReferId(data.id)
    setDateRefer(data)
  }

  const columns = Columns({ columnHelper, locale, handleEdit, UploadImage, refreshData })

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 25 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card className='p-4'>
        <div className='w-full flex flex-col'>
          <PendingReferTableFilter setData={setData} tableData={filterData} />
        </div>
        <div className='m-4 flex flex-row items-center'></div>

        <div className='overflow-x-auto overflow-y-auto  '>
          <div className='overflow-x-auto'>
            <table className={classnames(tableStyles.table, 'w-full text-sm')}>
              <thead className='bg-white z-30 text-sm'>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className='sticky top-0 z-30'>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className='bg-gray-50 px-2 py-1 text-left whitespace-nowrap'
                        style={{ fontWeight: '700' }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={classnames({
                              'flex items-center': true,
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {/* Default ลูกศรลง */}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted()] ?? (
                              <i className='tabler-chevron-down text-xl text-gray-400' />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      <DataNotFound />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className='px-2 py-1 text-sm whitespace-nowrap'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
        <div className='flex flex-row'></div>

        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
        <ModalUpload
          open={modalupload}
          referId={referId}
          dataRefer={dataRefer}
          onUpdate={refreshData}
          handleClose={() => setModalupload(false)}
        />
        {/* <EditDialog 
       
       isEdit={true}
       open={editDialog}
       onClose={handleClose}
       selectedUser={selectedUser}
       onUpdate={onUpdate}
     /> */}
      </Card>
    </>
  )
}

export default PendingReferTable
