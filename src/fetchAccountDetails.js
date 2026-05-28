import {
    post,
    put
} from 'aws-amplify/api';
import {
    isDevEnv,
    isProdEnv
} from './utils';

function getAccountDetailsApiName(queryParams) {
    if (isProdEnv()) {
        queryParams.is_dev_env = 0;
        return 'AccountDetailsProd';
    }

    if (isDevEnv()) {
        queryParams.is_dev_env = 1;
        return 'AccountDetailsDev';
    }

    throw new Error('Unable to determine account details API environment');
}

async function toAxiosLikeResponse(restOperation) {
    const response = await restOperation.response;

    return {
        status: response.statusCode,
        data: await response.body.json(),
        headers: response.headers
    };
}

function invokeAccountDetails(method, path, queryParams) {
    const operation = method === 'put' ? put : post;

    return toAxiosLikeResponse(
        operation({
            apiName: getAccountDetailsApiName(queryParams),
            path,
            options: {
                body: {
                    query_params: queryParams
                }
            }
        })
    );
}

export async function getAccountDetails(queryParams) {
    return invokeAccountDetails(
        'post',
        '/getAccountDetails',
        queryParams
    );
}

export async function updateAccountDetails(queryParams) {
    return invokeAccountDetails(
        'put',
        '/updateAccountDetails',
        queryParams
    );
}

export async function insertAccountDetails(queryParams) {
    return invokeAccountDetails(
        'post',
        '/insertAccountDetails',
        queryParams
    );
}
