import { fetchAuthSession } from "aws-amplify/auth";
import { isProdEnv } from "../utils";
import axios from "axios";
import aws4 from "aws4";

export async function sendEvent(
  email,
  company,
  role,
  eventType,
  attributes = {},
) {
  /*
    Makes a call to the user_analytics lambda, which then records the entry in a Timestream

    Valid eventTypes and {attributes} are listed below:
        login,
        pageView: {pageSource (BrokerDashboard, ShipperDashboard, LaneDashboard, BrokerDrilldown, ShipperDrilldown, LaneDrilldown, Calculator, Analytics, Account, Notifications)},
        ...'
    No validation is currently implemented
    */

  if (isProdEnv()) {
    if (company === undefined || company === "") {
      company = "N/A";
    }
    const body = {
      event_params: {
        event_name: eventType,
        email: email,
        company: company,
        role: role,
        custom_event_attributes: attributes,
        event_time: Date.now().toString(),
      },
    };

    try {
      const getSession = await fetchAuthSession();
      const credentials = getSession.credentials;
      if (!credentials) {
        throw new Error("AWS credentials not found");
      }

      const request = {
        host: "h4fiko3zph.execute-api.us-east-1.amazonaws.com",
        method: "PUT",
        url: "https://h4fiko3zph.execute-api.us-east-1.amazonaws.com/ua-2/putAnalyticsEvent",
        data: body,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const signedRequest = aws4.sign(request, {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
      });

      delete signedRequest.headers.Host;

      const response = await axios(signedRequest);

      return response.data;
    } catch (e) {
      console.error("Failed to send analytics event:", e);
    }
    throw e;
  } else {
    return "Not in prod, event not sent";
  }
}
