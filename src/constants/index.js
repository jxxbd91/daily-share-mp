export const CLOUD_ENV_TEST = 'test-9g29o5427ae58d43'

export const CLOUD_ENV_PROD = 'prod-8g82lh5za0857d43'

export const CLOUD_ENV = (process.env.CLOUD_ENV === 'production' || __wxConfig.envVersion === 'release') ? CLOUD_ENV_PROD : CLOUD_ENV_TEST

export const subscribeTemplateIds = {
  message: 'ENXmRqo56mNUsQXWWHjCv7xS8SwEbUMOqsP_7XattGo',
  todo: 'SSbI4_53wpx2EF097sQ8RhKImsWdGZULyQm0M7irfwc'
}
