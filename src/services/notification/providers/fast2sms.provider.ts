/**
 * Fast2SMS Provider Implementation (DLT & Quick SMS Routes)
 * Connects securely through backend endpoints or direct server dispatch.
 * Zero API keys exposed on the client.
 */

import { SMSProvider } from './sms-provider.interface';
import { SendSmsRequest, SmsResponse } from '../sms.types';
import { MASTER_SMS_TEMPLATES } from '../sms.templates';

export interface Fast2SmsConfig {
  apiKey?: string;
  baseUrl?: string;
  route?: 'dlt' | 'q' | 'otp';
  senderId?: string;
  entityId?: string;
  templates?: Record<string, string | undefined>;
}

export class Fast2SMSProvider implements SMSProvider {
  public name = 'FAST2SMS';
  private config: Fast2SmsConfig;

  constructor(config: Fast2SmsConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'https://www.fast2sms.com/dev',
      route: config.route || 'dlt',
      senderId: config.senderId,
      entityId: config.entityId,
      templates: config.templates || {},
      apiKey: config.apiKey,
    };
  }

  public validateConfiguration(): { valid: boolean; missingFields: string[] } {
    const missing: string[] = [];
    if (!this.config.apiKey) missing.push('FAST2SMS_API_KEY');
    if (this.config.route === 'dlt') {
      if (!this.config.senderId) missing.push('FAST2SMS_SENDER_ID');
    }
    return {
      valid: missing.length === 0,
      missingFields: missing,
    };
  }

  public async send(req: SendSmsRequest): Promise<SmsResponse> {
    const apiKey = this.config.apiKey;

    if (!apiKey) {
      return {
        success: false,
        status: 'FAILED',
        error: 'Fast2SMS API key not configured on server',
        errorCode: 'SMS_CONFIGURATION_ERROR',
      };
    }

    const endpoint = `${this.config.baseUrl || 'https://www.fast2sms.com/dev'}/bulkV2`;
    let templateId = req.metadata?.templateId;

    if (!templateId && this.config.templates) {
      templateId = this.config.templates[req.template as keyof typeof this.config.templates];
    }

    // Format variables into Fast2SMS pipe-separated format (e.g. "8.5|425")
    let variableValuesStr = '';
    if (Array.isArray(req.variables)) {
      variableValuesStr = req.variables.map((v) => String(v)).join('|');
    } else if (req.variables && typeof req.variables === 'object') {
      variableValuesStr = Object.values(req.variables)
        .map((v) => String(v))
        .join('|');
    }

    // Prepare DLT or Quick SMS Body
    const body: Record<string, any> = {
      numbers: req.phone,
      flash: 0,
    };

    if (this.config.route === 'dlt' && templateId) {
      body.route = 'dlt';
      body.sender_id = this.config.senderId;
      body.message = templateId; // In Fast2SMS DLT route, message is template_id
      body.variables_values = variableValuesStr;
      if (this.config.entityId) {
        body.entity_id = this.config.entityId;
      }
    } else {
      // Fallback to quick SMS route if templateId is missing or route is 'q'
      body.route = 'q';
      body.message = req.customMessage || this.getFallbackMessage(req);
      body.language = 'english';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        const statusMsg = response.status === 429 ? 'SMS_RATE_LIMITED' : 'SMS_PROVIDER_ERROR';
        return {
          success: false,
          status: 'FAILED',
          error: `Fast2SMS HTTP ${response.status}: ${data?.message || response.statusText}`,
          errorCode: statusMsg,
        };
      }

      if (data.return === true || data.status_code === 200) {
        return {
          success: true,
          status: 'SENT',
          providerMessageId: data.request_id || `F2S-${Date.now()}`,
          message: Array.isArray(data.message) ? data.message.join(', ') : data.message || 'SMS sent successfully',
        };
      } else {
        const errorMsg = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Fast2SMS rejected request';
        return {
          success: false,
          status: 'FAILED',
          error: errorMsg,
          errorCode: 'SMS_PROVIDER_ERROR',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        status: 'FAILED',
        error: err.message || 'Fast2SMS network timeout or connection failure',
        errorCode: 'SMS_PROVIDER_ERROR',
      };
    }
  }

  private getFallbackMessage(req: SendSmsRequest): string {
    const templateDef = MASTER_SMS_TEMPLATES[req.template];
    if (templateDef) {
      return templateDef.interpolate(req.variables || []);
    }
    return req.customMessage || 'RUDU FARM: Notification alert.';
  }
}
