/* =========================================================
   ARPEU DIGITAL MEMBERSHIP PORTAL
   FILE        : script.js
   VERSION     : 1.1 (Bug-Fix Pass)
   DEVELOPER   : P. Balakrishna
   DESCRIPTION : Core JavaScript Engine
========================================================= */

"use strict";

console.log("SCRIPT LOADED");



/* =========================================================
   FLATPICKR PRODUCTION HELPERS
========================================================= */

function ParseDate(str) {
    const invalid = new Date(NaN);
    if (!str || typeof str !== 'string' || str.trim() === "") return invalid;
    const match = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (!match) return invalid;
    const d = parseInt(match[1], 10), m = parseInt(match[2], 10), y = parseInt(match[3], 10);
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900) return invalid;
    const date = new Date(y, m - 1, d);
    return (date.getMonth() === m - 1 && date.getDate() === d) ? date : invalid;
}

function showError(message) {
    alert(message);
}

function PortalSync(selector, value, eventTypes = []) {
    const el = (typeof selector === 'string') ? document.querySelector(selector) : selector;
    if (!el) return;
    if (!value) {
        if (el._flatpickr) el._flatpickr.clear();
        else el.value = "";
    } else {
        if (el._flatpickr) {
            el._flatpickr.setDate(value, false);
        } else {
            el.value = value;
        }
    }
    const events = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
    events.forEach(type => el.dispatchEvent(new Event(type, { bubbles: true })));
}


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
    dob.addEventListener("change", function() {
        if (this.value === "") {
            age.value = "";
            return;
        }
        const birthDate = ParseDate(this.value);
        const today = new Date();
        
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        if (years < 15) {
            age.value = "";
            PortalSync(dob, "", "change");
            showError("Minimum 15 years age required for membership.");
            return;
        }

        // ఇక్కడ Years, Months, Days ఫార్మాట్ లో చూపిస్తున్నాను
        age.value = `${years}Y ${months}M ${days}D`;
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
        const birthDate=ParseDate(dob.value);
        const joinDate=ParseDate(joiningDate.value);
        const eligibleDate=new Date(birthDate);
        eligibleDate.setFullYear(eligibleDate.getFullYear()+15);
        if(joinDate<eligibleDate){
            showError("As per the Bharatiya Mazdoor Sangh (BMS) Bye-Laws and the Trade Unions Act, 1926, only persons who have completed 15 years of age are eligible for membership.");
            PortalSync(joiningDate, "", "change");
            joiningDate.focus();
        }
    });
}


/* =========================================================
   AADHAAR FORMATTING
   NOTE: This single handler owns the aadhaar field's "input"
   event (digit-only enforcement + 4-digit grouping + 12 digit
   cap). A second, separate validation handler used to be bound
   to the same event and fought with this one over the field's
   value on every keystroke - removed. See initializeValidations().
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

    // initializeValidations();

    initializeRenewalOtp();

    initializeAgeCalculation();
    initializeJoiningDateValidation();
    initializeAadhaarFormatting();
    initializePhotoPreview(); // ఇక్కడ పేరు సరిచేశాను
    initializeDatePickers();

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

    /* BUG-FIX: the payment engine object is named PaymentModuleV4,
       not PaymentModule. The old reference to "PaymentModule" was
       always undefined, so switching New Member <-> Renewal never
       reset the payment module state. Fixed to call the real
       object and its real reset method. */
    if (typeof PaymentModuleV4 !== "undefined") {

        PaymentModuleV4.reset();

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
   UI HELPERS
========================================================= */

function showElement(element) {
    if (!element) return;
    element.style.display = "";
}

function hideElement(element) {
    if (!element) return;
    element.style.display = "none";
}

function clearInput(element) {
    if (!element) return;
    element.value = "";
}

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



/* ==========================================================
   ARPEU PAYMENT MODULE V25 - Final Robust Logic
========================================================== */

/* ==========================================================
   ARPEU PAYMENT MODULE V25 - Final Robust Logic
========================================================== */

const PaymentModuleV25 = {
    currentTime24: { payNow: "", manual: "" },

    init() {
        this.cacheDOM();
        this.restrictDates();
        this.bindEvents();
    },

    cacheDOM() {
        this.dom = {
            payNowOpt: document.getElementById("payNowOption"),
            alreadyPaidOpt: document.getElementById("alreadyPaidOption"),
            payNowSec: document.getElementById("payNowSection"),
            alreadyPaidSec: document.getElementById("alreadyPaidSection"),
            finalSec: document.getElementById("finalSubmitSection"),
            
            // Time Elements
            pTimeDisp: document.getElementById("payNowTimeDisplay"),
            pTimeNative: document.getElementById("payNowTimeNative"),
            pFormat: document.getElementById("payNowTimeFormat"),
            mTimeDisp: document.getElementById("manualTimeDisplay"),
            mTimeNative: document.getElementById("manualTimeNative"),
            mFormat: document.getElementById("manualTimeFormat"),
            
            payNowAmt: document.getElementById("payNowAmount"),
            contBtn: document.getElementById("continueToPayBtn"),
            doneBtn: document.getElementById("payNowCompletedBtn"),
            manualAmt: document.getElementById("manualAmount"),
            payBalBtn: document.getElementById("payBalanceBtn"),
            manualFields: document.getElementById("manualFields"),
            utrFields: document.querySelectorAll(".utr-field"),
            allInputs: document.querySelectorAll(".final-val")
        };
    },

    formatTime(time24, format) {
        if (!time24) return "";
        let [hours, mins] = time24.split(':');
        hours = parseInt(hours);
        if (format === "24") return `${hours.toString().padStart(2, '0')}:${mins}`;
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours.toString().padStart(2, '0')}:${mins} ${ampm}`;
    },

    autoFillPayNowDT() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const dStr = `${day}-${month}-${year}`;
        
        const t24 = now.toTimeString().split(' ')[0].substring(0, 5);
        this.currentTime24.payNow = t24;
        
        PortalSync(document.getElementById("payNowDate"), dStr, ["input", "change"]);
        PortalSync(this.dom.pTimeNative, t24, "input");
        this.dom.pTimeDisp.value = this.formatTime(t24, this.dom.pFormat.value);
    },

    restrictDates() {
        const today = new Date();
        const pDate = document.getElementById("payNowDate");
        if (pDate) { PortalSync(pDate, today, ["input", "change"]); }
    },

    evaluateFinalSubmit() {
        const method = this.dom.payNowOpt.checked ? "payNow" : "alreadyPaid";
        let isValid = false;
        if (method === "payNow") {
            const time = this.dom.pTimeDisp.value;
            const id = document.getElementById("payNowTransactionId").value.trim();
            const file = document.getElementById("payNowReceipt").files.length > 0;
            if (time && id && file && document.getElementById("payNowStep3").style.display === "block") isValid = true;
        } else if (this.dom.alreadyPaidOpt.checked) {
            const date = document.getElementById("manualDate").value;
            const time = this.dom.mTimeDisp.value;
            const id = document.getElementById("manualTransactionId").value.trim();
            const file = document.getElementById("manualReceipt").files.length > 0;
            if (this.dom.manualFields.style.display === "block" && date && time && id && file) isValid = true;
        }
        this.dom.finalSec.style.display = isValid ? "block" : "none";
    },

    bindEvents() {
        this.dom.payNowOpt.addEventListener("click", () => { this.dom.payNowSec.style.display = "block"; this.dom.alreadyPaidSec.style.display = "none"; this.evaluateFinalSubmit(); });
        this.dom.alreadyPaidOpt.addEventListener("click", () => { this.dom.alreadyPaidSec.style.display = "block"; this.dom.payNowSec.style.display = "none"; this.evaluateFinalSubmit(); });

        // Time Picker Event Listeners
        this.dom.pTimeNative.addEventListener("input", (e) => {
            this.currentTime24.payNow = e.target.value;
            this.dom.pTimeDisp.value = this.formatTime(e.target.value, this.dom.pFormat.value);
            this.evaluateFinalSubmit();
        });

        this.dom.mTimeNative.addEventListener("input", (e) => {
            this.currentTime24.manual = e.target.value;
            this.dom.mTimeDisp.value = this.formatTime(e.target.value, this.dom.mFormat.value);
            this.evaluateFinalSubmit();
        });

        // Format Switchers
        this.dom.pFormat.addEventListener("change", () => {
            if (this.currentTime24.payNow) this.dom.pTimeDisp.value = this.formatTime(this.currentTime24.payNow, this.dom.pFormat.value);
        });

        this.dom.mFormat.addEventListener("change", () => {
            if (this.currentTime24.manual) this.dom.mTimeDisp.value = this.formatTime(this.currentTime24.manual, this.dom.mFormat.value);
        });

        this.dom.doneBtn.addEventListener("click", () => { document.getElementById("payNowStep3").style.display = "block"; this.autoFillPayNowDT(); this.evaluateFinalSubmit(); });
        this.dom.utrFields.forEach(el => { el.addEventListener("input", () => { el.value = el.value.replace(/[^a-zA-Z0-9]/g, ''); this.evaluateFinalSubmit(); }); });

        this.dom.payNowAmt.addEventListener("input", (e) => {
            let val = parseInt(e.target.value) || 0;
            this.updateUI(val, "payNow");
            document.getElementById("payNowBreakdown").style.display = val > 0 ? "block" : "none";
            this.dom.contBtn.style.display = (val >= 460) ? "flex" : "none";
            this.evaluateFinalSubmit();
        });

        this.dom.contBtn.addEventListener("click", () => {
            document.getElementById("payNowStep2").style.display = "block";
            document.getElementById("dynamicQR").src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=andhrarastrapowerempunion@sbi%26pn=ARPEU%26am=${this.dom.payNowAmt.value}%26cu=INR`;
        });

        this.dom.manualAmt.addEventListener("input", (e) => {
            let val = parseInt(e.target.value) || 0;
            this.updateUI(val, "manual");
            document.getElementById("manualBreakdown").style.display = val > 0 ? "block" : "none";
            if (val >= 460) { this.dom.payBalBtn.style.display = "none"; this.dom.manualFields.style.display = "block"; } 
            else if (val > 0) { this.dom.payBalBtn.style.display = "flex"; this.dom.manualFields.style.display = "none"; document.getElementById("balanceAmtDisp").innerText = "₹" + (460 - val); }
            this.evaluateFinalSubmit();
        });

        this.dom.payBalBtn.addEventListener("click", () => {
            let bal = 460 - (parseInt(this.dom.manualAmt.value) || 0);
            document.getElementById("inlineQR").src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=andhrarastrapowerempunion@sbi%26pn=ARPEU%26am=${bal}%26cu=INR`;
            document.getElementById("inlineBalanceBox").style.display = "block";
        });

        document.getElementById("inlinePaidDoneBtn").addEventListener("click", () => { document.getElementById("inlineBalanceBox").style.display = "none"; this.dom.manualFields.style.display = "block"; this.evaluateFinalSubmit(); });
        this.dom.allInputs.forEach(el => { el.addEventListener("change", () => this.evaluateFinalSubmit()); el.addEventListener("input", () => this.evaluateFinalSubmit()); });
    },

    updateUI(amt, prefix) {
        const required = 460;
        const total = document.getElementById(prefix + "Total");
        if (total) total.innerText = "₹" + amt;
        const balRow = document.getElementById(prefix + "BalRow");
        const donRow = document.getElementById(prefix + "DonRow");
        if (amt > 0 && amt < required) { if (balRow) balRow.style.display = "flex"; if (document.getElementById(prefix + "BalVal")) document.getElementById(prefix + "BalVal").innerText = "₹" + (required - amt); if (donRow) donRow.style.display = "none"; } 
        else if (amt > required) { if (balRow) balRow.style.display = "none"; if (donRow) donRow.style.display = "flex"; if (document.getElementById(prefix + "DonVal")) document.getElementById(prefix + "DonVal").innerText = "₹" + (amt - required); } 
        else { if (balRow) balRow.style.display = "none"; if (donRow) donRow.style.display = "none"; }
    }
};

document.addEventListener("DOMContentLoaded", () => PaymentModuleV25.init());


function initializeDatePickers() {
    const base = { disableMobile:true, allowInput:false, clickOpens:true, animate:true, position:"auto", static:false };

    // 1. Personal & Employment Dates
  // Personal & Employment Dates (DOB మరియు ఇతర తేదీలు)
    ["#dob", "#joiningDate"].forEach(id => {
        const el = document.querySelector(id);
        if (el) flatpickr(el, { 
            ...base, 
            dateFormat: "d-m-Y",
            position: "above", // ఎప్పుడూ పైకే ఓపెన్ అవుతుంది
            monthSelectorType: "dropdown", // నెలలు డ్రాప్‌డౌన్ లా వస్తాయి
            // ఇయర్ సెలెక్షన్ రేంజ్ పెంచుతున్నాను
            onReady: function(selectedDates, dateStr, instance) {
                const yearInput = instance.calendarContainer.querySelector(".numInput.cur-year");
                if (yearInput) {
                    yearInput.removeAttribute("readonly");
                }
            },
            onChange: () => el.dispatchEvent(new Event('change', {bubbles:true})) 
        });
    });

   // 1. Pay Now Date (ఈరోజు మాత్రమే మరియు పైకే ఓపెన్ అవ్వాలి)
    const payNowEl = document.querySelector("#payNowDate");
    if (payNowEl) {
        flatpickr(payNowEl, { 
            ...base, 
            dateFormat: "d-m-Y", 
            minDate: "today", 
            maxDate: "today", 
            position: "above", 
            onChange: () => {
                payNowEl.dispatchEvent(new Event('input', {bubbles:true}));
                payNowEl.dispatchEvent(new Event('change', {bubbles:true}));
            }
        });
    }

    // 2. Already Paid Date (గత తేదీలు మరియు ఈరోజు మాత్రమే)
    const manualDateEl = document.querySelector("#manualDate");
    if (manualDateEl) {
        flatpickr(manualDateEl, { 
            ...base, 
            dateFormat: "d-m-Y", 
            maxDate: "today", // రేపటి నుండి అన్నీ బ్లాక్ అవుతాయి
            onChange: () => {
                manualDateEl.dispatchEvent(new Event('input', {bubbles:true}));
                manualDateEl.dispatchEvent(new Event('change', {bubbles:true}));
            }
        });
    }

    // 3. Payment Times
    ["#payNowTimeNative", "#manualTimeNative"].forEach(id => {
        const el = document.querySelector(id);
        if (el) {
            const fp = flatpickr(el, { 
                ...base, 
                enableTime: true, 
                noCalendar: true, 
                dateFormat: "H:i",
                position: "above", // ఎప్పుడూ పైకే ఓపెన్ అవ్వడానికి
                onChange: () => el.dispatchEvent(new Event('input', {bubbles:true})) 
            });
            
            const formatSelector = id === "#payNowTimeNative" ? document.getElementById("payNowTimeFormat") : document.getElementById("manualTimeFormat");
            if (formatSelector) {
                formatSelector.addEventListener("change", () => {
                    const is24 = formatSelector.value === "24";
                    fp.set("time_24hr", is24);
                });
            }
        }
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
    initializeRenewalOtp();
    initializeAgeCalculation();
    initializeJoiningDateValidation();
    initializeAadhaarFormatting();
    initializePhotoPreview();
    initializeDatePickers();

    if (typeof PaymentModuleV25 !== 'undefined') {
        PaymentModuleV25.init();
        PaymentModuleV25.restrictDates();
    }


    if (submitMembershipBtn) {

    submitMembershipBtn.addEventListener("click", submitMembership);

    }

    showPage("home");
});




/* ============================================
   ARPEU Backend Configuration
============================================ */

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbz1zye0KwFFPnKELex9ZYK7796oopR6iF_R2nyNsLdxrUJ7EZAlJONyYsDBzWwTZ1aK/exec";

async function testBackendConnection() {

    try {

        const response = await fetch(BACKEND_URL);

        const result = await response.json();

        console.log(result);

        if (result.success) {
            alert("✅ Backend Connected Successfully");
        } else {
            alert("❌ Backend Connection Failed");
        }

    } catch (error) {

        console.error(error);

        alert("❌ Unable to connect to Backend");

    }

}

/* =========================================================
   SUBMIT MEMBERSHIP
========================================================= */

async function submitMembership() {

    const data = {

        fullName: document.getElementById("employeeName").value.trim(),

        mobile: document.getElementById("mobile").value.trim(),

        company: document.getElementById("company").value,

        stationCircle:
            document.getElementById("station").value ||
            document.getElementById("circle").value,

        divisionRegion:
            document.getElementById("division").value,

        subDivision:
            document.getElementById("subDivision").value,

        admissionFee: 100,

        annualSubscription: 360,

        donation: 0,

        paymentStatus: "Paid"

    };

    console.log("Sending Data :", data);

    try {

        const response = await fetch(BACKEND_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify({
                action: "saveMember",
                data: data
            })

        });

        const raw = await response.text();

        console.log("RAW RESPONSE:", raw);

        const result = JSON.parse(raw);

        console.log("PARSED RESPONSE:", result);

        if (result.success) {

            alert(
                "✅ Member Saved Successfully\n\nMembership ID : " +
                result.membershipId
            );

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error("FULL ERROR:", error);

        alert("❌ " + error);

    }

}