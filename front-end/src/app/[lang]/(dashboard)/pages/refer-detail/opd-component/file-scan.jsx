'use client'
import React, { useState, useEffect } from 'react'
import { OpenFile, Worker } from '@react-pdf-viewer/core'
import { getFilePlugin } from '@react-pdf-viewer/get-file'
import { zoomPlugin } from '@react-pdf-viewer/zoom'
import { printPlugin } from '@react-pdf-viewer/print' // Import the print plugin
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Typography, Grid, Button, Card, CircularProgress } from '@mui/material'
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
const Viewer = dynamic(() => import('react-viewer'), { ssr: false })
const CustomizeFileNameExample = ({ fileUrl, data, date, hn, SETID_PV1, hos_id }) => {
  const { data: session, status } = useSession()
  // Initialize plugins
  const [selectedPdf, setSelectedPdf] = React.useState(null) // State to track selected PDF
  const [fileScan, setFileScan] = useState([])
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [visible, setVisible] = useState(false);
const [activeIndex, setActiveIndex] = useState(0);

// แปลงข้อมูลรูปภาพให้อยู่ในรูปแบบที่ viewer ต้องการ
const images = useMemo(() => 
  fileScan.flatMap(pdf => 
    pdf.data_info.map(item => ({
      src: `data:image/gif;base64,${item.SCANFILE}`,
      alt: `${pdf.VSTDATE} ${pdf.VSTTIME}`,
      title: `${pdf.VSTDATE} ${pdf.VSTTIME}`
    }))
  ), [fileScan]
);

  const convertDateToThai = rawDate => {
    const year = parseInt(rawDate.substring(0, 4), 10) + 543 // Convert to Thai year
    const month = rawDate.substring(4, 6)
    const day = rawDate.substring(6, 8)
    return `${day}/${month}/${year}`
  }

  const GetFileEOPD = async () => {
    try {
      setIsFetchingData(true) // Show loading while fetching data
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/GetFileEOPD`,
        {
          hn_id: hn,
          fdate: convertDateToThai(date),
          hpt: hos_id
        },
        {
          headers: {
            Authorization: `${session?.user?.token}`
          }
        }
      )

      const data = res.data.data
      const targetData = data.filter(item => item.SETID_PV1 === SETID_PV1)
      if (targetData.length > 0) {
        //setFileScan(targetData[0].data_info)
        setFileScan(targetData)
      }
      console.log('file_scan', targetData)
    } catch (error) {
      console.error(error)
    } finally {
      setIsFetchingData(false) // Hide loading after fetching
    }
  }
  useEffect(() => {
    if (status === 'authenticated') {
      setSelectedPdf(null) // Reset selected PDF when data is reloaded
      GetFileEOPD()
    }
  }, [status, session, hn, date, SETID_PV1]) // Dependency for reloading data
  // Initialize plugins
  const getFilePluginInstance = getFilePlugin({
    fileNameGenerator: file => {
      const fileName = file.name.substring(file.name.lastIndexOf('/') + 1)
      return `${data?.PV1_VISIT_NUMBER}-${data?.PV1_CLINIC_NAME}`
    }
  })
  const zoomPluginInstance = zoomPlugin()
  const printPluginInstance = printPlugin()
  const pageNavigationPluginInstance = pageNavigationPlugin()

  const { DownloadButton } = getFilePluginInstance
  const { ZoomInButton, ZoomOutButton } = zoomPluginInstance
  const { PrintButton } = printPluginInstance
  const { CurrentPageInput, GoToFirstPageButton, GoToLastPageButton, GoToNextPageButton, GoToPreviousPageButton } =
    pageNavigationPluginInstance

  // Array of fake names (you can customize based on your needs)
  // const pdfNames = data.map((_, index) => `PDF Document ${index + 1}`)
  const handlePdfClick = pdf => {
    setSelectedPdf(`data:image/gif;base64,${pdf.SCANFILE}`)
    setIsLoading(false)
  }
  return (
    <div className="p-4">
    <Typography variant='h5' className="mb-4 font-semibold text-primary">
      รายการ File Scan
    </Typography>

    {isFetchingData ? (
      <div className="flex justify-center my-8">
        <CircularProgress />
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {fileScan.map((pdf, pdfIndex) => (
              pdf.data_info.map((item, itemIndex) => {
                // คำนวณ global index สำหรับแต่ละรูป
                const globalIndex = fileScan
                  .slice(0, pdfIndex)
                  .reduce((acc, curr) => acc + curr.data_info.length, 0) + itemIndex;

                return (
                  <div
                    key={`${pdfIndex}-${itemIndex}`}
                    onClick={() => {
                      setActiveIndex(globalIndex);
                      setVisible(true);
                    }}
                    className="group relative cursor-pointer transition-all duration-300 
                             hover:shadow-md rounded-lg overflow-hidden bg-gray-50 
                             border border-gray-200 p-4"
                  >
                    {/* Thumbnail Container */}
                    <div className="aspect-w-3 aspect-h-4 mb-2">
                      <img
                        src={`data:image/gif;base64,${item.SCANFILE}`}
                        alt={`${pdf.VSTDATE} ${pdf.VSTTIME}`}
                        className="object-contain w-full h-full transform group-hover:scale-105 
                                 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* File Name */}
                    <div className="text-center">
                      <Typography variant='body2' className="text-gray-700 truncate">
                        {pdf.VSTDATE} {pdf.VSTTIME}
                      </Typography>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-300 
                                  flex items-center justify-center">
                      <i className="tabler-eye text-primary text-xl" />
                    </div>
                  </div>
                );
              })
            ))}
        </div>
      </div>
    )}

    {/* React Viewer */}
    <Viewer
      visible={visible}
      onClose={() => setVisible(false)}
      images={images}
      activeIndex={activeIndex}
      zoomable={true}
      scalable={true}
      rotatable={true}
      downloadable={true}
      noNavbar={false}
      changeable={true}
      showTotal={true}
      zIndex={5000}
      customToolbar={toolbars => {
        // กำหนด custom toolbar ถ้าต้องการ
        return toolbars;
      }}
      zoomSpeed={0.2}
      defaultSize={{
        width: 1000,
        height: 800
      }}
      // แปล text เป็นภาษาไทย
      locale={{
        zoomIn: 'ขยาย',
        zoomOut: 'ย่อ',
        close: 'ปิด',
        download: 'ดาวน์โหลด',
        rotateLeft: 'หมุนซ้าย',
        rotateRight: 'หมุนขวา',
        next: 'ถัดไป',
        prev: 'ก่อนหน้า',
        total: 'ทั้งหมด'
      }}
    />

    {isLoading && (
      <div className="flex justify-center my-8">
        <CircularProgress />
      </div>
    )}
  </div>
  )
}

export default CustomizeFileNameExample
