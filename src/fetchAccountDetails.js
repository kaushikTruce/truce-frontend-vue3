import axios from 'axios';
import aws4 from 'aws4';
import { isProdEnv, isDevEnv } from './utils';

export async function getAccountDetails(query_params) {
    let request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: '77zp494jsb.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://77zp494jsb.execute-api.us-east-1.amazonaws.com/prod/getAccountDetails',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'mzar68mml7.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://mzar68mml7.execute-api.us-east-1.amazonaws.com/dev/getAccountDetails',
            data: {
                query_params: query_params
            }
        };
    }

    let signedRequest = aws4.sign(request, {
        // assumes user has authenticated and we have called
        // AWS.config.credentials.get to retrieve keys and
        // session tokens
        secretAccessKey: '',
        accessKeyId: ''
    });

    delete signedRequest.headers['Host'];
    delete signedRequest.headers['Content-Length'];
    let response = axios(signedRequest).then((result) => {
        return result;
    });

    return response;
}

export async function updateAccountDetails(query_params) {
    let request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: '77zp494jsb.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://77zp494jsb.execute-api.us-east-1.amazonaws.com/prod/updateAccountDetails',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'mzar68mml7.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://mzar68mml7.execute-api.us-east-1.amazonaws.com/dev/updateAccountDetails',
            data: {
                query_params: query_params
            }
        };
    }

    let signedRequest = aws4.sign(request, {
        // assumes user has authenticated and we have called
        // AWS.config.credentials.get to retrieve keys and
        // session tokens
        secretAccessKey: '',
        accessKeyId: ''
    });

    delete signedRequest.headers['Host'];
    delete signedRequest.headers['Content-Length'];
    let response = axios(signedRequest).then((result) => {
        return result;
    });

    return response;
}

export async function insertAccountDetails(query_params) {
    let request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: '77zp494jsb.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://77zp494jsb.execute-api.us-east-1.amazonaws.com/prod/insertAccountDetails',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'mzar68mml7.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://mzar68mml7.execute-api.us-east-1.amazonaws.com/dev/insertAccountDetails',
            data: {
                query_params: query_params
            }
        };
    }

    let signedRequest = aws4.sign(request, {
        // assumes user has authenticated and we have called
        // AWS.config.credentials.get to retrieve keys and
        // session tokens
        secretAccessKey: '',
        accessKeyId: ''
    });

    delete signedRequest.headers['Host'];
    delete signedRequest.headers['Content-Length'];
    let response = axios(signedRequest).then((result) => {
        return result;
    });

    return response;
}
