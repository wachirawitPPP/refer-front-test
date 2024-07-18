import React, { useEffect, useState } from 'react';
import { Grid, ListItem, Card, CardContent, Box, Paper, CardHeader, FormControlLabel, Checkbox, useMediaQuery } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@emotion/react';

export default function DisplayImageOPD({ linkFiles, loading ,checkedItems,checkedItemsImage, handleChangeSelect,handleChangeSelectImage,isAllChecked,isAllCheckedImage,isIndeterminate,isIndeterminateImage}) {
    // ,checkedItems,checkedItemsImage,setCheckedItems,setCheckedItemsImage,handleChangeSelect,handleChangeSelectImage,isAllChecked,isAllCheckedImage,isIndeterminate,isIndeterminateImage
    
    // tranfer data to modal // checkedItems={checkedItems} setCheckedItems={setCheckedItems} checkedItemsImage={checkedItemsImage} setCheckedItemsImage={setCheckedItemsImage} isAllChecked={isAllChecked} isIndeterminate={isIndeterminate} isIndeterminateImage={isIndeterminateImage} isAllCheckedImage={isAllCheckedImage}
    // const [filePreviews, setFilePreviews] = useState({});
    // const [page, setPage] = useState(1);

    // const [checkedItems, setCheckedItems] = useState(
    //     linkFiles.reduce((acc, item) => {
    //         acc[item.id] = false;
    //         return acc;
    //     }, {})
    // );

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down('md')); 

    // const [checkedItemsImage, setCheckedItemsImage] = useState(
    //     linkFiles.reduce((acc, item) => {
    //         item.data.forEach((dataItem) => {
    //             acc[String(dataItem.id)] = false;
    //         });
    //         return acc;
    //     }, {})
    // );
    // const [isAllChecked, setIsAllChecked] = useState(false);
    // const [isIndeterminate, setIsIndeterminate] = useState(false);
    // const [isAllCheckedImage, setIsAllCheckedImage] = useState(false);
    // const [isIndeterminateImage, setIsIndeterminateImage] = useState(false);

    // console.log(linkFiles,"linkFiles")

    // const itemsPerPage = 5;

    // const startIndex = (page - 1) * itemsPerPage;
    // const paginatedData = linkFiles.slice(startIndex, startIndex + itemsPerPage);

    // const handleChange = (event, value) => {
    //     setPage(value);
    // };

    if (loading) {
        return <div style={{ textAlign: "center", width: "100%" }}><CircularProgress /></div>;
    }

    //check type file

    // const renderFilePreview = element => {
    //     if (element.type.startsWith('image') && filePreviews[file.name]) {
    //         return <img style={{ borderRadius: "6px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} width={150} height={150} alt={file.name} src={filePreviews[file.name]} />
    //     } else {
    //         return <div ><a target='_blank' href={element.image}>
    //             <i className='tabler-file-description text-[100px]' /> <Typography className='file-name'>{element.title}</Typography></a>
    //            </div>
    //     }
    // }

    // const handleRemoveFile = element => {

    //     const filteredLinkFiles = linkFiles.map((lf) => ({
    //         ...lf,
    //         data: lf.data.filter(item => !(item.id === element.id))
    //     }));

    //     setLinkFiles(filteredLinkFiles)
    // }

    // const handleRemoveAllFiles = (idOfElement) => {
    //     const filteredLinkFiles = linkFiles.filter(lf => lf.id !== idOfElement);
    //     setLinkFiles(filteredLinkFiles);

    // }

    // const handleChange1 = (event) => {
    //     setChecked([event.target.checked, event.target.checked]);
    //     console.log([event.target.checked, event.target.checked], "event.target.checked000")
    // };

    // const handleChange2 = (event) => {
    //     setChecked([event.target.checked, checked[1]]);

    //     console.log([event.target.checked, checked[1]], "event.target.checked111")
    // };

    // const handleChangeSelect = (event) => {
    //     const { name, checked } = event.target;
    //     if (name === 'all') {
    //         const newCheckedItems = Object.keys(checkedItems).reduce((acc, key) => {
    //             acc[key] = checked;
    //             return acc;
    //         }, {});

    //         setCheckedItems(newCheckedItems);
    //         setIsAllChecked(checked);
    //         setIsIndeterminate(false);
    //     } else {
    //         const newCheckedItems = {
    //             ...checkedItems,
    //             [name]: checked,
    //         };
    //         const allChecked = Object.values(newCheckedItems).every(Boolean);
    //         const noneChecked = Object.values(newCheckedItems).every((val) => !val);
    //         setIsAllChecked(allChecked);
    //         setIsIndeterminate(!allChecked && !noneChecked);
    //         setCheckedItems(newCheckedItems);
    //     }
    // };

    // const handleChangeSelectImage = (event) => {
    //     const { name, checked } = event.target;

    //     const newCheckedItemsImage = Object.keys(checkedItemsImage).reduce((acc, key) => {
    //         acc[key] = checked;
    //         return acc;
    //     }, {});
    //     setCheckedItemsImage(newCheckedItemsImage);
    //     setIsAllCheckedImage(checked);
    //     setIsIndeterminateImage(false);

    //     if (name === 'allCheck') {
    //         const newCheckedItemsImage = Object.keys(checkedItemsImage).reduce((acc, key) => {
    //             acc[key] = checked;
    //             return acc;
    //         }, {});
    //         setCheckedItemsImage(newCheckedItemsImage);
    //         setIsAllCheckedImage(checked);
    //         setIsIndeterminateImage(false);
    //     } else {
    //         const newCheckedItemsImage = {
    //             ...checkedItemsImage,
    //             [name]: checked,
    //         };
    //         const allCheckedImage = Object.values(newCheckedItemsImage).every(Boolean);
    //         const noneCheckedImage = Object.values(newCheckedItemsImage).every((val) => !val);
    //         setIsAllCheckedImage(allCheckedImage);
    //         setIsIndeterminateImage(!allCheckedImage && !noneCheckedImage);
    //         setCheckedItemsImage(newCheckedItemsImage);
    //     }
    // };

    return (
        <div style={{ width: "100%", overflowY: "auto" ,minHeight:"100vh"}}>

            {/* <Grid container  >
                <Grid item xs={12} sm={4} md={4} >
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Button variant='outlined' disabled={loading} onClick={fetchPreviews}>
                            {loading ? 'Loading' : 'Reload'}
                        </Button>

                    </Box>
                </Grid>
                <Grid item xs={12} sm={2} md={2}></Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                       
                        <Pagination showFirstButton showLastButton shape="rounded" variant="tonal" count={Math.ceil(linkFiles.length / itemsPerPage)} page={page} onChange={handleChange} color="primary" />
                    </Box>
                </Grid>
            </Grid> */}

            <Grid container>
                <Grid item xs={12} sm={12} md={2} >
                    {/* {linkFiles.map((item) => ( */}
                    <Card  style={{ margin: "0 auto", display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "2em", maxWidth: '90%' }}>
                        <CardHeader title={"ID : OPD"} />
                        {/* <div style={{ textAlign: "left", width: "100%" }}> */}
 
                        {/* </div> */}
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={12} >

                                    {isMd ? <Box display="flex" alignItems="center">
                                        <Checkbox
                                            name='all'
                                            checked={isAllChecked}
                                            indeterminate={isIndeterminate}
                                            onChange={handleChangeSelect}
                                        />
                                        {"All"}

                                    </Box> : <Box >

                                        <Checkbox
                                            name='all'
                                            checked={isAllChecked}
                                            indeterminate={isIndeterminate}
                                            onChange={handleChangeSelect}
                                        />

                                        {"All"}
                                    </Box>}
                                </Grid>
                                {linkFiles.map((item) => (
                                    <Grid item key={item.id} xs={12} sm={6} md={12} >
                                        {isMd ? <Box display="flex" alignItems="center"> <Checkbox checked={!!checkedItems[item.id] || false} name={item.id}
                                            onChange={handleChangeSelect}
                                        />{`${item.id} : ${item.createAt}`}  </Box> : <Box display="flex" justifyContent="center" alignItems="flex-start"> <Checkbox checked={!!checkedItems[item.id] || false} name={item.id}
                                            onChange={handleChangeSelect}
                                        />{`${item.id} : ${item.createAt}`}  </Box>}

                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={10} >

                    {linkFiles.map((item) => (
                        checkedItems[item.id] && (
                            <Card key={item.id} style={{ margin: "0 auto", display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "2em", maxWidth: '99%' ,marginBottom:"1em"}}>
                                {/* <CardHeader  style={{textAlign:"left",width:"100%"}} >{item.id+" : "+item.name}</CardHeader> */}
                                {linkFiles.length ? (
                                    <Paper elevation={3} style={{ width: "100%" }}>
                                        <Grid container spacing={4} padding={5} justifyContent="center" alignItems="center">
                                            <Grid item xs={12} sm={9} md={9} style={{ textAlign: 'center' }}>{`${item.id} | ${item.type} | ${item.department} | ${item.createBy} | ${item.createAt}` }</Grid>
                                        
                                            <Grid item xs={12} sm={3} md={3}>
                                                <div style={{ textAlign: 'center', width: "100%" }}>
                                                    <FormControlLabel
                                                        label="All"
                                                        control={
                                                            <Checkbox
                                                                name='allCheck'
                                                                checked={isAllCheckedImage}
                                                                indeterminate={isIndeterminateImage}
                                                                onChange={handleChangeSelectImage}
                                                            />
                                                        }
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ) : null}

                                <CardContent>
                                    <Grid container spacing={6}>
                                        {item.data.map((element) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={element.id}>
                                                <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <Paper elevation={3}>
                                                        {/* <div style={{ textAlign: "right", width: "100%" ,marginTop:"1em"}}> */}
                                                            {/* <IconButton onClick={() => handleRemoveFile(element)}>
                                                            <i className='tabler-x text-xl' />
                                                        </IconButton> */}
                                                            <Box display="flex" justifyContent="flex-end">
                                                                {/* <FormControlLabel
                                                                    control={ */}
                                                                        <Checkbox
                                                                            checked={!!checkedItemsImage[String(element.id)] || false} name={String(element.id)}
                                                                            onChange={handleChangeSelectImage}
                                                                        />
                                                                        {/* }
                                                                /> */}
                                                            </Box>
                                                        {/* </div> */}
                                                        <div style={{ paddingLeft: "2em",paddingRight:"2em",paddingTop:"1em",paddingBottom:"1em" }}>
                                                            <img width={140} height={140} src={element.image} alt={element.title} />
                                                        </div>
                                                    </Paper>
                                                </ListItem>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        )
                        // )}
                    ))}


                </Grid>
            </Grid>
        </div>
    )
}
