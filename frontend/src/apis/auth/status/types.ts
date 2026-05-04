export type ManagementStatus = {
  status: string
  port: number
  providers: number
}

export type ManagementConfig = {
  port: number
  host: string
  debug: boolean
}

export type QueryOptions = {
  enabled?: boolean
}
