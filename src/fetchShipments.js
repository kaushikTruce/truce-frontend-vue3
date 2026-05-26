import axios from 'axios';
import aws4 from 'aws4';
import { isProdEnv, isDevEnv } from './utils';

export async function fetchShipmentData(query_params) {
    var shipmentsArray;
    var request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: 'n0w1ee4mng.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://n0w1ee4mng.execute-api.us-east-1.amazonaws.com/lazy/postShipment',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'hv54frdqa1.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://hv54frdqa1.execute-api.us-east-1.amazonaws.com/lazy_dev/postShipment',
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
    signedRequest.headers['Cache-Control'] = 'no-store';
    signedRequest.headers['Pragma'] = 'no-cache';
    signedRequest.headers['Expires'] = '0';
    let response = axios(signedRequest).then((result) => {
        return result.data.body.records;
    });

    return response;
}

export async function fetchAnalyticsData(query_params) {
    const currentUrl = window.location.href;

    var request;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: 'n0w1ee4mng.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://n0w1ee4mng.execute-api.us-east-1.amazonaws.com/lazy/postShipment',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'hv54frdqa1.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://hv54frdqa1.execute-api.us-east-1.amazonaws.com/lazy_dev/postShipment',
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
        return result.data.body.records;
    });

    return response;
}
