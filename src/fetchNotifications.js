import axios from 'axios';
import aws4 from 'aws4';
import { isProdEnv, isDevEnv } from './utils';

export async function getNotifications(query_params) {
    let request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: 'hz9ylqv3we.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://hz9ylqv3we.execute-api.us-east-1.amazonaws.com/prod-1/getNotification',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'ij1yddlun5.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://ij1yddlun5.execute-api.us-east-1.amazonaws.com/dev-1/getNotification',
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
        return result.data.records;
    });

    return response;
}

export async function updateNotification(query_params) {
    let request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: 'hz9ylqv3we.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://hz9ylqv3we.execute-api.us-east-1.amazonaws.com/prod-1/updateNotificationStatus',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'ij1yddlun5.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://ij1yddlun5.execute-api.us-east-1.amazonaws.com/dev-1/updateNotificationStatus',
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
        return result.data.records;
    });

    return response;
}

export async function getSubscriptionStatus(query_params) {
    let request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: 'hz9ylqv3we.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://hz9ylqv3we.execute-api.us-east-1.amazonaws.com/prod-1/getSubscriptionStatus',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'ij1yddlun5.execute-api.us-east-1.amazonaws.com',
            method: 'POST',
            url: 'https://ij1yddlun5.execute-api.us-east-1.amazonaws.com/dev-1/getSubscriptionStatus',
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
        if (result.data == null) {
            return [];
        }
        return result.data;
    });

    return response;
}

export async function updateSubscriptionStatus(query_params) {
    let request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: 'hz9ylqv3we.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://hz9ylqv3we.execute-api.us-east-1.amazonaws.com/prod-1/updateSubscriptionStatus',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'ij1yddlun5.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://ij1yddlun5.execute-api.us-east-1.amazonaws.com/dev-1/updateSubscriptionStatus',
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
        if (result.data == null) {
            return [];
        }
        return result.data;
    });

    return response;
}

export async function createNewSubscriber(query_params) {
    let request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: 'hz9ylqv3we.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://hz9ylqv3we.execute-api.us-east-1.amazonaws.com/prod-1/createNewSubscriber',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'ij1yddlun5.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://ij1yddlun5.execute-api.us-east-1.amazonaws.com/dev-1/createNewSubscriber',
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
        if (result.data == null) {
            return [];
        }
        return result.data;
    });

    return response;
}

export async function updateSubscriptionFrequency(query_params) {
    let request;

    const currentUrl = window.location.href;

    if (isProdEnv()) {
        query_params.is_dev_env = 0;
        request = {
            host: 'hz9ylqv3we.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://hz9ylqv3we.execute-api.us-east-1.amazonaws.com/prod-1/updateSubscriptionFrequency',
            data: {
                query_params: query_params
            }
        };
    } else if (isDevEnv()) {
        query_params.is_dev_env = 1;
        request = {
            host: 'ij1yddlun5.execute-api.us-east-1.amazonaws.com',
            method: 'PUT',
            url: 'https://ij1yddlun5.execute-api.us-east-1.amazonaws.com/dev-1/updateSubscriptionFrequency',
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
        if (result.data == null) {
            return [];
        }
        return result.data;
    });

    return response;
}
