import SPN2Client from './index';
import env from './env';

// Create a new instance of SPN2Client
// You can get your ACCESS_KEY and SECRET_KEY from your account on archive.org
// Check here: https://archive.org/account/s3.php
const client = new SPN2Client(env.ACCESS_KEY, env.SECRET_KEY);

(async () => {
    await client.savePageNow({
        url: 'https://www.npmjs.com/package/spn2',
        captureAll: true,
        captureOutlinks: true,
        captureScreenshot: true,
        /*
        delayWBAvalability: true,
        forceGet: true,
        skipFirstArchive: true,
        ifNotArchivedWithinBetween: ["1h","5h"],
        ifNotArchivedWithin: 1h,
        outlinks_availability: true,
        emailResults: true,
        captureExternalCookies: 'test',
        captureExternalUserAgent: 'test',
        captureTargetAuthorizations: {
            username: 'test',
            password: 'test'
        }
        */
    }).then((res: object) => {
        console.log(`client.savePageNow():`,res);
    });

    await client.savePageNowStatus('spn2-f1500ef4caff2c81b98feff1e3bfcb762255950b').then((res: object) => {
        console.log(`client.savePageNowStatus('spn2-f1500e'):`,res);
    });

    await client.systemStatus().then((res: object) => {
        console.log(`client.systemStatus():`,res);
    });

    await client.userStatus().then((res: object) => {
        console.log(`client.userStatus():`,res);
    });
})();

//console.log(client.test('https://www.google.com'));