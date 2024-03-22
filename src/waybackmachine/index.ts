import constant from "./constant";

export interface SavePageNowOptions {
    url: string;
    captureAll?: boolean;
    captureOutlinks?: boolean;
    captureScreenshot?: boolean;
    delayWBAvailability?: boolean;
    forceGet?: boolean;
    skipFirstArchive?: boolean;
    ifNotArchivedWithin?: string;
    ifNotArchivedWithinBetween?: number[]|string[];
    outlinksAvailability?: boolean;
    emailResults?: boolean;
    captureExternalCookies?: string;
    captureExternalUserAgent?: string;
    captureTargetAuthorizations?: SavePageNowAuth;
}

interface SavePageNowAuth {
    username?: string;
    password?: string;
}

export interface SavePageNowRequestOptions {
    url: string;
    method: "POST"|"GET";
    headers: any;
    body: any;
}

export interface SavePageNowResponse {
    url?: string;
    job_id?: string;
    message?: string;
    status?: string;
    status_ext?: string;
}

export interface SavePageNowStatusResponse {
    counters: {
        embeds: number;
        outlinks: number;
    };
    duration_sec: number;
    http_status: number;
    job_id: string;
    original_url: string;
    outlinks: {
        [key: string]: string;
    }|string[];
    resources: string[];
    screenshot: string;
    status: string;
    timestamp: string;
}

export default class SPN2Client {
    accessKey: string;
    secretKey: string;
    /**
     * @param accessKey Your access key (https://archive.org/account/s3.php)
     * @param secretKey Your secret key (https://archive.org/account/s3.php)
     * @returns SPN2Client
    */
    constructor(accessKey:string, secretKey:string) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
    }

    async booleanParser(value: boolean) {
        return value ? '1' : undefined;
    }

    async checkUrl(url: string): Promise<boolean|any>{
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url);
                if(response.status === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (error) {
                reject(false);
                console.error(error);
            }
        });
    };

    async apiRequest(endpoint: string, options: any) {
        options.method = 'POST';
        options.body = `url=${options.url}`;
        options.headers = constant.API_HEADERS;
        options.body = new URLSearchParams(options.body).toString();

        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(endpoint, options);
                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    async savePageRequest(url: string, opt: SavePageNowRequestOptions) {
        return new Promise(async (resolve, reject) => {
            try {
                await fetch(constant.API_URL, opt)
                .then(async (res: any) => {
                    var data = await res.json();
                    resolve({
                        url: data?.url,
                        job_id: data?.job_id,
                        message: data?.message,
                        status: data?.status,
                        status_ext: data?.status_ext
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public async savePageNow(options: SavePageNowOptions) {
        
        const captureAll = await this.booleanParser(options.captureAll || false);
        const captureOutlinks = await this.booleanParser(options.captureOutlinks || false);
        const captureScreenshot = await this.booleanParser(options.captureScreenshot || false);
        const delayWBAvailability = await this.booleanParser(options.delayWBAvailability || false);
        const forceGet = await this.booleanParser(options.forceGet || false);
        const skipFirstArchive = await this.booleanParser(options.skipFirstArchive || false);
        const ifNotArchivedWithinBetween = options.ifNotArchivedWithinBetween || undefined;
        const ifNotArchivedWithin = options.ifNotArchivedWithin || undefined;
        const outlinksAvailability = await this.booleanParser(options.outlinksAvailability || false);
        const emailResults = await this.booleanParser(options.emailResults || false);
        const captureExternalCookies = options.captureExternalCookies || undefined;
        const captureExternalUserAgent = options.captureExternalUserAgent || undefined;
        const captureTargetAuthorizations = options.captureTargetAuthorizations || {};

        let requestOptions: SavePageNowRequestOptions = {
            url: options.url,
            method: 'POST',
            headers: {},
            body: {}
        };

        requestOptions.headers = {
            ...constant.API_HEADERS,
            authorization: `LOW ${this.accessKey}:${this.secretKey}`
        };

        const urlencodedBody = new URLSearchParams();

        urlencodedBody.append("url", options.url);

        if(captureAll) {
            urlencodedBody.append("capture_all", captureAll || '0');
        }
        if(captureOutlinks) {
            urlencodedBody.append("capture_outlinks", captureOutlinks || '0');
        }
        if(captureScreenshot) {
            urlencodedBody.append("capture_screenshot", captureScreenshot || '0');
        }
        if(delayWBAvailability) {
            urlencodedBody.append("delay_wb_availability", delayWBAvailability || '0');
        }
        if(forceGet) {
            urlencodedBody.append("force_get", forceGet || '0');
        }
        if(skipFirstArchive) {
            urlencodedBody.append("skip_first_archive", skipFirstArchive || '0');
        }
        if(ifNotArchivedWithinBetween) {
            if(Array.isArray(options.ifNotArchivedWithinBetween)) {
                urlencodedBody.append("if_not_archived_within", ifNotArchivedWithinBetween.join(',') as string);
            }
        }else{
            if(ifNotArchivedWithin) {
                urlencodedBody.append("if_not_archived_within", ifNotArchivedWithin || '');
            }
        }
        if(outlinksAvailability) {
            urlencodedBody.append("outlinks_availability", outlinksAvailability || '0');
        }
        if(emailResults) {
            urlencodedBody.append("email_result", emailResults || '0');
        }
        if(captureExternalCookies) {
            urlencodedBody.append("capture_cookie", captureExternalCookies || '');
        }
        if(captureExternalUserAgent) {
            urlencodedBody.append("use_user_agent", captureExternalUserAgent || '');
        }
        if(captureTargetAuthorizations) {
            urlencodedBody.append("target_username", captureTargetAuthorizations?.username || '');
            urlencodedBody.append("target_password", captureTargetAuthorizations?.password || '');
        }

        requestOptions.body = urlencodedBody;

        if(await this.checkUrl(options.url)) {
            return await this.savePageRequest(constant.API_URL, requestOptions);
        }else{
            return new Error('Invalid URL');
        }
    }

    public async savePageNowStatus(jobId: string): Promise<SavePageNowResponse>{
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${constant.API_URL}/status/${jobId}`);
                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
}

function then(arg0: (data: any) => void) {
    throw new Error("Function not implemented.");
}
