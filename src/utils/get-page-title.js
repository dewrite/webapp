
const packageconfig = require('../../package.json')

export default function getPageTitle(pageTitle) {
  const title = packageconfig.title
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
