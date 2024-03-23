import constant from "./constant";

/**
 * @interface SavePageNowOptions
 * @param url The URL to save
 * @param captureAll Capture all embedded content
 * @param captureOutlinks Capture outlinks
 * @param captureScreenshot Capture a screenshot
 * @param delayWBAvailability Delay until the Wayback Machine has the page
 * @param forceGet Force a GET request
 * @param skipFirstArchive Skip the first archive
 * @param ifNotArchivedWithin If the page is not archived within the specified time
 * @param ifNotArchivedWithinBetween If the page is not archived within the specified time between
 * @param outlinksAvailability Check outlinks availability
 * @param emailResults Email the results
 * @param captureExternalCookies Capture external cookies
 * @param captureExternalUserAgent Capture external user agent
 * @param captureTargetAuthorizations Capture target authorizations
 * @returns SavePageNowOptions
 * @example
 * ```
 * {
 *   url: 'https://www.npmjs.com/package/spn2',
 *   captureAll: true,
 *   captureOutlinks: true,
 *   captureScreenshot: true,
 *   delayWBAvailability: true,
 *   forceGet: true,
 *   skipFirstArchive: true,
 *   ifNotArchivedWithin: '1h',
 *   ifNotArchivedWithinBetween: ['1h', '2h'],
 *   outlinksAvailability: true,
 *   emailResults: true,
 *   captureExternalCookies: 'test',
 *   captureExternalUserAgent: 'test',
 *   captureTargetAuthorizations: {
 *     username: 'test',
 *     password: 'test'
 *   }
 * }
 * ```
 */
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

export interface SystemStatusResponse {
    queues: SystemStatusResponseQueues;
    recent_captures: number;
    status: string;
}

export interface SystemStatusResponseQueues {
    api: number;
    api_misc: number;
    api_outlink: number;
    api_outlink_misc: number;
    high_fidelity: number;
    main: number;
    main_misc: number;
    main_outlink: number;
    main_outlink_misc: number;
}

export interface UserStatusResponse {
    available: number;
    daily_captures: number;
    daily_captures_limit: number;
    processing: number;
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

    async savePageRequest(options: SavePageNowRequestOptions): Promise<SavePageNowResponse>{
        return new Promise(async (resolve, reject) => {
            try {
                await fetch(constant.API_URL, options)
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

    public async savePageNow(options: SavePageNowOptions): Promise<SavePageNowResponse> {
        
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
            return await this.savePageRequest(requestOptions);
        }else{
            return new Error('Invalid URL');
        }
    }

    public async savePageNowStatus(jobId: string): Promise<SavePageNowStatusResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${constant.API_URL}/status/${jobId}`);
                const data = await response.json();
                resolve({
                    job_id: data?.job_id,
                    status: data?.status,
                    http_status: data?.http_status,
                    original_url: data?.original_url,
                    duration_sec: data?.duration_sec,
                    counters: {
                        embeds: data?.counters?.embeds,
                        outlinks: data?.counters?.outlinks
                    },
                    outlinks: data?.outlinks,
                    resources: data?.resources,
                    screenshot: data?.screenshot,
                    timestamp: data?.timestamp
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public async systemStatus(): Promise<SystemStatusResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${constant.API_URL}/status/system`)
                const data = await response.json();
                resolve({
                    status: data?.status,
                    recent_captures: data?.recent_captures,
                    queues: {
                        api: data?.queues?.api,
                        api_misc: data?.queues?.api_misc,
                        api_outlink: data?.queues?.api_outlink,
                        api_outlink_misc: data?.queues?.api_outlink_misc,
                        high_fidelity: data?.queues?.high_fidelity,
                        main: data?.queues?.main,
                        main_misc: data?.queues?.main_misc,
                        main_outlink: data?.queues?.main_outlink,
                        main_outlink_misc: data?.queues?.main_outlink_misc
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    public async userStatus(): Promise<UserStatusResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                let requestOptions: any = {
                    method: 'GET',
                    redirect: 'follow',
                    headers: {}
                };
        
                requestOptions.headers = {
                    //...constant.API_HEADERS,
                    authorization: `LOW ${this.accessKey}:${this.secretKey}`
                };

                const response = await fetch(`${constant.API_URL}/status/user`, requestOptions);
                const data = await response.json();
                resolve({
                    available: data?.available,
                    processing: data?.processing,
                    daily_captures: data?.daily_captures,
                    daily_captures_limit: data?.daily_captures_limit,
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
