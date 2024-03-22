import SPN2Client from './index';

const client = new SPN2Client('9Jk7NiaFIzCr1IGw','CQx2ezTt7jjZh8xG');

(async () => {
    await client.savePageNow({
        url: 'https://www.asteriks.com',
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