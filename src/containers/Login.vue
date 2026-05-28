<template>
    <v-app style="background-color: #f5f8ff;" class="app">
        <v-container class="justify-center text-center">
            <v-card
                class="mx-auto my-12 pa-10 pt-0 pb-0"
                max-width="475"
                :loading="loadingLogin"
                light
                style="background-color: white"
                v-if="render_login"
            >
                <v-col v-if="cardIdx != 0">
                    <v-card-title class="justify-center">
                        <v-btn
                            size="small"
                            style="margin-left: -40px;"
                            v-on:click="decrementCard"
                        >
                            <v-icon 
                                theme="dark"
                            >
                                mdi-arrow-left
                            </v-icon>
                            <v-img
                                :src="Truce_Black"
                                max-height="50"
                            ></v-img>
                        </v-btn>
                    </v-card-title>
                </v-col>
                <template v-if="cards[cardIdx] == 'initial'">
                    <br />
                    <v-card-title class="justify-center text-center text-h4 font-weight-bold mt-10">
                        <v-img 
                            :src="Truce_Black"
                            max-height="120"
                        ></v-img>
                    </v-card-title>
                    <v-card-actions>
                        <v-col cols="12">
                            <LoginScreen
                                @emailUpdate="handleEmailEmission"
                                @passwordUpdate="handlePasswordEmission"
                                @forgotPassword="handleForgotPasswordEmission"
                                @triggerLogin="signIn"
                            >
                            </LoginScreen>
                            <v-btn
                                block
                                @click="signIn"
                                class="login-button"
                                :disabled="loadingLogin"
                            >
                                Login
                            </v-btn>
                            <v-btn
                                v-if="provider == reyesProvider"    
                                block
                                @click="signInWithOkta"
                                class="provider-button"
                            >
                                Login with Okta
                            </v-btn>
                            <p class="link" style="color: #545454">
                                Don't have an account? Contact us at 
                                <a href="mailto:contact@truce.io">
                                    contact@truce.io
                                </a> to sign up.
                            </p>
                            <br />
                            <br />
                            <br />
                            <br />

                            <span
                                class="clickable link"
                                @click="moveToContact"
                                style="color: #545454;"
                            >
                                Contact Us
                            </span>
                        </v-col>
                    </v-card-actions>
                </template>
                
                <template v-if="cards[cardIdx] == 'forgot'">
                    <v-card-title class="justify-center text-center text-h5">
                        Reset Password
                    </v-card-title>
                    <v-card-text class="py-5">
                        <ForgotPassword>
                            @emailUpdate="handleEmailEmission"
                            @error="handleForgotPasswordEmission"
                            @emailSent="handleEmailSent"
                        </ForgotPassword>
                    </v-card-text>
                </template>

                <template v-else-if="cards[cardIdx] == 'signup'">
                   <v-card-title class="justify-center text-center text-h5">
                        Enter Your Information
                    </v-card-title>
                    <v-card-text class="py-4">
                        <BasicInformation
                            @firstNameUpdate="handleFirstNameEmission"
                            @lastNameUpdate="handleLastNameEmission"
                            @phoneNumberUpdate="handlePhoneNumberEmission"
                            @roleUpdate="handleRoleEmission"
                            @selectedUpdate="handleCompanyEmission"
                        >
                        </BasicInformation>
                    </v-card-text>
                    <v-card-actions class="pt-6">
                        <v-row class="pb-5 pt-4">
                            <v-spacer></v-spacer>
                            <v-btn
                                v-on:click="verifyBasicInformation"
                                outlined
                                color="blue"
                            >
                                Next
                            </v-btn>
                        </v-row>
                    </v-card-actions>
                </template>
                <template v-else-if="cards[cardIdx] == 'reset'">
                    <v-card-title class="justify-center text-center text-h5">
                        Set Your Account Password
                    </v-card-title>
                    <v-card-text class="py-4">
                        <SetPassword
                            @setPasswordUpdate="handleSetPasswordEmission"
                            @confirmPasswordUpdate="
                                handleConfirmPasswordEmission
                            "
                            @creationRuleUpdate="handleCreationRuleStatus"
                            @tokenUpdate="handleTokenEmission"
                            @triggerLogin="signUp"
                            :token_reset="token_reset"
                        >
                        </SetPassword>
                    </v-card-text>
                    <v-card-actions>
                        <v-row class="pb-5 pt-4">
                            <v-spacer></v-spacer>
                            <v-btn v-on:click="signUp" outlined color="blue" :disabled="loadingLogin">
                                Login
                            </v-btn>
                        </v-row>
                    </v-card-actions>
                </template>
                <template v-else-if="cards[cardIdx] == 'dummysignup'">
                    <v-card-title class="justify-center text-center text-h5">
                        Sign Up
                    </v-card-title>
                    <v-card-actions>
                        <v-col cols="12">
                            We're super excited that you want to join our
                            platform! Unfortunately, as of right now, we only
                            allow sign up through an administrator. Contact us
                            at
                            <a href="mailto:contact@truce.io"
                                >contact@truce.io</a
                            >
                            to join!
                        </v-col>
                    </v-card-actions>
                    <br />
                    <br />
                </template>
<template v-else-if="cards[cardIdx] == 'contact'">
                    <v-card-title class="justify-center text-center text-h5">
                        Contact Us
                    </v-card-title>
                    <v-card-actions>
                        <v-col cols="12">
                            If you have questions or concerns, you can contact
                            us at any time!<br />
                            <br />
                            Email:
                            <a href="mailto:contact@truce.io">contact@truce.io</a>
                            <br />
                        </v-col>
                    </v-card-actions>
                    <br />
                    <br />
                </template>

                <template v-else-if="cards[cardIdx] == 'expired'">
                    <v-card-actions v-if="!resendSuccess">
                        <v-row>
                            <v-row>
                                <v-col cols="12">
                                    Your temporary password has expired. Select
                                    the button below to receive a new password.
                                </v-col>
                            </v-row>
                            <v-row class="justify-center pt-4">
                                <v-btn
                                    @click="resendTemporaryPassword"
                                    color="blue"
                                    dark
                                    :disabled="resendSuccess"
                                    >Resend Password</v-btn
                                >
                            </v-row>
                        </v-row>
                    </v-card-actions>
                    <v-row class="pt-4" v-if="resendSuccess">
                        <v-col cols="12">
                            A new email with your temporary password has been
                            sent. If you do not receive an email please contact
                            us at
                            <a href="mailto:contact@truce.io">contact@truce.io</a>.
                        </v-col>
                    </v-row>
                    <br />
                    <br />
                </template>
            </v-card>
            <SplashScreen style="z-index: 220" :is_loading="true" v-else />
            <v-snackbar v-model="snackbar" color="red" top timeout="2500">
                {{ errorText }}
            </v-snackbar>
        </v-container>
    </v-app>
</template>

<script setup>
import Truce_Black from '../assets/Truce_Black.png'
import {
    ref,
    computed,
    onBeforeMount,
    getCurrentInstance
} from 'vue';
import { useRouter } from 'vue-router';
import {
    signIn as amplifySignIn,
    getCurrentUser,
    fetchAuthSession,
    confirmSignIn,
    confirmResetPassword,
    signInWithRedirect
} from 'aws-amplify/auth';
import { get } from 'aws-amplify/api';
import * as stateAPI from '../stateAPI';
import * as user_analytics from '../analytics/sendAnalyticsEvent';
import LoginScreen from '../authentication/auth_components/LoginScreen.vue';
import SetPassword from '../authentication/auth_components/SetPassword.vue';
import BasicInformation from '../authentication/auth_components/BasicInformation.vue';
import ForgotPassword from '../authentication/auth_components/ForgotPassword.vue';
import SplashScreen from '../components/SplashScreen.vue';
import admin_emails from '../authentication/admins';
import {
    isProdEnv,
    isDevEnv,
    REYES_OKTA_URL
} from '../utils';
import * as fetchAccountDetails from '../fetchAccountDetails';
import {
    AUTH_FLOW_TYPE,
    configureAmplifyForOkta
} from '../authentication/aws-exports';

defineOptions({
    name: 'Login'
});

const router = useRouter();
const { proxy } = getCurrentInstance();
const cards = ref([
    'initial',
    'signup',
    'reset',
    'forgot',
    'dummysignup',
    'contact',
    'expired'
]);

const cardIdx = ref(0);

const email = ref('');
const username = ref('');
const password = ref('');
const setPassword = ref('');
const confirm_password = ref('');
const creation_rule_status = ref('');
const first_name = ref('');
const last_name = ref('');
const full_name = ref('');
const phone_number = ref('');
const role = ref('shipper');
const company = ref('');

const resetDecrement = ref(false);
const resetDecrement_forgot = ref(false);

const email_sent = ref(false);
const token_reset = ref(false);
const token = ref(null);

const snackbar = ref(false);
const errorText = ref('');
const idToken = ref('');

const loadingLogin = ref(false);

const resendSuccess = ref(false);

const provider = ref('');
const reyesProvider = ref('reyesHoldingsOkta');

const skipGuard = ref(false);

const render_login = ref(true);

const is_admin = ref(false);

const cognitoUser = ref(null);

const theme = computed(() => {
    return proxy.$vuetify.theme.dark ? 'dark' : 'light';
});

onBeforeMount(async () => {
    if (checkAccessTokenInUrl()) {
        render_login.value = false;

        await checkOktaUserAndFetchAttributes();
    }

    const searchParams = new URLSearchParams(
        window.location.search
    );

    if (searchParams.has('provider')) {
        provider.value = searchParams.get('provider');
    }
});

function updateConfigForOkta() {
    configureAmplifyForOkta();
}

function checkAccessTokenInUrl() {
    const urlHash = window.location.hash.substring(1);

    const params = new URLSearchParams(urlHash);

    const accessToken = params.get('access_token');

    if (accessToken) {
        console.log(
            'Access Token found:',
            accessToken
        );

        return true;
    }

    console.log(
        'No Access Token found in the URL.'
    );

    return false;
}

async function signInWithOkta() {
    try {
        updateConfigForOkta();

        await signInWithRedirect({
            provider: {
                custom: 'ReyesHoldingsOkta'
            }
        });
    } catch (error) {
        console.error(
            'Error initiating sign-in with Okta',
            error
        );
    }
}

async function checkOktaUserAndFetchAttributes() {
    try {
        updateConfigForOkta();

        const currentUser =
            await getCurrentUser();

        const session =
            await fetchAuthSession();

        email.value =
            currentUser.signInDetails?.loginId ||
            '';

        full_name.value =
            currentUser.username;

        phone_number.value = 'None';

        role.value = 'shipper';

        company.value = 'Reyes Holdings, Inc.';

        idToken.value =
            session.tokens?.idToken?.toString();

        skipGuard.value = true;

        await navigate();
    } catch (error) {
        console.error(
            'Error fetching current authenticated user:',
            error
        );
    }
}

async function signIn() {
    try {
        loadingLogin.value = true;

        const response = await amplifySignIn({
            username: email.value,
            password: password.value,
            options: {
                authFlowType: AUTH_FLOW_TYPE
            }
        });

        cognitoUser.value = response;

        if (
            response.nextStep.signInStep ===
            'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
        ) {
            username.value = email.value;

            loadingLogin.value = false;

            incrementCard();

            return;
        }

        const session =
            await fetchAuthSession();

        const currentUser =
            await getCurrentUser();

        email.value =
            currentUser.signInDetails?.loginId ||
            email.value;

        full_name.value =
            currentUser.username;

        idToken.value =
            session.tokens?.idToken?.toString();

        await navigate();
    } catch (error) {
        loadingLogin.value = false;

        console.error(error);

        if (
            error?.name ===
                'NotAuthorizedException' &&
            error?.message ===
                'User is disabled.'
        ) {
            snackbar.value = true;

            errorText.value =
                'Your credentials have been disabled by your administrator.';
        } else {
            snackbar.value = true;

            errorText.value =
                'Incorrect email or password.';
        }
    }
}

async function signUp() {
    if (!creation_rule_status.value) {
        snackbar.value = true;

        errorText.value =
            'All creation rules must be met.';

        return;
    }

    if (
        setPassword.value !==
        confirm_password.value
    ) {
        snackbar.value = true;

        errorText.value =
            'Password must match confirm password.';

        return;
    }

    loadingLogin.value = true;

    if (token_reset.value) {
        try {
            await confirmResetPassword({
                username: email.value,

                confirmationCode:
                    token.value,

                newPassword:
                    setPassword.value
            });

            cardIdx.value = 0;

            email.value = '';

            password.value = '';
        } catch (error) {
            errorText.value =
                'There was a problem. Please try again or contact an adminstator.';

            snackbar.value = true;

            loadingLogin.value = false;
        }

        return;
    }

    try {
        if (
            admin_emails.includes(email.value)
        ) {
            role.value = 'admin';

            company.value = 'Truce';
        }

        await confirmSignIn({
            challengeResponse:
                setPassword.value
        });

        const session =
            await fetchAuthSession();

        const currentUser =
            await getCurrentUser();

        email.value =
            currentUser.signInDetails?.loginId ||
            email.value;

        full_name.value =
            `${first_name.value} ${last_name.value}`;

        idToken.value =
            session.tokens?.idToken?.toString();

        const params = {
            first_name: first_name.value
                .toLowerCase()
                .replace(
                    /[^a-zA-Z 0-9]\s+/g,
                    ''
                )
                .replace(/\s+/g, ''),

            last_name: last_name.value
                .toLowerCase()
                .replace(
                    /[^a-zA-Z 0-9]+/g,
                    ''
                )
                .replace(/\s+/g, ''),

            email: email.value
                .toLowerCase()
                .replace(
                    /[^a-zA-Z 0-9@+.]+/g,
                    ''
                )
                .replace(/\s+/g, ''),

            phone_number:
                phone_number.value
                    .replace(/\D/g, '')
                    .replace(
                        /[^0-9]+/g,
                        ''
                    )
                    .replace(/\s+/g, '')
        };

        const result =
            await fetchAccountDetails.insertAccountDetails(
                params
            );

        if (
            result !== undefined &&
            result.status === 200
        ) {
            await navigate();
        } else {
            throw new Error(
                'Error occured during sign up'
            );
        }
    } catch (error) {
        console.error(error);

        snackbar.value = true;

        errorText.value =
            'There was an error. Contact your administrator.';

        loadingLogin.value = false;
    }
}

function verifyBasicInformation() {
    if (
        first_name.value === '' ||
        last_name.value === ''
    ) {
        snackbar.value = true;

        errorText.value =
            'First and last name cannot be empty.';

        return;
    }

    const alphaPattern =
        /^[a-zA-Z\s]*$/;

    if (
        !first_name.value.match(
            alphaPattern
        ) ||
        !last_name.value.match(
            alphaPattern
        )
    ) {
        snackbar.value = true;

        errorText.value =
            'First and last name can only contain letters.';

        return;
    }

    const maxLength = 40;

    if (
        first_name.value.length >=
            maxLength ||
        last_name.value.length >=
            maxLength
    ) {
        snackbar.value = true;

        errorText.value = `First and last name cannot contain more than ${maxLength} characters.`;

        return;
    }

    if (phone_number.value == null) {
        snackbar.value = true;

        errorText.value =
            'Phone number cannot be empty.';

        return;
    }

    const count =
        (
            phone_number.value.match(
                /\d/g
            ) || []
        ).length;

    if (count !== 10) {
        snackbar.value = true;

        errorText.value =
            'Phone number must have exactly 10 digits';

        return;
    }

    incrementCard();
}

async function navigate() {
    try {
        const apiName = 'SBUAccess';

        let path;

        if (isProdEnv()) {
            path =
                '/getshipperbusinessunit';
        } else if (isDevEnv()) {
            path =
                '/getshipperbusinessunitdev';
        }

        const restOperation = get({
            apiName,
            path,

            options: {
                queryParams: {
                    email: email.value
                }
            }
        });

        const response =
            await restOperation.response;

        const data =
            await response.body.json();

        stateAPI.setStateProperty(
            proxy,
            'user_id',
            data.body.shipper_business_unit
        );

        if (company.value === undefined) {
            company.value =
                data.body.company;
        }

        await fetchAccountDetails
            .getAccountDetails({
                email: email.value
            })
            .then((result) => {
                let parsedData = null;

                if (
                    result !== undefined &&
                    result.status === 200
                ) {
                    parsedData = JSON.parse(
                        result.data.records[0]
                            .config
                    );
                }

                if (
                    parsedData != null &&
                    parsedData.darkMode !=
                        null
                ) {
                    stateAPI.setStateProperty(
                        proxy,
                        'darkMode',
                        parsedData.darkMode
                    );
                } else {
                    stateAPI.setStateProperty(
                        proxy,
                        'darkMode',
                        false
                    );
                }

                proxy.$vuetify.theme.dark =
                    stateAPI.getStateProperty(
                        proxy,
                        'darkMode'
                    );
            });

        stateAPI.setStateProperty(
            proxy,
            'equipment_type_list',
            [
                'Dry Van',
                'Reefer',
                'Flatbed',
                'Power Only',
                'Straight Truck'
            ]
        );

        stateAPI.setStateProperty(
            proxy,
            'crumbs',
            []
        );

        stateAPI.setStateProperty(
            proxy,
            'crumbIds',
            ['dashboard']
        );

        const usn =
            email.value.split('@')[0];

        stateAPI.setStateProperty(
            proxy,
            'username',
            usn
        );

        stateAPI.setStateProperty(
            proxy,
            'email',
            email.value
        );

        stateAPI.setStateProperty(
            proxy,
            'name',
            full_name.value
        );

        stateAPI.setStateProperty(
            proxy,
            'phone_number',
            phone_number.value
        );

        stateAPI.setStateProperty(
            proxy,
            'company',
            company.value
        );

        const calc_enabled = [
            'BlueGrace Logistics'
        ];

        stateAPI.setStateProperty(
            proxy,
            'calc_enabled',
            role.value !== 'broker' ||
                calc_enabled.includes(
                    company.value
                )
        );

        stateAPI.setStateProperty(
            proxy,
            'role',
            role.value
        );

        stateAPI.setStateProperty(
            proxy,
            'first_load',
            true
        );

        stateAPI.setStateProperty(
            proxy,
            'is_admin',
            is_admin.value
        );

        // Analytics

        const analyticsEmail =
            stateAPI.getStateProperty(
                proxy,
                'email'
            );

        const analyticsCompany =
            stateAPI.getStateProperty(
                proxy,
                'company'
            );

        const analyticsRole =
            stateAPI.getStateProperty(
                proxy,
                'role'
            );

        user_analytics.sendEvent(
            analyticsEmail,
            analyticsCompany,
            analyticsRole,
            'login'
        );

        const searchParams =
            new URLSearchParams(
                window.location.search
            );

        if (
            searchParams.has('redirect')
        ) {
            router.replace(
                `${searchParams.get(
                    'redirect'
                )}`
            );
        } else {
            if (
                role.value !== 'broker'
            ) {
                router.push({
                    name: 'broker-dashboard',

                    params: {
                        prop_usn:
                            'Roop Pal',

                        prop_toggle:
                            'left'
                    },

                    query: {
                        skipGuard:
                            skipGuard.value
                    }
                });
            } else {
                router.push({
                    name:
                        'shipper-dashboard',

                    params: {
                        prop_usn:
                            'Roop Pal',

                        prop_toggle:
                            'left'
                    },

                    query: {
                        skipGuard:
                            skipGuard.value
                    }
                });
            }
        }
    } catch (error) {
        console.error(error);

        errorText.value =
            'There was a problem. Please try again or contact an adminstator.';

        snackbar.value = true;

        loadingLogin.value = false;
    }
}

function incrementCard() {
    cardIdx.value++;
}

function decrementCard() {
    if (
        resetDecrement.value ||
        cardIdx.value ===
            cards.value.indexOf(
                'expired'
            )
    ) {
        cardIdx.value = 0;

        resetDecrement.value = false;

        resetDecrement_forgot.value =
            false;
    } else if (
        resetDecrement_forgot.value
    ) {
        cardIdx.value = 3;

        resetDecrement.value = true;

        resetDecrement_forgot.value =
            false;
    } else {
        cardIdx.value--;
    }

    if (cardIdx.value === 0) {
        email.value = '';

        password.value = '';
    }
}

function moveToPasswordReset() {
    if (email_sent.value) {
        cardIdx.value = 2;

        resetDecrement.value = false;

        resetDecrement_forgot.value =
            true;

        token_reset.value = true;
    } else {
        errorText.value =
            'Please send a reset email.';

        snackbar.value = true;
    }
}

function moveToDummySignUp() {
    cardIdx.value = 4;

    resetDecrement.value = true;
}

function moveToContact() {
    cardIdx.value = 5;

    resetDecrement.value = true;
}

function handleEmailEmission(val) {
    email.value = val;
}

function handlePasswordEmission(val) {
    password.value = val;
}

function handleSetPasswordEmission(
    val
) {
    setPassword.value = val;
}

function handleConfirmPasswordEmission(
    val
) {
    confirm_password.value = val;
}

function handleFirstNameEmission(val) {
    first_name.value = val;
}

function handleLastNameEmission(val) {
    last_name.value = val;
}

function handlePhoneNumberEmission(
    val
) {
    phone_number.value = val;
}

function handleRoleEmission(
    role_type
) {
    role.value = role_type;

    if (role_type === 'admin') {
        company.value = 'Truce';
    }
}

function handleCompanyEmission(val) {
    company.value = val;
}

function handleCreationRuleStatus(
    val
) {
    creation_rule_status.value =
        val;
}

function handleForgotPasswordEmission() {
    cardIdx.value = 3;

    resetDecrement.value = true;
}

function handleForgotPasswordError() {
    errorText.value =
        'Please enter a valid email.';

    snackbar.value = true;
}

function handleEmailSent() {
    email_sent.value = true;

    moveToPasswordReset();
}

function handleTokenEmission(val) {
    token.value = val;
}

async function resendTemporaryPassword() {
    loadingLogin.value = true;

    try {
        let path;

        if (isProdEnv()) {
            path =
                '/resendtemporarypassword';
        } else if (isDevEnv()) {
            path =
                '/resendtemporarypassworddev';
        }

        const restOperation = get({
            apiName:
                'ResendTempPassword',

            path,

            options: {
                queryParams: {
                    email: email.value
                }
            }
        });

        const response =
            await restOperation.response;

        const data =
            await response.body.json();

        if (data.statusCode === 200) {
            resendSuccess.value = true;
        } else {
            errorText.value =
                'An error occurred while regenerating your temporary password. Please contact a system administrator';

            snackbar.value = true;
        }
    } catch (error) {
        console.error(error);

        snackbar.value = true;

        errorText.value =
            'An error occurred while regenerating your temporary password.';
    } finally {
        loadingLogin.value = false;
    }
}

function signInWithProvider() {
    if (
        provider.value ===
        reyesProvider.value
    ) {
        window.location.replace(
            REYES_OKTA_URL
        );
    }
}
</script>

<style scoped lang="scss">
.app {
    background: url('../assets/roads.jpg') no-repeat center center fixed;
    background-size: cover;
}

.login-button {
    background: linear-gradient(90deg, #0091ff, #0091ff) !important;
    color: white !important;
    border-radius: 100px !important;
    margin-bottom: 10px;
}

.provider-button {
    background: linear-gradient(90deg, #2865d5, #2865d5) !important;
    color: white !important;
    border-radius: 100px !important;
    margin-bottom: 10px;
}

.clickable {
    cursor: pointer;
}
</style>
