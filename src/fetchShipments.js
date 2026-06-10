import { post } from 'aws-amplify/api';
import { isDevEnv, isProdEnv } from './utils';

function getShipmentsApiName(queryParams) {
    if (isProdEnv()) {
        queryParams.is_dev_env = 0;
        return 'ShipmentsProd';
    }

    if (isDevEnv()) {
        queryParams.is_dev_env = 1;
        return 'ShipmentsDev';
    }

    throw new Error('Unable to determine shipments API environment');
}

async function fetchShipmentRecords(queryParams, options = {}) {
    const restOperation = post({
        apiName: getShipmentsApiName(queryParams),
        path: '/postShipment',
        options: {
            body: {
                query_params: queryParams
            },
            ...options
        }
    });

    const response = await restOperation.response;
    const data = await response.body.json();

    return data.body.records;
}

export async function fetchShipmentData(queryParams) {
    return fetchShipmentRecords(queryParams, {
        headers: {
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
            Expires: '0'
        }
    });
}

export async function fetchAnalyticsData(queryParams) {
    return fetchShipmentRecords(queryParams);
}
