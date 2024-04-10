const yellow = (str) => `\u001b[33m${str}\u001b[39m`
const log = process.env.VITE_CJS_TRACE ? console.trace : console.warn
log(yellow(`The CJS version of x-crawl has been deprecated.`))
