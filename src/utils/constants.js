export const HOST = import.meta.env.VITE_SERVER_URL

export const AUTH_ROUTES = "api/auth"
export const SIGN_ROUTE = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE = `${AUTH_ROUTES}/update-profile`
export const PROFILE_IMAGE = `${AUTH_ROUTES}/upload-image`
export const DELETE_IMAGE = `${AUTH_ROUTES}/remove-image`

export const CONTACTS_ROUTES = "api/contacts"
export const SEARCH_CONTACTS = `${CONTACTS_ROUTES}/search`
export const GET_CONTACTS = `${CONTACTS_ROUTES}/get-contacts`
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/get-all-contacts`

export const Messages_ROUTES = "api/messages"
export const GET_MESSAGES = `${Messages_ROUTES}/get-messages`
export const UPLOAD_FILE = `${Messages_ROUTES}/upload-file`

export const Channels_ROUTES = "api/channels"
export const CREATE_CHANNEL = `${Channels_ROUTES}/create-channel`
export const GET_USER_CHANNELS = `${Channels_ROUTES}/get-user-channels`
export const GET_CHANNEL_MESSAGES = `${Channels_ROUTES}/channel-messages`