import React, { useState } from 'react'

const ShowFile = ({ fileData }) => {
    const [data, setData] = useState(fileData);

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