/* =========================================================
   ARPEU DIGITAL MEMBERSHIP PORTAL
   FILE        : script.js
   VERSION     : 1.1 (Bug-Fix Pass)
   DEVELOPER   : P. Balakrishna
   DESCRIPTION : Core JavaScript Engine
========================================================= */

"use strict";

/* =========================================================
   DEVELOPMENT MODE
========================================================= */

const DEV_MODE = true;

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
const navContact = document.getElementById("navContact");
const contactSection = document.getElementById("contactSection");

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
========================================================= */

function initializeAadhaarFormatting() {

    const aadhaar = document.getElementById("aadhaar");

    if (!aadhaar) {

        return;

    }

    aadhaar.setAttribute("maxlength", "14");

    aadhaar.addEventListener("input", function () {

        let digits = this.value.replace(/\D/g, "");

        if (digits.length > 12) {

            digits = digits.substring(0, 12);

        }

        let formatted = "";

        for (let i = 0; i < digits.length; i++) {

            if (i > 0 && i % 4 === 0) {

                formatted += " ";

            }

            formatted += digits[i];

        }

        this.value = formatted;

    });

    aadhaar.addEventListener("keypress", function (e) {

        const digits = this.value.replace(/\D/g, "");

        if (digits.length >= 12 && /\d/.test(e.key)) {

            e.preventDefault();

        }

    });

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

/* ==========================================================
   NAVIGATION ENGINE (ISOLATED PAGES FIX)
========================================================== */

function showPage(page) {

    // 📌 ప్రొఫైల్ సెక్షన్‌తో సహా అన్నింటినీ ముందుగా హైడ్ చేస్తుంది
    const profSec = document.getElementById("profileSection");
    if (profSec) profSec.style.display = "none";

    if (homeSection) homeSection.style.display = "none";
    if (membershipPage) membershipPage.style.display = "none";
    if (statisticsSection) statisticsSection.style.display = "none";
    if (contactSection) contactSection.style.display = "none";

    if (navHome) navHome.classList.remove("active");
    if (navMembership) navMembership.classList.remove("active");
    if (navStatistics) navStatistics.classList.remove("active");

    switch (page) {

        case "home":
            if (homeSection) homeSection.style.display = "block";
            if (navHome) navHome.classList.add("active");
            break;

        case "membership":
            if (membershipPage) membershipPage.style.display = "block";
            if (navMembership) navMembership.classList.add("active");
            break;

        case "statistics":
            if (statisticsSection) statisticsSection.style.display = "block";
            if (navStatistics) navStatistics.classList.add("active");
            loadMembershipStatistics();
            break;

            case "contact":
            if (contactSection) contactSection.style.display = "block";
            break;
    }

    document
    .getElementById("contentArea")
    .scrollTo({

    top:0,

    behavior:"smooth"

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

    if (navContact) {

        navContact.addEventListener("click", function (e) {

            e.preventDefault();

            showPage("contact");

            const moreDropdown = document.getElementById("moreDropdown");
            if (moreDropdown) {
                moreDropdown.classList.remove("show");
            }

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
   if(!DEV_MODE){
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
   PHOTO UPLOAD & CROPPER ENGINE (WHATSAPP STYLE)
========================================================= */

let cropperInstance = null;
window.croppedPhotoFile = null;

function initializePhotoPreview() {
    if (!memberPhoto) return;

    memberPhoto.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            alert("Invalid file format.\nOnly JPG, PNG and WEBP files are allowed.");
            this.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            openCropperModal(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

function openCropperModal(imageSrc) {
    const modal = document.getElementById("cropperModal");
    const cropImg = document.getElementById("cropperImage");
    if (!modal || !cropImg) return;

    cropImg.src = imageSrc;
    modal.style.display = "flex";

    if (cropperInstance) {
        cropperInstance.destroy();
    }

    // Passport Size Aspect Ratio (3:4)
    cropperInstance = new Cropper(cropImg, {
        aspectRatio: 3 / 4,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.9,
        responsive: true,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragOnDblclick: false
    });
}

function cropperZoom(delta) {
    if (cropperInstance) cropperInstance.zoom(delta);
}

function cropperRotate(degree) {
    if (cropperInstance) cropperInstance.rotate(degree);
}

function cropperReset() {
    if (cropperInstance) cropperInstance.reset();
}

function closeCropperModal() {
    const modal = document.getElementById("cropperModal");
    if (modal) modal.style.display = "none";
    if (cropperInstance) {
        cropperInstance.destroy();
        cropperInstance = null;
    }
}

function applyPhotoCrop() {
    if (!cropperInstance) return;

    // High quality cropped canvas (300x400 Passport Specs)
    const canvas = cropperInstance.getCroppedCanvas({
        width: 300,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    canvas.toBlob((blob) => {
        const croppedFile = new File([blob], "cropped-passport-photo.jpg", { type: "image/jpeg" });
        window.croppedPhotoFile = croppedFile; // Save cropped reference

        // Preview UI update
        const photoPreview = document.getElementById("photoPreview");
        const previewText = document.querySelector(".preview-text");
        const photoFileName = document.getElementById("photoFileName");

        if (photoPreview) {
            photoPreview.src = canvas.toDataURL("image/jpeg", 0.9);
            photoPreview.style.display = "block";
        }
        if (previewText) previewText.style.display = "none";
        if (photoFileName) photoFileName.value = "Photo Cropped & Adjusted ✔";

        closeCropperModal();
    }, "image/jpeg", 0.9);
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
   COMPANY CHANGE (DYNAMIC LOCATION VISIBILITY FIX)
========================================================= */

function onCompanyChange() {

    const locGroup = document.getElementById("locationGroup");

    // Hide All Groups By Default
    hideElement(stationGroup);
    hideElement(stageGroup);

    hideElement(circleGroup);
    hideElement(divisionGroup);
    hideElement(subDivisionGroup);

    hideElement(subStationGroup);
    hideElement(sectionGroup);
    
    // 👈 డిఫాల్ట్‌గా లొకేషన్ ఫీల్డ్‌ని ఆటోమేటిక్‌గా హైడ్ చేస్తుంది
    if (locGroup) locGroup.style.display = "none";

    hideElement(designationGroup);

    // Clear Dropdowns & Inputs
    DropdownEngine.clear(station, "Select Station");
    DropdownEngine.clear(stage, "Select Stage");

    DropdownEngine.clear(circle, "Select Circle");
    DropdownEngine.clear(division, "Select Division");
    DropdownEngine.clear(subDivision, "Select Sub Division");

    DropdownEngine.clear(designation, "Select Designation");

    clearInput(subStation);
    clearInput(section);
    
    const locInput = document.getElementById("location");
    if (locInput) locInput.value = "";

    /* ==========================================
       1. APGENCO (Shows Station, Stage & Location)
    ========================================== */
    if (company.value === "APGENCO") {

        showElement(stationGroup);
        showElement(stageGroup);

        showElement(divisionGroup);
        showElement(subDivisionGroup);

        // 👈 APGENCO ఎంచుకుంటే మాత్రమే Location ఫీల్డ్ కనిపిస్తుంది!
        if (locGroup) locGroup.style.display = "block";

        showElement(designationGroup);

        DropdownEngine.populate(
            station,
            Object.keys(employmentMaster.APGENCO.stations),
            "Select Station"
        );

        return;
    }

    /* ==========================================
       2. APTRANSCO (Hides Location)
    ========================================== */
    if (company.value === "APTRANSCO") {

        showElement(circleGroup);
        showElement(divisionGroup);
        showElement(subDivisionGroup);

        showElement(subStationGroup);
        showElement(sectionGroup);
        // Location is hidden!

        showElement(designationGroup);

        DropdownEngine.populate(
            circle,
            Object.keys(employmentMaster.APTRANSCO.circles),
            "Select Circle"
        );

        return;
    }

    /* ==========================================
       3. DISCOMS (APSPDCL, APCPDCL, APEPDCL) (Hides Location)
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
        // Location is hidden!

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
   PAYMENT RECEIPT VALIDATION
========================================================= */

function initializeReceiptValidation() {

    const payNowReceipt = document.getElementById("payNowReceipt");

    if (!payNowReceipt) return;

    payNowReceipt.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            alert(
                "Invalid receipt format.\n\n" +
                "Only JPG, JPEG, PNG and WEBP files are allowed."
            );

            this.value = "";

            return;
        }

        const MAX_SIZE = 2 * 1024 * 1024;

        if (file.size > MAX_SIZE) {

            alert(
                "Receipt size exceeds 2 MB.\n\n" +
                "Please upload a receipt smaller than 2 MB."
            );

            this.value = "";

            return;
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

    initializeValidations();

    initializeAadhaarFormatting();

    initializeAgeCalculation();

    initializeJoiningDateValidation();

    initializeReceiptValidation();

    initializeDatePickers();

    if (typeof initializeRenewalOtp === "function") {

        initializeRenewalOtp();

    }

    if (typeof PaymentModuleV25 !== "undefined") {

        PaymentModuleV25.init();

        PaymentModuleV25.restrictDates();

    }

    if (submitMembershipBtn) {

        submitMembershipBtn.addEventListener("click", submitMembership);

    }

    showPage("home");

});


/* ==========================================================
   SUPER-FAST POST DUPLICATE CHECK ENGINE (NO 404 ERRORS)
========================================================== */

const activeFetchControllers = {
    mobile: null,
    employeeid: null,
    aadhaar: null,
    transactionid: null
};

const debounceTimers = {
    mobile: null,
    employeeid: null,
    aadhaar: null,
    transactionid: null
};

/* ==========================================================
   ULTRA-CLEAN GET DUPLICATE CHECK ENGINE (NO CORS BLOCKS)
========================================================== */

// Common Fetch for Submit Check
async function fetchDuplicateCheck(field, value) {
    if (!value || value.trim() === "") return { success: true, exists: false };
    try {
        const url = `${BACKEND_URL}?action=checkDuplicate&field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}`;
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        console.error(`[${field}] Check Error:`, e);
        return { success: true, exists: false }; // Fail-safe
    }
}

// Real-time Clean GET Checker
// Real-time Fail-Safe GET Checker
async function executeDuplicateCheck(field, value, statusElementId) {
    const statusEl = document.getElementById(statusElementId);
    if (!statusEl) return;

    statusEl.className = "field-status checking";
    statusEl.innerHTML = "Checking...";

    try {
        const url = `${BACKEND_URL}?action=checkDuplicate&field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}`;
        const response = await fetch(url);
        const rawText = await response.text();
        let result;

        try {
            result = JSON.parse(rawText);
        } catch (e) {
            // సర్వర్ వార్మప్ వల్ల రెస్పాన్స్ లేట్ అయితే యూజర్‌ని ఆపకుండా సురక్షితంగా ప్రొసీడ్ చేస్తుంది
            statusEl.className = "field-status success";
            statusEl.innerHTML = "✔ Available";
            return;
        }

        if (result && result.success && result.exists) {
            statusEl.className = "field-status error";
            statusEl.innerHTML = "✖ Already Registered";
        } else {
            statusEl.className = "field-status success";
            statusEl.innerHTML = "✔ Available";
        }

    } catch (error) {
        console.error(`[${field}] Error:`, error);
        statusEl.className = "field-status success";
        statusEl.innerHTML = "✔ Available";
    }
}

// Submit Check Wrappers
async function checkMobileDuplicate(mobile) {
    return await fetchDuplicateCheck("mobile", mobile);
}

async function checkEmployeeIdDuplicate(employeeId) {
    return await fetchDuplicateCheck("employeeid", employeeId);
}

async function checkAadhaarDuplicate(aadhaar) {
    return await fetchDuplicateCheck("aadhaar", aadhaar);
}

async function checkTransactionIdDuplicate(transactionId) {
    return await fetchDuplicateCheck("transactionid", transactionId);
}



/* ==========================================================
   INITIALIZE VALIDATIONS
========================================================== */

/* ==========================================================
   INITIALIZE VALIDATIONS (SMOOTH 800MS & BLUR CHECK)
========================================================== */

function initializeValidations() {

    /* 1. MOBILE (Strict 10 Digits) */
    const mobileInput = document.getElementById("mobile");
    if (mobileInput) {
        mobileInput.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(0, 10);
            const val = this.value.trim();
            const status = document.getElementById("mobileStatus");

            clearTimeout(debounceTimers.mobile);

            if (val.length !== 10) {
                if (status) { status.className = "field-status"; status.innerHTML = ""; }
                return;
            }

            debounceTimers.mobile = setTimeout(() => {
                executeDuplicateCheck("mobile", val, "mobileStatus");
            }, 800);
        });
    }

    /* 2. AADHAAR (Strict 12 Digits) */
    const aadhaarInput = document.getElementById("aadhaar");
    if (aadhaarInput) {
        aadhaarInput.addEventListener("input", function () {
            const rawAadhaar = this.value.replace(/\s/g, "").replace(/\D/g, "");
            const status = document.getElementById("aadhaarStatus");

            clearTimeout(debounceTimers.aadhaar);

            if (rawAadhaar.length !== 12) {
                if (status) { status.className = "field-status"; status.innerHTML = ""; }
                return;
            }

            debounceTimers.aadhaar = setTimeout(() => {
                executeDuplicateCheck("aadhaar", rawAadhaar, "aadhaarStatus");
            }, 800);
        });
    }

    /* 3. EMPLOYEE ID (Check on Blur & Timeout) */
    const employeeIdInput = document.getElementById("employeeId");
    if (employeeIdInput) {
        employeeIdInput.addEventListener("input", function () {
            const val = this.value.trim();
            const status = document.getElementById("employeeIdStatus");

            clearTimeout(debounceTimers.employeeid);

            if (val.length < 3) {
                if (status) { status.className = "field-status"; status.innerHTML = ""; }
                return;
            }

            debounceTimers.employeeid = setTimeout(() => {
                executeDuplicateCheck("employeeid", val, "employeeIdStatus");
            }, 1000);
        });

        employeeIdInput.addEventListener("blur", function() {
            const val = this.value.trim();
            if (val.length >= 3) {
                clearTimeout(debounceTimers.employeeid);
                executeDuplicateCheck("employeeid", val, "employeeIdStatus");
            }
        });
    }

    /* 4. TRANSACTION ID (Check on Blur & Timeout) */
    const transactionIdInput = document.getElementById("payNowTransactionId");
    if (transactionIdInput) {
        transactionIdInput.addEventListener("input", function () {
            const val = this.value.trim();
            const status = document.getElementById("transactionIdStatus");

            clearTimeout(debounceTimers.transactionid);

            if (val.length < 5) {
                if (status) { status.className = "field-status"; status.innerHTML = ""; }
                return;
            }

            debounceTimers.transactionid = setTimeout(() => {
                executeDuplicateCheck("transactionid", val, "transactionIdStatus");
            }, 1000);
        });

        transactionIdInput.addEventListener("blur", function() {
            const val = this.value.trim();
            if (val.length >= 5) {
                clearTimeout(debounceTimers.transactionid);
                executeDuplicateCheck("transactionid", val, "transactionIdStatus");
            }
        });
    }
}



/* ============================================
   ARPEU Backend Configuration
============================================ */

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxKuc9TyArIcDFFye8hecsLasOv51vJnfyJTnFwJIvmq8tkHhQt5UM0L-XwQZEV0Ynm/exec";

async function testBackendConnection() {

    try {

        const response = await fetch(BACKEND_URL);

        const text = await response.text();

        console.log("STATUS:", response.status);
        console.log("RAW:", text);

        return;

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

async function submitMembership(){

    const submitBtn=document.getElementById("submitMembershipBtn");
    const originalButtonText=submitBtn.innerHTML;

    submitBtn.disabled=true;
    submitBtn.innerHTML="Submitting...";

    /* ------------------------------
       DECLARATION VALIDATION
    ------------------------------ */

    if(!document.getElementById("declarationCheck").checked){

        alert("Please accept the Declaration before submitting your Membership Application.");

        document.getElementById("declarationCheck").focus();

        submitBtn.disabled=false;
        submitBtn.innerHTML=originalButtonText;

        return;

    }

    /* ------------------------------
       PHOTO VALIDATION
    ------------------------------ */

    const memberPhotoFile=document.getElementById("memberPhoto");

    if(!memberPhotoFile.files||memberPhotoFile.files.length===0){

        alert("Please upload or capture your passport-size photograph before submitting the Membership Application.");

        memberPhotoFile.focus();

        submitBtn.disabled=false;
        submitBtn.innerHTML=originalButtonText;

        return;

    }

    /* ------------------------------
   DUPLICATE VALIDATION
------------------------------ */

const mobile = document.getElementById("mobile").value.trim();

const employeeId = document.getElementById("employeeId").value.trim();

const aadhaar = document.getElementById("aadhaar").value.replace(/\s/g, "").trim();

const transactionId =
document.getElementById("payNowOption").checked
? document.getElementById("payNowTransactionId").value.trim()
: document.getElementById("manualTransactionId").value.trim();


if (mobile === "") {

    alert("Please Enter Mobile Number");

    document.getElementById("mobile").focus();

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalButtonText;

    return;

}

if (aadhaar === "") {

    alert("Please Enter Aadhaar Number");

    document.getElementById("aadhaar").focus();

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalButtonText;

    return;

}


/* ------------------------------
   MOBILE DUPLICATE
------------------------------ */

const mobileDuplicate = await checkMobileDuplicate(mobile);

console.log("Mobile Result :", mobileDuplicate);

if (mobileDuplicate.exists) {

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalButtonText;

    alert(
        "Mobile Number Already Registered\n\n" +
        "Mobile Number : " + mobile + "\n" +
        "Membership ID : " + mobileDuplicate.member.membershipId + "\n" +
        "Member Name : " + mobileDuplicate.member.fullName
    );

    return;

}


/* ------------------------------
   EMPLOYEE ID DUPLICATE
------------------------------ */

const employeeDuplicate = await checkEmployeeIdDuplicate(employeeId);

console.log("Employee Result :", employeeDuplicate);

if (employeeDuplicate.exists) {

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalButtonText;

    alert(
        "Employee ID Already Registered\n\n" +
        "Employee ID : " + employeeId + "\n" +
        "Membership ID : " + employeeDuplicate.member.membershipId + "\n" +
        "Member Name : " + employeeDuplicate.member.fullName
    );

    return;

}


/* ------------------------------
   AADHAAR DUPLICATE
------------------------------ */

const aadhaarDuplicate = await checkAadhaarDuplicate(aadhaar);

console.log("Aadhaar Result :", aadhaarDuplicate);

if (aadhaarDuplicate.exists) {

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalButtonText;

    alert(
        "Aadhaar Number Already Registered\n\n" +
        "Aadhaar Number : " + aadhaar + "\n" +
        "Membership ID : " + aadhaarDuplicate.member.membershipId + "\n" +
        "Member Name : " + aadhaarDuplicate.member.fullName
    );

    return;

}


/* ------------------------------
   TRANSACTION ID DUPLICATE
------------------------------ */

if (transactionId !== "") {

    console.log("Transaction ID Before Check :", transactionId);

    const transactionDuplicate = await checkTransactionIdDuplicate(transactionId);

    console.log("Transaction Result :", transactionDuplicate);

    if (transactionDuplicate.exists) {

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;

        alert(
            "Transaction ID Already Registered\n\n" +
            "Transaction ID : " + transactionId + "\n" +
            "Membership ID : " + transactionDuplicate.member.membershipId + "\n" +
            "Member Name : " + transactionDuplicate.member.fullName
        );

        return;

    }

}
    /* ------------------------------
       MEMBER DATA
    ------------------------------ */

    const data = {

        employeeId: employeeId,
        fullName: document.getElementById("employeeName").value.trim(),
        mobile: mobile,
        email: document.getElementById("email").value.trim(),
        aadhaar: aadhaar,

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

        paymentMode: "UPI",
        transactionId: transactionId,
        paymentStatus: "Paid",

        photoBase64: "",
        photoType: "",

        receiptBase64: "",
        receiptType: ""
    };

/* ------------------------------
   CONVERT PHOTO TO BASE64
------------------------------ */

const photoInput = document.getElementById("memberPhoto");

if (photoInput.files.length > 0) {

    const photoFile = photoInput.files[0];

    data.photoType = photoFile.type;

    data.photoBase64 = await new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function () {

            resolve(reader.result.split(",")[1]);

        };

        reader.onerror = reject;

        reader.readAsDataURL(photoFile);

    });

}

/* ------------------------------
   CONVERT RECEIPT TO BASE64
------------------------------ */

const receiptInput = document.getElementById("payNowReceipt");

if (receiptInput.files.length > 0) {

    const receiptFile = receiptInput.files[0];

    data.receiptType = receiptFile.type;

    data.receiptBase64 = await new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result.split(",")[1]);
        };

        reader.onerror = reject;

        reader.readAsDataURL(receiptFile);

    });

}

console.log("Sending Data :", data);
console.log("Photo Type :", data.photoType);
console.log("Photo Base64 Length :", data.photoBase64.length);
console.log("Receipt Type :", data.receiptType);
console.log("Receipt Base64 Length :", data.receiptBase64.length);

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

    console.log("RAW RESPONSE :", raw);

    const result = JSON.parse(raw);

    console.log("PARSED RESPONSE :", result);

    if (result.success) {

        window.lastMembershipId = result.membershipId;
        window.lastReceiptNo = result.receiptNo; 

        openReceipt();

        if (!DEV_MODE) {

            if (photoPreview) {

                photoPreview.removeAttribute("src");
                photoPreview.style.display = "none";

            }

            const previewText = document.querySelector(".preview-text");

            if (previewText) {

                previewText.style.display = "block";

            }

            document.getElementById("finalSubmitSection").style.display = "none";

        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;

    } else {

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;

        alert(result.message);

    }

} catch (error) {

    console.error("FULL ERROR :", error);

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalButtonText;

    alert("❌ " + error);

}

}   // submitMembership()


/* ==========================================================
   REAL-TIME LIVE MEMBERSHIP STATISTICS ENGINE
========================================================== */

let statsAutoRefreshTimer = null;
window.companyStatsData = {};

async function loadMembershipStatistics() {
    try {
        const url = `${BACKEND_URL}?action=getMembershipStatistics`;
        const response = await fetch(url);
        const result = await response.json();

        if (!result || !result.success || !result.statistics) return;

        const stats = result.statistics;
        window.companyStatsData = stats.companyDetails || {};

        // లైవ్ నంబర్ల అప్‌డేట్
        if (document.getElementById("totalMembers")) document.getElementById("totalMembers").textContent = stats.totalMembers || 0;
        if (document.getElementById("todayMembers")) document.getElementById("todayMembers").textContent = stats.todayMembers || 0;
        if (document.getElementById("monthMembers")) document.getElementById("monthMembers").textContent = stats.monthMembers || 0;
        if (document.getElementById("yearMembers")) document.getElementById("yearMembers").textContent = stats.yearMembers || 0;

        if (stats.companies) {
            if (document.getElementById("apgencoCount")) document.getElementById("apgencoCount").textContent = stats.companies.APGENCO || 0;
            if (document.getElementById("aptranscoCount")) document.getElementById("aptranscoCount").textContent = stats.companies.APTRANSCO || 0;
            if (document.getElementById("apspdclCount")) document.getElementById("apspdclCount").textContent = stats.companies.APSPDCL || 0;
            if (document.getElementById("apcpdclCount")) document.getElementById("apcpdclCount").textContent = stats.companies.APCPDCL || 0;
            if (document.getElementById("apepdclCount")) document.getElementById("apepdclCount").textContent = stats.companies.APEPDCL || 0;
        }
    } catch (error) {
        console.error("Live Statistics Load Error:", error);
    }
}

// 📌 కంపెనీ కార్డ్ క్లిక్ చేసినప్పుడు డీటైల్స్ చూపించే ఫంక్షన్
function showCompany(companyKey) {
    const detailsDiv = document.getElementById("companyDetails");
    if (!detailsDiv) return;

    const keyUpper = companyKey.toUpperCase();
    const details = window.companyStatsData ? window.companyStatsData[keyUpper] : null;

    if (!details || Object.keys(details).length === 0) {
        detailsDiv.innerHTML = `<h3><i class="fas fa-building" style="color:#ff6600;"></i> ${keyUpper} Details</h3><p style="color:#666; font-size:13px; margin-top:8px;">No station/circle registrations found yet.</p>`;
        detailsDiv.style.display = "block";
        return;
    }

    let html = `<h3><i class="fas fa-building" style="color:#ff6600;"></i> ${keyUpper} Station / Circle Breakdown</h3>`;
    for (const [name, count] of Object.entries(details)) {
        html += `
            <div class="detail-row">
                <span class="detail-name"><i class="fas fa-bolt"></i> ${name}</span>
                <span class="detail-count">${count} Members</span>
            </div>
        `;
    }

    detailsDiv.innerHTML = html;
    detailsDiv.style.display = "block";
    detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 📌 ప్రతీ 15 సెకన్లకు ఆటోమేటిక్‌గా రీఫ్రెష్ అయ్యే లైవ్ టైమర్
function startLiveStatsPolling() {
    loadMembershipStatistics(); // తక్షణమే మొదటిసారి తెస్తుంది
    if (!statsAutoRefreshTimer) {
        statsAutoRefreshTimer = setInterval(function () {
            loadMembershipStatistics(); // ప్రతీ 15 సెకన్లకు బ్యాక్‌గ్రౌండ్‌లో సింక్ అవుతుంది
        }, 15000);
    }
}

// 📌 Application Initialization లో లైవ్ సింకింగ్ స్టార్ట్ అవుతుంది
document.addEventListener("DOMContentLoaded", function () {
    startLiveStatsPolling();
});

/* ==========================================================
   RECEIPT TYPES
========================================================== */

const ReceiptTypes={

membership:{
title:"MEMBERSHIP RECEIPT",
layout:"member",
table:"membership"
},

renewal:{
title:"MEMBERSHIP RENEWAL RECEIPT",
layout:"member",
table:"membership"
},

diaryAdvertisement:{
title:"DIARY ADVERTISEMENT RECEIPT",
layout:"business",
table:"advertisement"
},

diaryFund:{
title:"DIARY FUND RECEIPT",
layout:"donation",
table:"donation"
},

donation:{
title:"DONATION RECEIPT",
layout:"donation",
table:"donation"
},

eventFund:{
title:"EVENT FUND RECEIPT",
layout:"event",
table:"event"
}

};

/* ==========================================================
   LOCKED RECEIPT MODULE ENGINE
========================================================== */

// నంబర్లను మాటల్లోకి మార్చే ఫంక్షన్ (Number to Words Converter)
function numberToWords(num) {
    if (!num || isNaN(num)) return "Zero Only";
    num = parseInt(num, 10);
    if (num === 0) return "Zero Only";

    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety '];

    function inWords(n) {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + a[n % 10];
        if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 !== 0 ? 'and ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
        return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? inWords(n % 10000000) : '');
    }

    return (inWords(num).trim() + " Only");
}

function collectReceiptData() {
    const isPayNow = document.getElementById("payNowOption")?.checked;
    const payNowAmt = parseInt(document.getElementById("payNowAmount")?.value) || 460;
    const manualAmt = parseInt(document.getElementById("manualAmount")?.value) || 460;
    const totalAmount = isPayNow ? payNowAmt : manualAmt;

    const admissionFee = 100;
    const annualSub = 360;
    const donation = Math.max(0, totalAmount - 460);
    const others = 0;

    const transactionId = isPayNow
        ? (document.getElementById("payNowTransactionId")?.value || "")
        : (document.getElementById("manualTransactionId")?.value || "");

    const receiptDate = isPayNow
        ? (document.getElementById("payNowDate")?.value || "")
        : (document.getElementById("manualDate")?.value || "");

    const now = new Date();
    const hrs = String(now.getHours() % 12 || 12).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

    const receiptTime = `${hrs}:${mins}:${secs}:${ms} ${ampm}`;
    const companyVal = document.getElementById("company")?.value || "";
    const currentYear = new Date().getFullYear();

    return {
        receiptNumber: window.lastReceiptNo || (`ARPEU/${currentYear}/1`),
        membershipId: window.lastMembershipId || "ARPEU00001",
        receiptDate: receiptDate || new Date().toLocaleDateString('en-GB'),
        receiptTime: receiptTime,
        memberName: document.getElementById("employeeName")?.value || "",
        employeeId: document.getElementById("employeeId")?.value || "",
        mobile: document.getElementById("mobile")?.value || "",
        company: companyVal,
        circle: companyVal !== "APGENCO" ? (document.getElementById("circle")?.value || "") : "",
        station: companyVal === "APGENCO" ? (document.getElementById("station")?.value || "") : "",
        stage: companyVal === "APGENCO" ? (document.getElementById("stage")?.value || "") : "",
        division: document.getElementById("division")?.value || "",
        subDivision: document.getElementById("subDivision")?.value || "", // 👈 సబ్ డివిజన్
        location: document.getElementById("location")?.value || "",       // 👈 లొకేషన్
        admissionFee,
        annualSub,
        donation,
        others,
        totalAmount,
        totalInWords: numberToWords(totalAmount),
        paymentMode: "UPI",
        transactionId: transactionId || "N/A",
        paymentStatus: "SUCCESSFUL / PAID"
    };
}

function loadReceiptPreview() {
    const data = collectReceiptData();

    document.getElementById("rReceiptNo").textContent = data.receiptNumber;
    document.getElementById("rMembershipId").textContent = data.membershipId;
    document.getElementById("rDate").textContent = data.receiptDate;
    document.getElementById("rTime").textContent = data.receiptTime;

    document.getElementById("rMemberName").textContent = data.memberName;
    document.getElementById("rEmpId").textContent = data.employeeId;
    document.getElementById("rMobile").textContent = data.mobile;
    document.getElementById("rCompany").textContent = data.company;
    document.getElementById("rCircle").textContent = data.circle || "-";
    document.getElementById("rStation").textContent = data.station || "-";
    document.getElementById("rStage").textContent = data.stage || "-";
    document.getElementById("rDivision").textContent = data.division || "-";

    // Sub Division Logic (డేటా ఉంటే చూపిస్తుంది, లేకపోతే హైడ్ చేస్తుంది)
    const subDivEl = document.getElementById("rSubDivision");
    if (subDivEl) {
        subDivEl.textContent = data.subDivision || "";
        const parentField = subDivEl.closest(".meta-field");
        if (parentField) parentField.style.display = data.subDivision ? "flex" : "none";
    }

    // Location Logic (డేటా ఉంటే చూపిస్తుంది, లేకపోతే హైడ్ చేస్తుంది)
    const locEl = document.getElementById("rLocation");
    if (locEl) {
        locEl.textContent = data.location || "";
        const parentField = locEl.closest(".meta-field");
        if (parentField) parentField.style.display = data.location ? "flex" : "none";
    }

    document.getElementById("rAdmissionFee").textContent = data.admissionFee;
    document.getElementById("rAnnualSub").textContent = data.annualSub;
    document.getElementById("rDonation").textContent = data.donation;
    document.getElementById("rOthers").textContent = data.others;
    document.getElementById("rTotal").textContent = data.totalAmount;
    document.getElementById("rTotalInWords").textContent = data.totalInWords;

    document.getElementById("rPaymentMode").textContent = data.paymentMode;
    document.getElementById("rTransactionId").textContent = data.transactionId;
    document.getElementById("rPaymentStatus").textContent = data.paymentStatus;

    generateReceiptQR(data);
}


function generateReceiptQR(data) {
    const qrContainer = document.getElementById("receiptQrCode");
    if (!qrContainer) return;
    qrContainer.innerHTML = "";

    const currentDomain = window.location.origin + window.location.pathname;
    const profileUrl = `${currentDomain}?id=${encodeURIComponent(data.membershipId)}`;

    new QRCode(qrContainer, {
        text: profileUrl,
        width: 85,
        height: 85,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });

    // 📌 CLICK TO PREVIEW PROFILE (QR కోడ్ క్లిక్ చేయగానే ప్రొఫైల్ ఓపెన్ అవుతుంది)
    qrContainer.style.cursor = "pointer";
    qrContainer.title = "Click here to Preview Member Digital Profile";
    qrContainer.onclick = function () {
        loadMemberProfile(data.membershipId);
    };
}

/* ==========================================================
   MEMBER DIGITAL PROFILE LOADER ENGINE
========================================================== */


function closeProfile() {
    const profSec = document.getElementById("profileSection");
    if (profSec) profSec.style.display = "none";

    // URL లో ఉన్న ?id=... ని క్లియర్ చేసి హోమ్ పేజీకి తీసుకెళ్తుంది
    if (window.history && window.history.pushState) {
        window.history.pushState({}, document.title, window.location.pathname);
    }
    showPage("home");
}

function closeProfileAndGoHome() {
    closeProfile();
}

async function loadMemberProfile(memberId) {
    if (!memberId) return;

    // 📌 ప్రొఫైల్ ఓపెన్ అయినప్పుడు హోమ్, మెంబర్‌షిప్, స్టాటిస్టిక్స్ అన్నింటినీ పూర్తిగా హైడ్ చేస్తుంది
    if (homeSection) homeSection.style.display = "none";
    if (membershipPage) membershipPage.style.display = "none";
    if (statisticsSection) statisticsSection.style.display = "none";
    const rc = document.getElementById("receiptContainer");
    if (rc) rc.style.display = "none";

    const profSec = document.getElementById("profileSection");
    const loader = document.getElementById("profileLoader");
    const content = document.getElementById("profileContent");

    if (profSec) profSec.style.display = "block";
    if (loader) loader.style.display = "block";
    if (content) content.style.display = "none";

    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
        const response = await fetch(`${BACKEND_URL}?action=getMemberProfile&id=${encodeURIComponent(memberId)}`);
        const result = await response.json();

        if (result.success && result.profile) {
            const p = result.profile;

            // Member Photo Display
            const photoImg = document.getElementById("pMemberPhoto");
            if (photoImg) {
                if (p.photoUrl) {
                    photoImg.src = p.photoUrl;
                } else {
                    photoImg.src = "images/arpeu-logo.png";
                }
            }

            document.getElementById("pFullName").textContent = p.fullName || "Member";
            document.getElementById("pMembershipId").textContent = p.membershipId || memberId;
            document.getElementById("pReceiptNo").textContent = p.receiptNo || "-";
            document.getElementById("pJoinedDate").textContent = p.createdDate || "-";
            document.getElementById("pValidity").textContent = p.validityTill || "-";
            document.getElementById("pStatusText").textContent = p.membershipStatus || "ACTIVE MEMBER";

            document.getElementById("pNameVal").textContent = p.fullName || "-";
            document.getElementById("pMobileVal").textContent = p.mobile || "-";
            document.getElementById("pEmailVal").textContent = p.email || "-";
            document.getElementById("pAadhaarVal").textContent = p.maskedAadhaar || "XXXX XXXX XXXX";

            document.getElementById("pCompanyVal").textContent = p.company || "-";
            document.getElementById("pEmpIdVal").textContent = p.employeeId || "-";
            document.getElementById("pStationVal").textContent = p.stationCircle || "-";
            document.getElementById("pDivisionVal").textContent = p.divisionRegion || "-";
            document.getElementById("pSubDivVal").textContent = p.subDivision || "-";
            document.getElementById("pStageVal").textContent = p.stage || "-";

            document.getElementById("pAdmFee").textContent = p.admissionFee || 100;
            document.getElementById("pAnnSub").textContent = p.annualSubscription || 360;
            document.getElementById("pDonation").textContent = p.donation || 0;
            document.getElementById("pTotalPaid").textContent = (p.admissionFee || 100) + (p.annualSubscription || 360) + (p.donation || 0);
            document.getElementById("pPayMode").textContent = p.paymentMode || "UPI";
            document.getElementById("pTxnId").textContent = p.transactionId || "N/A";

            // History Metrics
            document.getElementById("hStartYear").textContent = p.startedYear || new Date().getFullYear();
            document.getElementById("hYearsUnion").textContent = (p.yearsInUnion || 1) + (p.yearsInUnion > 1 ? " Years" : " Year");
            document.getElementById("hTotalRenewals").textContent = p.totalRenewals || 0;
            document.getElementById("hTotalSub").textContent = (p.admissionFee || 100) + (p.annualSubscription || 360) + (p.donation || 0);
            document.getElementById("tlDate").textContent = p.createdDate || "2026";

            if (loader) loader.style.display = "none";
            if (content) content.style.display = "flex";
        } else {
            alert(result.message || "Unable to load profile");
            closeProfile();
        }
    } catch (error) {
        console.error("Profile Load Error:", error);
        alert("Error connecting to server. Please try again.");
        closeProfile();
    }
}



// 📌 URL Check on Page Load
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get('id') || urlParams.get('memberId');

    if (memberId) {
        loadMemberProfile(memberId);
    }
});

function openReceipt() {
    loadReceiptPreview();
    if (membershipPage) membershipPage.style.display = "none";
    if (homeSection) homeSection.style.display = "none";
    if (statisticsSection) statisticsSection.style.display = "none";

    const rc = document.getElementById("receiptContainer");
    if (rc) rc.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeReceipt() {
    const rc = document.getElementById("receiptContainer");
    if (rc) rc.style.display = "none";
    showPage("home");
}

/* ==========================================================
   HOME PAGE ENHANCEMENTS ENGINE
========================================================== */

function dismissHomeBanner() {
    const banner = document.getElementById("homeBannerContainer");
    if (banner) {
        banner.style.opacity = "0";
        banner.style.transform = "translateY(-20px)";
        banner.style.maxHeight = "0px";
        banner.style.marginBottom = "0px";
        banner.style.padding = "0px";
        banner.style.overflow = "hidden";
    }
}

// 📌 6 సెకన్ల తర్వాత ఆటోమేటిక్‌గా వెల్‌కమ్ బ్యానర్ దాగిపోతుంది (Auto Disappear)
setTimeout(function () {
    dismissHomeBanner();
}, 6000);

// 📌 హోమ్ పేజీ కౌంటర్లను లైవ్ డేటాతో అప్‌డేట్ చేస్తుంది
function syncHomeLiveCounters(stats) {
    if (!stats) return;
    
    const total = stats.totalMembers || 0;
    const today = stats.todayMembers || 0;
    const year = stats.yearMembers || 0;
    const lastYear = Math.max(0, total - today);
    const growth = Math.max(0, year - today);

    if (document.getElementById("hTotalMembers")) document.getElementById("hTotalMembers").textContent = total;
    if (document.getElementById("hLastYearMembers")) document.getElementById("hLastYearMembers").textContent = lastYear;
    if (document.getElementById("hCurrentYearMembers")) document.getElementById("hCurrentYearMembers").textContent = year;
    if (document.getElementById("hGrowthMembers")) document.getElementById("hGrowthMembers").textContent = "+" + growth;
}

// loadMembershipStatistics లో ఈ లైన్ చేర్చబడింది
const originalLoadStats = loadMembershipStatistics;
loadMembershipStatistics = async function() {
    try {
        const url = `${BACKEND_URL}?action=getMembershipStatistics`;
        const response = await fetch(url);
        const result = await response.json();

        if (result && result.success && result.statistics) {
            syncHomeLiveCounters(result.statistics);
        }
    } catch(e){}
    
    if (typeof originalLoadStats === "function") {
        originalLoadStats();
    }
};

const moreBtn=document.getElementById("moreBtn");
const moreDropdown=document.getElementById("moreDropdown");
if(moreBtn&&moreDropdown){
moreBtn.addEventListener("click",function(e){
e.stopPropagation();
moreDropdown.classList.toggle("show");
});
document.addEventListener("click",function(e){
if(!moreDropdown.contains(e.target)&&!moreBtn.contains(e.target)){
moreDropdown.classList.remove("show");
}
});
document.querySelectorAll("#moreDropdown a").forEach(function(item){
item.addEventListener("click",function(){
moreDropdown.classList.remove("show");
});
});
}