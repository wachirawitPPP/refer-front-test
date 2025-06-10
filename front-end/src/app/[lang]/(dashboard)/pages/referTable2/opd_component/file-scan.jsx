'use client'
import React, { useState, useEffect } from 'react'
import { OpenFile, Viewer, Worker } from '@react-pdf-viewer/core'
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
const CustomizeFileNameExample = ({ fileUrl, data, date, hn, SETID_PV1, hos_id }) => {
  const { data: session, status } = useSession()
  // Initialize plugins
  const [selectedPdf, setSelectedPdf] = React.useState(null) // State to track selected PDF
  const [fileScan, setFileScan] = useState([])
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const convertDateToThai = (rawDate) => {
    const year = parseInt(rawDate.substring(0, 4), 10) + 543; // Convert to Thai year
    const month = rawDate.substring(4, 6);
    const day = rawDate.substring(6, 8);
    return `${day}/${month}/${year}`;
  };

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
      if(targetData.length > 0) {
        setFileScan(targetData[0].data_info)
      }
      console.log("file_scan", targetData)
   
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
  const handlePdfClick = (pdf) => { 
    setSelectedPdf(`data:image/gif;base64,${pdf.SCANFILE}`);
    setIsLoading(false);  
};
  return (
    <div>
      <Typography variant='h5'>รายการ File Scan</Typography>
      {isFetchingData ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={2}>
          {fileScan.map((pdf, index) => (
            <Card key={pdf.ITEMNO} style={{ padding: 10, margin: 10 }}>
              <div
                onClick={() => handlePdfClick(pdf)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: 10,
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5'
                }}
              >
                {/* <img src='/images/logos/pdf-icon.png' alt={pdf.ITEMNO} style={{ width: 50, marginBottom: 10 }} /> */}
                <img src={`data:image/gif;base64,${pdf.SCANFILE}`} alt={pdf.ITEMNO} style={{ width: 50, marginBottom: 10 }} />
                <Typography variant='body1'>{pdf.ITEMNO}</Typography>
              </div>
            </Card>
          ))}
        </Grid>
      )}
      {/* Grid layout for PDF thumbnails */}

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <CircularProgress />
        </div>
      )}

      {/* Show PDF Viewer when a PDF is selected */}
      {!isLoading && selectedPdf && (
        <div
        className='rpv-core__viewer'
        style={{
          border: '1px solid rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '20px',
          maxHeight: '700px',
          maxWidth: '1100px',
        }}
      >
        <div style={{ flex: 1, overflow: 'auto' }}>
          <img
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              margin: '0 auto'
            }}
            src={selectedPdf} 
            alt="Scanned document"
          />
        </div>
      </div>
      )}
    </div>
  )
}

export default CustomizeFileNameExample
