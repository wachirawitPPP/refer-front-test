'use client';
import React, { useState, useEffect } from 'react';
import { OpenFile, Viewer, Worker } from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { printPlugin } from '@react-pdf-viewer/print';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Typography, Grid, Button, Card, CircularProgress } from '@mui/material';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const EOpdCard = ({ fileUrl, data, date, hn, SETID_PV1, hos_id }) => {
  const { data: session, status } = useSession();
  const [eopds, setEopds] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false); // State for fetching data
  const [isLoading, setIsLoading] = useState(false); // State for loading PDF
  const [selectedPdf, setSelectedPdf] = useState(null); // State to track selected PDF

  const convertDateToThai = (rawDate) => {
    const year = parseInt(rawDate.substring(0, 4), 10) + 543; // Convert to Thai year
    const month = rawDate.substring(4, 6);
    const day = rawDate.substring(6, 8);
    return `${day}/${month}/${year}`;
  };

  const GetFileEOPD = async () => {
    try {
      setIsFetchingData(true); // Show loading while fetching data
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/GetFileEOPD`,
        {
          hn_id: hn,
          fdate: convertDateToThai(date),
          hpt: hos_id,
        },
        {
          headers: {
            Authorization: `${session?.user?.token}`,
          },
        }
      );

      const data = res.data.data;
      const targetData = data.filter((item) => item.SETID_PV1 === SETID_PV1);
      setEopds(targetData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingData(false); // Hide loading after fetching
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      setSelectedPdf(null); // Reset selected PDF when data is reloaded
      GetFileEOPD();
    }
  }, [status, session, hn, date, SETID_PV1]); // Dependency for reloading data

  const getFilePluginInstance = getFilePlugin();
  const zoomPluginInstance = zoomPlugin();
  const printPluginInstance = printPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const { DownloadButton } = getFilePluginInstance
  const { ZoomInButton, ZoomOutButton } = zoomPluginInstance
  const { PrintButton } = printPluginInstance
  const { CurrentPageInput, GoToFirstPageButton, GoToLastPageButton, GoToNextPageButton, GoToPreviousPageButton } = pageNavigationPluginInstance;

  const handlePdfClick = (pdf) => { 
      setSelectedPdf(`data:application/pdf;base64,${pdf.EMR}`);
      setIsLoading(false);  
  };

  return (
    <div>
      <Typography variant="h5">รายการไฟล์ E-OPD</Typography>

      {/* Show loading spinner while fetching data */}
      {isFetchingData ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={2}>
          {eopds.map((pdf, index) => (
            <Card key={index} style={{ padding: 10, margin: 10 }}>
              <div
                onClick={() => handlePdfClick(pdf)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: 10,
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                }}
              >
                <img src="/images/logos/pdf-icon.png" alt={pdf.VN} style={{ width: 50, marginBottom: 10 }} />
                <Typography variant="body1">
                  {pdf.VSTDATE} {pdf.VSTTIME}
                </Typography>
              </div>
            </Card>
          ))}
        </Grid>
      )}

      {/* Show loading spinner when loading PDF */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <CircularProgress />
        </div>
      )}

      {/* Show PDF Viewer when a PDF is selected */}
      {!isLoading && selectedPdf && (
        <div
          className="rpv-core__viewer"
          style={{
            border: '1px solid rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            maxHeight: '500px',
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#eeeeee',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '4px',
              }}
            >
              <DownloadButton />
              <ZoomInButton>{props => <Button onClick={props.onClick}>Zoom In</Button>}</ZoomInButton>
              <ZoomOutButton>{props => <Button onClick={props.onClick}>Zoom Out</Button>}</ZoomOutButton>
              <PrintButton>{props => <Button onClick={props.onClick}>Print</Button>}</PrintButton>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <Viewer
                fileUrl={selectedPdf}
                plugins={[getFilePluginInstance, zoomPluginInstance, printPluginInstance, pageNavigationPluginInstance]}
              />
            </div>
          </Worker>
        </div>
      )}
    </div>
  );
};

export default EOpdCard;
