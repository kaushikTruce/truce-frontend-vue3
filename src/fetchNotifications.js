import {
    post,
    put
} from 'aws-amplify/api';
import {
    isDevEnv,
    isProdEnv
} from './utils';

function getNotificationsApiName(queryParams) {
    if (isProdEnv()) {
        queryParams.is_dev_env = 0;
        return 'NotificationsProd';
    }

    if (isDevEnv()) {
        queryParams.is_dev_env = 1;
        return 'NotificationsDev';
    }

    throw new Error('Unable to determine notifications API environment');
}

async function invokeNotification(
    method,
    path,
    queryParams,
    fallback = null
) {
    const operation = method === 'put' ? put : post;
    const restOperation = operation({
        apiName: getNotificationsApiName(queryParams),
        path,
        options: {
            body: {
                query_params: queryParams
            }
        }
    });

    const response = await restOperation.response;
    const data = await response.body.json();

    return data == null ? fallback : data;
}

export async function getNotifications(queryParams) {
    const data = await invokeNotification(
        'post',
        '/getNotification',
        queryParams
    );

    return data.records;
}

export async function updateNotification(queryParams) {
    const data = await invokeNotification(
        'put',
        '/updateNotificationStatus',
        queryParams
    );

    return data.records;
}

export async function getSubscriptionStatus(queryParams) {
    return invokeNotification(
        'post',
        '/getSubscriptionStatus',
        queryParams,
        []
    );
}

export async function updateSubscriptionStatus(queryParams) {
    return invokeNotification(
        'put',
        '/updateSubscriptionStatus',
        queryParams,
        []
    );
}

export async function createNewSubscriber(queryParams) {
    return invokeNotification(
        'put',
        '/createNewSubscriber',
        queryParams,
        []
    );
}

export async function updateSubscriptionFrequency(queryParams) {
    return invokeNotification(
        'put',
        '/updateSubscriptionFrequency',
        queryParams,
        []
    );
}
