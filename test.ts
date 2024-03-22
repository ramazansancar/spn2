import SPN2Client from './index';

// Create a new instance of SPN2Client
// Set the accessKey and secretKey to empty string
// Check here: https://archive.org/account/s3.php
const client = new SPN2Client('ACCESS_KEY', 'SECRET_KEY');

(async () => {
    await client.savePageNow({
        url: 'https://www.npmjs.com/package/spn2',
        captureAll: true,
        captureOutlinks: true,
        captureScreenshot: true,
        /*delayWBAvalability: true,
        forceGet: true,
        skipFirstArchive: true,
        outlinks_availability: true,
        emailResults: true,
        captureExternalCookies: 'test',
        captureExternalUserAgent: 'test',
        captureTargetAuthorizations: {
            username: 'test',
            password: 'test'
        }*/
    }).then((res: any) => {
        console.log(res);
        return {
            url: res?.url,
            job_id: res?.job_id,
            message: res?.message,
            status: res?.status,
            status_ext: res?.status_ext
        };
    });
})();

//console.log(client.test('https://www.google.com'));