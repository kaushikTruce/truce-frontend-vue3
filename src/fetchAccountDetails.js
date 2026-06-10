import { post, put} from 'aws-amplify/api';
import { isDevEnv, isProdEnv } from './utils';

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

    // Attempt to parse JSON response body, fall back to text when not JSON
    let data = null;
    try {
        data = await response.body.json();
    } catch (err) {
        try {
            data = await response.body.text();
        } catch (err2) {
            data = null;
        }
    }

    return {
        status: response.statusCode,
        data,
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
