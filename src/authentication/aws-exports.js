import { Amplify } from 'aws-amplify';

export const AUTH_FLOW_TYPE = 'USER_PASSWORD_AUTH';

const defaultAuthConfig = {
    Auth: {
        Cognito: {
            identityPoolId:
                'us-east-1:977ab447-23e4-4445-9d3b-2a0f15057a38',
            userPoolId: 'us-east-1_PJgJ5RUP8',
            userPoolClientId:
                '20ecjtv2a9goqcjh2kvuj1u4i3',
            loginWith: {
                email: true
            },
            signUpVerificationMethod: 'code',
            allowGuestAccess: false
        }
    }
};

const oktaAuthConfig = {
    Auth: {
        Cognito: {
            identityPoolId:
                'us-east-1:2531f0b0-d583-4e88-8696-149fa59f7199',
            userPoolId: 'us-east-1_QRIwhgq8L',
            userPoolClientId:
                '2lesvpgr39vk8nnk27te9rt8ee',
            loginWith: {
                oauth: {
                    domain:
                        'truce-okta.auth.us-east-1.amazoncognito.com',
                    scopes: [
                        'email',
                        'openid',
                        'aws.cognito.signin.user.admin',
                        'profile'
                    ],
                    redirectSignIn: [
                        'https://www.truce.io/app'
                    ],
                    redirectSignOut: [
                        'https://www.truce.io/app?provider=reyesHoldingsOkta'
                    ],
                    responseType: 'token'
                }
            },
            allowGuestAccess: false
        }
    }
};

const sharedResourceConfig = {
    API: {
        REST: {
            SBUAccess: {
                endpoint:
                    'https://llvtzheyh4.execute-api.us-east-1.amazonaws.com/prod',
                region: 'us-east-1'
            },
            Contact: {
                endpoint:
                    'https://gkiuzzt1h8.execute-api.us-east-1.amazonaws.com/contactTest',
                region: 'us-east-1'
            },
            ResendTempPassword: {
                endpoint:
                    'https://jzbd0kolh3.execute-api.us-east-1.amazonaws.com/dev',
                region: 'us-east-1'
            },
            AccountDetailsProd: {
                endpoint:
                    'https://77zp494jsb.execute-api.us-east-1.amazonaws.com/prod',
                region: 'us-east-1'
            },
            AccountDetailsDev: {
                endpoint:
                    'https://mzar68mml7.execute-api.us-east-1.amazonaws.com/dev',
                region: 'us-east-1'
            },
            ShipmentsProd: {
                endpoint:
                    'https://n0w1ee4mng.execute-api.us-east-1.amazonaws.com/lazy',
                region: 'us-east-1'
            },
            ShipmentsDev: {
                endpoint:
                    'https://hv54frdqa1.execute-api.us-east-1.amazonaws.com/lazy_dev',
                region: 'us-east-1'
            },
            NotificationsProd: {
                endpoint:
                    'https://hz9ylqv3we.execute-api.us-east-1.amazonaws.com/prod-1',
                region: 'us-east-1'
            },
            NotificationsDev: {
                endpoint:
                    'https://ij1yddlun5.execute-api.us-east-1.amazonaws.com/dev-1',
                region: 'us-east-1'
            },
            UserAnalytics: {
                endpoint:
                    'https://h4fiko3zph.execute-api.us-east-1.amazonaws.com/ua-2',
                region: 'us-east-1'
            }
        }
    },
    Storage: {
        S3: {
            bucket: 'broker-data-upload',
            region: 'us-east-1'
        }
    }
};

export function getAmplifyConfig(authConfig = defaultAuthConfig) {
    return {
        ...authConfig,
        ...sharedResourceConfig
    };
}

export function configureAmplify(authConfig = defaultAuthConfig) {
    Amplify.configure(getAmplifyConfig(authConfig));
}

export function configureAmplifyForOkta() {
    configureAmplify(oktaAuthConfig);
}

export default getAmplifyConfig();
