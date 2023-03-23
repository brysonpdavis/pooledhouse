import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '$env/static/private'
import twilioClient from 'twilio'

export const twilio = twilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)