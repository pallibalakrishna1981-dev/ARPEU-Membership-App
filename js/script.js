/* =========================================================
   ARPEU DIGITAL MEMBERSHIP PORTAL
   FILE        : script.js
   VERSION     : 1.0
   DEVELOPER   : P. Balakrishna
   DESCRIPTION : Core JavaScript Engine
========================================================= */

"use strict";

console.log("SCRIPT LOADED");


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

const navHome = document.getElementById("navHome");
const navMembership = document.getElementById("navMembership");
const navStatistics = document.getElementById("navStatistics");

const homeSection = document.getElementById("homeSection");
const membershipPage = document.getElementById("membershipPage");
const statisticsSection = document.getElementById("statisticsSection");

const newMemberBtn = document.getElementById("newMemberBtn");
const renewalBtn = document.getElementById("renewalBtn");

const membershipTitle = document.getElementById("membershipTitle");
const submitMembershipBtn = document.getElementById("submitMembershipBtn");

const memberPhoto = document.getElementById("memberPhoto");
const photoPreview = document.getElementById("photoPreview");

const mobile = document.getElementById("mobile");
const aadhaar = document.getElementById("aadhaar");
const age = document.getElementById("age");

const paymentOptions = document.querySelectorAll('input[name="paymentOption"]');
const upiPaymentSection = document.getElementById("upiPaymentSection");
const alreadyPaidSection = document.getElementById("alreadyPaidSection");



/* =========================================================
   EMPLOYMENT MASTER DATA
   Version : 3.0.0
   Status  : LOCKED
========================================================= */

/* ==========================================================
   HELPER FUNCTIONS
========================================================== */

function clone(data) {
    return JSON.parse(JSON.stringify(data));
}


/* =========================================================
   UNIVERSAL DROPDOWN ENGINE v2.0
========================================================= */

const DropdownEngine = {

    clear(element, placeholder = "Select") {
        if (!element) {
            return;
        }

        element.innerHTML = "";

        const option = document.createElement("option");
        option.value = "";
        option.textContent = placeholder;

        element.appendChild(option);
    },

    populate(element, values = [], placeholder = "Select") {
        this.clear(element, placeholder);

        if (!element || !Array.isArray(values)) {
            return;
        }

        values.forEach((value) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;

            element.appendChild(option);
        });
    },

    reset(items = []) {
        items.forEach((item) => {
            this.clear(item.element, item.placeholder);
        });
    },

    enable(element) {
        if (element) {
            element.disabled = false;
        }
    },

    disable(element) {
        if (element) {
            element.disabled = true;
        }
    },

    show(element) {
        if (element) {
            element.style.display = "";
        }
    },

    hide(element) {
        if (element) {
            element.style.display = "none";
        }
    },

    value(element) {
        return element ? element.value : "";
    },

    setValue(element, value = "") {
        if (element) {
            element.value = value;
        }
    },

    keys(object) {
        return object ? Object.keys(object) : [];
    },

    get(object, path = []) {

        let node = object;

        for (const key of path) {

            if (!node || !(key in node)) {
                return null;
            }

            node = node[key];

        }

        return node;

    },

    bind(config) {

        const node = this.get(config.data, config.path);

        if (!node) {

            this.populate(
                config.target,
                [],
                config.placeholder
            );

            return;

        }

        this.populate(
            config.target,
            this.keys(node),
            config.placeholder
        );

    }

};




/* =========================================================
   RENEWAL OTP
========================================================= */

const renewalSearch = document.getElementById("renewalSearch");

const sendOtpBtn = document.getElementById("sendOtpBtn");

const otpCard = document.getElementById("otpCard");

const renewalOtp = document.getElementById("renewalOtp");

const verifyOtpBtn = document.getElementById("verifyOtpBtn");

const otpStatus = document.getElementById("otpStatus");

const otpTimer = document.getElementById("otpTimer");

const resendOtpBtn = document.getElementById("resendOtpBtn");

const countdown = document.getElementById("countdown");

let membershipMode = "new";

let otpCountdown = 60;

let otpTimerInterval = null;



/* =========================================================
   AGE CALCULATION
========================================================= */

function initializeAgeCalculation(){
    const dob=document.getElementById("dob");
    const age=document.getElementById("age");
    if(!dob||!age){
        return;
    }
    dob.max=new Date().toISOString().split("T")[0];
    dob.addEventListener("change",function(){
        if(this.value===""){
            age.value="";
            return;
        }
        const birthDate=new Date(this.value);
        const today=new Date();
        let years=today.getFullYear()-birthDate.getFullYear();
        const monthDifference=today.getMonth()-birthDate.getMonth();
        if(monthDifference<0||(monthDifference===0&&today.getDate()<birthDate.getDate())){
            years--;
        }
        if(years<15){
            age.value="";
            dob.value="";
            showError("As per the Bharatiya Mazdoor Sangh (BMS) Bye-Laws and the Trade Unions Act, 1926, only persons who have completed 15 years of age are eligible for membership.");
            dob.focus();
        }
    });
}

function initializeJoiningDateValidation(){
    const dob=document.getElementById("dob");
    const joiningDate=document.getElementById("joiningDate");
    if(!dob||!joiningDate){
        return;
    }
    joiningDate.addEventListener("change",function(){
        if(dob.value===""||joiningDate.value===""){
            return;
        }
        const birthDate=new Date(dob.value);
        const joinDate=new Date(joiningDate.value);
        const eligibleDate=new Date(birthDate);
        eligibleDate.setFullYear(eligibleDate.getFullYear()+15);
        if(joinDate<eligibleDate){
            showError("As per the Bharatiya Mazdoor Sangh (BMS) Bye-Laws and the Trade Unions Act, 1926, only persons who have completed 15 years of age are eligible for membership.");
            joiningDate.value="";
            joiningDate.focus();
        }
    });
}


/* =========================================================
   AADHAAR FORMATTING
========================================================= */

function initializeAadhaarFormatting(){
    const aadhaar=document.getElementById("aadhaar");
    if(!aadhaar){
        return;
    }
    aadhaar.addEventListener("input",function(){
        let digits=this.value.replace(/\D/g,"");
        if(digits.length>12){
            digits=digits.substring(0,12);
        }
        let formatted="";
        for(let i=0;i<digits.length;i++){
            if(i>0&&i%4===0){
                formatted+=" ";
            }
            formatted+=digits[i];
        }
        this.value=formatted;
    });
}



/* =========================================================
   INITIALIZE APPLICATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeNavigation();

    initializeMembershipMode();

    initializeEmploymentModule();

    initializeDistrictDropdown();

    initializePhotoPreview();

    initializeValidations();

    initializeRenewalOtp();

    initializeAgeCalculation();
    initializeJoiningDateValidation();
    initializeAadhaarFormatting();
    initializePhotoModule();

    showPage("home");

});

/* =========================================================
   INITIALIZE RENEWAL OTP
========================================================= */
function initializeRenewalOtp() {
    if (!sendOtpBtn) {
        return;
    }
    sendOtpBtn.addEventListener("click", sendOtp);
    if (resendOtpBtn) {
        resendOtpBtn.addEventListener("click", sendOtp);
    }
}
/* =========================================================
   SEND OTP
========================================================= */
function sendOtp() {
    const searchValue = getValue(renewalSearch);
    if (searchValue === "") {
        showError("Please Enter Member ID or Mobile Number");
        renewalSearch.focus();
        return;
    }
    disableElement(renewalSearch);
    disableElement(sendOtpBtn);
    clearInput(renewalOtp);
    showElement(otpCard);
    showElement(otpStatus);
    showElement(otpTimer);
    hideElement(resendOtpBtn);
    otpStatus.textContent = "OTP Sent Successfully.";
    otpStatus.style.color = "green";
    enableElement(renewalOtp);
    enableElement(verifyOtpBtn);
    renewalOtp.focus();
    startOtpTimer();
}


/* =========================================================
   OTP TIMER
========================================================= */
function startOtpTimer() {
    otpCountdown = 60;
    if (otpTimerInterval) {
        clearInterval(otpTimerInterval);
    }
    showElement(otpTimer);
    hideElement(resendOtpBtn);
    countdown.textContent = "01:00";
    otpTimerInterval = setInterval(function () {
        otpCountdown--;
        const minutes = Math.floor(otpCountdown / 60);
        const seconds = otpCountdown % 60;
        countdown.textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
        if (otpCountdown > 30) {
            countdown.style.color = "green";
        } else if (otpCountdown > 10) {
            countdown.style.color = "orange";
        } else {
            countdown.style.color = "red";
        }
        if (otpCountdown <= 0) {
            clearInterval(otpTimerInterval);
            otpTimerInterval = null;
            otpStatus.textContent = "OTP Expired.";
            otpStatus.style.color = "red";
            countdown.textContent = "00:00";
            showElement(resendOtpBtn);
        }
    }, 1000);
}

/* =========================================================
   DISTRICT DROPDOWN
========================================================= */


/* =========================================================
   DISTRICT DROPDOWN
========================================================= */

const districtSelect = document.getElementById("district");

const districts = [
    "Alluri Sitarama Raju",
    "Anakapalli",
    "Anantapur",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "Dr. B. R. Ambedkar Konaseema",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "Nandyal",
    "NTR",
    "Palnadu",
    "Parvathipuram Manyam",
    "Prakasam",
    "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa"
];

function initializeDistrictDropdown() {

    if (!districtSelect) {
        return;
    }

    districts.forEach(function (district) {

        const option = document.createElement("option");

        option.value = district;

        option.textContent = district;

        districtSelect.appendChild(option);

    });

}




/* =========================================================
   NAVIGATION ENGINE
========================================================= */

function showPage(page) {

    if (homeSection) {
    homeSection.style.display = "none";
    }

    if (membershipPage) {
        membershipPage.style.display = "none";
    }

    if (statisticsSection) {
    statisticsSection.style.display = "none";
    }

    if (navHome) {
        navHome.classList.remove("active");
    }

    if (navMembership) {
        navMembership.classList.remove("active");
    }

    if (navStatistics) {
        navStatistics.classList.remove("active");
    }

    switch (page) {

        case "home":

            if (homeSection) {
                homeSection.style.display = "block";
            }

            if (navHome) {
                navHome.classList.add("active");
            }

            break;

        case "membership":

            if (membershipPage) {
                membershipPage.style.display = "block";
            }

            if (navMembership) {
                navMembership.classList.add("active");
            }

            break;

        case "statistics":

            if (statisticsSection) {
                statisticsSection.style.display = "block";
            }

            if (navStatistics) {
                navStatistics.classList.add("active");
            }

            break;

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

/* =========================================================
   INITIALIZE NAVIGATION
========================================================= */

function initializeNavigation() {

    if (navHome) {

        navHome.addEventListener("click", function (e) {

            e.preventDefault();

            showPage("home");

        });

    }

    if (navMembership) {

        navMembership.addEventListener("click", function (e) {

            e.preventDefault();

            setMembershipMode("new");

            showPage("membership");

        });

    }

    if (navStatistics) {

        navStatistics.addEventListener("click", function (e) {

            e.preventDefault();

            showPage("statistics");

        });

    }

}

/* =========================================================
   HOME PAGE MEMBERSHIP BUTTONS
========================================================= */

function initializeMembershipMode() {

    if (newMemberBtn) {

        newMemberBtn.addEventListener("click", function (e) {

            e.preventDefault();

            setMembershipMode("new");

            showPage("membership");

        });

    }

    if (renewalBtn) {

        renewalBtn.addEventListener("click", function (e) {

            e.preventDefault();

            setMembershipMode("renewal");

            showPage("membership");

        });

    }

}

/* =========================================================
   MEMBERSHIP MODE TOGGLE
========================================================= */

const toggleNewMember = document.getElementById("toggleNewMember");
const toggleRenewal = document.getElementById("toggleRenewal");
const membershipToggle = document.getElementById("membershipToggle");
const membershipDescription = document.getElementById("membershipDescription");
const renewalSection = document.getElementById("renewalSection");
const newMemberSection = document.getElementById("newMemberSection");

if (toggleNewMember && toggleRenewal) {

    toggleNewMember.addEventListener("click", function () {

        setMembershipMode("new");

    });

    toggleRenewal.addEventListener("click", function () {

        setMembershipMode("renewal");

    });

}

function setMembershipMode(mode) {

    membershipMode = mode;

    if (typeof PaymentModule !== "undefined") {

    PaymentModule.state.membershipMode = mode;

    PaymentModule.updateMembershipFee();

    }

    if (!membershipTitle || !submitMembershipBtn) {
        return;
    }

    if (mode === "renewal") {

        if (newMemberSection) {
            newMemberSection.style.display = "none";
        }

        if (renewalSection) {
            renewalSection.style.display = "block";
        }

        membershipTitle.textContent = "MEMBERSHIP RENEWAL";

        membershipDescription.textContent = "Renew your existing ARPEU membership.";

        submitMembershipBtn.textContent = "SUBMIT RENEWAL";

        membershipToggle.classList.add("renewal");

        toggleRenewal.classList.add("active");
        toggleNewMember.classList.remove("active");

        membershipTitle.style.color = "#FF6600";

    } else {

        if (newMemberSection) {
            newMemberSection.style.display = "block";
        }

        if (renewalSection) {
            renewalSection.style.display = "none";
        }

        membershipTitle.textContent = "NEW MEMBER";

        membershipDescription.textContent = "Join ARPEU and become a registered member.";

        submitMembershipBtn.textContent = "SUBMIT MEMBERSHIP";

        membershipToggle.classList.remove("renewal");

        toggleNewMember.classList.add("active");
        toggleRenewal.classList.remove("active");

        membershipTitle.style.color = "#0B4EA2";

    }

}


/* =========================================================
   PHOTO PREVIEW
========================================================= */

function initializePhotoPreview() {

    if (!memberPhoto || !photoPreview) {
        return;
    }

    const previewText = document.querySelector(".preview-text");

    memberPhoto.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {

            photoPreview.removeAttribute("src");
            photoPreview.style.display = "none";

            if (previewText) {
                previewText.style.display = "block";
            }

            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {

            photoPreview.src = e.target.result;
            photoPreview.style.display = "block";

            if (previewText) {
                previewText.style.display = "none";
            }

        };

        reader.readAsDataURL(file);

    });

}



/* =========================================================
   EMPLOYMENT MASTER DATA
   Version : 3.0.0
   Status  : LOCKED
========================================================= */

/* ==========================================================
   HELPER FUNCTIONS
========================================================== */

function clone(data) {
    return JSON.parse(JSON.stringify(data));
}

/* ==========================================================
   APGENCO STAGE TEMPLATE
========================================================== */

const apgencoStageTemplate = {

    divisions: {

        "Boiler Maintenance": {
            subDivisions: [
                "Sub Division-I",
                "Sub Division-II",
                "Sub Division-III",
                "Sub Division-IV"
            ],
            designationGroups: ["Technical"]
        },

        "Turbine Maintenance": {
            subDivisions: [
                "Sub Division-I",
                "Sub Division-II",
                "Sub Division-III"
            ],
            designationGroups: ["Technical"]
        },

        "Electrical Maintenance": {
            subDivisions: [
                "Switch Yard",
                "HT Maintenance",
                "LT Maintenance",
                "Transformer Maintenance",
                "Protection"
            ],
            designationGroups: ["Technical"]
        },

        "Control & Instrumentation (C&I)": {
            subDivisions: [],
            designationGroups: ["Technical"]
        },

        "Coal Handling Plant (CHP)": {
            subDivisions: [
                "Operation",
                "Maintenance",
                "Dozer Operators",
                "Loco Pilots"
            ],
            designationGroups: ["Technical"]
        },

        "Ash Handling Plant (AHP)": {
            subDivisions: [],
            designationGroups: ["Technical"]
        },

        "Efficiency & Planning (E&P)": {
            subDivisions: [],
            designationGroups: ["Technical"]
        },

        "MRT": {
            subDivisions: [],
            designationGroups: ["Technical"]
        }

    }

};

/* ==========================================================
   APGENCO COMMON SERVICES TEMPLATE
========================================================== */

const apgencoCommonServicesTemplate = {

    divisions: {

        "Accounts": {
            subDivisions: [],
            designationGroups: ["Accounts"]
        },

        "Administration": {
            subDivisions: [],
            designationGroups: ["Administration"]
        },

        "Stores": {
            subDivisions: [],
            designationGroups: ["Administration"]
        },

        "Hospital": {
            subDivisions: [],
            designationGroups: ["Hospital"]
        },

        "Water Treatment Plant": {
            subDivisions: [],
            designationGroups: ["Technical"]
        },

        "Colony Maintenance": {
            subDivisions: [],
            designationGroups: ["Technical"]
        },

        "Colony Security Guards": {
            subDivisions: [],
            designationGroups: ["Security"]
        },

        "Safety Department": {
            subDivisions: [],
            designationGroups: ["Technical"]
        }

    }

};

const employmentMaster = {

    APGENCO: {

        stations: {

            "Dr. NTTPS": {

                type: "THERMAL",

                stages: {

                    "Stage-I": clone(apgencoStageTemplate),
                    "Stage-II": clone(apgencoStageTemplate),
                    "Stage-III": clone(apgencoStageTemplate),
                    "Stage-IV": clone(apgencoStageTemplate),
                    "Stage-V": clone(apgencoStageTemplate),

                    "Common Services": clone(apgencoCommonServicesTemplate)

                }

            },

            "Dr. MVR RTPP": {

                type: "THERMAL",

                stages: {

                    "Stage-I": clone(apgencoStageTemplate),
                    "Stage-II": clone(apgencoStageTemplate),

                    "Common Services": clone(apgencoCommonServicesTemplate)

                }

            },

            "SDSTPS": {

                type: "THERMAL",

                stages: {

                    "Stage-I": clone(apgencoStageTemplate),

                    "Common Services": clone(apgencoCommonServicesTemplate)

                }

            },

            "Hydel": {

                type: "HYDEL",

                stages: {

                    "Common Services": clone(apgencoCommonServicesTemplate)

                }

            }

        },

        designationGroups: {

            Technical: [

                "JPA (Junior Plant Attendant)",
                "PA (Plant Attendant)",
                "JE (Junior Engineer)",
                "AE (Assistant Engineer)",
                "AEE (Assistant Executive Engineer)",
                "Dy.EE (Deputy Executive Engineer)",
                "Foreman Gr.-IV",
                "Foreman Gr.-II",
                "Foreman Gr.-I",
                "Chemist",
                "Lab Assistant",
                "Sr. Chemist (Senior Chemist)",
                "Contract Labour",
                "Casual Labour",
                "Others"

            ],

            Accounts: [

                "Jr. Assistant (Junior Assistant)",
                "Sr. Assistant (Senior Assistant)",
                "JAO (Junior Accounts Officer)",
                "AAO (Assistant Accounts Officer)",
                "AO (Accounts Officer)",
                "Others"

            ],

            Administration: [

                "Jr. Assistant (Junior Assistant)",
                "Sr. Assistant (Senior Assistant)",
                "Drivers",
                "Contract Labour",
                "Casual Labour",
                "Others"

            ],

            Hospital: [

                "Medical Officer",
                "Staff Nurse",
                "Pharmacist",
                "Lab Technician",
                "ANM",
                "Hospital Attendant",
                "Contract Labour",
                "Others"

            ],

            Security: [

                "Security Guard",
                "Head Security Guard",
                "Security Supervisor",
                "Contract Labour",
                "Others"

            ]

        }

    },

    APTRANSCO: {

    circles: {

        "Kadapa Circle": {
            divisions: {

                "Kadapa Division": {
                    subDivisions: [
                        "Rajampeta",
                        "Porumamilla",
                        "C.K. Dinne",
                        "MRT",
                        "O&M"
                    ]
                },

                "Yerraguntla Division": {
                    subDivisions: [
                        "Pulivendula",
                        "Proddatur",
                        "Jammalamadugu"
                    ]
                }

            }
        }

    }

},

    APSPDCL: {

    circles: {

        "Nellore Circle": {
            divisions: {
                "Nellore Town": { subDivisions: ["Nellore Town"] },
                "Kavali": { subDivisions: ["Kavali"] },
                "Atmakur": { subDivisions: ["Atmakur"] }
            }
        },

        "Anantapur Circle": {
            divisions: {
                "Anantapur": { subDivisions: ["Anantapur"] },
                "Dharmavaram": { subDivisions: ["Dharmavaram"] },
                "Tadipatri": { subDivisions: ["Tadipatri"] },
                "Kadiri": { subDivisions: ["Kadiri"] },
                "Kalyandurgam": { subDivisions: ["Kalyandurgam"] },
                "Penukonda": { subDivisions: ["Penukonda"] },
                "Puttaparthi": { subDivisions: ["Puttaparthi"] }
            }
        },

        "Kurnool Circle": {
            divisions: {
                "Kurnool": { subDivisions: ["Kurnool"] },
                "Nandyal": { subDivisions: ["Nandyal"] },
                "Adoni": { subDivisions: ["Adoni"] },
                "Dhone": { subDivisions: ["Dhone"] },
                "Atmakur": { subDivisions: ["Atmakur"] }
            }
        },

        "Kadapa Circle": {
            divisions: {
                "Kadapa": { subDivisions: ["Kadapa"] },
                "Proddatur": { subDivisions: ["Proddatur"] },
                "Rayachoti": { subDivisions: ["Rayachoti"] },
                "Rajampeta": { subDivisions: ["Rajampeta"] },
                "Madanapalle": { subDivisions: ["Madanapalle"] }
            }
        },

        "Tirupati Circle": {
            divisions: {
                "Chittoor": { subDivisions: ["Chittoor"] },
                "Palamaner": { subDivisions: ["Palamaner"] },
                "Nagari": { subDivisions: ["Nagari"] },
                "Kuppam": { subDivisions: ["Kuppam"] },
                "Tirupati": { subDivisions: ["Tirupati"] },
                "Srikalahasti": { subDivisions: ["Srikalahasti"] },
                "Satyavedu": { subDivisions: ["Satyavedu"] }
            }
        }

    }

},

    APCPDCL: {

    circles: {

        "CRDA Circle": {
            divisions: {
                "Amaravati Division": { subDivisions: ["Mangalagiri"] },
                "Chilakaluripeta Division": { subDivisions: ["Krishna Nagar"] }
            }
        },

        "Guntur Circle": {
            divisions: {
                "Guntur Town Division": { subDivisions: ["Guntur-I", "Guntur-II", "Guntur-III"] },
                "Tenali Division": { subDivisions: ["Tenali Town", "Tenali Rural", "Ponnur"] }
            }
        },

        "Palnadu Circle": {
            divisions: {
                "Narasaraopeta Division": { subDivisions: ["Narasaraopeta Town", "Narasaraopeta Rural"] },
                "Macherla Division": { subDivisions: ["Macherla Town", "Macherla Rural"] }
            }
        },

        "Bapatla Circle": {
            divisions: {
                "Bapatla Division": { subDivisions: ["Bapatla Town", "Cherukupalli", "Tsundur", "Repalle"] },
                "Chirala Division": { subDivisions: ["Chirala Town", "Chirala Rural"] }
            }
        },

        "Ongole Circle": {
            divisions: {
                "Ongole Town Division": { subDivisions: ["Ongole Town", "Ongole Rural"] },
                "Kandukur Division": { subDivisions: ["Kandukur Town", "Kandukur Rural"] }
            }
        },

        "Markapuram Circle": {
            divisions: {
                "Markapuram Division": { subDivisions: ["Markapuram Town", "Markapuram Rural"] },
                "Kanigiri Division": { subDivisions: ["Kanigiri Town", "Kanigiri Rural"] }
            }
        }

    }

},

    APEPDCL: {

    circles: {

        "Eluru Circle": {
            divisions: {
                "Jangareddygudem Division": {
                    subDivisions: [
                        "Jeelugumilli",
                        "Chintalapudi",
                        "Polavaram",
                        "Jangareddygudem",
                        "Kamavarapukota"
                    ]
                },
                "Eluru Division": {
                    subDivisions: [
                        "Unguturu",
                        "Denduluru",
                        "Eluru",
                        "Pedavegi",
                        "Bhimadolu"
                    ]
                }
            }
        },

        "Anakapalli Circle": {
            divisions: {
                "Narsipatnam Division": {
                    subDivisions: [
                        "Narsipatnam",
                        "Vaddadi",
                        "Chodavaram"
                    ]
                },
                "Anakapalli Division": {
                    subDivisions: [
                        "Anakapalli",
                        "Payakaraopeta",
                        "Achyutapuram",
                        "Yelamanchili"
                    ]
                },
                "Kasimkota Division": {
                    subDivisions: [
                        "Kasimkota"
                    ]
                }
            }
        }

    }

},

};

/* =========================================================
   EMPLOYMENT MODULE v4.0
========================================================= */

const company = document.getElementById("company");

const station = document.getElementById("station");
const stage = document.getElementById("stage");

const circle = document.getElementById("circle");
const division = document.getElementById("division");
const subDivision = document.getElementById("subDivision");

const subStation = document.getElementById("subStation");
const section = document.getElementById("section");

const designation = document.getElementById("designation");

const stationGroup = document.getElementById("stationGroup");
const stageGroup = document.getElementById("stageGroup");

const circleGroup = document.getElementById("circleGroup");
const divisionGroup = document.getElementById("divisionGroup");
const subDivisionGroup = document.getElementById("subDivisionGroup");

const subStationGroup = document.getElementById("subStationGroup");
const sectionGroup = document.getElementById("sectionGroup");

const designationGroup = document.getElementById("designationGroup");


/* =========================================================
   INITIALIZE EMPLOYMENT MODULE
========================================================= */

function initializeEmploymentModule() {

    if (!company) return;

    company.addEventListener("change", onCompanyChange);

    station.addEventListener("change", onStationChange);
    stage.addEventListener("change", onStageChange);

    circle.addEventListener("change", onCircleChange);
    division.addEventListener("change", onDivisionChange);

    subDivision.addEventListener("change", onSubDivisionChange);

    onCompanyChange();

}


/* =========================================================
   COMPANY CHANGE
========================================================= */

function onCompanyChange() {

    // Hide All Groups

    hideElement(stationGroup);
    hideElement(stageGroup);

    hideElement(circleGroup);
    hideElement(divisionGroup);
    hideElement(subDivisionGroup);

    hideElement(subStationGroup);
    hideElement(sectionGroup);

    hideElement(designationGroup);

    // Clear Dropdowns

    DropdownEngine.clear(station, "Select Station");
    DropdownEngine.clear(stage, "Select Stage");

    DropdownEngine.clear(circle, "Select Circle");
    DropdownEngine.clear(division, "Select Division");
    DropdownEngine.clear(subDivision, "Select Sub Division");

    DropdownEngine.clear(designation, "Select Designation");

    clearInput(subStation);
    clearInput(section);

    /* ==========================================
       APGENCO
    ========================================== */

    if (company.value === "APGENCO") {

        showElement(stationGroup);
        showElement(stageGroup);

        showElement(divisionGroup);
        showElement(subDivisionGroup);

        showElement(designationGroup);

        DropdownEngine.populate(
            station,
            Object.keys(employmentMaster.APGENCO.stations),
            "Select Station"
        );

        return;

    }

    /* ==========================================
       APTRANSCO
    ========================================== */

    if (company.value === "APTRANSCO") {

        showElement(circleGroup);
        showElement(divisionGroup);
        showElement(subDivisionGroup);

        showElement(subStationGroup);
        showElement(sectionGroup);

        showElement(designationGroup);

        DropdownEngine.populate(
            circle,
            Object.keys(employmentMaster.APTRANSCO.circles),
            "Select Circle"
        );

        return;

    }

    /* ==========================================
       DISCOMS
    ========================================== */

    if (
        company.value === "APSPDCL" ||
        company.value === "APCPDCL" ||
        company.value === "APEPDCL"
    ) {

        showElement(circleGroup);
        showElement(divisionGroup);
        showElement(subDivisionGroup);

        showElement(subStationGroup);
        showElement(sectionGroup);

        showElement(designationGroup);

        DropdownEngine.populate(
            circle,
            Object.keys(
                employmentMaster[company.value].circles
            ),
            "Select Circle"
        );

        return;

    }

}

/* =========================================================
   CIRCLE CHANGE
========================================================= */

function onCircleChange() {

    // APGENCO uses Station -> Stage Flow
    if (company.value === "APGENCO") {
        return;
    }

    DropdownEngine.clear(
        division,
        "Select Division"
    );

    DropdownEngine.clear(
        subDivision,
        "Select Sub Division"
    );

    DropdownEngine.clear(
        designation,
        "Select Designation"
    );

    clearInput(subStation);
    clearInput(section);

    const companyData =
        employmentMaster[company.value];

    if (!companyData) return;

    const circleData =
        companyData.circles[circle.value];

    if (!circleData) return;

    DropdownEngine.populate(
        division,
        Object.keys(circleData.divisions),
        "Select Division"
    );

}


/* =========================================================
   STATION CHANGE
========================================================= */

function onStationChange() {

    if (!station.value) {

        DropdownEngine.clear(
            stage,
            "Select Stage"
        );

        return;

    }

    const stationData =
        employmentMaster.APGENCO
        .stations[station.value];

    if (!stationData) return;

    DropdownEngine.populate(
        stage,
        Object.keys(stationData.stages),
        "Select Stage"
    );

}


/* =========================================================
   STAGE CHANGE
========================================================= */

function onStageChange() {

    if (!stage.value) {

        DropdownEngine.clear(
            division,
            "Select Division"
        );

        DropdownEngine.clear(
            subDivision,
            "Select Sub Division"
        );

        DropdownEngine.clear(
            designation,
            "Select Designation"
        );

        return;

    }

    const stageData =
        employmentMaster.APGENCO
        .stations[station.value]
        .stages[stage.value];

    if (!stageData) return;

    DropdownEngine.populate(
        division,
        Object.keys(stageData.divisions),
        "Select Division"
    );

}


/* =========================================================
   DIVISION CHANGE
========================================================= */

function onDivisionChange() {

    /* ==========================================
       APGENCO
    ========================================== */

    if (company.value === "APGENCO") {

        const divisionData =
            employmentMaster.APGENCO
            .stations[station.value]
            .stages[stage.value]
            .divisions[division.value];

        if (!divisionData) return;

        DropdownEngine.populate(
            subDivision,
            divisionData.subDivisions,
            "Select Sub Division"
        );

        let designationList = [];

        divisionData.designationGroups.forEach(group => {

            designationList.push(
                ...employmentMaster.APGENCO.designationGroups[group]
            );

        });

        DropdownEngine.populate(
            designation,
            designationList,
            "Select Designation"
        );

        return;

    }

    /* ==========================================
       DISCOMS
    ========================================== */

    DropdownEngine.clear(
        subDivision,
        "Select Sub Division"
    );

    DropdownEngine.clear(
        designation,
        "Select Designation"
    );

    const companyData =
        employmentMaster[company.value];

    if (!companyData) return;

    const circleData =
        companyData.circles[circle.value];

    if (!circleData) return;

    const divisionData =
        circleData.divisions[division.value];

    if (!divisionData) return;

    DropdownEngine.populate(
        subDivision,
        divisionData.subDivisions,
        "Select Sub Division"
    );

}

/* =========================================================
   SUB DIVISION CHANGE
========================================================= */

function onSubDivisionChange() {

    // APGENCO loads designation in Division Change
    if (company.value === "APGENCO") {
        return;
    }

    DropdownEngine.populate(
        designation,
        [
        "AAO",
        "AE",
        "AO",
        "Computer Operator",
        "Dy. EE",
        "EE",
        "Foreman",
        "Foreman Grade-I",
        "Foreman Grade-II",
        "JAO",
        "JE",
        "JLM",
        "JLM Grade-II",
        "Junior Assistant",
        "LI",
        "Senior Assistant",
        "Senior LI",
        "Shift Operator",
        "Watchman",
        "Others"
        ],
        "Select Designation"
    );

}


/*=========================================================
    PAYMENT MODULE V3
    PART - 1
=========================================================*/

/*=========================================================
    MEMBERSHIP CONSTANTS
=========================================================*/

const ADMISSION_FEE = 100;
const ANNUAL_SUBSCRIPTION = 360;

const MEMBERSHIP_FEES = {
    new: ADMISSION_FEE + ANNUAL_SUBSCRIPTION,
    renewal: ANNUAL_SUBSCRIPTION
};

/*=========================================================
    PAYMENT MODULE
=========================================================*/

const PaymentModule = {

    /*=====================================================
        DOM
    =====================================================*/

    elements: {},

    /*=====================================================
        STATE
    =====================================================*/

    state: {

        membershipMode: "renewal",

        paymentOption: "",

        requiredFee: MEMBERSHIP_FEES.renewal,

        alreadyPaid: 0,

        currentPayment: 0,

        balanceAmount: 0,

        totalPaid: 0,

        donation: 0

    },

    /*=====================================================
        INITIALIZE
    =====================================================*/

    init() {

        this.cacheDOM();

        this.bindEvents();

        this.initializeDefaults();

    },

    /*=====================================================
        CACHE DOM
    =====================================================*/

    cacheDOM() {

        this.elements.paymentOptions =
            document.querySelectorAll(
                "input[name='paymentOption']"
            );

        this.elements.membershipFeeSection =
            document.getElementById(
                "membershipFeeSection"
            );

        this.elements.membershipFee =
            document.getElementById(
                "membershipFee"
            );

        this.elements.paymentInfoBox =
            document.getElementById(
                "paymentInfoBox"
            );

        this.elements.minimumFeeText =
            document.getElementById(
                "minimumFeeText"
            );

        this.elements.admissionFeeText =
            document.getElementById(
                "admissionFeeText"
            );

        this.elements.paymentValidationMessage =
            document.getElementById(
                "paymentValidationMessage"
            );

        this.elements.upiPaymentSection =
            document.getElementById(
                "upiPaymentSection"
            );

        this.elements.paymentCompleted =
            document.getElementById(
                "paymentCompleted"
            );

        this.elements.paymentCompletedSection =
            document.getElementById(
                "paymentCompletedSection"
            );

        this.elements.transactionId =
            document.getElementById(
                "transactionId"
            );

        this.elements.paymentDate =
            document.getElementById(
                "paymentDate"
            );

        this.elements.alreadyPaidSection =
            document.getElementById(
                "alreadyPaidSection"
            );

        this.elements.alreadyPaymentDate =
            document.getElementById(
                "alreadyPaymentDate"
            );

        this.elements.alreadyPaymentAmount =
            document.getElementById(
                "alreadyPaymentAmount"
            );

        this.elements.alreadyTransactionId =
            document.getElementById(
                "alreadyTransactionId"
            );

        this.elements.paymentReceipt =
            document.getElementById(
                "paymentReceipt"
            );

        this.elements.partialPaymentSummary =
            document.getElementById(
                "partialPaymentSummary"
            );

        this.elements.requiredAmountText =
            document.getElementById(
                "requiredAmountText"
            );

        this.elements.alreadyPaidAmountText =
            document.getElementById(
                "alreadyPaidAmountText"
            );

        this.elements.balanceAmountText =
            document.getElementById(
                "balanceAmountText"
            );

        this.elements.balanceWarningMessage =
            document.getElementById(
                "balanceWarningMessage"
            );

        this.elements.completePaymentButton =
            document.getElementById(
                "completePaymentButton"
            );

        this.elements.balancePaymentSection =
            document.getElementById(
                "balancePaymentSection"
            );

        this.elements.balancePaymentAmount =
            document.getElementById(
                "balancePaymentAmount"
            );

        this.elements.balanceTransactionId =
            document.getElementById(
                "balanceTransactionId"
            );

        this.elements.balancePaymentDate =
            document.getElementById(
                "balancePaymentDate"
            );

        this.elements.balancePaymentReceipt =
            document.getElementById(
                "balancePaymentReceipt"
            );

        this.elements.finalPaymentSummary =
            document.getElementById(
                "finalPaymentSummary"
            );

        this.elements.summaryRequiredFee =
            document.getElementById(
                "summaryRequiredFee"
            );

        this.elements.summaryAlreadyPaid =
            document.getElementById(
                "summaryAlreadyPaid"
            );

        this.elements.summaryAdditionalPayment =
            document.getElementById(
                "summaryAdditionalPayment"
            );

        this.elements.summaryFinalBalanceAmount =
            document.getElementById(
                "summaryFinalBalanceAmount"
            );

        this.elements.summaryTotalPaid =
            document.getElementById(
                "summaryTotalPaid"
            );

        this.elements.summaryMembershipFee =
            document.getElementById(
                "summaryMembershipFee"
            );

        this.elements.summaryDonation =
            document.getElementById(
                "summaryDonation"
            );

    },

    /*=====================================================
        BIND EVENTS
    =====================================================*/

    bindEvents() {

        this.elements.paymentOptions.forEach(option => {

            option.addEventListener("change", e => {

                this.handlePaymentOption(
                    e.target.value
                );

            });

        });

        if (this.elements.membershipFee) {

            this.elements.membershipFee.addEventListener(
                "input",
                () => this.validateMembershipFee()
            );

        }

        if (this.elements.paymentCompleted) {

            this.elements.paymentCompleted.addEventListener(
                "change",
                () => this.togglePaymentCompleted()
            );

        }

    },

    /*=====================================================
        DEFAULTS
    =====================================================*/

    initializeDefaults() {

        this.hide(
            this.elements.membershipFeeSection
        );

        this.hide(
            this.elements.upiPaymentSection
        );

        this.hide(
            this.elements.paymentCompletedSection
        );

        this.hide(
            this.elements.alreadyPaidSection
        );

        this.hide(
            this.elements.partialPaymentSummary
        );

        this.hide(
            this.elements.balanceWarningMessage
        );

        this.hide(
            this.elements.completePaymentButton
        );

        this.hide(
            this.elements.balancePaymentSection
        );

        this.hide(
            this.elements.finalPaymentSummary
        );

        if (this.elements.paymentValidationMessage) {

            this.elements.paymentValidationMessage.style.display = "none";

        }

        this.updateMembershipFee();

    },

    /*=====================================================
        SHOW
    =====================================================*/

    show(element) {

        if (!element) return;

        element.style.display = "block";

        element.classList.add("fade-in");

    },

    /*=====================================================
        HIDE
    =====================================================*/

    hide(element) {

        if (!element) return;

        element.style.display = "none";

        element.classList.remove("fade-in");

    },

    /*=====================================================
        PART - 2 CONTINUES
    =====================================================*/

    /*=====================================================
        HANDLE PAYMENT OPTION
    =====================================================*/

    handlePaymentOption(option) {

        this.state.paymentOption = option;

        this.hide(this.elements.membershipFeeSection);
        this.hide(this.elements.upiPaymentSection);
        this.hide(this.elements.paymentCompletedSection);
        this.hide(this.elements.alreadyPaidSection);
        this.hide(this.elements.partialPaymentSummary);
        this.hide(this.elements.balanceWarningMessage);
        this.hide(this.elements.completePaymentButton);
        this.hide(this.elements.balancePaymentSection);
        this.hide(this.elements.finalPaymentSummary);

        if (option === "payNow") {

            this.show(this.elements.membershipFeeSection);
            this.show(this.elements.upiPaymentSection);

            this.validateMembershipFee();

        }

        if (option === "alreadyPaid") {

            this.show(this.elements.alreadyPaidSection);

            this.calculateAlreadyPaid();

        }

    },

    /*=====================================================
        UPDATE MEMBERSHIP FEE
=====================================================*/

updateMembershipFee() {

    if (this.state.membershipMode === "new") {

        this.state.requiredFee = MEMBERSHIP_FEES.new;

        this.elements.admissionFeeText.textContent =
            this.formatAmount(ADMISSION_FEE);

    }

    else {

        this.state.requiredFee = MEMBERSHIP_FEES.renewal;

        this.elements.admissionFeeText.textContent =
            this.formatAmount(0);

    }

    this.elements.minimumFeeText.textContent =
        this.formatAmount(this.state.requiredFee);

},

    /*=====================================================
        VALIDATE MEMBERSHIP FEE
    =====================================================*/

    validateMembershipFee() {

        const amount =
            Number(this.elements.membershipFee.value) || 0;

        const msg =
            this.elements.paymentValidationMessage;

        msg.style.display = "block";

        if (amount === 0) {

            msg.className =
                "payment-message payment-warning";

            msg.innerHTML =
                "Please enter Membership Fee.";

            return false;

        }

        if (amount < this.state.requiredFee) {

            msg.className =
                "payment-message payment-error";

            msg.innerHTML =
                "Minimum payable amount is ₹" +
                this.state.requiredFee;

            return false;

        }

        msg.className =
            "payment-message payment-success";

        msg.innerHTML =
            "Membership Fee is valid.";

        return true;

    },

    /*=====================================================
        PAYMENT COMPLETED
    =====================================================*/

    togglePaymentCompleted() {

        if (this.elements.paymentCompleted.checked) {

            this.show(
                this.elements.paymentCompletedSection
            );

        }

        else {

            this.hide(
                this.elements.paymentCompletedSection
            );

        }

    },

    /*=====================================================
        CALCULATE ALREADY PAID
    =====================================================*/

    calculateAlreadyPaid() {

        const paid =
            Number(
                this.elements.alreadyPaymentAmount.value
            ) || 0;

        this.state.alreadyPaid = paid;

        this.state.balanceAmount =
            this.state.requiredFee - paid;

        if (this.state.balanceAmount < 0) {

            this.state.balanceAmount = 0;

        }

        this.elements.requiredAmountText.textContent =
            "₹" + this.state.requiredFee;

        this.elements.alreadyPaidAmountText.textContent =
            "₹" + paid;

        this.elements.balanceAmountText.textContent =
            "₹" + this.state.balanceAmount;

        this.show(
            this.elements.partialPaymentSummary
        );

        if (paid < this.state.requiredFee) {

            this.show(
                this.elements.balanceWarningMessage
            );

            this.show(
                this.elements.completePaymentButton
            );

        }

        else {

            this.hide(
                this.elements.balanceWarningMessage
            );

            this.hide(
                this.elements.completePaymentButton
            );

            this.updateFinalSummary();

        }

    },

    /*=====================================================
        COMPLETE BALANCE PAYMENT
    =====================================================*/

    openBalancePayment() {

        this.show(
            this.elements.balancePaymentSection
        );

        this.elements.balancePaymentAmount.value =
            this.state.balanceAmount;

    },

    /*=====================================================
        VALIDATE BALANCE PAYMENT
    =====================================================*/

    validateBalancePayment() {

        const amount =
            Number(
                this.elements.balancePaymentAmount.value
            ) || 0;

        if (amount < this.state.balanceAmount) {

            alert(
                "Please pay at least ₹" +
                this.state.balanceAmount
            );

            return false;

        }

        return true;

    },

    /*=====================================================
        CALCULATE FINAL PAYMENT
    =====================================================*/

    calculateFinalPayment() {

        this.state.currentPayment =
            Number(
                this.elements.balancePaymentAmount.value
            ) || 0;

        this.state.totalPaid =
            this.state.alreadyPaid +
            this.state.currentPayment;

        this.calculateDonation();

        this.updateFinalSummary();

    },

    /*=====================================================
        CALCULATE DONATION
    =====================================================*/

    calculateDonation() {

        this.state.totalPaid =
            this.state.alreadyPaid +
            this.state.currentPayment;

        this.state.membershipFeeUsed =
            Math.min(
                this.state.totalPaid,
                this.state.requiredFee
            );

        this.state.donation =
            Math.max(
                0,
                this.state.totalPaid -
                this.state.requiredFee
            );

        this.state.balanceAmount =
            Math.max(
                0,
                this.state.requiredFee -
                this.state.totalPaid
            );

    },

    /*=====================================================
        UPDATE FINAL SUMMARY
    =====================================================*/

    updateFinalSummary() {

        this.calculateDonation();

        this.elements.summaryRequiredFee.textContent =
            "₹" + this.state.requiredFee;

        this.elements.summaryAlreadyPaid.textContent =
            "₹" + this.state.alreadyPaid;

        this.elements.summaryAdditionalPayment.textContent =
            "₹" + this.state.currentPayment;

        this.elements.summaryFinalBalanceAmount.textContent =
            "₹" + this.state.balanceAmount;

        this.elements.summaryTotalPaid.textContent =
            "₹" + this.state.totalPaid;

        this.elements.summaryMembershipFee.textContent =
            "₹" + this.state.membershipFeeUsed;

        if (this.state.donation > 0) {

            this.elements.summaryDonation.parentElement.style.display =
                "flex";

            this.elements.summaryDonation.textContent =
                "₹" + this.state.donation;

        } else {

            this.elements.summaryDonation.parentElement.style.display =
                "none";

            this.elements.summaryDonation.textContent =
                "₹0";

        }

        this.show(
            this.elements.finalPaymentSummary
        );

    },

    /*=====================================================
        PART - 4 CONTINUES
    =====================================================*/

        /*=====================================================
        RESET FORM
    =====================================================*/

    reset() {

        this.state.paymentOption = "";

        this.state.requiredFee =
            MEMBERSHIP_FEES.renewal;

        this.state.alreadyPaid = 0;

        this.state.currentPayment = 0;

        this.state.balanceAmount = 0;

        this.state.totalPaid = 0;

        this.state.donation = 0;

        this.elements.paymentOptions.forEach(option => {
            option.checked = false;
        });

        if (this.elements.membershipFee)
            this.elements.membershipFee.value = "";

        if (this.elements.transactionId)
            this.elements.transactionId.value = "";

        if (this.elements.paymentDate)
            this.elements.paymentDate.value = "";

        if (this.elements.paymentCompleted)
            this.elements.paymentCompleted.checked = false;

        if (this.elements.alreadyPaymentDate)
            this.elements.alreadyPaymentDate.value = "";

        if (this.elements.alreadyPaymentAmount)
            this.elements.alreadyPaymentAmount.value = "";

        if (this.elements.alreadyTransactionId)
            this.elements.alreadyTransactionId.value = "";

        if (this.elements.balancePaymentAmount)
            this.elements.balancePaymentAmount.value = "";

        if (this.elements.balancePaymentDate)
            this.elements.balancePaymentDate.value = "";

        if (this.elements.balanceTransactionId)
            this.elements.balanceTransactionId.value = "";

        if (this.elements.paymentReceipt)
            this.elements.paymentReceipt.value = "";

        if (this.elements.balancePaymentReceipt)
            this.elements.balancePaymentReceipt.value = "";

        this.initializeDefaults();

    },

/*=====================================================
        FORMAT AMOUNT
=====================================================*/

formatAmount(amount) {

    amount = Number(amount) || 0;

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    ).format(amount);

},

    /*=====================================================
        GET NUMBER
    =====================================================*/

    getNumber(element) {

        if (!element) return 0;

        return Number(element.value) || 0;

    },

    /*=====================================================
        SET TEXT
    =====================================================*/

    setText(element, value) {

        if (!element) return;

        element.textContent = value;

    },

    /*=====================================================
        ENABLE
    =====================================================*/

    enable(element) {

        if (!element) return;

        element.disabled = false;

    },

    /*=====================================================
        DISABLE
    =====================================================*/

    disable(element) {

        if (!element) return;

        element.disabled = true;

    },

    /*=====================================================
        TOGGLE
    =====================================================*/

    toggle(element, status) {

        if (!element) return;

        element.style.display =
            status ? "block" : "none";

    },

    /*=====================================================
        PART - 5 CONTINUES
    =====================================================*/

        /*=====================================================
        REGISTER EVENTS
    =====================================================*/

    registerDynamicEvents() {

        if (this.elements.alreadyPaymentAmount) {

            this.elements.alreadyPaymentAmount.addEventListener(
                "input",
                () => this.calculateAlreadyPaid()
            );

        }

        if (this.elements.membershipFee) {

            this.elements.membershipFee.addEventListener(
                "input",
                () => this.validateMembershipFee()
            );

        }

        if (this.elements.balancePaymentAmount) {

            this.elements.balancePaymentAmount.addEventListener(
                "input",
                () => this.calculateFinalPayment()
            );

        }

        if (this.elements.completePaymentButton) {

            this.elements.completePaymentButton.addEventListener(
                "click",
                () => this.openBalancePayment()
            );

        }

    },

    /*=====================================================
        VALIDATE REQUIRED FIELDS
    =====================================================*/

    validateRequiredFields() {

        if (this.state.paymentOption === "") {

            alert("Please select Payment Option.");

            return false;

        }

        if (this.state.paymentOption === "payNow") {

            if (!this.validateMembershipFee()) {

                return false;

            }

        }

        if (this.state.paymentOption === "alreadyPaid") {

            if (
                !this.elements.alreadyPaymentAmount.value
            ) {

                alert("Enter Already Paid Amount.");

                return false;

            }

        }

        return true;

    },

    /*=====================================================
        EXPORT PAYMENT DATA
    =====================================================*/

    getPaymentData() {

        return {

            membershipMode:
                this.state.membershipMode,

            paymentOption:
                this.state.paymentOption,

            requiredFee:
                this.state.requiredFee,

            alreadyPaid:
                this.state.alreadyPaid,

            currentPayment:
                this.state.currentPayment,

            totalPaid:
                this.state.totalPaid,

            membershipFeeUsed:
                this.state.requiredFee,

            donation:
                this.state.donation,

            balanceAmount:
                Math.max(
                    0,
                    this.state.requiredFee -
                    this.state.totalPaid
                ),

            transactionId:
                this.elements.transactionId
                    ? this.elements.transactionId.value
                    : "",

            paymentDate:
                this.elements.paymentDate
                    ? this.elements.paymentDate.value
                    : "",

            alreadyTransactionId:
                this.elements.alreadyTransactionId
                    ? this.elements.alreadyTransactionId.value
                    : "",

            alreadyPaymentDate:
                this.elements.alreadyPaymentDate
                    ? this.elements.alreadyPaymentDate.value
                    : "",

            balanceTransactionId:
                this.elements.balanceTransactionId
                    ? this.elements.balanceTransactionId.value
                    : "",

            balancePaymentDate:
                this.elements.balancePaymentDate
                    ? this.elements.balancePaymentDate.value
                    : ""

        };

    },

    /*=====================================================
        PART - 6 CONTINUES
    =====================================================*/

        /*=====================================================
        SAVE
    =====================================================*/

    save() {

        if (!this.validateRequiredFields()) {

            return false;

        }

        return this.getPaymentData();

    }

};

/*=========================================================
    INITIALIZE MODULE
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    PaymentModule.init();

    PaymentModule.registerDynamicEvents();

});

/*=========================================================
    GLOBAL FUNCTIONS
=========================================================*/

function updateMembershipMode(mode) {

    PaymentModule.state.membershipMode = mode;

    PaymentModule.updateMembershipFee();

}

function resetPaymentModule() {

    PaymentModule.reset();

}

function getPaymentModuleData() {

    return PaymentModule.getPaymentData();

}

function validatePaymentModule() {

    return PaymentModule.validateRequiredFields();

}

function savePaymentModule() {

    return PaymentModule.save();

}

function calculateAlreadyPaid() {

    PaymentModule.calculateAlreadyPaid();

}

function calculateFinalPayment() {

    PaymentModule.calculateFinalPayment();

}

function validateMembershipFee() {

    return PaymentModule.validateMembershipFee();

}

function openBalancePayment() {

    PaymentModule.openBalancePayment();

}

function togglePaymentCompleted() {

    PaymentModule.togglePaymentCompleted();

}

/*=========================================================
    END OF PAYMENT MODULE V3
=========================================================*/




    function showUpiSection() {
        if (upiPaymentSection) {
            upiPaymentSection.style.display = "block";
        }
        if (alreadyPaidSection) {
            alreadyPaidSection.style.display = "none";
        }
    }
    function showAlreadyPaidSection() {
        if (upiPaymentSection) {
            upiPaymentSection.style.display = "none";
        }
        if (alreadyPaidSection) {
            alreadyPaidSection.style.display = "block";
        }
    }
    /* =========================================================
       INPUT VALIDATIONS
    ========================================================= */
    function initializeValidations() {
        initializeMobileValidation();
        initializeAadhaarValidation();
    }
    /* =========================================================
       MOBILE VALIDATION
    ========================================================= */
    function initializeMobileValidation() {
        if (!mobile) {
            return;
        }
        mobile.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "");
            if (this.value.length > 10) {
                this.value = this.value.substring(0, 10);
            }
        });
    }
    /* =========================================================
       AADHAAR VALIDATION
    ========================================================= */
    function initializeAadhaarValidation() {
        if (!aadhaar) {
            return;
        }
        aadhaar.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "");
            if (this.value.length > 12) {
                this.value = this.value.substring(0, 12);
            }
        });
    }
    /* =========================================================
       COMMON UTILITIES
    ========================================================= */
    function showElement(element) {
        if (element) {
            element.style.display = "block";
        }
    }
    function hideElement(element) {
        if (element) {
            element.style.display = "none";
        }
    }
    function enableElement(element) {
        if (element) {
            element.disabled = false;
        }
    }
    function disableElement(element) {
        if (element) {
            element.disabled = true;
        }
    }
    function clearInput(element) {
        if (element) {
            element.value = "";
        }
    }
    function getValue(element) {
        if (!element) {
            return "";
        }
        return element.value.trim();
    }
    function setValue(element, value) {
        if (element) {
            element.value = value;
        }
    }
    /* =========================================================
       MESSAGE HELPERS
    ========================================================= */
    function showSuccess(message) {
        alert(message);
    }
    function showError(message) {
        alert(message);
    }
    /* =========================================================
       PART 2 END
    ========================================================= */


/* =========================================================
   FORM VALIDATION
========================================================= */

function validateMembershipForm(){

    const employeeName = document.getElementById("employeeName");
    const gender = document.getElementById("gender");
    const dob = document.getElementById("dob");

    const village = document.getElementById("village");
    const mandal = document.getElementById("mandal");
    const district = document.getElementById("district");
    const pincode = document.getElementById("pincode");
    const postOffice = document.getElementById("postOffice");

    const company = document.getElementById("company");
    const employeeId = document.getElementById("employeeId");

    const declaration = document.getElementById("declaration");

    if(employeeName && getValue(employeeName) === ""){
        showError("Please Enter Employee Name");
        employeeName.focus();
        return false;
    }

    if(gender && getValue(gender) === ""){
        showError("Please Select Gender");
        gender.focus();
        return false;
    }

    if(age && Number(age.value) < 15){
    showError("Membership is not allowed for members below 15 years of age.");
    dob.focus();
    return false;
}

    if(village && getValue(village) === ""){
        showError("Please Enter Village / Town / City");
        village.focus();
        return false;
    }

    if(mandal && getValue(mandal) === ""){
        showError("Please Enter Mandal");
        mandal.focus();
        return false;
    }

    if(district && getValue(district) === ""){
        showError("Please Select District");
        district.focus();
        return false;
    }

    if(pincode && getValue(pincode) === ""){
        showError("Please Enter PIN Code");
        pincode.focus();
        return false;
    }

    if(postOffice && getValue(postOffice) === ""){
        showError("Please Enter Post Office");
        postOffice.focus();
        return false;
    }

    if(mobile && mobile.value.length !== 10){
        showError("Please Enter Valid Mobile Number");
        mobile.focus();
        return false;
    }

    if(aadhaar && aadhaar.value.length !== 12){
        showError("Please Enter Valid Aadhaar Number");
        aadhaar.focus();
        return false;
    }

    if(company && getValue(company) === ""){
        showError("Please Select Company");
        company.focus();
        return false;
    }

    if(employeeId && getValue(employeeId) === ""){
        showError("Please Enter Employee ID");
        employeeId.focus();
        return false;
    }

    if(declaration && !declaration.checked){
        showError("Please Accept Declaration");
        declaration.focus();
        return false;
    }

    return true;

}
    /* =========================================================
       MEMBER DATA
    ========================================================= */
    function collectMembershipData() {
        return {
            membershipMode: membershipMode,
            fullName: getValue(document.getElementById("fullName")),
            fatherName: getValue(document.getElementById("fatherName")),
            gender: getValue(document.getElementById("gender")),
            dob: getValue(document.getElementById("dob")),
            mobile: getValue(document.getElementById("mobile")),
            email: getValue(document.getElementById("email")),
            aadhaar: getValue(document.getElementById("aadhaar")),
            company: getValue(document.getElementById("company")),
            circle: getValue(document.getElementById("circle")),
            division: getValue(document.getElementById("division")),
            subDivision: getValue(document.getElementById("subDivision")),
            section: getValue(document.getElementById("section")),
            employeeId: getValue(document.getElementById("employeeId")),
            designation: getValue(document.getElementById("designation")),
            joiningDate: getValue(document.getElementById("joiningDate")),
            regionalUnit: getValue(document.getElementById("regionalUnit")),
            membershipType: getValue(document.getElementById("membershipType")),
            transactionId: getValue(document.getElementById("transactionId")),
            createdDate: new Date().toISOString()
        };
    }

/* =========================================================
   FORM SUBMIT
========================================================= */

function initializeFormSubmit(){

    if(!submitMembershipBtn){
        return;
    }

    submitMembershipBtn.addEventListener("click",function(e){

        e.preventDefault();

        if(!validateMembershipForm()){
            return;
        }

        if(!validatePaymentDetails()){
            return;
        }

        const memberData=collectMembershipData();

        console.log("Membership Data");
        console.log(memberData);

        // Future Integration
        // saveToGoogleSheets(memberData);
        // uploadPhoto();
        // uploadReceipt();
        // generateMembershipId();

        showSuccess("Membership Details Collected Successfully.");

    });

}

document.addEventListener("DOMContentLoaded",function(){

    initializeFormSubmit();

});


    /* =========================================================
       RESET FORM
    ========================================================= */
    function resetMembershipForm() {
        const formElements = document.querySelectorAll("input,select,textarea");
        formElements.forEach(function (element) {
            if (element.type === "checkbox" || element.type === "radio") {
                element.checked = false;
            } else if (element.type !== "button" && element.type !== "submit") {
                element.value = "";
            }
        });
        if (photoPreview) {
            photoPreview.removeAttribute("src");
            photoPreview.style.display = "none";
        }
        hideElement(upiPaymentSection);
        hideElement(alreadyPaidSection);
    }
    /* =========================================================
       GOOGLE SHEETS PLACEHOLDER
    ========================================================= */
    function saveToGoogleSheets(data) {
        console.log("Google Sheets Integration Ready");
        console.log(data);
    }
    /* =========================================================
       STATISTICS PLACEHOLDER
    ========================================================= */
    function loadStatistics() {
        console.log("Statistics Module Ready");
    }



function initializePhotoModule(){
const photoInput=document.getElementById("memberPhoto");
const photoPreview=document.getElementById("photoPreview");
const photoFileName=document.getElementById("photoFileName");
const previewText=document.querySelector(".preview-text");
const takePhotoBtn=document.getElementById("takePhotoBtn");
if(!photoInput||!photoPreview||!photoFileName||!takePhotoBtn){
return;
}
photoInput.addEventListener("change",function(){
if(!this.files||this.files.length===0){
resetPhotoModule();
return;
}
const file=this.files[0];
const allowedTypes=["image/jpeg","image/png","image/webp"];
if(!allowedTypes.includes(file.type)){
alert("Please select JPG, PNG or WEBP image only.");
resetPhotoModule();
return;
}
if(file.size>4*1024*1024){
alert("Photo size should not exceed 4 MB.");
resetPhotoModule();
return;
}
photoFileName.value=file.name;
const reader=new FileReader();
reader.onload=function(e){
photoPreview.src=e.target.result;
photoPreview.style.display="block";
if(previewText){
previewText.style.display="none";
}
};
reader.readAsDataURL(file);
});

takePhotoBtn.addEventListener("click",function(){
const isMobile=/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
if(!isMobile){
alert("Take Photo works only on mobile devices. On desktop, please use Upload Photo to select an image.");
return;
}
photoInput.setAttribute("capture","environment");
photoInput.click();
});

function resetPhotoModule(){
photoInput.value="";
photoFileName.value="No file selected";
photoPreview.removeAttribute("src");
photoPreview.style.display="none";
if(previewText){
previewText.style.display="block";
}
}
}
/* =========================================================
   END OF FILE
========================================================= */
