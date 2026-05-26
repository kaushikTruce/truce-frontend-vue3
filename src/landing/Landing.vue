<template>
    <v-app>
        <v-app-bar
            flat
            :color="'transparent'" 
            class="px-xl-14 px-lg-14 px-md-14 hidden-sm-and-down">
            <div>
                <v-img
                    alt="Truce Logo" 
                    id="logo" 
                    class="shrink mt-2 ml-4" 
                    :src="logoSrc" 
                    width="140"
                    style="margin-right: 120px" 
                    @click="toTop()" 
                />
            </div>
            <v-spacer />
            <v-btn 
                style="margin-left: 120px; font-size: 16px" 
                class="mt-5 dmsans font-weight-bold" 
                :color="btnColor_1"
                variant="text"
                @click="contactFormDialog = true"
            >
                Contact Us
            </v-btn>
            <v-btn 
                style="margin-left: 10px; font-size: 16px" 
                class="mt-5 dmsans font-weight-bold" 
                :color="btnColor_1"
                variant="text" 
                @click="navigateToApp()"
            >
                Sign In
            </v-btn>
        </v-app-bar>

        <v-app-bar 
            flat 
            color="transparent" 
            class="pa-0 ma-0 hidden-md-and-up"
        >
            <div>
                <v-img 
                    alt="Truce Logo" 
                    class="shrink mt-2" 
                    :src="logoSrc" 
                    width="140"
                />
            </div>
        </v-app-bar>

        <v-btn 
            v-show="backToTop" 
            icon color="blue-darken-4" 
            :class="backToTopMargin" 
            class="hidden-md-and-down"
            style="position: fixed; bottom: 0; right: 16px" 
            elevation="0" 
            @click="toTop"
        >
            <v-icon>mdi-chevron-up</v-icon>
        </v-btn>

        <v-main class="pa-0">
            <v-dialog v-model="contactFormDialog" max-width="600px">
                <v-form ref="contactForm" v-model="contactFormValid">
                    <v-card 
                        class="pa-6" 
                        style="background-color: whitesmoke; color: black"
                    >
                        <v-card-title>
                            <span class="text-h5">Contact Us</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field 
                                            label="Name*" 
                                            :rules="[
                                                rules.required,
                                                rules.alphanumeric
                                            ]" 
                                            v-model="name">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field 
                                            label="Company" 
                                            :rules="[rules.alphanumeric]"
                                            v-model="company"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field 
                                            label="Email*" 
                                            :rules="[
                                                rules.required,
                                                rules.email
                                            ]" 
                                            v-model="email"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea 
                                            name="input-7-1" 
                                            label="Comments" 
                                            :rules="[
                                                rules.counter,
                                                rules.alphanumeric
                                            ]"  
                                            variant="outlined" 
                                            v-model="comment" 
                                            counter
                                            :maxlength="commentMaxLength"
                                        ></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn 
                                color="red" 
                                variant="text" 
                                @click="
                                    contactFormDialog = false;
                                    resetForm();
                                "
                            >
                                Cancel
                            </v-btn>
                            <v-btn 
                                color="green" 
                                variant="text" 
                                :disabled="!contactFormValid" 
                                @click="sendEmail()"
                            >
                                Submit
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>

            <section id="header">
                <v-container fluid class="pa-0">
                    <v-img
                        :src="headerBlue" 
                        class="align-center"
                        gradient="to bottom, rgba(0,0,0,0.7), transparent 40vh"
                    >
                        <v-row style="margin-top: -100px !important">
                            <v-col cols="12" xl="8" lg="8" md="8" sm="12">
                                <div 
                                    class="text-h5 text-sm-h4 text-md-h3 text-lg-h2 text-xl-h2 font-weight-bold ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-7 dmsans"
                                    style="
                                        color: white;
                                        line-height: 1.1;
                                        width: 80%;
                                    "
                                >
                                    Data-transparent relationships <br />
                                    for shippers and 3PLs
                                </div>
                                <div 
                                    class="text-subtitle-1 text-sm-h6 text-md-h5 text-lg-h4 text-xl-h4 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left hidden-sm-and-down mb-7 dmsans"
                                    style="color: white; width: 80%"
                                >
                                    Truce enables trusted partnerships, <br />
                                    sustainable cost reduction, and <br />
                                    improved on time delivery.
                                </div>
                                <div 
                                    class="text-subtitle-1 mx-auto text-center hidden-md-and-up font-weight-bold mb-7 dmsans"
                                    style="color: #0d47a1; width: 80%"
                                >
                                    Truce enables trusted partnerships, <br />
                                    sustainable cost reduction, and <br />
                                    improved on time delivery.
                                </div>
                                <div 
                                    class="ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left"
                                    style="color: white; width: 80%"
                                >
                                    <v-btn 
                                        style="font-size: 17px; color: #0091ff !important"
                                        class="mt-4 dmsans font-weight-bold" 
                                        color="white"
                                        size="x-large"
                                        @click="contactFormDialog = true"
                                    >
                                       Request Demo
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row 
                            justify="center" 
                            style="position: relative; bottom: -25vh" 
                            class="hidden-sm-and-down"
                        >
                            <v-btn 
                                icon 
                                variant="outlined" 
                                color="white" 
                                @click="goTo('#platform', { offset: -76 })"
                            >
                                <v-icon>mdi-chevron-down</v-icon>
                            </v-btn>
                        </v-row>
                    </v-img>
                </v-container>
            </section>

            <section
                id="platform" 
                class="application" 
                style="
                    height: 102vh !important; 
                    background-color: #f7f9fe !important;
                "
            >
                <v-container fluid class="pa-0">
                    <v-row 
                        class="pa-0 ma-0 align-center" 
                        style="height: 102vh; max-width: 100%"
                    >
                        <v-col 
                            cols="6" 
                            class="pr-13 hidden-sm-and-down"
                        >
                            <div 
                                class="ml-auto mb-7" 
                                style="width: 80%; max-width: 800px"
                            >
                                <v-img :src="platformImage.src"></v-img>
                            </div>
                        </v-col>
                        <v-col 
                            cols="12" 
                            xl="6" 
                            lg="6" 
                            md="6" 
                            sm="12" 
                            class="pl-xl-13 pl-lg-13 pl-md-13"
                        >
                            <div 
                                class="mr-xl-auto mr-lg-auto mr-md-auto ml-xl-0 ml-lg-0 ml-md-0 mx-sm-auto mx-auto mb-7 dmsans"
                                style="width: 80%; max-width: 800px"
                            >
                                <div 
                                    class="text-xl-h5 text-lg-h5 text-md-h6 text-sm-subtitle-1 text-body-1 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-2 dmsans"
                                    style="color: #a6a8b0"
                                >
                                    P L A T F O R M
                                </div>
                                <div 
                                    class="text-xl-h2 text-lg-h2 text-md-h3 text-sm-h4 text-h6 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-xl-7 mb-lg-7 mb-md-7 mb-sm-3 mb-3 font-weight-bold dmsans"
                                    style="color: #0091ff"
                                >
                                    Introducing the Truce Transparency Platform
                                </div>
                                <div 
                                    class="text-xl-h5 text-lg-h5 text-md-h6 text-sm-subtitle-1 text-body-2 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-7 font-weight-light pr-xl-16 pr-lg-16 pr-md-16 dmsans"
                                    style="color: black"
                                >
                                    From metrics on performance and margin to
                                    advanced analytics with machine learning,
                                    Truce provides an ultramodern platform that
                                    enables you to take your freight
                                    partnerships to the next level.
                                </div>
                            </div>
                            <div 
                                class="mx-auto mb-7 hidden-md-and-up" style="width: 70%; max-width: 800px"
                            >
                                <v-img :src="platformImage.src"></v-img>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row 
                        justify="center" 
                        style="position: relative; bottom: 13vh" class="hidden-sm-and-down"
                    >
                        <v-btn 
                            icon 
                            variant="outlined" 
                            color="blue-darken-4" 
                            @click="goTo('#trust', { offset: -76 })"
                        >
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                    </v-row>
                </v-container>
            </section>

            <section 
                id="trust" 
                style="
                    height: 102vh !important; 
                    background-color: white
                "
            >
                <v-container fluid class="pa-0">
                    <v-row class="pa-0 ma-0 align-center" style="height: 102vh; max-width: 100%">
                        <v-col 
                            cols="12" 
                            xl="6" 
                            lg="6" 
                            md="6" 
                            sm="12" 
                            class="pl-xl-13 pl-lg-13 pl-md-13"
                        >
                            <div 
                                class="ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto mb-7"
                                style="width: 80%; max-width: 800px"
                            >
                                <div 
                                    class="text-xl-h5 text-lg-h5 text-md-h6 text-sm-subtitle-1 text-body-2 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-2 dmsans"
                                    style="color: #a6a8b0"
                                >
                                    T R U S T
                                </div>
                                <div 
                                    class="text-xl-h2 text-lg-h2 text-md-h3 text-sm-h4 text-h5 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-xl-7 mb-lg-7 mb-md-7 mb-sm-3 mb-3 font-weight-bold dmsans"
                                    style="color: #0091ff"
                                >
                                    Build the foundation for trusted
                                    partnerships
                                </div>
                                <div 
                                    class="text-xl-h5 text-lg-h5 text-md-h6 text-sm-subtitle-1 text-body-2 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-7 font-weight-light pr-xl-16 pr-lg-16 pr-md-16 dmsans"
                                    style="color: black"
                                >
                                    Gain insight into the complexities of your
                                    brokers' business. Leverage precise cost
                                    data to avoid paper rates and grow your
                                    current partnerships.
                                </div>
                            </div>
                            <div 
                                class="mx-auto mb-7 hidden-md-and-up" 
                                style="width: 70%; max-width: 800px"
                            >
                                <v-img :src="trustImage.src"></v-img>
                            </div>
                        </v-col>
                        <v-col 
                            cols="6" 
                            class="hidden-sm-and-down"
                        >
                            <div 
                                class="mr-auto mb-7" 
                                style="width: 80%; max-width: 800px"
                            >
                                <v-img :src="trustImage.src"></v-img>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row 
                        justify="center" 
                        style="position: relative; bottom: 13vh" 
                        class="hidden-sm-and-down"
                    >
                        <v-btn 
                            icon 
                            variant="outlined" 
                            color="blue-darken-4"
                            @click="goTo('#stability', { offset: -76 })"
                        >
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                    </v-row>
                </v-container>
            </section>

            <section 
                id="stability" 
                style="
                    height: 102vh !important;
                    background-color: #eef1fc !important;
                "
            >
                <v-container fluid class="pa-0">
                    <v-row 
                        class="pa-0 ma-0 align-center" 
                        style="height: 102vh; max-width: 100%"
                    >
                        <v-col 
                            cols="6" 
                            class="pr-13 hidden-sm-and-down"
                        >
                            <div 
                                class="ml-auto mb-7" 
                                style="width: 80%; max-width: 800px"
                            >
                                <v-img :src="stabilityImage.src"></v-img>
                            </div>
                        </v-col>
                        <v-col 
                            cols="12" 
                            xl="6" 
                            lg="6" 
                            md="6" 
                            sm="12" 
                            class="pl-xl-13 pl-lg-13 pl-md-13"
                        >
                            <div 
                                class="mr-xl-auto mr-lg-auto mr-md-auto ml-xl-0 ml-lg-0 ml-md-0 mx-sm-auto mx-auto mb-7 dmsans"
                                style="width: 80%; max-width: 800px"
                            >
                                <div 
                                    class="text-xl-h5 text-lg-h5 text-md-h6 text-sm-subtitle-1 text-body-2 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-2 dmsans"
                                    style="color: #a6a8b0"
                                >
                                    S T A B I L I T Y
                                </div>
                                <div 
                                    class="text-xl-h2 text-lg-h2 text-md-h3 text-sm-h4 text-h5 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-xl-7 mb-lg-7 mb-md-7 mb-sm-3 mb-3 font-weight-bold dmsans"
                                    style="color: #0091ff"
                                >
                                    More stability and <br />
                                    more commitment
                                </div>
                                <div 
                                    class="text-xl-h5 text-lg-h5 text-md-h6 text-sm-subtitle-1 text-body-2 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-7 font-weight-light pr-xl-16 pr-lg-16 pr-md-16 dmsans"
                                    style="color: black"
                                >
                                    Understand your brokers' strongest lanes and
                                    commit to them long-term. Insulate your
                                    network from market swings and create
                                    stability and efficiency for you and your
                                    partners. Manage your network without RFPs
                                    if you choose.
                                </div>
                            </div>
                            <div 
                                class="mx-auto mb-7 hidden-md-and-up" style="width: 70%; max-width: 800px"
                            >
                                <v-img :src="stabilityImage.src"></v-img>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row 
                        justify="center" 
                        style="position: relative; bottom: 13vh" 
                        class="hidden-sm-and-down"
                    >
                        <v-btn 
                            icon 
                            variant="outlined" 
                            color="blue-darken-4"
                            @click="goTo('#network', { offset: -76 })"
                        >
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                    </v-row>
                </v-container>
            </section>

            <section 
                id="network" 
                style="
                    height: 102vh !important; 
                    background-color: white"
                >
                <v-container fluid class="pa-0">
                    <v-row 
                        class="pa-0 align-center ma-0" 
                        style="height: 102vh !important; max-width: 100%"
                    >
                        <v-col 
                            cols="12" 
                            xl="6" 
                            lg="6" 
                            md="6" 
                            sm="12" 
                            class="pl-xl-13 pl-lg-13 pl-md-13"
                        >
                            <div 
                                class="ml-xl-auto ml-lg-auto ml-md-auto mx-sm-auto mx-auto mr-xl-0 mr-lg-0 mr-md-0 mb-7"
                                style="width: 80%; max-width: 800px"
                            >
                                <div 
                                    class="text-xl-h5 text-lg-h5 text-md-h6 text-sm-subtitle-1 text-body-1 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-2 dmsans"
                                    style="color: #a6a8b0"
                                >
                                    N E T W O R K
                                </div>
                                <div 
                                    class="text-xl-h2 text-lg-h2 text-md-h3 text-sm-h4 text-h5 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-xl-7 mb-lg-7 mb-md-7 mb-sm-3 mb-3 font-weight-bold dmsans"
                                    style="color: #0091ff"
                                >
                                    Protect your budget and optimize your
                                    network
                                </div>
                                <div 
                                    class="text-xl-h5 text-lg-h5 text-md-h6 text-sm-subtitle-1 text-body-2 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-7 font-weight-light pr-xl-16 pr-lg-16 pr-md-16 dmsans"
                                    style="color: black"
                                >
                                    Be proactive during market swings. No more
                                    wasteful overspending in deflationary
                                    markets, and no more distrust when markets
                                    are chaotic. Identify opportunities for
                                    improvement with precise data, and execute
                                    on them with confidence.
                                </div>
                            </div>
                            <div class="mx-auto mb-7 hidden-md-and-up" style="width: 70%; max-width: 800px">
                                <v-img :src="networkImage.src"></v-img>
                            </div>
                        </v-col>
                        <v-col 
                            cols="6" 
                            class="hidden-sm-and-down"
                        >
                            <div 
                                class="mr-auto mb-7" 
                                style="width: 80%; max-width: 800px"
                            >
                                <v-img :src="networkImage.src"></v-img>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row 
                        justify="center" 
                        style="position: relative; bottom: 13vh" 
                        class="hidden-sm-and-down"
                    >
                        <v-btn 
                            icon 
                            variant="outlined" 
                            color="blue-darken-4" 
                            @click="goTo('#contact', { offset: -76 })"
                        >
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                    </v-row>
                </v-container>
            </section>

            <section 
                id="contact" 
                style="
                    height: 90vh !important;
                    background-color: #eef1fc !important;
                ">
                <v-container fluid class="pa-0">
                    <v-row 
                        class="pa-0 ma-0 align-center" 
                        style="height: 87vh; max-width: 100%"
                    >
                        <v-col 
                            cols="6" 
                            class="pr-13 hidden-sm-and-down"
                        >
                            <div 
                                class="ml-auto mb-7" 
                                style="width: 80%; max-width: 800px"
                            >
                                <v-img :src="contactUsImage.src"></v-img>
                            </div>
                        </v-col>
                        <v-col 
                            cols="12" 
                            xl="6" 
                            lg="6" 
                            md="6" 
                            sm="12" 
                            class="pl-xl-13 pl-lg-13 pl-md-13"
                        >
                            <div 
                                class="mr-xl-auto mr-lg-auto mr-md-auto mx-sm-auto mx-auto ml-xl-0 ml-lg-0 ml-md-0 mb-7"
                                style="width: 80%; max-width: 800px"
                            >
                                <div 
                                    class="text-xl-h2 text-lg-h2 text-md-h3 text-sm-h4 text-h5 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-3 font-weight-bold dmsans"
                                    style="color: #0091ff"
                                >
                                    Contact Us
                                </div>
                                <div 
                                    class="text-xl-h5 text-lg-h5 text-md-h6 text-sm-subtitle-1 text-subtitle-2 ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left mb-7 font-weight-light pr-xl-16 pr-lg-16 pr-md-16 dmsans"
                                    style="color: black"
                                >
                                    Get in touch with our sales team! Request a
                                    demo below.
                                </div>
                                <div
                                    class="mb-7 font-weight-light pr-xl-16 pr-lg-16 pr-md-16 dmsans ml-xl-auto ml-lg-auto ml-md-auto mr-xl-0 mr-lg-0 mr-md-0 mx-sm-auto mx-auto text-center text-sm-center text-md-left text-lg-left text-xl-left"
                                >
                                    <v-btn 
                                        style="font-size: 17px; color: white;"
                                        class="mt-4 dmsans font-weight-bold" 
                                        elevation="0" 
                                        color="blue-darken-4"
                                        size="x-large"
                                        @click="contactFormDialog = true"
                                    >
                                        Request Demo
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </section>

            <v-footer 
                style="background-color: #0d47a1"
            >
                <v-card 
                    flat 
                    tile 
                    width="100%" 
                    class="bg-blue-darken-4 text-center hidden-sm-and-down"
                >
                    <v-card-text>
                        <v-row>
                            <v-col cols="6">
                                <v-row>
                                    <div>
                                        <v-img 
                                            alt="Truce Logo" 
                                            class="shrink" 
                                            src="../assets/Truce_Logo_White.png"
                                            width="140" style="margin-right: 120px" 
                                        />
                                    </div>
                                </v-row>
                                <v-row>
                                    <div 
                                        class="text-white"
                                    >
                                        {{ `\u00A9 ${getCopyrightString()}` }}
                                    </div>
                                </v-row>
                            </v-col>
                            <v-col 
                                cols="6" 
                                class="text-right"
                            >
                                <v-btn 
                                    style="margin-left: 120px; font-size: 16px" 
                                    class="mt-5 dmsans font-weight-bold"
                                    elevation="0" color="white" variant="text" @click="navigateToPrivacy()"
                                >
                                    Privacy
                                </v-btn>
                                <v-btn 
                                    style="margin-left: 10px; font-size: 16px" 
                                    class="mt-5 dmsans font-weight-bold"
                                    elevation="0" color="white" variant="text" @click="navigateToTerms()"
                                >
                                    Terms of Use
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-row 
                    class="hidden-md-and-up"
                >
                    <v-col 
                        cols="12"
                    >
                        <div 
                            class="mx-auto text-center"
                        >
                            <v-btn 
                                style="font-size: 16px" 
                                class="mt-5 dmsans font-weight-bold" 
                                elevation="0"
                                color="white" variant="text" @click="navigateToPrivacy()"
                            >
                                Privacy
                            </v-btn>
                        </div>
                        <div 
                            class="mx-auto text-center"
                        >
                            <v-btn 
                                style="font-size: 16px" 
                                class="mb-5 dmsans font-weight-bold" elevation="0"
                                color="white" 
                                variant="text" 
                                @click="navigateToTerms()"
                            >
                                Terms of Use
                            </v-btn>
                            <div class="text-white">
                                {{ `\u00A9 ${getCopyrightString()}` }}
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-footer>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGoTo } from 'vuetify';
import { post } from 'aws-amplify/api';
import * as utils from '../utils';
import headerBlue from '../assets/header_blue.jpg'

const router = useRouter();
const goTo = useGoTo();

const scrollPosition = ref(null);
const btnColor_1 = ref('white');
const logo_img = ref('Truce_Logo_White.png');
const contactFormDialog = ref(false);
const name = ref('');
const company = ref('');
const email = ref('');
const comment = ref('');
const backToTop = ref(false);
const backToTopMargin = ref('backToTop');
const contactFormValid = ref(false);
const commentMaxLength = ref(250);
const contactForm = ref(null);

const platformImage = new Image();
const trustImage = reactive(new Image());
const stabilityImage = reactive(new Image());
const networkImage = reactive(new Image());
const contactUsImage = reactive(new Image());

const logoSrc = computed(() =>
    new URL(`../assets/${logo_img.value}`, import.meta.url).href
);

const rules = {
    required: (value) => !!value || 'Required.',
    counter: (value) => {
        if (!value) return true;
        return (
            value.length <= commentMaxLength.value ||
            `Max ${commentMaxLength.value} characters`
        );
    },
    email: (value) => {
        if (!value) return true;
        const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
    },
    alphanumeric: (value) => {
        if (!value) return true;
        const pattern = /^[a-zA-Z0-9\s]*$/;
        return (
            pattern.test(value) ||
            'Invalid characters. Only letters and numbers allowed.'
        );
    }
};

const getCopyrightString = utils.getCopyrightString;

function updateScroll(e) {
    scrollPosition.value = window.scrollY;
    if (scrollPosition.value > document.documentElement.clientHeight - 50) {
        btnColor_1.value = 'black';
        logo_img.value = 'Truce_Logo_Black.png';
    } else {
        btnColor_1.value = 'white';
        logo_img.value = 'Truce_Logo_White.png';
    }

    if (scrollPosition.value < window.innerHeight * 5 - 50) {
        backToTopMargin.value = 'backToTop';
    } else {
        backToTopMargin.value = 'backToTop_Footer';
    }

    if (typeof window === 'undefined') return;
    const top = window.pageYOffset || e.target.scrollTop || 0;
    backToTop.value = top > 20;
}

function navigateToApp() {
    router.push({
        name: 'app',
    });
}

function navigateToPrivacy() {
    router.push({ name: 'privacy' });
}

function navigateToTerms() {
    router.push({ name: 'terms' });
}

function resetForm() {
    contactForm.value?.reset();
    contactForm.value?.resetValidation();
}

async function validateForm() {
    const result = await contactForm.value?.validate();
    return result?.valid ?? false;
}

async function sendEmail() {
    if (await validateForm()) {
        try {
            const { body } = await post({
                apiName: 'Contact',
                path: '/contact',
                options: {
                    body: {
                        name: name.value,
                        company: company.value,
                        email: email.value,
                        comment: comment.value
                    },
                    headers: {}
                }
            }).response;
        } catch (error) {
            console.log('Error occurred');
        }

        contactFormDialog.value = false;
        resetForm();
    }
}

function toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
    toTop();
    window.addEventListener('scroll', updateScroll);

    platformImage.src = new URL('../assets/platform@2x.png', import.meta.url).href;
    trustImage.src = new URL('../assets/trust@2x.png', import.meta.url).href;
    stabilityImage.src = new URL('../assets/stability@2x.png', import.meta.url).href;
    networkImage.src = new URL('../assets/score@2x.png', import.meta.url).href;
    contactUsImage.src = new URL('../assets/contact img@2x.png', import.meta.url).href;
});

onUnmounted(() => {
    window.removeEventListener('scroll', updateScroll);
});
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');

.v-tab {
    text-transform: none !important;
}

.v-tab:hover {
    color: #536dfe !important;
    border-bottom: 2px solid #536dfe !important;
}

.rounded-card {
    border-radius: 5px !important;
}

// Vuetify 4: deep selector syntax
.my-overlay :deep(.v-overlay__content) {
    width: 100%;
}

.change_color {
    color: #536dfe;
}

.bottom-gradient {
    background-image: linear-gradient(to bottom, rgb(255, 0, 0) 0%, transparent 72px);
}

.dmsans {
    font-family: 'DM Sans', sans-serif !important;
}

.backToTop {
    margin-bottom: 4.3vh;
}

.backToTop_Footer {
    margin-bottom: 17vh;
}

#logo:hover {
    cursor: pointer;
}
</style>