import type { NextApiRequest, NextApiResponse } from 'next';
import {Storage} from '@google-cloud/storage';
import formidable, { File, PersistentFile } from 'formidable';
import axios from 'axios';

type ProcessedFiles = Array<[string, File]>;

export const config = {
    api: {
        bodyParser: false,
    }
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
    if (req.method === 'POST') {
        console.log('File recieved');
        const form  = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            if (err) return console.log(err);
            console.log(fields);
            let file_objs: File| File[] = files['file'];
            if ((file_objs as File).filepath != undefined) {
                let fobj = file_objs as File;
                await uploadGCS(fobj.filepath, fobj.originalFilename);
            }
            else {
                let file_arr = file_objs as File[];
                file_arr.forEach(async f => {
                    await uploadGCS(f.filepath, f.originalFilename);
                });
            }        
        });
        res.status(200).send('File successfully uploaded');
    } else {
        res.status(400).send("Bad Request: Unexpected HTTP method");
    }
}

function uploadGCS(filepath, filename) {
    // TODO before release - https://cloud.google.com/docs/authentication/application-default-credentials#GAC
    const storage = new Storage();
    console.log("Storage object created");
    const bucketname = "devprofiles";
    const options = {
        destination: filename,
        // preconditionOpts avoids race condition while writing to bucket
        preconditionOpts: {ifGenerationMatch: 0},
    }
    try {
        storage.bucket(bucketname).upload(filepath, options)
        .then(res => {
            console.log(res);
            triggerCloudRun(filename);
        });
        console.log(`${filepath} uploaded to ${bucketname}`);
    }
    catch(e) {
        console.log(e);
        // TODO - catch error
    }
}

function triggerCloudRun(filename) {
    axios.post("https://gcscruncsql-k7jns52mtq-el.a.run.app/insert", {
        bucketname: "devprofiles",
        filename: filename,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
}