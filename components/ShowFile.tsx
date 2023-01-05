import React ,{useState}from 'react'

// ShowFile will be sued ot displa the selected files. 
// the fileData object contains a fileList array. This will be 
// the selected or dropped files. 

const ShowFile = ({ fileData }) => {
    const [data,setData] = useState(fileData);

    return (
        <div>
            <div>
                {/* loop over the fileData */}
                {fileData.fileList.map((f: any) => {
                    return (
                        <>
                            <ol>
                                <li key={f.lastModified}>
                                    {/* Showing the file name and it's type  */}
                                    <div key={f.name}>
                                        {f.name}
                                    </div>
                                </li>
                            </ol>
                        </>
                    )
                })}

            </div>

        </div>
    )
}

export default ShowFile