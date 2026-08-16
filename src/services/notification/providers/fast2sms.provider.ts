import { ISmsProvider, ISmsProviderResult, SmsNotificationPayload } from "../sms.types";
import { MASTER_SMS_TEMPLATES } from "../sms.templates";

export class Fast2SMSProvider implements ISmsProvider {
  name = "FAST2SMS";

  async send(payload: SmsNotificationPayload): Promise<ISmsProviderResult> {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "SMS_CONFIGURATION_ERROR: Fast2SMS API key is not configured on server.",
        errorCode: "SMS_CONFIGURATION_ERROR"
      };
    }

    const templateDef = MASTER_SMS_TEMPLATES[payload.template];
    if (!templateDef) {
      return {
        success: false,
        error: `SMS_TEMPLATE_ERROR: Invalid or unknown template key '${payload.template}'`,
        errorCode: "SMS_TEMPLATE_ERROR"
      };
    }

    const baseUrl = process.env.FAST2SMS_BASE_URL || "https://www.fast2sms.com/dev";
    const route = (process.env.FAST2SMS_ROUTE || "dlt").toLowerCase();
    const dltTemplateId = process.env[templateDef.dltEnvVar];
    const formattedMessage = templateDef.formatMessage(payload.variables || {});

    try {
      let url = `${baseUrl}/bulkV2`;
      let res: Response;

      if (route === "dlt" && dltTemplateId) {
        // DLT Route POST payload
        const varsArray = templateDef.requiredVariables.map(vKey => String(payload.variables[vKey] || ''));
        const bodyData = {
          route: "dlt",
          sender_id: process.env.FAST2SMS_SENDER_ID || undefined,
          entity_id: process.env.FAST2SMS_ENTITY_ID || undefined,
          message: dltTemplateId,
          variables_values: varsArray.join("|"),
          numbers: payload.phone
        };

        res = await fetch(url, {
          method: "POST",
          headers: {
            "authorization": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyData)
        });
      } else {
        // Quick SMS Route GET request fallback (Development / Testing)
        const params = new URLSearchParams({
          authorization: apiKey,
          route: "q",
          message: formattedMessage,
          language: "english",
          flash: "0",
          numbers: payload.phone
        });

        res = await fetch(`${url}?${params.toString()}`, {
          method: "GET",
          headers: {
            "cache-control": "no-cache"
          }
        });
      }

      const responseText = await res.text();
      let responseData: any = {};
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        return {
          success: false,
          error: `Fast2SMS raw response error (${res.status}): ${responseText.slice(0, 150)}`,
          errorCode: "SMS_PROVIDER_PARSE_ERROR"
        };
      }

      if (!res.ok || responseData.return === false) {
        const errorMsg = Array.isArray(responseData.message) 
          ? responseData.message.join(", ") 
          : responseData.message || responseText || "SMS_PROVIDER_ERROR";
        return {
          success: false,
          error: errorMsg,
          errorCode: "SMS_PROVIDER_ERROR",
          rawResponse: { status: res.status, return: responseData.return }
        };
      }

      const messageId = Array.isArray(responseData.request_id) 
        ? responseData.request_id[0] 
        : responseData.request_id || `MSG-${Date.now()}`;

      return {
        success: true,
        providerMessageId: String(messageId),
        rawResponse: { request_id: messageId }
      };

    } catch (err: any) {
      return {
        success: false,
        error: "SMS_NETWORK_ERROR: Failed to connect to SMS gateway provider.",
        errorCode: "SMS_NETWORK_ERROR"
      };
    }
  }
}
