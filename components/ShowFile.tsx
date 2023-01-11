import React, { useState } from 'react'
// ShowFile will be used ot display the selected files. 
// the fileData object contains a fileList array. This will be 
// the selected or dropped files. 

const ShowFile = ({ fileData }) => {
    // const [data, setData] = useState(fileData);

    console.log(fileData)
    // only 1 file is allowed to upload 
    if (fileData.fileList.length === 1) {
        return (
            <div className='mt-3'>
                <h1 className='font-semibold'>Selected File : {fileData.fileList[0].name}</h1>
            </div>
        )
    }
    else if(fileData.fileList.length>1) { 
        return (
            <div className='mt-3'>
                <h1 className='font-semibold text-primary-warning'>Please upload only 1 file.</h1>
            </div>
        )
    }
}

export default ShowFile