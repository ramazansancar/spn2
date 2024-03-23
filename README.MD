# Save Page Now 2 for Wayback Machine

The SPN2 JS Library provides an easy-to-use interface to interact with the Save Page Now 2 (SPN2) API, which is part of the Internet Archive's Wayback Machine service.

API Docs Source: [Google Docs](https://docs.google.com/document/d/1Nsv52MvSjbLb2PCpHlat0gkzw0EvtSgpKHu4mk0MnrA/view)
API Change Log: [Google Docs](https://docs.google.com/document/d/19RJsRncGUw2qHqGGg9lqYZYf7KKXMDL1Mro5o1Qw6QI/view)

## Installation

```bash
npm install -g spn2
```

OR

```bash
pnpm install -g spn2
```

OR

```bash
yarn global add spn2
```

## Usage

See [test.ts](https://github.com/ramazansancar/spn2/blob/master/test.ts) for usage examples.

## Error Codes

| status_ext | Description |
| --- | --- |
| error:bad-gateway | Bad Gateway for URL (HTTP status=502). |
| error:bad-request | The server could not understand the request due to invalid syntax. (HTTP status=401) |
| error:bandwidth-limit-exceeded | The target server has exceeded the bandwidth specified by the server administrator. (HTTP status=509). |
| error:blocked | The target site is blocking us (HTTP status=999). |
| error:blocked-client-ip | Anonymous clients which are listed in https://www.spamhaus.org/xbl/ or https://www.spamhaus.org/sbl/ lists (spams & exploits) are blocked. Tor exit nodes are excluded from this filter. |
| error:blocked-url | We use a URL block list based on Mozilla web tracker lists to avoid unwanted captures. |
| error:browsing-timeout | SPN2 back-end headless browser timeout. |
| error:capture-location-error | SPN2 back-end cannot find the created capture location. (system error). |
| error:cannot-fetch | Cannot fetch the target URL due to system overload. |
| error:celery | Cannot start capture task. |
| error:filesize-limit | Cannot capture web resources over 2GB. |
| error:ftp-access-denied | Tried to capture an FTP resource but access was denied. |
| error:gateway-timeout | The target server didn't respond in time. (HTTP status=504). |
| error:http-version-not-supported | The target server does not support the HTTP protocol version used in the request for URL (HTTP status=505). |
| error:internal-server-error | SPN internal server error. |
| error:invalid-url-syntax | Target URL syntax is not valid. |
| error:invalid-server-response | The target server response was invalid. (e.g. invalid headers, invalid content encoding, etc). |
| error:invalid-host-resolution | Couldn’t resolve the target host. |
| error:job-failed | Capture failed due to system error. |
| error:method-not-allowed | The request method is known by the server but has been disabled and cannot be used (HTTP status=405). |
| error:not-implemented | The request method is not supported by the server and cannot be handled (HTTP status=501). |
| error:no-browsers-available | SPN2 back-end headless browser cannot run. |
| error:network-authentication-required | The client needs to authenticate to gain network access to the URL (HTTP status=511). |
| error:no-access | Target URL could not be accessed (status=403). |
| error:not-found | Target URL not found (status=404). |
| error:not-implemented | The request method is not supported by the server and cannot be handled for URL (HTTP status=501). |
| error:proxy-error | SPN2 back-end proxy error. |
| error:protocol-error | HTTP connection broken. (A possible cause of this error is “IncompleteRead”). |
| error:read-timeout | HTTP connection read timeout. |
| error:soft-time-limit-exceeded | Capture duration exceeded 45s time limit and was terminated. |
| error:service-unavailable | Service unavailable for URL (HTTP status=503). |
| error:too-many-daily-captures | This URL has been captured 10 times today. We cannot make any more captures. |
| error:too-many-redirects | Too many redirects. SPN2 tries to follow 3 redirects automatically. |
| error:too-many-requests | The target host has received too many requests from SPN and it is blocking it. (HTTP status=429). Note that captures to the same host will be delayed for 10-20s after receiving this response to remedy the situation. |
| error:user-session-limit | User has reached the limit of concurrent active capture sessions. |
| error:unauthorized | The server requires authentication (HTTP status=401). |

## License

[GPL-3.0](https://github.com/ramazansancar/spn2/blob/master/LICENSE)

Author: [Ramazan Sancar](https://github.com/ramazansancar)
