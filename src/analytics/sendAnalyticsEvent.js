import { put } from 'aws-amplify/api';
import { isProdEnv } from '../utils';

export async function sendEvent(
    email,
    company,
    role,
    eventType,
    attributes = {}
) {
    /*
      Makes a call to the user_analytics lambda, which then records the entry in a Timestream

      Valid eventTypes and {attributes} are listed below:
          login,
          pageView: {pageSource (BrokerDashboard, ShipperDashboard, LaneDashboard, BrokerDrilldown, ShipperDrilldown, LaneDrilldown, Calculator, Analytics, Account, Notifications)},
          ...'
      No validation is currently implemented
      */

    if (!isProdEnv()) {
        return 'Not in prod, event not sent';
    }

    const body = {
        event_params: {
            event_name: eventType,
            email,
            company: company || 'N/A',
            role,
            custom_event_attributes: attributes,
            event_time: Date.now().toString()
        }
    };

    try {
        const restOperation = put({
            apiName: 'UserAnalytics',
            path: '/putAnalyticsEvent',
            options: {
                body
            }
        });

        const response = await restOperation.response;

        return await response.body.json();
    } catch (error) {
        console.error('Failed to send analytics event:', error);
        throw error;
    }
}
