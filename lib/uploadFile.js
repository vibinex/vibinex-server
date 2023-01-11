function main(
    bucketName = 'my-bucket',
    filePath = './local/path/to/file.txt',
    destFileName = 'file.txt',
    generationMatchPrecondition = 0
  ) {
    // [START storage_upload_file]
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // The ID of your GCS bucket
    // const bucketName = 'your-unique-bucket-name';
  
    // The path to your file to upload
    // const filePath = 'path/to/your/file';
  
    // The new ID for your GCS file
    // const destFileName = 'your-new-file-name';
  
    // Imports the Google Cloud client library
    const {Storage} = require('@google-cloud/storage');
  
    // Creates a client
    const storage = new Storage();
  
    async function uploadFile() {
      const options = {
        destination: destFileName,
        // Optional:
        // Set a generation-match precondition to avoid potential race conditions
        // and data corruptions. The request to upload is aborted if the object's
        // generation number does not match your precondition. For a destination
        // object that does not yet exist, set the ifGenerationMatch precondition to 0
        // If the destination object already exists in your bucket, set instead a
        // generation-match precondition using its generation number.
        preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
      };
  
      await storage.bucket(bucketName).upload(filePath, options);
      console.log(`${filePath} uploaded to ${bucketName}`);
    }
  
    uploadFile().catch(console.error);
    // [END storage_upload_file]
  }
  
  main(...process.argv.slice(2));
  