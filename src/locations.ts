export interface Locations {
  [key: string]: (...args: any[]) => string
}

export const locations: Locations = {
  root: () => '/',
  activity: address => `/events/${address}`,
  activityPage: () => '/events/:address'
}
