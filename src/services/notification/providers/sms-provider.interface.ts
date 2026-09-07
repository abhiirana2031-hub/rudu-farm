/**
 * Generic SMS Provider Interface
 * Allows seamless switching between Fast2SMS, Mock, MSG91, Twilio, AWS SNS
 */

import { SendSmsRequest, SmsResponse } from '../sms.types';

export interface SMSProvider {
  name: string;
  send(req: SendSmsRequest): Promise<SmsResponse>;
  validateConfiguration(): { valid: boolean; missingFields: string[] };
}
