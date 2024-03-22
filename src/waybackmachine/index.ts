import constant from "./constant";

export interface SavePageNowOptions {
    url: string;
    captureAll?: boolean;
    captureOutlinks?: boolean;
    captureScreenshot?: boolean;
    delayWBAvailability?: boolean;
    forceGet?: boolean;
    skipFirstArchive?: boolean;
    ifNotArchivedWithin?: number|string;
    ifNotArchivedWithinBetween?: string[];
    outlinks_availability?: boolean;
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
     * 
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
                console.error(error);
                reject(false);
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
                console.log(`savePageRequest Opt:`,opt);
                await fetch(constant.API_URL, opt)
                .then(async (res: any) => {
                    console.log(`savePageRequest Response1:`,res);
                    var data = await res.json();
                    console.log(`savePageRequest Response2:`,data);
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
        const outlinks_availability = await this.booleanParser(options.outlinks_availability || false);
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
            Authorization: `LOW ${this.accessKey}:${this.secretKey}`
        };

        requestOptions.body = {
            url: options.url,
            capture_all: captureAll,
            capture_outlinks: captureOutlinks,
            capture_screenshot: captureScreenshot,
            delay_wb_availability: delayWBAvailability,
            force_get: forceGet,
            skip_first_archive: skipFirstArchive,
            if_not_archived_within: options.ifNotArchivedWithin,
            outlinks_availability: outlinks_availability,
            email_result: emailResults,
            capture_cookie: captureExternalCookies,
            use_user_agent: captureExternalUserAgent,
            target_username: captureTargetAuthorizations.username,
            target_password: captureTargetAuthorizations.password
        };
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
