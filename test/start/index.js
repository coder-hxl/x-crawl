'use strict';

var fs = require('node:fs');
var promises = require('node:fs/promises');
var path = require('node:path');
var puppeteer = require('puppeteer');
var chalk = require('chalk');
var http = require('node:http');
var https = require('node:https');
var Url = require('node:url');
var HttpsProxyAgent = require('https-proxy-agent');

function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}
function random(max, min = 0) {
    let res = Math.floor(Math.random() * max);
    while (res < min) {
        res = Math.floor(Math.random() * max);
    }
    return res;
}
function mkdirDirSync(dir) {
    const dirSplit = path.resolve(dir).split(path.sep);
    dirSplit.reduce((prev, item, index) => {
        const currentDir = index !== 0 ? path.join(prev, item) : item;
        if (!fs.existsSync(currentDir)) {
            fs.mkdirSync(currentDir);
        }
        return currentDir;
    }, '');
}
const log = console.log;
const logNumber = chalk.hex('#a57fff');
const logSuccess = chalk.green;
const logError = chalk.red;
const logWarn = chalk.yellow;
function isUndefined(value) {
    return typeof value === 'undefined';
}
function isNumber(value) {
    return typeof value === 'number';
}
function isObject(value) {
    return typeof value === 'object' && value && !Array.isArray(value);
}
function isArray(value) {
    return Array.isArray(value);
}

async function useSleepByBatch(isHaventervalTime, isNumberIntervalTime, intervalTime, id) {
    if (isHaventervalTime && id > 1) {
        const timeout = isNumberIntervalTime
            ? intervalTime
            : random(intervalTime.max, intervalTime.min);
        log(`Id: ${logNumber(id)} - Crawl needs to sleep for ${logNumber(timeout + 'ms')} milliseconds before sending`);
        await sleep(timeout);
    }
    else {
        log(`Id: ${logNumber(id)} - Crawl does not need to sleep, send immediately`);
    }
}
async function asyncBatchCrawl(detailInfos, extraConfig, singleCrawlHandle, singleResultHandle) {
    const { intervalTime } = extraConfig;
    const isHaventervalTime = !isUndefined(intervalTime);
    const isNumberIntervalTime = isNumber(intervalTime);
    const crawlPendingQueue = [];
    for (const detailInfo of detailInfos) {
        const { id } = detailInfo;
        await useSleepByBatch(isHaventervalTime, isNumberIntervalTime, intervalTime, id);
        const crawlSinglePending = singleCrawlHandle(detailInfo, extraConfig)
            .catch((error) => {
            detailInfo.crawlErrorQueue.push(error);
            return false;
        })
            .then((detailTargetRes) => {
            const notAllowRetry = detailInfo.retryCount === detailInfo.maxRetry;
            if (typeof detailTargetRes === 'boolean') {
                if (notAllowRetry) {
                    singleResultHandle(detailInfo, extraConfig);
                }
                return;
            }
            detailInfo.isSuccess = true;
            detailInfo.detailTargetRes = detailTargetRes;
            // 根据 状态码/是否无法重试 决定处理结果
            const { detailTarget } = detailInfo;
            const status = getCrawlStatus(detailTargetRes);
            const switchByHttpStatus = detailTarget.proxy?.switchByHttpStatus ?? [];
            if ((status && !switchByHttpStatus.includes(status)) || notAllowRetry) {
                log(status, switchByHttpStatus);
                singleResultHandle(detailInfo, extraConfig);
                delete detailInfo._notHandle;
            }
        });
        crawlPendingQueue.push(crawlSinglePending);
    }
    // 等待所有爬取结束
    await Promise.all(crawlPendingQueue);
}
async function syncBatchCrawl(detailInfos, extraConfig, singleCrawlHandle, singleResultHandle) {
    const { intervalTime } = extraConfig;
    const isHaventervalTime = !isUndefined(intervalTime);
    const isNumberIntervalTime = isNumber(intervalTime);
    for (const detailInfo of detailInfos) {
        const { id } = detailInfo;
        await useSleepByBatch(isHaventervalTime, isNumberIntervalTime, intervalTime, id);
        try {
            detailInfo.detailTargetRes = await singleCrawlHandle(detailInfo, extraConfig);
            detailInfo.isSuccess = true;
        }
        catch (error) {
            detailInfo.crawlErrorQueue.push(error);
        }
        // 根据 是否成功和状态码/是否无法重试 决定处理结果
        const { detailTarget, detailTargetRes } = detailInfo;
        const status = getCrawlStatus(detailTargetRes);
        const switchByHttpStatus = detailTarget.proxy?.switchByHttpStatus ?? [];
        const notAllowRetry = detailInfo.retryCount === detailInfo.maxRetry;
        if ((detailInfo.isSuccess &&
            status &&
            !switchByHttpStatus.includes(status)) ||
            notAllowRetry) {
            singleResultHandle(detailInfo, extraConfig);
            delete detailInfo._notHandle;
        }
    }
}

function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
function quickSort(arr) {
    const n = arr.length;
    partition(0, n - 1);
    function partition(left, right) {
        if (left >= right)
            return;
        // 1.找基准元素
        const pivot = arr[right];
        // 2.定义双指针进行交换(左小右大)
        let i = left;
        let j = right - 1;
        while (i <= j) {
            while (arr[i] < pivot) {
                i++;
            }
            while (arr[j] > pivot) {
                j--;
            }
            if (i <= j) {
                swap(arr, i, j);
                i++;
                j--;
            }
        }
        // 3.将 pivot 放到正确位置
        swap(arr, i, right);
        // 4.左右划分区域
        partition(left, i - 1);
        partition(i + 1, right);
    }
    return arr;
}
function priorityQueueMergeSort(arr) {
    if (arr.length === 1)
        return arr;
    const mid = Math.floor(arr.length / 2);
    const newLeftArr = priorityQueueMergeSort(arr.slice(0, mid));
    const newRightArr = priorityQueueMergeSort(arr.slice(mid));
    const newArr = [];
    let i = 0;
    let j = 0;
    while (i < newLeftArr.length && j < newRightArr.length) {
        if (newLeftArr[i] >= newRightArr[j]) {
            newArr.push(newLeftArr[i]);
            i++;
        }
        else {
            newArr.push(newRightArr[j]);
            j++;
        }
    }
    if (i < newLeftArr.length) {
        newArr.push(...newLeftArr.slice(i));
    }
    if (j < newRightArr.length) {
        newArr.push(...newRightArr.splice(j));
    }
    return newArr;
}

function getCrawlStatus(detailTargetRes) {
    let status = null;
    if (isObject(detailTargetRes) &&
        Object.hasOwn(detailTargetRes, 'response') &&
        detailTargetRes.response) {
        // crawlPage
        const response = detailTargetRes.response;
        status = response.status();
    }
    else if (isObject(detailTargetRes)) {
        // crawlData / crawlFie
        status = detailTargetRes.statusCode ?? null;
    }
    return status;
}
async function controller(name, mode, detailTargets, extraConfig, singleCrawlHandle, singleResultHandle) {
    // 是否使用优先爬取
    const isPriorityCrawl = !detailTargets.every((item) => item.priority === detailTargets[0].priority);
    const detailTargetConfigs = isPriorityCrawl
        ? priorityQueueMergeSort(detailTargets.map((item) => ({
            ...item,
            valueOf: () => item.priority
        })))
        : detailTargets;
    // 通过映射生成新的配置数组
    const detailInfos = detailTargetConfigs.map((detailTarget, index) => ({
        _notHandle: true,
        id: index + 1,
        isSuccess: false,
        maxRetry: detailTarget.maxRetry,
        retryCount: 0,
        crawlErrorQueue: [],
        proxyDetailes: detailTarget.proxyDetails,
        data: null,
        detailTarget,
        detailTargetRes: null
    }));
    log(`${logSuccess(`Start crawling`)} - name: ${logWarn(name)}, mode: ${logWarn(mode)}, total: ${logNumber(detailInfos.length)} `);
    // 选择爬取模式
    const batchCrawl = mode === 'async' ? asyncBatchCrawl : syncBatchCrawl;
    let i = 0;
    let crawlQueue = detailInfos;
    while (crawlQueue.length) {
        await batchCrawl(crawlQueue, extraConfig, singleCrawlHandle, singleResultHandle);
        crawlQueue = crawlQueue.filter((detailInfo) => {
            const { isSuccess, maxRetry, retryCount, proxyDetailes, crawlErrorQueue, detailTarget, detailTargetRes } = detailInfo;
            let isRetry = false;
            const haveRetryChance = maxRetry && retryCount < maxRetry;
            // 没有被处理/没成功/状态码不符合
            if (Object.hasOwn(detailInfo, '_notHandle') && haveRetryChance) {
                // 1.不成功
                if (!isSuccess) {
                    isRetry = true;
                }
                // 2.代理多, 轮换代理
                if (proxyDetailes.length >= 2) {
                    // 获取状态码
                    const status = getCrawlStatus(detailTargetRes);
                    // 错误次数 / 检测状态码
                    const switchByErrorCount = detailTarget.proxy?.switchByErrorCount ?? 0;
                    const switchByHttpStatus = detailTarget.proxy?.switchByHttpStatus ?? [];
                    if ((status && switchByHttpStatus.includes(status)) ||
                        switchByErrorCount >= crawlErrorQueue.length) {
                        isRetry = true;
                        proxyDetailes.find((detail) => detail.url === detailTarget.proxyUrl).state = false;
                        // 寻找新代理 URL
                        const newProxyUrl = proxyDetailes.find((detaile) => detaile.state)?.url;
                        // 无则不切换
                        if (!isUndefined(newProxyUrl)) {
                            detailTarget.proxyUrl = newProxyUrl;
                        }
                    }
                }
            }
            // 重置需要重试的 isSuccess
            if (isRetry) {
                detailInfo.isSuccess = false;
            }
            return isRetry;
        });
        if (crawlQueue.length) {
            const retriedIds = crawlQueue.map((item) => {
                item.retryCount++;
                return item.id;
            });
            log(logWarn(`Retry: ${++i} - Ids to retry: [ ${retriedIds.join(' - ')} ]`));
        }
    }
    // 统计结果
    const succssIds = [];
    const errorIds = [];
    detailInfos.forEach((item) => {
        if (item.isSuccess) {
            succssIds.push(item.id);
        }
        else {
            errorIds.push(item.id);
        }
    });
    log('Crawl the final result:');
    log(logSuccess(`  Success - total: ${succssIds.length}, ids: [ ${succssIds.join(' - ')} ]`));
    log(logError(`    Error - total: ${errorIds.length}, ids: [ ${errorIds.join(' - ')} ]`));
    return detailInfos;
}

function parseParams(urlSearch, params) {
    let res = urlSearch ? `${urlSearch}` : '?';
    if (params) {
        for (const key in params) {
            const value = params[key];
            res += `&${key}=${value}`;
        }
    }
    else {
        res = urlSearch;
    }
    return res;
}
function parseHeaders(rawConfig, config) {
    const rawHeaders = rawConfig.headers ?? {};
    const headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        ...rawHeaders
    };
    if (config.method === 'POST' && rawConfig.data) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = Buffer.byteLength(rawConfig.data);
    }
    return headers;
}
function handleRequestConfig(rawConfig) {
    const { protocol, hostname, port, pathname, search } = new Url.URL(rawConfig.url);
    const isHttp = protocol === 'http:';
    const config = {
        agent: rawConfig.proxyUrl
            ? HttpsProxyAgent(rawConfig.proxyUrl)
            : isHttp
                ? new http.Agent()
                : new https.Agent(),
        protocol,
        hostname,
        port,
        path: pathname,
        search: parseParams(search, rawConfig.params),
        method: rawConfig.method?.toLocaleUpperCase() ?? 'GET',
        headers: {},
        timeout: rawConfig.timeout
    };
    config.headers = parseHeaders(rawConfig, config);
    return config;
}
function request(config) {
    return new Promise((resolve, reject) => {
        const isDataUndefine = isUndefined(config.data);
        config.data = !isDataUndefine ? JSON.stringify(config.data) : config.data;
        const requestConfig = handleRequestConfig(config);
        function handleRes(res) {
            const { statusCode, headers } = res;
            const container = [];
            res.on('data', (chunk) => container.push(chunk));
            res.on('end', () => {
                const data = Buffer.concat(container);
                const resolveRes = {
                    statusCode,
                    headers,
                    data
                };
                resolve(resolveRes);
            });
        }
        let req;
        if (requestConfig.protocol === 'http:') {
            req = http.request(requestConfig, handleRes);
        }
        else {
            req = https.request(requestConfig, handleRes);
        }
        req.on('timeout', () => {
            reject(new Error(`Timeout ${config.timeout}ms`));
        });
        req.on('error', (err) => {
            reject(err);
        });
        // 其他处理
        if (requestConfig.method === 'POST' && !isDataUndefine) {
            req.write(config.data);
        }
        req.end();
    });
}

const fingerprints = [
    {
        platform: 'Windows',
        mobile: 'random',
        userAgent: {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            versions: [
                {
                    name: 'Chrome',
                    maxMajorVersion: 112,
                    minMajorVersion: 100,
                    maxMinorVersion: 10,
                    maxPatchVersion: 5615
                },
                { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 }
            ]
        }
    },
    {
        platform: 'Windows',
        mobile: 'random',
        userAgent: {
            value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
            versions: [
                {
                    name: 'Chrome',
                    maxMajorVersion: 91,
                    minMajorVersion: 88,
                    maxMinorVersion: 10,
                    maxPatchVersion: 5615
                },
                { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 },
                { name: 'Edg', maxMinorVersion: 10, maxPatchVersion: 864 }
            ]
        }
    },
    {
        platform: 'Windows',
        mobile: 'random',
        userAgent: {
            value: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
            versions: [
                {
                    name: 'Firefox',
                    maxMajorVersion: 47,
                    minMajorVersion: 43,
                    maxMinorVersion: 10,
                    maxPatchVersion: 5000
                }
            ]
        }
    }
];

/* Function */
function parsePageCookies(url, cookies) {
    const cookiesArr = [];
    if (typeof cookies === 'string') {
        cookies.split('; ').forEach((item) => {
            const cookie = item.split('=');
            cookiesArr.push({ name: cookie[0], value: cookie[1], url });
        });
    }
    else if (Array.isArray(cookies)) {
        cookies.forEach((cookie) => {
            if (!cookie.url) {
                cookie.url = url;
            }
            cookiesArr.push(cookie);
        });
    }
    else if (typeof cookies === 'object' && cookies) {
        if (!cookies.url) {
            cookies.url = url;
        }
        cookiesArr.push(cookies);
    }
    return cookiesArr;
}
function transformTargetToDetailTargets(config) {
    return isArray(config)
        ? config.map((item) => (isObject(item) ? item : { url: item }))
        : [isObject(config) ? config : { url: config }];
}
/* Loader config */
function loaderCommonFingerprintToDetailTarget(detail, fingerprint) {
    const { ua, platform, platformVersion, mobile, acceptLanguage, userAgent } = fingerprint;
    let headers = detail.headers;
    if (!headers) {
        detail.headers = headers = {};
    }
    // 1.sec-ch-ua
    if (ua) {
        headers['sec-ch-ua'] = ua;
    }
    // 2.sec-ch-ua-mobile
    if (mobile) {
        headers['sec-ch-ua-mobile'] =
            mobile === 'random' ? (random(2) ? '?1' : '?0') : mobile;
    }
    // 3.sec-ch-platform
    if (platform) {
        headers['sec-ch-platform'] = platform;
    }
    // 4.sec-ch-ua-platform-version
    if (platformVersion) {
        headers['sec-ch-ua-platform-version'] = platformVersion;
    }
    // 5.accept-language
    if (acceptLanguage) {
        headers['accept-language'] = acceptLanguage;
    }
    // 6.user-agent
    if (userAgent) {
        let value = userAgent.value;
        userAgent.versions?.forEach((version) => {
            const { name, maxMajorVersion, minMajorVersion, maxMinorVersion, minMinorVersion, maxPatchVersion, minPatchVersion } = version;
            const nameSplit = value.split(`${name}/`);
            const versionSplit = nameSplit[1].split(' ')[0].split('.');
            const originalVersion = versionSplit.join('.');
            if (!isUndefined(maxMajorVersion)) {
                versionSplit[0] =
                    maxMajorVersion === minMajorVersion
                        ? maxMajorVersion
                        : random(maxMajorVersion, minMajorVersion);
            }
            if (!isUndefined(maxMinorVersion)) {
                versionSplit[1] =
                    maxMinorVersion === minMinorVersion
                        ? maxMinorVersion
                        : random(maxMinorVersion, minMinorVersion);
            }
            if (!isUndefined(maxPatchVersion)) {
                versionSplit[2] =
                    maxPatchVersion === minPatchVersion
                        ? maxPatchVersion
                        : random(maxPatchVersion, minPatchVersion);
            }
            const searchValue = `${name}/${originalVersion}`;
            const replaceValue = `${name}/${versionSplit.join('.')}`;
            value = value.replace(searchValue, replaceValue);
        });
        headers['user-agent'] = value;
    }
}
function loaderPageFingerprintToDetailTarget(detail, fingerprint) {
    const { maxWidth, minWidth, maxHeight, minHidth } = fingerprint;
    const viewport = detail.viewport ?? {};
    // 1.width / height
    if (maxWidth) {
        viewport.width =
            maxWidth === minWidth ? maxWidth : random(maxWidth, minWidth);
    }
    if (maxHeight) {
        viewport.height =
            maxHeight === minHidth ? maxHeight : random(maxHeight, minHidth);
    }
    if (Object.hasOwn(viewport, 'width') && Object.hasOwn(viewport, 'height')) {
        detail.viewport = viewport;
    }
}
function loaderCommonConfigToCrawlConfig(xCrawlConfig, advancedDetailTargetsConfig, crawlConfig) {
    // 1.detailTargets
    crawlConfig.detailTargets = advancedDetailTargetsConfig.detailTargets.map((rawDetail) => {
        // detail > advanced > app
        const detail = rawDetail;
        const { url, timeout, proxy, maxRetry, priority, headers, fingerprint } = detail;
        // 1.1.baseUrl
        if (!isUndefined(xCrawlConfig.baseUrl)) {
            detail.url = xCrawlConfig.baseUrl + url;
        }
        // 1.2.timeout
        if (isUndefined(timeout)) {
            if (!isUndefined(advancedDetailTargetsConfig.timeout)) {
                detail.timeout = advancedDetailTargetsConfig.timeout;
            }
            else {
                detail.timeout = xCrawlConfig.timeout;
            }
        }
        // 1.3.maxRetry
        if (isUndefined(maxRetry)) {
            if (!isUndefined(advancedDetailTargetsConfig.maxRetry)) {
                detail.maxRetry = advancedDetailTargetsConfig.maxRetry;
            }
            else {
                detail.maxRetry = xCrawlConfig.maxRetry;
            }
        }
        // 1.4.proxy
        if (isUndefined(proxy)) {
            if (!isUndefined(advancedDetailTargetsConfig.proxy)) {
                detail.proxy = advancedDetailTargetsConfig.proxy;
            }
            else if (!isUndefined(xCrawlConfig.proxy)) {
                detail.proxy = xCrawlConfig.proxy;
            }
        }
        // 1.5.proxyUrl & proxyDetail
        if (!isUndefined(detail.proxy?.urls)) {
            const urls = detail.proxy.urls;
            detail.proxyUrl = urls[0];
            detail.proxyDetails = urls.map((url) => ({ url, state: true }));
        }
        // 1.6.priority
        if (isUndefined(priority)) {
            detail.priority = 0;
        }
        // 1.7.header
        if (isUndefined(headers) && advancedDetailTargetsConfig.headers) {
            detail.headers = { ...advancedDetailTargetsConfig.headers };
        }
        // 1.8.fingerprint(公共部分)
        if (fingerprint) {
            // detaileTarget
            loaderCommonFingerprintToDetailTarget(detail, fingerprint);
        }
        else if (isUndefined(fingerprint) &&
            isArray(advancedDetailTargetsConfig.fingerprints) &&
            advancedDetailTargetsConfig.fingerprints.length) {
            // advancedConfig
            const fingerprints = advancedDetailTargetsConfig.fingerprints;
            const selectFingerprintIndex = random(fingerprints.length);
            const fingerprint = fingerprints[selectFingerprintIndex];
            // 记录每个目标选中的指纹索引
            crawlConfig.selectFingerprintIndexs.push(selectFingerprintIndex);
            loaderCommonFingerprintToDetailTarget(detail, fingerprint);
        }
        else if (isUndefined(fingerprint) &&
            !isArray(advancedDetailTargetsConfig.fingerprints) &&
            xCrawlConfig.enableRandomFingerprint) {
            // xCrawlConfig
            const fingerprint = fingerprints[random(fingerprints.length)];
            loaderCommonFingerprintToDetailTarget(detail, fingerprint);
        }
        return detail;
    });
    // 2.intervalTime
    crawlConfig.intervalTime = advancedDetailTargetsConfig.intervalTime;
    if (isUndefined(advancedDetailTargetsConfig.intervalTime) &&
        !isUndefined(xCrawlConfig.intervalTime)) {
        crawlConfig.intervalTime = xCrawlConfig.intervalTime;
    }
    // 3.onCrawlItemComplete
    crawlConfig.onCrawlItemComplete =
        advancedDetailTargetsConfig.onCrawlItemComplete;
}
/* Create config */
/*
  每个创建配置函数的返回值都是类似于进阶配置
  不同点:
    - detailTargets 里面将存放的是详细版目标配置
    - 不会保留与详细版目标配置相同的选项

  生成 advancedConfig 对象对每个详细版目标配置进行装载, 如果是传入进阶版配置会覆盖生成的 advancedConfig 对象
*/
function createCrawlPageConfig(xCrawlConfig, originalConfig) {
    const crawlPageConfig = {
        detailTargets: [],
        intervalTime: undefined,
        selectFingerprintIndexs: [],
        onCrawlItemComplete: undefined
    };
    let advancedDetailTargetsConfig = {
        targets: [],
        detailTargets: []
    };
    if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
        // CrawlPageAdvancedConfig 处理
        const { targets } = originalConfig;
        advancedDetailTargetsConfig =
            originalConfig;
        advancedDetailTargetsConfig.detailTargets =
            transformTargetToDetailTargets(targets);
    }
    else {
        // string | CrawlPageDetailTargetConfig | (string | CrawlPageDetailTargetConfig)[] 处理
        advancedDetailTargetsConfig.detailTargets = transformTargetToDetailTargets(originalConfig);
    }
    // 装载公共配置
    loaderCommonConfigToCrawlConfig(xCrawlConfig, advancedDetailTargetsConfig, crawlPageConfig);
    // 装载单独配置
    crawlPageConfig.detailTargets.forEach((detail, index) => {
        // detail > advanced  > xCrawl
        const { cookies, viewport, fingerprint } = detail;
        // 1.cookies
        if (isUndefined(cookies) && advancedDetailTargetsConfig.cookies) {
            detail.cookies = advancedDetailTargetsConfig.cookies;
        }
        // 2.viewport
        if (isUndefined(viewport) && advancedDetailTargetsConfig.viewport) {
            detail.viewport = advancedDetailTargetsConfig.viewport;
        }
        // 3.fingerprint
        if (fingerprint) {
            loaderPageFingerprintToDetailTarget(detail, fingerprint);
        }
        else if (isUndefined(fingerprint) &&
            advancedDetailTargetsConfig.fingerprints?.length) {
            // 从对应的选中记录中取出指纹索引
            const selectFingerprintIndex = crawlPageConfig.selectFingerprintIndexs[index];
            const fingerprint = advancedDetailTargetsConfig.fingerprints[selectFingerprintIndex];
            loaderPageFingerprintToDetailTarget(detail, fingerprint);
        }
    });
    return crawlPageConfig;
}
function createCrawlDataConfig(xCrawlConfig, originalConfig) {
    const crawlDataConfig = {
        detailTargets: [],
        intervalTime: undefined,
        selectFingerprintIndexs: [],
        onCrawlItemComplete: undefined
    };
    let advancedDetailTargetsConfig = {
        targets: [],
        detailTargets: []
    };
    if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
        // CrawlDataAdvancedConfig 处理
        const { targets } = originalConfig;
        advancedDetailTargetsConfig =
            originalConfig;
        advancedDetailTargetsConfig.detailTargets =
            transformTargetToDetailTargets(targets);
    }
    else {
        // string | CrawlDataDetailTargetConfig | (string | CrawlDataDetailTargetConfig)[] 处理
        advancedDetailTargetsConfig.detailTargets = transformTargetToDetailTargets(originalConfig);
    }
    loaderCommonConfigToCrawlConfig(xCrawlConfig, advancedDetailTargetsConfig, crawlDataConfig);
    return crawlDataConfig;
}
function createCrawlFileConfig(xCrawlConfig, originalConfig) {
    const crawlFileConfig = {
        detailTargets: [],
        intervalTime: undefined,
        selectFingerprintIndexs: [],
        onBeforeSaveItemFile: undefined,
        onCrawlItemComplete: undefined
    };
    let advancedDetailTargetsConfig = {
        targets: [],
        detailTargets: []
    };
    if (isObject(originalConfig) && Object.hasOwn(originalConfig, 'targets')) {
        // CrawlFileAdvancedConfig 处理
        const { targets } = originalConfig;
        advancedDetailTargetsConfig =
            originalConfig;
        advancedDetailTargetsConfig.detailTargets =
            transformTargetToDetailTargets(targets);
    }
    else {
        // CrawlFileDetailTargetConfig |  CrawlFileDetailTargetConfig[] 处理
        advancedDetailTargetsConfig.detailTargets = isArray(originalConfig)
            ? originalConfig
            : [originalConfig];
    }
    loaderCommonConfigToCrawlConfig(xCrawlConfig, advancedDetailTargetsConfig, crawlFileConfig);
    const haveAdvancedStoreDir = !isUndefined(advancedDetailTargetsConfig?.storeDir);
    const haveAdvancedExtension = !isUndefined(advancedDetailTargetsConfig?.extension);
    crawlFileConfig.detailTargets.forEach((detail) => {
        // 1.storeDir
        if (isUndefined(detail.storeDir) && haveAdvancedStoreDir) {
            detail.storeDir = advancedDetailTargetsConfig.storeDir;
        }
        // 2.extension
        if (isUndefined(detail.extension) && haveAdvancedExtension) {
            detail.extension = advancedDetailTargetsConfig.extension;
        }
    });
    crawlFileConfig.onBeforeSaveItemFile =
        advancedDetailTargetsConfig.onBeforeSaveItemFile;
    return crawlFileConfig;
}
/* Single crawl handle */
async function pageSingleCrawlHandle(detaileInfo, extraConfig) {
    const { id, detailTarget } = detaileInfo;
    const { errorPageMap, browser } = extraConfig;
    const page = await browser.newPage();
    if (detailTarget.viewport) {
        await page.setViewport(detailTarget.viewport);
    }
    let response = null;
    try {
        if (detailTarget.proxyUrl) {
            await browser.createIncognitoBrowserContext({
                proxyServer: detailTarget.proxyUrl
            });
        }
        else {
            await browser.createIncognitoBrowserContext({
                proxyServer: undefined
            });
        }
        if (detailTarget.cookies) {
            const cookies = parsePageCookies(detailTarget.url, detailTarget.cookies);
            await page.setCookie(...cookies);
        }
        else {
            const cookies = await page.cookies(detailTarget.url);
            await page.deleteCookie(...cookies);
        }
        if (detailTarget.headers) {
            await page.setExtraHTTPHeaders(detailTarget.headers);
        }
        response = await page.goto(detailTarget.url, {
            timeout: detailTarget.timeout
        });
    }
    catch (error) {
        // 收集报错的 page
        if (!errorPageMap.get(id)) {
            errorPageMap.set(id, page);
        }
        // 让外面收集错误
        throw error;
    }
    return { response, page };
}
async function dataAndFileSingleCrawlHandle(detaileInfo) {
    const { detailTarget } = detaileInfo;
    return await request(detailTarget);
}
/* Single result handle */
function pageSingleResultHandle(detaileInfo, extraConfig) {
    const { id, isSuccess, detailTargetRes } = detaileInfo;
    const { errorPageMap, browser, onCrawlItemComplete } = extraConfig;
    let data = null;
    if (isSuccess && detailTargetRes) {
        data = { browser: browser, ...detailTargetRes };
    }
    else {
        const page = errorPageMap.get(id);
        data = { browser: browser, response: null, page };
    }
    detaileInfo.data = data;
    const crawlPageSingleRes = detaileInfo;
    delete crawlPageSingleRes.detailTarget;
    delete crawlPageSingleRes.detailTargetRes;
    if (onCrawlItemComplete) {
        onCrawlItemComplete(crawlPageSingleRes);
    }
}
function fileSingleResultHandle(detaileInfo, extraConfig) {
    const { id, isSuccess, detailTarget, detailTargetRes } = detaileInfo;
    const { saveFileErrorArr, saveFilePendingQueue, onCrawlItemComplete, onBeforeSaveItemFile } = extraConfig;
    const crawlFileSingleRes = detaileInfo;
    delete crawlFileSingleRes.detailTarget;
    delete crawlFileSingleRes.detailTargetRes;
    if (isSuccess && detailTargetRes) {
        const mimeType = detailTargetRes.headers['content-type'] ?? '';
        const fileName = detailTarget.fileName ?? `${id}-${new Date().getTime()}`;
        const fileExtension = detailTarget.extension ?? `.${mimeType.split('/').pop()}`;
        if (detailTarget.storeDir && !fs.existsSync(detailTarget.storeDir)) {
            mkdirDirSync(detailTarget.storeDir);
        }
        const storePath = detailTarget.storeDir ?? __dirname;
        const filePath = path.resolve(storePath, fileName + fileExtension);
        // 在保存前的回调
        const data = detailTargetRes.data;
        let dataPromise = Promise.resolve(data);
        if (onBeforeSaveItemFile) {
            dataPromise = onBeforeSaveItemFile({
                id,
                fileName,
                filePath,
                data
            });
        }
        const saveFileItemPending = dataPromise.then(async (newData) => {
            let isSuccess = true;
            try {
                await promises.writeFile(filePath, newData);
            }
            catch (err) {
                isSuccess = false;
                const message = `File save error at id ${id}: ${err.message}`;
                const valueOf = () => id;
                saveFileErrorArr.push({ message, valueOf });
            }
            const size = newData.length;
            detaileInfo.data = {
                ...detailTargetRes,
                data: {
                    isSuccess,
                    fileName,
                    fileExtension,
                    mimeType,
                    size,
                    filePath
                }
            };
            if (onCrawlItemComplete) {
                onCrawlItemComplete(crawlFileSingleRes);
            }
        });
        // 存放保存文件 Promise , 后续等待即可回到 crawlFile 函数内部等待完成即可
        saveFilePendingQueue.push(saveFileItemPending);
    }
    else {
        if (onCrawlItemComplete) {
            onCrawlItemComplete(crawlFileSingleRes);
        }
    }
}
/* Create crawl API */
function createCrawlPage(xCrawlConfig) {
    let browser = null;
    let createBrowserPending = null;
    let haveCreateBrowser = false;
    async function crawlPage(config, callback) {
        //  创建浏览器
        if (!haveCreateBrowser) {
            haveCreateBrowser = true;
            createBrowserPending = puppeteer
                .launch(xCrawlConfig.crawlPage?.launchBrowser)
                .then((res) => {
                browser = res;
            });
        }
        // 等待浏览器创建完毕
        if (createBrowserPending) {
            await createBrowserPending;
            // 防止对 createBrowserPending 重复赋值
            if (createBrowserPending)
                createBrowserPending = null;
        }
        // 创建新配置
        const { detailTargets, intervalTime, onCrawlItemComplete } = createCrawlPageConfig(xCrawlConfig, config);
        const extraConfig = {
            errorPageMap: new Map(),
            browser: browser,
            intervalTime,
            onCrawlItemComplete
        };
        const crawlResArr = (await controller('page', xCrawlConfig.mode, detailTargets, extraConfig, pageSingleCrawlHandle, pageSingleResultHandle));
        const crawlRes = isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
            ? crawlResArr
            : crawlResArr[0];
        if (callback) {
            callback(crawlRes);
        }
        return crawlRes;
    }
    return crawlPage;
}
function createCrawlData(xCrawlConfig) {
    async function crawlData(config, callback) {
        const { detailTargets, intervalTime, onCrawlItemComplete } = createCrawlDataConfig(xCrawlConfig, config);
        function dataSingleResultHandle(detaileInfo, extraConfig) {
            const { isSuccess, detailTargetRes } = detaileInfo;
            const { onCrawlItemComplete } = extraConfig;
            if (isSuccess && detailTargetRes) {
                const contentType = detailTargetRes.headers['content-type'] ?? '';
                const data = contentType === 'application/json'
                    ? JSON.parse(detailTargetRes.data.toString())
                    : contentType.includes('text')
                        ? detailTargetRes.data.toString()
                        : detailTargetRes.data;
                detaileInfo.data = { ...detailTargetRes, data };
            }
            const crawlDataSingleRes = detaileInfo;
            if (onCrawlItemComplete) {
                onCrawlItemComplete(crawlDataSingleRes);
            }
        }
        const extraConfig = {
            intervalTime,
            onCrawlItemComplete
        };
        const crawlResArr = (await controller('data', xCrawlConfig.mode, detailTargets, extraConfig, dataAndFileSingleCrawlHandle, dataSingleResultHandle));
        const crawlRes = isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
            ? crawlResArr
            : crawlResArr[0];
        if (callback) {
            callback(crawlRes);
        }
        return crawlRes;
    }
    return crawlData;
}
function createCrawlFile(xCrawlConfig) {
    async function crawlFile(config, callback) {
        const { detailTargets, intervalTime, onBeforeSaveItemFile, onCrawlItemComplete } = createCrawlFileConfig(xCrawlConfig, config);
        const extraConfig = {
            saveFileErrorArr: [],
            saveFilePendingQueue: [],
            intervalTime,
            onCrawlItemComplete,
            onBeforeSaveItemFile
        };
        const crawlResArr = (await controller('file', xCrawlConfig.mode, detailTargets, extraConfig, dataAndFileSingleCrawlHandle, fileSingleResultHandle));
        const { saveFilePendingQueue, saveFileErrorArr } = extraConfig;
        // 等待保存文件完成
        await Promise.all(saveFilePendingQueue);
        // 打印保存错误
        quickSort(saveFileErrorArr).forEach((item) => log(logError(item.message)));
        // 统计保存
        const succssIds = [];
        const errorIds = [];
        crawlResArr.forEach((item) => {
            if (item.data?.data.isSuccess) {
                succssIds.push(item.id);
            }
            else {
                errorIds.push(item.id);
            }
        });
        log('Save file final result:');
        log(logSuccess(`  Success - total: ${succssIds.length}, ids: [ ${succssIds.join(' - ')} ]`));
        log(logError(`    Error - total: ${errorIds.length}, ids: [ ${errorIds.join(' - ')} ]`));
        const crawlRes = isArray(config) || (isObject(config) && Object.hasOwn(config, 'targets'))
            ? crawlResArr
            : crawlResArr[0];
        if (callback) {
            callback(crawlRes);
        }
        return crawlRes;
    }
    return crawlFile;
}
function startPolling(config, callback) {
    const { d, h, m } = config;
    const day = !isUndefined(d) ? d * 1000 * 60 * 60 * 24 : 0;
    const hour = !isUndefined(h) ? h * 1000 * 60 * 60 : 0;
    const minute = !isUndefined(m) ? m * 1000 * 60 : 0;
    const total = day + hour + minute;
    let count = 0;
    startCallback();
    const intervalId = setInterval(startCallback, total);
    function startCallback() {
        console.log(logSuccess(`Start the ${logWarn.bold(++count)} polling`));
        callback(count, stopPolling);
    }
    function stopPolling() {
        clearInterval(intervalId);
        console.log(logSuccess(`Stop the polling`));
    }
}

function loaderBaseConfig(baseConfig) {
    const loaderBaseConfig = baseConfig ? baseConfig : {};
    if (isUndefined(loaderBaseConfig.mode)) {
        loaderBaseConfig.mode = 'async';
    }
    if (isUndefined(loaderBaseConfig.enableRandomFingerprint)) {
        loaderBaseConfig.enableRandomFingerprint = true;
    }
    if (isUndefined(baseConfig?.timeout)) {
        loaderBaseConfig.timeout = 10000;
    }
    if (isUndefined(baseConfig?.maxRetry)) {
        loaderBaseConfig.maxRetry = 0;
    }
    return loaderBaseConfig;
}
function createnInstance(baseConfig) {
    const instance = {
        crawlPage: createCrawlPage(baseConfig),
        crawlData: createCrawlData(baseConfig),
        crawlFile: createCrawlFile(baseConfig),
        startPolling
    };
    return instance;
}
function xCrawl(baseConfig) {
    const newBaseConfig = loaderBaseConfig(baseConfig);
    const instance = createnInstance(newBaseConfig);
    return instance;
}

const testXCrawl = xCrawl({
    intervalTime: { max: 5000, min: 3000 }
});
// testXCrawl.crawlPage({
//   targets: [
//     'https://github.com/coder-hxl',
//     { url: 'https://github.com/coder-hxl/x-crawl', fingerprint: null },
//     {
//       url: 'https://github.com/coder-hxl/x-crawl/stargazers',
//       fingerprint: {
//         platform: 'Windows',
//         mobile: 'random',
//         userAgent: {
//           value:
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
//           versions: [
//             {
//               name: 'Chrome',
//               maxMajorVersion: 91,
//               minMajorVersion: 88,
//               maxMinorVersion: 10,
//               maxPatchVersion: 5615
//             },
//             { name: 'Safari', maxMinorVersion: 36, maxPatchVersion: 2333 },
//             { name: 'Edg', maxMinorVersion: 10, maxPatchVersion: 864 }
//           ]
//         }
//       }
//     }
//   ],
//   fingerprints: [
//     {
//       platform: 'Windows',
//       mobile: 'random',
//       userAgent: {
//         value:
//           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
//         versions: [
//           {
//             name: 'Chrome',
//             maxMajorVersion: 112,
//             minMajorVersion: 100,
//             maxMinorVersion: 20,
//             maxPatchVersion: 5000
//           },
//           {
//             name: 'Safari',
//             maxMajorVersion: 537,
//             minMajorVersion: 500,
//             maxMinorVersion: 36,
//             maxPatchVersion: 5000
//           }
//         ]
//       }
//     }
//   ]
// })
testXCrawl
    .crawlPage({
    targets: [
        'https://www.google.com/search?q=1',
        'https://github.com/coder-hxl'
    ],
    proxy: {
        urls: ['https://www.npmjs.com/package/x-crawl', 'http://localhost:14892'],
        switchByErrorCount: 1,
        switchByHttpStatus: [200]
    },
    maxRetry: 4
})
    .then((res) => {
    res.forEach((item, i) => {
        console.log(item.proxyDetailes);
        // item.data.page.screenshot({ path: `${i}page.jpg` })
    });
    res[0].data.browser.close();
});
