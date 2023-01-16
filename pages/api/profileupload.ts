import type { NextApiRequest, NextApiResponse } from 'next';
import {Storage} from '@google-cloud/storage';
import formidable, { File, PersistentFile } from 'formidable';
import axios from 'axios';

type ProcessedFiles = Array<[string, File]>;

const config = {
    api: {
        bodyParser: false,
    }
};

const bucketname = "devprofiles";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
    if (req.method === 'POST') {
        const form  = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {
            if (err) {
                res.status(400).send(`Bad Request: Error in parsing body -${err}`);
                return;
            }
            let file_arr: File[];
            let file_obj: File| File[] = files['file'];
            if ((file_obj as File).filepath != undefined) {
                file_arr = [file_obj as File];
            }
            else {
                file_arr = file_obj as File[];
            }
            file_arr.forEach(async f => {
                if (f.originalFilename && f.filepath) {
                    uploadGCS(f.filepath, f.originalFilename)
                    .then(res_gcs => {
                        triggerCloudRun(f.originalFilename!).then(res_crun => {
                            res.status(200).send('File successfully uploaded');
                        }).catch(err => {
                            console.error(err);
                            res.status(500).send(`Unable to upload to db - ${err}`);
                        });
                        console.debug(`${f.originalFilename} uploaded`);
                    }).catch(err => {
                        console.error(`Unable to upload - ${err}`);
                        res.status(500).send(`Unable to upload to bucket - ${err}`)
                    });
                }
                });        
        });
    } else {
        res.status(400).send("Bad Request: Unexpected HTTP method");
    }
}

function processenvExist() {
    return (process.env.PROJECT_ID != undefined 
        || process.env.PRIVATE_KEY_ID != undefined 
        || process.env.PRIVATE_KEY != undefined
        || process.env.CLIENT_EMAIL != undefined
        || process.env.CLIENT_ID != undefined
        || process.env.AUTH_URI != undefined
        || process.env.TOKEN_URI != undefined
        || process.env.AUTH_PROVIDER_X509_CERT_URL != undefined
        || process.env.CLIENT_X509_CERT_URL != undefined)
}

function uploadGCS(filepath: string, filename: string) {
    // TODO before release - https://cloud.google.com/docs/authentication/application-default-credentials#GAC
    const storage = new Storage({
        credentials: {
            type: 'service_account',
            // project_id: process.env.PROJECT_ID,
            // private_key_id: process.env.PRIVATE_KEY_ID,
            private_key: process.env.PRIVATE_KEY,
            client_email: process.env.CLIENT_EMAIL,
            client_id: process.env.CLIENT_ID,
            // auth_uri: process.env.AUTH_URI,
            // token_uri: process.env.TOKEN_URI,
            // auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
            // client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
        },
        projectId: process.env.PROJECT_ID,
    });
    const options = {
        destination: filename,
        // preconditionOpts avoids race condition while writing to bucket
        preconditionOpts: {ifGenerationMatch: 0},
    } 
    return storage.bucket(bucketname).upload(filepath, options);
}

function triggerCloudRun(filename: string) {
    return axios.post("https://gcscruncsql-k7jns52mtq-el.a.run.app/insert", {
        bucketname: bucketname,
        filename: filename,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}