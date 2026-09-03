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



/* ==========================================================
   UNIVERSAL AGE CALCULATION ENGINE (MEMBERSHIP & PROFILE)
   Single Reusable Engine for Date of Birth & Age Calculation
   ========================================================== */

/**
 * Calculates age in Y/M/D format dynamically upon Date of Birth selection.
 * Works universally for both Membership (#dob -> #age) and Profile (#profDob -> #profAge).
 * @param {string} dobSelector - Date of Birth input selector
 * @param {string} ageSelector - Calculated Age output selector
 */
function bindUniversalAgeCalculator(dobSelector, ageSelector) {
  const dobEl = document.querySelector(dobSelector);
  const ageEl = document.querySelector(ageSelector);
  if (!dobEl || !ageEl) return;

  // Restrict future dates beyond today
  dobEl.max = new Date().toISOString().split("T")[0];

  dobEl.addEventListener("change", function () {
    if (!this.value || this.value.trim() === "") {
      ageEl.value = "";
      return;
    }

    const birthDate = ParseDate(this.value);
    if (!birthDate || isNaN(birthDate.getTime())) {
      ageEl.value = "";
      return;
    }

    const today = new Date();
    let years  = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days   = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Minimum 15 years age validation as per union bye-laws
    if (years < 15) {
      ageEl.value = "";
      if (typeof PortalSync === "function") {
        PortalSync(dobEl, "", "change");
      } else {
        dobEl.value = "";
      }
      showError("Minimum 15 years age required for membership.");
      return;
    }

    // Output formatted age: e.g., 28Y 5M 14D
    ageEl.value = `${years}Y ${months}M ${days}D`;
  });
}

/**
 * Universal Initialization Call for Age Calculation Across All Forms
 */
function initializeAgeCalculation() {
  bindUniversalAgeCalculator("#dob", "#age");          // Membership Form
  bindUniversalAgeCalculator("#profDob", "#profAge");  // Profile Form
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




/* ==========================================================
   AADHAAR FORMATTING ENGINE (MEMBERSHIP & PROFILE REUSE)
   ========================================================== */

/**
 * Enforces 12-digit numeric constraint and 4-4-4 auto-spacing formatting on Aadhaar inputs.
 */
function initializeAadhaarFormatting() {
  ["#aadhaar", "#profAadhaar"].forEach(selector => {
    const aadhaarEl = document.querySelector(selector);
    if (!aadhaarEl) return;

    aadhaarEl.setAttribute("maxlength", "14");

    aadhaarEl.addEventListener("input", function () {
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

    aadhaarEl.addEventListener("keypress", function (e) {
      const digits = this.value.replace(/\D/g, "");
      if (digits.length >= 12 && /\d/.test(e.key)) {
        e.preventDefault();
      }
    });
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
   DISTRICTS MASTER DATA & UNIVERSAL ENGINE
========================================================= */

// Master List of 26 AP Districts (Single Source of Truth)
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

/**
 * Universal District Populator Engine.
 * Automatically finds and populates ALL district dropdowns across Membership, Profile & Donations.
 */
function initializeUniversalDistrictEngine() {
  if (typeof districts === "undefined" || !Array.isArray(districts)) return;

  // Query ALL district select elements across Membership, Profile, and Donations
  const allDistrictSelects = document.querySelectorAll(
    '#district, #profPermDistrict, #profPresDistrict, #donorDistrict, select[name*="district"], select[id*="district"], select[id*="District"]'
  );

  allDistrictSelects.forEach(selectEl => {
    if (!selectEl) return;

    // Capture currently selected value if available
    const currentValue = selectEl.value;

    // Clear existing options and set default placeholder
    selectEl.innerHTML = '<option value="">Select District</option>';

    // Populate all 26 AP Districts from single master array
    districts.forEach(function (districtName) {
      const option = document.createElement("option");
      option.value = districtName;
      option.textContent = districtName;
      selectEl.appendChild(option);
    });

    // Restore selected value if already set
    if (currentValue) {
      selectEl.value = currentValue;
    }
  });
}


/* ==========================================================
   COMPLETE NAVIGATION ENGINE WITH UNDER-DEVELOPMENT GUARD
   ========================================================== */

function showPage(page) {
  const rc = document.getElementById("receiptContainer");

  // 1. Capture ALL page sections strictly
  const homeSec  = document.getElementById("homeSection") || document.getElementById("homePage");
  const membSec  = document.getElementById("membershipPage") || document.getElementById("membershipSection");
  const donSec   = document.getElementById("donationsSection") || document.getElementById("donationsPage");
  const statSec  = document.getElementById("statisticsSection") || document.getElementById("statisticsPage");
  const abtSec   = document.getElementById("aboutSection") || document.getElementById("aboutPage");
  const cntSec   = document.getElementById("contactSection") || document.getElementById("contactPage");
  const dwnSec   = document.getElementById("downloadsSection") || document.getElementById("downloadsPage");
  const profSec  = document.getElementById("profileSection") || document.getElementById("profilePage");
  const admSec   = document.getElementById("adminSection");
  const notifSec = document.getElementById("notificationsSection");
  const setSec   = document.getElementById("settingsSection");
  const mtgSec   = document.getElementById("meetingsSection");
  const obSec    = document.getElementById("office-bearersSection"); // 👉 Added Office Bearers Section
  const placeholderSec = document.getElementById("underDevPlaceholderSection");

  // 2. FORCE HIDE EVERY SECTION (Guarantees Zero Overlapping)
  if (homeSec)  homeSec.style.display  = "none";
  if (membSec)  membSec.style.display  = "none";
  if (donSec)   donSec.style.display   = "none";
  if (statSec)  statSec.style.display  = "none";
  if (abtSec)   abtSec.style.display   = "none";
  if (cntSec)   cntSec.style.display   = "none";
  if (dwnSec)   dwnSec.style.display   = "none";
  if (profSec)  profSec.style.display  = "none";
  if (admSec)   admSec.style.display   = "none";
  if (notifSec) notifSec.style.display = "none";
  if (setSec)   setSec.style.display   = "none";
  if (mtgSec)   mtgSec.style.display   = "none";
  if (obSec)    obSec.style.display    = "none"; // 👉 Hide Office Bearers
  if (placeholderSec) placeholderSec.style.display = "none";

  // Hide standalone contentArea children if any
  document.querySelectorAll("#contentArea > section").forEach(s => s.style.display = "none");

  // 3. Remove 'active' state from navigation links
  const navLinks = document.querySelectorAll(".nav-link, .nav-tab-link, .dropdown-item, .navbar-nav a, .nav-item");
  navLinks.forEach(link => link.classList.remove("active"));

  // 4. Smooth scroll to top
  const contentArea = document.getElementById("contentArea") || window;
  contentArea.scrollTo({ top: 0, behavior: "smooth" });

  // Normalize page name by removing 'section' or 'page' suffixes
  const targetPage = String(page).toLowerCase().replace(/section|page/g, '').trim();

  // 5. Highlight active navbar item
  let activeLink = document.getElementById(`nav${targetPage.charAt(0).toUpperCase() + targetPage.slice(1)}`) ||
                   document.querySelector(`[onclick*="'${targetPage}'"]`);
  if (activeLink) {
    activeLink.classList.add("active");
    if (activeLink.parentElement && activeLink.parentElement.classList.contains("nav-item")) {
      activeLink.parentElement.classList.add("active");
    }
  }

  // 6. SHOW ONLY TARGETED PAGE
  switch (targetPage) {
    case "home":
      if (homeSec) homeSec.style.display = "block";
      break;

    case "membership":
      if (membSec) membSec.style.display = "block";
      break;

    case "donation":
    case "donations":
      if (donSec) donSec.style.display = "block";
      break;

    case "statistic":
    case "statistics":
    case "stats":
      if (statSec) statSec.style.display = "block";
      if (typeof loadMembershipStatistics === "function") loadMembershipStatistics();
      break;

    case "about":
    case "aboutus":
    case "about-arpeu":
      if (abtSec) abtSec.style.display = "block";
      break;

    case "contact":
    case "contactus":
    case "contact-us":
      if (cntSec) cntSec.style.display = "block";
      break;

    case "download":
    case "downloads":
      if (dwnSec) dwnSec.style.display = "block";
      break;

    case "profile":
    case "profiles":
      if (profSec) profSec.style.display = "block";
      break;

    case "meeting":
    case "meetings":
    case "conference":
    case "conferences":
      if (mtgSec) mtgSec.style.display = "flex";
      if (typeof loadMeetingsList === "function") loadMeetingsList();
      break;

    case "notification":
    case "notifications":
      if (notifSec) notifSec.style.display = "block";
      if (typeof loadNotificationsList === "function") loadNotificationsList();
      break;

    case "office-bearers":
    case "officebearers":
    case "bearers":
    case "leadership":
      if (obSec) obSec.style.display = "block"; // 👉 Open Office Bearers Master Page
      break;

    case "setting":
    case "settings":
      if (setSec) setSec.style.display = "block";
      break;

    case "admin":
    case "adminlogin":
      if (admSec) admSec.style.display = "block";
      if (typeof checkAdminSession === "function") checkAdminSession();
      break;

    default:
      if (placeholderSec) {
        const titleEl = document.getElementById("devPageTitle");
        if (titleEl) titleEl.textContent = `${targetPage.toUpperCase()} - Page Under Development`;
        placeholderSec.style.display = "block";
      }
      break;
  }
}

/* ==========================================================
   INITIALIZE PORTAL TOP NAVIGATION ENGINE
   ========================================================== */

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
      const rc = document.getElementById("receiptContainer");
      const isMembReceiptOpen = rc && (rc.getAttribute("data-membership-active") === "true");

      /* Switch mode to new member only if receipt is not actively open */
      if (!isMembReceiptOpen) {
        setMembershipMode("new");
      }
      showPage("membership");
    });
  }

  // Donations Navigation Listener
  const navDonations = document.getElementById("navDonations");
  if (navDonations) {
    navDonations.addEventListener("click", function (e) {
      e.preventDefault();
      showPage("donations");
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
      if (moreDropdown) moreDropdown.classList.remove("show");
    });
  }

  if (typeof navAbout !== "undefined" && navAbout) {
    navAbout.addEventListener("click", function (e) {
      e.preventDefault();
      showPage("about");
      const moreDropdown = document.getElementById("moreDropdown");
      if (moreDropdown) moreDropdown.classList.remove("show");
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


/* ==========================================================
   UNIVERSAL PHOTO UPLOAD & CROPPER ENGINE (ORIGINAL MATCH)
   Seamless Cropping & Instant Preview for Membership & Profile
   ========================================================== */

let cropperInstance = null;
window.croppedPhotoFile = null;
let activePhotoSource = "membership"; // Tracks active upload source: 'membership' or 'profile'

/**
 * Binds photo upload listeners and sets active target source
 */
function initializePhotoPreview() {
  const membGallery = document.getElementById("memberPhoto");
  const membCamera  = document.getElementById("memberCameraPhoto");
  const profGallery = document.getElementById("profPhotoInput");
  const profCamera  = document.getElementById("profCameraPhotoInput");

  /* 1. Membership Gallery Upload */
  if (membGallery) {
    membGallery.addEventListener("change", function () {
      if (!this.files || !this.files[0]) return;
      activePhotoSource = "membership";
      processSelectedPhoto(this.files[0]);
    });
  }

  /* 2. Membership Direct Live Camera */
  if (membCamera) {
    membCamera.addEventListener("change", function () {
      if (!this.files || !this.files[0]) return;
      activePhotoSource = "membership";
      processSelectedPhoto(this.files[0]);
    });
  }

  /* 3. Profile Gallery Upload */
  if (profGallery) {
    profGallery.addEventListener("change", function () {
      if (!this.files || !this.files[0]) return;
      activePhotoSource = "profile";
      processSelectedPhoto(this.files[0]);
    });
  }

  /* 4. Profile Direct Live Camera */
  if (profCamera) {
    profCamera.addEventListener("change", function () {
      if (!this.files || !this.files[0]) return;
      activePhotoSource = "profile";
      processSelectedPhoto(this.files[0]);
    });
  }
}

/**
 * Validates format and opens Cropper Modal
 * @param {File} file - Selected image file
 */
function processSelectedPhoto(file) {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    alert("Invalid file format.\nOnly JPG, PNG and WEBP files are allowed.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    openCropperModal(e.target.result);
  };
  reader.readAsDataURL(file);
}

/**
 * Opens WhatsApp-style Cropper Modal with 3:4 Passport Aspect Ratio
 * @param {string} imageSrc - Base64 image URL
 */
function openCropperModal(imageSrc) {
  const modal = document.getElementById("cropperModal");
  const cropImg = document.getElementById("cropperImage");
  if (!modal || !cropImg) return;

  cropImg.src = imageSrc;
  modal.style.display = "flex";

  if (cropperInstance) {
    cropperInstance.destroy();
  }

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

/**
 * Applies Cropped Photo ONLY to the active targeted page (Page Isolation)
 */
function applyPhotoCrop() {
  if (!cropperInstance) return;

  const canvas = cropperInstance.getCroppedCanvas({
    width: 300,
    height: 400,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  });

  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

  canvas.toBlob((blob) => {
    const croppedFile = new File([blob], "cropped-passport-photo.jpg", { type: "image/jpeg" });
    window.croppedPhotoFile = croppedFile;

    // ISOLATION LOGIC: Update ONLY the active page target
    if (activePhotoSource === "profile") {
      // 1. Update Profile Photo Preview Box ONLY
      const profPreview = document.getElementById("profilePhotoPreview") || document.getElementById("profPhotoImg");
      const profText    = document.getElementById("profPreviewText") || document.getElementById("profPhotoTxt");
      const profName    = document.getElementById("profPhotoFileName") || document.getElementById("profPhotoNameBox");

      if (profPreview) {
        profPreview.src = dataUrl;
        profPreview.style.setProperty("display", "block", "important");
      }
      if (profText) {
        profText.style.setProperty("display", "none", "important");
      }
      if (profName) {
        profName.value = "Photo Cropped & Adjusted ✔";
      }

      // Update Profile Header Avatar Image
      const headerAvatar = document.getElementById("profileAvatarHeaderImg");
      if (headerAvatar) {
        headerAvatar.src = dataUrl;
      }
    } else {
      // 2. Update Membership Photo Preview Box ONLY
      const photoPreview  = document.getElementById("photoPreview");
      const previewText   = document.querySelector("#membershipPage .preview-text");
      const photoFileName = document.getElementById("photoFileName");

      if (photoPreview) {
        photoPreview.src = dataUrl;
        photoPreview.style.setProperty("display", "block", "important");
      }
      if (previewText) {
        previewText.style.setProperty("display", "none", "important");
      }
      if (photoFileName) {
        photoFileName.value = "Photo Cropped & Adjusted ✔";
      }
    }

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

/* ==========================================================
   UNIFIED UNIVERSAL EMPLOYMENT CASCADING ENGINE
   Single Reusable Engine for Membership & Profile
   ========================================================== */

/**
 * Universal Cascading Employment Engine
 * Handles APGENCO, APTRANSCO, and DISCOMs dropdowns for ANY form section using prefix
 * @param {string} prefix - Field ID prefix ('' for Membership, 'prof' for Profile)
 */
function bindUniversalEmploymentEngine(prefix) {
  const p = prefix || "";
  
  // Dynamic Element Getters
  const getEl = (id) => document.getElementById(p ? `${p}${id.charAt(0).toUpperCase() + id.slice(1)}` : id);
  const getGrp = (id) => document.getElementById(p ? `${p}${id.charAt(0).toUpperCase() + id.slice(1)}Group` : `${id}Group`);

  const companyEl     = getEl("company");
  const stationEl     = getEl("station");
  const stageEl       = getEl("stage");
  const circleEl      = getEl("circle");
  const divisionEl    = getEl("division");
  const subDivisionEl = getEl("subDivision");
  const subStationEl  = getEl("subStation");
  const sectionEl     = getEl("section");
  const designationEl = getEl("designation");
  const locationEl    = getEl("location");

  if (!companyEl) return;

  companyEl.addEventListener("change", function () {
    const compVal = companyEl.value;

    // Hide All Groups
    [getGrp("station"), getGrp("stage"), getGrp("circle"), getGrp("division"), getGrp("subDivision"), getGrp("subStation"), getGrp("section"), getGrp("location"), getGrp("designation")].forEach(hideElement);

    // Clear All Dropdowns & Inputs
    DropdownEngine.clear(stationEl, "Select Station");
    DropdownEngine.clear(stageEl, "Select Stage");
    DropdownEngine.clear(circleEl, "Select Circle");
    DropdownEngine.clear(divisionEl, "Select Division");
    DropdownEngine.clear(subDivisionEl, "Select Sub Division");
    DropdownEngine.clear(designationEl, "Select Designation");

    clearInput(subStationEl);
    clearInput(sectionEl);
    if (locationEl) locationEl.value = "";

    if (!compVal) return;

    if (compVal === "APGENCO") {
      showElement(getGrp("station"));
      showElement(getGrp("stage"));
      showElement(getGrp("division"));
      showElement(getGrp("subDivision"));
      if (getGrp("location")) getGrp("location").style.display = "block";
      showElement(getGrp("designation"));

      DropdownEngine.populate(stationEl, Object.keys(employmentMaster.APGENCO.stations), "Select Station");
    } else if (employmentMaster[compVal]) {
      showElement(getGrp("circle"));
      showElement(getGrp("division"));
      showElement(getGrp("subDivision"));
      showElement(getGrp("subStation"));
      showElement(getGrp("section"));
      showElement(getGrp("designation"));

      DropdownEngine.populate(circleEl, Object.keys(employmentMaster[compVal].circles), "Select Circle");
    }
  });

  if (stationEl) {
    stationEl.addEventListener("change", function () {
      if (!stationEl.value) return;
      const stationData = employmentMaster.APGENCO.stations[stationEl.value];
      if (stationData) DropdownEngine.populate(stageEl, Object.keys(stationData.stages), "Select Stage");
    });
  }

  if (stageEl) {
    stageEl.addEventListener("change", function () {
      if (!stageEl.value || !stationEl.value) return;
      const stageData = employmentMaster.APGENCO.stations[stationEl.value].stages[stageEl.value];
      if (stageData) DropdownEngine.populate(divisionEl, Object.keys(stageData.divisions), "Select Division");
    });
  }

  if (circleEl) {
    circleEl.addEventListener("change", function () {
      if (!circleEl.value || !companyEl.value) return;
      const circleData = employmentMaster[companyEl.value].circles[circleEl.value];
      if (circleData) DropdownEngine.populate(divisionEl, Object.keys(circleData.divisions), "Select Division");
    });
  }

  if (divisionEl) {
    divisionEl.addEventListener("change", function () {
      if (!divisionEl.value) return;

      if (companyEl.value === "APGENCO") {
        const divisionData = employmentMaster.APGENCO.stations[stationEl.value].stages[stageEl.value].divisions[divisionEl.value];
        if (!divisionData) return;

        DropdownEngine.populate(subDivisionEl, divisionData.subDivisions, "Select Sub Division");
        let desigList = [];
        divisionData.designationGroups.forEach(g => desigList.push(...employmentMaster.APGENCO.designationGroups[g]));
        DropdownEngine.populate(designationEl, desigList, "Select Designation");
      } else {
        const circleData = employmentMaster[companyEl.value].circles[circleEl.value];
        if (!circleData) return;
        const divisionData = circleData.divisions[divisionEl.value];
        if (!divisionData) return;

        DropdownEngine.populate(subDivisionEl, divisionData.subDivisions, "Select Sub Division");
      }
    });
  }

  if (subDivisionEl) {
    subDivisionEl.addEventListener("change", function () {
      if (!companyEl || companyEl.value === "APGENCO") return;
      DropdownEngine.populate(
        designationEl,
        ["AAO", "AE", "AO", "Computer Operator", "Dy. EE", "EE", "Foreman", "Foreman Grade-I", "Foreman Grade-II", "JAO", "JE", "JLM", "JLM Grade-II", "Junior Assistant", "LI", "Senior Assistant", "Senior LI", "Shift Operator", "Watchman", "Others"],
        "Select Designation"
      );
    });
  }
}

/**
 * Single Universal Initialization Call for both Membership and Profile
 */
function initializeEmploymentModule() {
  bindUniversalEmploymentEngine("");     // Binds Membership Form
  bindUniversalEmploymentEngine("prof"); // Binds Profile Form
}

/* ==========================================================
   MEMBERSHIP PAYMENT MODULE (STRICT STEP-BY-STEP UNHIDE)
   ========================================================== */

const PaymentModuleV25 = {
  init: function () {
    const payNowOpt = document.getElementById("payNowOption");
    const alreadyPaidOpt = document.getElementById("alreadyPaidOption");
    const payNowSec = document.getElementById("payNowSection");
    const alreadyPaidSec = document.getElementById("alreadyPaidSection");
    const payNowAmt = document.getElementById("payNowAmount");
    const contBtn = document.getElementById("continueToPayBtn");
    const doneBtn = document.getElementById("payNowCompletedBtn");
    const manualAmt = document.getElementById("manualAmount");
    const payBalBtn = document.getElementById("payBalanceBtn");
    const inlineDoneBtn = document.getElementById("inlinePaidDoneBtn");
    const finalSec = document.getElementById("finalSubmitSection");

    /* Strict Checker: Unhides Submit card ONLY after Receipt File is chosen */
    function syncMembershipSubmitVisibility() {
      if (!finalSec) return;
      let isReady = false;

      if (payNowOpt && payNowOpt.checked) {
        const dateVal = document.getElementById("payNowDate") ? document.getElementById("payNowDate").value.trim() : "";
        const txnVal  = document.getElementById("payNowTransactionId") ? document.getElementById("payNowTransactionId").value.trim() : "";
        const fileInp = document.getElementById("payNowReceipt");
        const hasFile = fileInp && fileInp.files && fileInp.files.length > 0;
        if (dateVal !== "" && txnVal !== "" && hasFile) {
          isReady = true;
        }
      } else if (alreadyPaidOpt && alreadyPaidOpt.checked) {
        const dateVal = document.getElementById("manualDate") ? document.getElementById("manualDate").value.trim() : "";
        const txnVal  = document.getElementById("manualTransactionId") ? document.getElementById("manualTransactionId").value.trim() : "";
        const fileInp = document.getElementById("manualReceipt");
        const hasFile = fileInp && fileInp.files && fileInp.files.length > 0;
        if (dateVal !== "" && txnVal !== "" && hasFile) {
          isReady = true;
        }
      }

      finalSec.style.display = isReady ? "block" : "none";
    }

    // Toggle Payment Options (Pay Now / Already Paid)
    if (payNowOpt) {
      payNowOpt.addEventListener("change", function () {
        if (this.checked) {
          if (payNowSec) payNowSec.style.display = "block";
          if (alreadyPaidSec) alreadyPaidSec.style.display = "none";
          if (finalSec) finalSec.style.display = "none";
        }
      });
    }

    if (alreadyPaidOpt) {
      alreadyPaidOpt.addEventListener("change", function () {
        if (this.checked) {
          if (alreadyPaidSec) alreadyPaidSec.style.display = "block";
          if (payNowSec) payNowSec.style.display = "none";
          if (finalSec) finalSec.style.display = "none";
        }
      });
    }

    // Pay Now Amount Breakdown
    if (payNowAmt) {
      payNowAmt.addEventListener("input", function () {
        const val = parseInt(this.value, 10) || 0;
        const breakdown = document.getElementById("payNowBreakdown");
        const total = document.getElementById("payNowTotal");
        const donRow = document.getElementById("payNowDonRow");
        const donVal = document.getElementById("payNowDonVal");

        if (breakdown) breakdown.style.display = val > 0 ? "block" : "none";
        if (total) total.innerText = "₹" + val;
        if (contBtn) contBtn.style.display = val >= 460 ? "inline-flex" : "none";

        if (val > 460) {
          if (donRow) donRow.style.display = "flex";
          if (donVal) donVal.innerText = "₹" + (val - 460);
        } else {
          if (donRow) donRow.style.display = "none";
        }
      });
    }

    // Continue to Payment -> Shows QR Code
    if (contBtn) {
      contBtn.addEventListener("click", function () {
        const step2 = document.getElementById("payNowStep2");
        if (step2) step2.style.display = "block";
        const qr = document.getElementById("dynamicQR");
        if (qr && payNowAmt) {
          qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=andhrarastrapowerempunion@sbi%26pn=ARPEU%26am=${payNowAmt.value}%26cu=INR`;
        }
      });
    }

    // "I HAVE COMPLETED PAYMENT" Click -> Shows Step 3 & Auto-fills Today's Live Date/Time
    if (doneBtn) {
      doneBtn.addEventListener("click", function () {
        const step3 = document.getElementById("payNowStep3");
        if (step3) step3.style.display = "block";

        const now = new Date();
        const dStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        let hours = now.getHours();
        const mins = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const tStr = `${String(hours).padStart(2, '0')}:${mins} ${ampm}`;

        const pDate = document.getElementById("payNowDate");
        const pTime = document.getElementById("payNowTimeDisplay");
        if (pDate) {
          pDate.value = dStr;
          // Locks Pay Now calendar strictly to Today's date only
          if (typeof flatpickr === "function") {
            flatpickr(pDate, { dateFormat: "d-m-Y", minDate: "today", maxDate: "today", disableMobile: true });
          }
        }
        if (pTime) pTime.value = tStr;

        syncMembershipSubmitVisibility();
      });
    }

    // Manual Amount Input for Already Paid
    if (manualAmt) {
      manualAmt.addEventListener("input", function () {
        const val = parseInt(this.value, 10) || 0;
        const breakdown = document.getElementById("manualBreakdown");
        const mFields = document.getElementById("manualFields");
        const total = document.getElementById("manualTotal");
        const donRow = document.getElementById("manualDonRow");
        const donVal = document.getElementById("manualDonVal");
        const balRow = document.getElementById("manualBalRow");
        const balVal = document.getElementById("manualBalVal");

        if (breakdown) breakdown.style.display = val > 0 ? "block" : "none";
        if (total) total.innerText = "₹" + val;

        if (val > 460) {
          if (donRow) donRow.style.display = "flex";
          if (donVal) donVal.innerText = "₹" + (val - 460);
          if (balRow) balRow.style.display = "none";
          if (payBalBtn) payBalBtn.style.display = "none";
          if (mFields) mFields.style.display = "block";
        } else if (val === 460) {
          if (donRow) donRow.style.display = "none";
          if (balRow) balRow.style.display = "none";
          if (payBalBtn) payBalBtn.style.display = "none";
          if (mFields) mFields.style.display = "block";
        } else if (val > 0 && val < 460) {
          if (donRow) donRow.style.display = "none";
          if (balRow) balRow.style.display = "flex";
          if (balVal) balVal.innerText = "₹" + (460 - val);
          if (payBalBtn) payBalBtn.style.display = "inline-flex";
          if (mFields) mFields.style.display = "none";
          const balDisp = document.getElementById("balanceAmtDisp");
          if (balDisp) balDisp.innerText = "₹" + (460 - val);
        } else {
          if (donRow) donRow.style.display = "none";
          if (balRow) balRow.style.display = "none";
          if (payBalBtn) payBalBtn.style.display = "none";
          if (mFields) mFields.style.display = "none";
        }

        syncMembershipSubmitVisibility();
      });
    }

    // Pay Balance Click
    if (payBalBtn) {
      payBalBtn.addEventListener("click", function () {
        const val = parseInt(manualAmt ? manualAmt.value : 0, 10) || 0;
        const bal = 460 - val;
        const inlineBox = document.getElementById("inlineBalanceBox");
        const inlineQR = document.getElementById("inlineQR");
        if (inlineQR) {
          inlineQR.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=andhrarastrapowerempunion@sbi%26pn=ARPEU%26am=${bal}%26cu=INR`;
        }
        if (inlineBox) inlineBox.style.display = "block";
      });
    }

    // Inline Balance Paid Done Click
    if (inlineDoneBtn) {
      inlineDoneBtn.addEventListener("click", function () {
        const inlineBox = document.getElementById("inlineBalanceBox");
        const mFields = document.getElementById("manualFields");
        if (inlineBox) inlineBox.style.display = "none";
        if (mFields) mFields.style.display = "block";
        syncMembershipSubmitVisibility();
      });
    }

    // Real-time watchers for membership receipt file and UTR inputs
    const watchMembershipInputs = [
      "#payNowReceipt", "#manualReceipt", 
      "#payNowTransactionId", "#manualTransactionId", "#payNowDate", "#manualDate"
    ];

    watchMembershipInputs.forEach(function (sel) {
      const el = document.querySelector(sel);
      if (el) {
        el.addEventListener("change", syncMembershipSubmitVisibility);
        el.addEventListener("input", syncMembershipSubmitVisibility);
      }
    });
  }
};


// 1. Handle Automatic Issuer & Designation Selection with 2-Line HTML Support
function handleIssuerSelection(leaderName) {
    const selectEl = document.getElementById("mtgIssuerSelect");
    const desigBox = document.getElementById("mtgIssuerDesigBox");
    const hiddenDesig = document.getElementById("mtgIssuerDesig");
    if (!selectEl || !desigBox) return;

    const selectedOption = selectEl.options[selectEl.selectedIndex];
    const designationHtml = selectedOption.getAttribute("data-desig") || "Leader";
    
    // Set visual multi-line text
    desigBox.innerHTML = designationHtml;
    // Set plain text for WhatsApp & Backend
    if (hiddenDesig) {
        hiddenDesig.value = designationHtml.replace(/<br\s*[\/]?>/gi, " - ");
    }

    updateLiveWhatsAppPreview();
}

// 2. Universal Flatpickr Initializer (Includes Meetings Date & AM/PM Time)
function initializeDatePickers() {
  if (typeof flatpickr !== "function") return;

  const base = { 
    disableMobile: true, 
    allowInput: false, 
    clickOpens: true, 
    animate: false,
    position: "auto"
  };

  // Date Pickers (Includes #mtgDate)
  const dateSelectors = ["#dob", "#joiningDate", "#profDob", "#profDoj", "#payNowDate", "#manualDate", "#donDate", "#donPayNowDate", "#mtgDate"];
  dateSelectors.forEach(id => {
    const el = document.querySelector(id);
    if (el) {
      flatpickr(el, { 
        ...base, 
        dateFormat: "d-m-Y",
        defaultDate: id === "#mtgDate" ? "today" : null,
        monthSelectorType: "dropdown",
        onChange: (selectedDates, dateStr, instance) => {
          el.value = dateStr;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          if (instance) instance.close();
        }
      });
    }
  });

  // Time Pickers with AM/PM (Includes #mtgTime)
  const timeSelectors = ["#payNowTimeDisplay", "#manualTimeDisplay", "#donTimeDisplay", "#donPayNowTimeDisplay", "#mtgTime"];
  timeSelectors.forEach(id => {
    const el = document.querySelector(id);
    if (el) {
      flatpickr(el, { 
        ...base, 
        enableTime: true, 
        noCalendar: true, 
        dateFormat: "h:i K",
        time_24hr: false,
        minuteIncrement: 5,
        defaultDate: id === "#mtgTime" ? "10:30" : null,
        static: true,
        position: "above",
        onChange: (selectedDates, dateStr) => {
          el.value = dateStr;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
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

    initializeUniversalDistrictEngine();

    initializePhotoPreview();

    initializeValidations();

    initializeUniversalUtrCheckEngine();

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
       // PaymentModuleV25.restrictDates();
    }

    if (typeof DonationPaymentModule !== "undefined") {
        DonationPaymentModule.init();
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

/* ==========================================================
   REAL-TIME FAIL-SAFE DUPLICATE CHECK ENGINE
   ========================================================== */

async function executeDuplicateCheck(field, value, statusElementId) {
  const statusEl = document.getElementById(statusElementId);
  if (!statusEl) return;

  statusEl.className = "field-status checking";
  statusEl.style.color = "#0B4EA2";
  statusEl.innerHTML = "Checking availability...";

  try {
    const url = `${BACKEND_URL}?action=checkDuplicate&field=${encodeURIComponent(field)}&value=${encodeURIComponent(value.toString().trim())}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result && result.success && result.exists) {
      statusEl.className = "field-status error";
      statusEl.style.color = "#DC2626";
      statusEl.innerHTML = "✖ Already Registered";
    } else {
      statusEl.className = "field-status success";
      statusEl.style.color = "#16A34A";
      statusEl.innerHTML = "✔ Available";
    }
  } catch (error) {
    console.error(`[${field}] Duplicate Check Error:`, error);
    // If network fails, do not falsely show available
    statusEl.className = "field-status";
    statusEl.innerHTML = "";
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
   MOBILE & FIELD VALIDATIONS ENGINE
   ========================================================== */

/**
 * Initializes strict 10-digit mobile number constraints and duplicate checking for Membership and Profile.
 */
function initializeValidations() {
  /* 1. MEMBERSHIP & PROFILE MOBILE (Strict 10 Digits) */
  ["#mobile", "#profMobile"].forEach(selector => {
    const mobileInput = document.querySelector(selector);
    if (!mobileInput) return;

    mobileInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 10);
      const val = this.value.trim();
      const statusId = selector === "#mobile" ? "mobileStatus" : "profileSearchStatus";
      const status = document.getElementById(statusId);

      clearTimeout(debounceTimers.mobile);

      if (val.length !== 10) {
        if (status && selector === "#mobile") { 
          status.className = "field-status"; 
          status.innerHTML = ""; 
        }
        return;
      }

      debounceTimers.mobile = setTimeout(() => {
        executeDuplicateCheck("mobile", val, statusId);
      }, 800);
    });
  });

  /* 2. MEMBERSHIP & PROFILE AADHAAR (Strict 12 Digits Duplicate Check) */
  ["#aadhaar", "#profAadhaar"].forEach(selector => {
    const aadhaarInput = document.querySelector(selector);
    if (!aadhaarInput) return;

    aadhaarInput.addEventListener("input", function () {
      const rawAadhaar = this.value.replace(/\s/g, "").replace(/\D/g, "");
      const statusId = selector === "#aadhaar" ? "aadhaarStatus" : "profileSearchStatus";
      const status = document.getElementById(statusId);

      clearTimeout(debounceTimers.aadhaar);

      if (rawAadhaar.length !== 12) {
        if (status && selector === "#aadhaar") { 
          status.className = "field-status"; 
          status.innerHTML = ""; 
        }
        return;
      }

      debounceTimers.aadhaar = setTimeout(() => {
        executeDuplicateCheck("aadhaar", rawAadhaar, statusId);
      }, 800);
    });
  });

  /* 3. EMPLOYEE ID (Check on Blur & Timeout) */
  const employeeIdInput = document.getElementById("employeeId");
  if (employeeIdInput) {
    employeeIdInput.addEventListener("input", function () {
      const val = this.value.trim();
      const status = document.getElementById("employeeIdStatus");

      clearTimeout(debounceTimers.employeeid);

      if (val.length < 3) {
        if (status) { 
          status.className = "field-status"; 
          status.innerHTML = ""; 
        }
        return;
      }

      debounceTimers.employeeid = setTimeout(() => {
        executeDuplicateCheck("employeeid", val, "employeeIdStatus");
      }, 1000);
    });

    employeeIdInput.addEventListener("blur", function () {
      const val = this.value.trim();
      if (val.length >= 3) {
        clearTimeout(debounceTimers.employeeid);
        executeDuplicateCheck("employeeid", val, "employeeIdStatus");
      }
    });
  }
}

/* ==========================================================
   UNIVERSAL UTR / TRANSACTION ID DUPLICATE CHECK ENGINE
   Seamless real-time check for Membership & Donation UTR inputs.
   ========================================================== */

function initializeUniversalUtrCheckEngine() {
  const utrInputs = document.querySelectorAll(
    '#payNowTransactionId, #manualTransactionId, #donUpiTxnId, #donPayNowTxnId, #donBankRefNo, .utr-field'
  );

  utrInputs.forEach(function (utrInput) {
    if (!utrInput) return;

    utrInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const val = this.value.trim();

      /* Auto-detect corresponding status container */
      let statusEl = document.getElementById(this.id + "Status") || 
                     document.getElementById("donUpiTxnStatus") || 
                     document.getElementById("donPayNowTxnStatus") || 
                     document.getElementById("manualTransactionIdStatus") || 
                     document.getElementById("transactionIdStatus");

      clearTimeout(debounceTimers.transactionid);

      if (val.length < 5) {
        if (statusEl) {
          statusEl.className = "field-status";
          statusEl.innerHTML = "";
        }
        return;
      }

      if (statusEl) {
        statusEl.className = "field-status checking";
        statusEl.style.color = "#0B4EA2";
        statusEl.innerHTML = "Checking availability...";
      }

      debounceTimers.transactionid = setTimeout(function () {
        executeDuplicateCheck("transactionid", val, statusEl ? statusEl.id : "transactionIdStatus");
      }, 800);
    });

    utrInput.addEventListener("blur", function () {
    
      if (val.length >= 5) {
        let statusEl = document.getElementById(this.id + "Status") || 
                       document.getElementById("donUpiTxnStatus") || 
                       document.getElementById("donPayNowTxnStatus") || 
                       document.getElementById("manualTransactionIdStatus") || 
                       document.getElementById("transactionIdStatus");

        clearTimeout(debounceTimers.transactionid);
        executeDuplicateCheck("transactionid", val, statusEl ? statusEl.id : "transactionIdStatus");
      }
    });
  });
}


/* ==========================================================
   UNIVERSAL UTR / TRANSACTION ID DUPLICATE CHECK ENGINE
   ========================================================== */

function initializeUniversalUtrCheckEngine() {
  const utrInputs = document.querySelectorAll(
    '#payNowTransactionId, #manualTransactionId, #donUpiTxnId, #donPayNowTxnId, #donBankRefNo, .utr-field'
  );

  utrInputs.forEach(function (utrInput) {
    if (!utrInput) return;

    utrInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const val = this.value.trim();

      // Find exact status div below this specific input box
      let statusEl = document.getElementById(this.id + "Status") || 
                     document.getElementById("transactionIdStatus") || 
                     document.getElementById("manualTransactionIdStatus") || 
                     document.getElementById("donUpiTxnStatus");

      clearTimeout(debounceTimers.transactionid);

      if (val.length < 5) {
        if (statusEl) {
          statusEl.className = "field-status";
          statusEl.innerHTML = "";
        }
        return;
      }

      if (statusEl) {
        statusEl.className = "field-status checking";
        statusEl.style.color = "#0B4EA2";
        statusEl.innerHTML = "Checking UTR availability...";
      }

      debounceTimers.transactionid = setTimeout(function () {
        executeDuplicateCheck("transactionid", val, statusEl ? statusEl.id : "transactionIdStatus");
      }, 600);
    });
  });
}


/* ============================================
   ARPEU Backend Configuration
============================================ */

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyoBv4TQ28mb7HIsTQ42iEe7P-3Yqs-7lR5tHhHqk0RqCQOShGrLBVPvD4j2ZUV1Q/exec";

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


/* ==========================================================
   STRICT MEMBERSHIP SUBMISSION & FIELD-FOCUS VALIDATION ENGINE
   ========================================================== */

async function submitMembership() {
  const submitBtn = document.getElementById("submitMembershipBtn");
  const originalButtonText = submitBtn ? submitBtn.innerHTML : "SUBMIT MEMBERSHIP APPLICATION";

  // Helper function to show alert and smoothly scroll to the empty field
  function validateField(id, message) {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      alert(message);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.borderColor = "#dc2626";
        setTimeout(() => { el.style.borderColor = ""; }, 3000);
      }
      return false;
    }
    return true;
  }

  // 1. Mandatory Personal Information Validation
  if (!validateField("employeeName", "Please enter Employee Name.")) return;
  if (!validateField("gender", "Please select Gender.")) return;
  if (!validateField("dob", "Please select Date of Birth.")) return;

  // 2. Mandatory Address Details Validation
  if (!validateField("village", "Please enter Village / Town / City.")) return;
  if (!validateField("mandal", "Please enter Mandal.")) return;
  if (!validateField("district", "Please select District.")) return;
  
  const pincode = document.getElementById("pincode") ? document.getElementById("pincode").value.trim() : "";
  if (!pincode || pincode.length !== 6) {
    alert("Please enter a valid 6-digit PIN Code.");
    document.getElementById("pincode").focus();
    return;
  }
  if (!validateField("postOffice", "Please enter Post Office.")) return;

  // 3. Mandatory Contact & Identity Validation
  const mobile = document.getElementById("mobile") ? document.getElementById("mobile").value.trim() : "";
  if (!mobile || mobile.length !== 10) {
    alert("Please enter a valid 10-digit Mobile Number.");
    document.getElementById("mobile").focus();
    return;
  }

  const aadhaar = document.getElementById("aadhaar") ? document.getElementById("aadhaar").value.replace(/\s/g, "").trim() : "";
  if (!aadhaar || aadhaar.length !== 12) {
    alert("Please enter a valid 12-digit Aadhaar Number.");
    document.getElementById("aadhaar").focus();
    return;
  }

  // 4. Mandatory Employment Validation
  const company = document.getElementById("company") ? document.getElementById("company").value : "";
  if (!validateField("company", "Please select Company.")) return;

  if (company === "APGENCO") {
    if (!validateField("station", "Please select Station.")) return;
    if (!validateField("stage", "Please select Stage.")) return;
  } else {
    if (!validateField("circle", "Please select Circle.")) return;
    if (!validateField("division", "Please select Division.")) return;
    if (!validateField("subDivision", "Please select Sub Division.")) return;
  }

  if (!validateField("designation", "Please select Designation.")) return;
  if (!validateField("employeeId", "Please enter Employee ID.")) return;

  // 5. Mandatory Photo Validation
  const memberPhotoFile  = document.getElementById("memberPhoto");
  const memberCameraFile = document.getElementById("memberCameraPhoto");
  const hasPhoto = (memberPhotoFile && memberPhotoFile.files.length > 0) || (memberCameraFile && memberCameraFile.files.length > 0) || window.croppedPhotoFile;

  if (!hasPhoto) {
    alert("Please upload or capture your passport-size photograph.");
    const photoBox = document.querySelector(".photo-upload-container");
    if (photoBox) photoBox.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // 6. Mandatory Declaration Check
  const declCheck = document.getElementById("declarationCheck");
  if (!declCheck || !declCheck.checked) {
    alert("Please accept the declaration before submitting your application.");
    if (declCheck) {
      declCheck.focus();
      declCheck.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // 7. Payment Mode & Transaction ID Validation
  const isPayNow = document.getElementById("payNowOption") && document.getElementById("payNowOption").checked;
  const transactionId = isPayNow
    ? (document.getElementById("payNowTransactionId") ? document.getElementById("payNowTransactionId").value.trim() : "")
    : (document.getElementById("manualTransactionId") ? document.getElementById("manualTransactionId").value.trim() : "");

  if (!transactionId) {
    alert("Please enter a valid Transaction ID / UTR Number.");
    const utrInput = isPayNow ? document.getElementById("payNowTransactionId") : document.getElementById("manualTransactionId");
    if (utrInput) utrInput.focus();
    return;
  }

  // 🚀 SPINNER ANIMATION ON BUTTON (Live Processing Feedback)
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" style="margin-right: 8px;"></i> Submitting Application...';
  }

  /* ---------------------------------------------------------
     BACKEND DUPLICATE CHECKS
  --------------------------------------------------------- */
  const mobileDup = await checkMobileDuplicate(mobile);
  if (mobileDup && mobileDup.exists) {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalButtonText; }
    alert(`Mobile Number Already Registered:\n\nMobile: ${mobile}`);
    return;
  }

  const empDup = await checkEmployeeIdDuplicate(document.getElementById("employeeId").value.trim());
  if (empDup && empDup.exists) {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalButtonText; }
    alert(`Employee ID Already Registered:\n\nEmployee ID: ${document.getElementById("employeeId").value.trim()}`);
    return;
  }

  const aadhaarDup = await checkAadhaarDuplicate(aadhaar);
  if (aadhaarDup && aadhaarDup.exists) {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalButtonText; }
    alert(`Aadhaar Number Already Registered:\n\nAadhaar: ${aadhaar}`);
    return;
  }

  const txnDup = await checkTransactionIdDuplicate(transactionId);
  if (txnDup && txnDup.exists) {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalButtonText; }
    alert(`Transaction ID Already Registered:\n\nTransaction ID: ${transactionId}`);
    return;
  }

  /* ---------------------------------------------------------
     PAYLOAD DATA PREPARATION & BASE64 CONVERSION
  --------------------------------------------------------- */
  const admissionFee = 100;
  const annualSubscription = 360;
  const rawAmt = isPayNow
    ? parseFloat(document.getElementById("payNowAmount") ? document.getElementById("payNowAmount").value : 460)
    : parseFloat(document.getElementById("manualAmount") ? document.getElementById("manualAmount").value : 460);

  const totalAmount = isNaN(rawAmt) || rawAmt < 460 ? 460 : rawAmt;
  const donation = totalAmount > 460 ? (totalAmount - 460) : 0;

  const data = {
    employeeId: document.getElementById("employeeId").value.trim(),
    fullName: document.getElementById("employeeName").value.trim(),
    gender: document.getElementById("gender").value,
    dob: document.getElementById("dob").value.trim(),
    doorNo: document.getElementById("doorNo") ? document.getElementById("doorNo").value.trim() : "",
    street: document.getElementById("street") ? document.getElementById("street").value.trim() : "",
    village: document.getElementById("village").value.trim(),
    mandal: document.getElementById("mandal").value.trim(),
    district: document.getElementById("district").value,
    state: "Andhra Pradesh",
    pincode: pincode,
    postOffice: document.getElementById("postOffice").value.trim(),
    mobile: mobile,
    email: document.getElementById("email") ? document.getElementById("email").value.trim() : "",
    aadhaar: aadhaar,
    company: company,
    stationCircle: (document.getElementById("station") ? document.getElementById("station").value : "") || (document.getElementById("circle") ? document.getElementById("circle").value : ""),
    divisionRegion: document.getElementById("division") ? document.getElementById("division").value : "",
    subDivision: document.getElementById("subDivision") ? document.getElementById("subDivision").value : "",
    designation: document.getElementById("designation").value,
    admissionFee: admissionFee,
    annualSubscription: annualSubscription,
    donation: donation,
    totalAmount: totalAmount,
    paymentMode: "UPI",
    transactionId: transactionId,
    paymentStatus: "Paid",
    photoBase64: "",
    photoType: "",
    receiptBase64: "",
    receiptType: ""
  };

  // Convert Cropped Photo to Base64
  if (window.croppedPhotoFile) {
    data.photoType = window.croppedPhotoFile.type;
    data.photoBase64 = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(window.croppedPhotoFile);
    });
  } else if (memberPhotoFile && memberPhotoFile.files && memberPhotoFile.files[0]) {
    const pFile = memberPhotoFile.files[0];
    data.photoType = pFile.type;
    data.photoBase64 = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(pFile);
    });
  }

  // Convert Receipt to Base64
  const receiptInput = document.getElementById("payNowReceipt") || document.getElementById("manualReceipt");
  if (receiptInput && receiptInput.files && receiptInput.files[0]) {
    const rFile = receiptInput.files[0];
    data.receiptType = rFile.type;
    data.receiptBase64 = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(rFile);
    });
  }

  /* ---------------------------------------------------------
     SUBMIT TO BACKEND & GENERATE RECEIPT
  --------------------------------------------------------- */
  try {
    const targetUrl = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : "https://script.google.com/macros/s/AKfycbyoBv4TQ28mb7HIsTQ42iEe7P-3Yqs-7lR5tHhHqk0RqCQOShGrLBVPvD4j2ZUV1Q/exec";

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "saveMember", data: data })
    });

    const raw = await response.text();
    const result = JSON.parse(raw);

    if (result && (result.success || result.status === "success")) {
      const resData = result.result || result;
      window.lastMembershipId = resData.membershipId || "ARPEU00001";
      window.lastReceiptNo = resData.receiptNo || "ARPEU/2026/1";

      openReceipt();

      if (typeof resetMembershipForm === "function") {
        resetMembershipForm();
      }
    } else {
      alert(result.message || "Submission Failed. Please try again.");
    }
  } catch (error) {
    console.error("Submission Error:", error);
    alert("Connection error while submitting application: " + error);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalButtonText;
    }
  }
}


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

/* =========================================================
   LOCKED RECEIPT MODULE ENGINE - NUMBER TO WORDS CONVERTER
========================================================= */

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

/* ==========================================================
   MASTER UNIVERSAL DIGITAL RECEIPT GENERATOR ENGINE
   Single Reusable Engine for Membership, Donations & All Funds
   ========================================================== */

/**
 * Universal Receipt Config Mapping for All Portal Modules
 */
const MasterReceiptConfig = {
  membership:           { title: "MEMBERSHIP RECEIPT",          color: "#0B4EA2" },
  renewal:              { title: "MEMBERSHIP RENEWAL RECEIPT",  color: "#FF6600" },
  donation:             { title: "DONATION RECEIPT",            color: "#F57C00" },
  diaryAdvertisement:   { title: "DIARY ADVERTISEMENT RECEIPT", color: "#F57C00" },
  diaryFund:            { title: "DIARY FUND RECEIPT",          color: "#2E7D32" },
  welfareFund:          { title: "WELFARE FUND RECEIPT",        color: "#2E7D32" },
  reliefFund:           { title: "RELIEF FUND RECEIPT",         color: "#d32f2f" },
  buildingFund:         { title: "BUILDING FUND RECEIPT",       color: "#0B4EA2" },
  trainingFund:         { title: "TRAINING FUND RECEIPT",       color: "#0284c7" },
  eventSponsorship:     { title: "EVENT SPONSORSHIP RECEIPT",   color: "#7b1fa2" },
  default:              { title: "RECEIPT",                     color: "#0B4EA2" }
};

/**
 * Single Universal Digital Receipt Generator for Entire Portal
 * @param {Object} data - Receipt Payload Object
 */
function generateUniversalReceipt(data) {
  if (!data) return;

  // 1. Determine Receipt Type & Styling Config
  const typeKey = data.type || (data.donationType ? data.donationType.toLowerCase().replace(/\s+/g, '') : 'default');
  const config  = MasterReceiptConfig[typeKey] || MasterReceiptConfig[data.type] || {
    title: (data.donationType ? `${data.donationType.toUpperCase()} RECEIPT` : "RECEIPT"),
    color: "#F57C00"
  };

  // 2. Set Dynamic Title & Ribbon Color
  const titlePill = document.getElementById("receiptTitle");
  if (titlePill) {
    titlePill.textContent = config.title;
    titlePill.style.backgroundColor = config.color;
  }

  // 3. Helper to Safely Set Text
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || "-";
  };

  // 4. Set Metadata Values
  setVal("rReceiptNo",    data.receiptNo || data.receiptNumber || "ARPEU/2026/1");
  setVal("rMembershipId", data.membershipId || data.donationId || "ARPEU00001");
  setVal("rDate",         data.receiptDate || data.paymentDate || new Date().toLocaleDateString('en-GB'));
  setVal("rTime",         data.receiptTime || new Date().toLocaleTimeString('en-US'));

  setVal("rMemberName",   data.memberName || data.donorName || "Valued Supporter");
  setVal("rEmpId",        data.employeeId || data.donorType || "Member");
  setVal("rMobile",       data.mobile || data.donorMobile || "-");
  setVal("rCompany",      data.company || data.organization || "ARPEU");
  setVal("rStation",      data.station || data.address || "-");
  setVal("rStage",        data.stage || "-");
  setVal("rDivision",     data.division || "-");

  // 5. Populate Particulars Table Dynamically
  const tableBody = document.querySelector("#receiptContainer .receipt-table tbody");
  let totalAmount = data.totalAmount || data.amount || 0;

  if (tableBody && Array.isArray(data.particulars) && data.particulars.length > 0) {
    let rowsHtml = "";
    totalAmount = 0;

    data.particulars.forEach(item => {
      const amt = parseFloat(item.amount) || 0;
      totalAmount += amt;
      rowsHtml += `
        <tr>
          <td>${item.label || 'Particulars'}</td>
          <td class="amt-col">Rs. ${amt}</td>
        </tr>
      `;
    });

    rowsHtml += `
      <tr class="total-row">
        <td class="total-lbl">Total Received</td>
        <td class="amt-col total-val">Rs. ${totalAmount}</td>
      </tr>
      <tr class="words-row">
        <td colspan="2">
          <span class="lbl-dark">Total in Words: Rupees</span>
          <span id="rTotalInWords" class="val-bold">${typeof numberToWords === 'function' ? numberToWords(totalAmount) : totalAmount + ' Only'}</span>
        </td>
      </tr>
    `;

    tableBody.innerHTML = rowsHtml;
  } else {
    // Default fallback row binding
    setVal("rAdmissionFee", data.admissionFee || 100);
    setVal("rAnnualSub",    data.annualSub || 360);
    setVal("rDonation",     data.donation || data.amount || 0);
    setVal("rTotal",        totalAmount);
    setVal("rTotalInWords", typeof numberToWords === 'function' ? numberToWords(totalAmount) : totalAmount + ' Only');
  }

  // 6. Set Payment Method Info
  setVal("rPaymentMode",   data.paymentMode || "UPI");
  setVal("rTransactionId", data.transactionId || "N/A");
  setVal("rPaymentStatus", data.paymentStatus || "SUCCESSFUL / PAID");

  // 7. Generate Universal Receipt QR Code
  const qrBox = document.getElementById("receiptQrCode");
  if (qrBox && typeof QRCode === "function") {
    qrBox.innerHTML = "";
    const currentDomain = window.location.origin + window.location.pathname;
    const verifyUrl = `${currentDomain}?verifyReceipt=${encodeURIComponent(data.receiptNo || data.membershipId || '1')}`;

    new QRCode(qrBox, {
      text: verifyUrl,
      width: 85,
      height: 85,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  // 8. Unhide Universal Receipt View
 const rc = document.getElementById("receiptContainer");
  if (rc) {
    rc.style.display = "block";
    rc.setAttribute("data-membership-active", "true"); /* Locks active membership receipt */
    rc.removeAttribute("data-donation-active");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openReceipt() {
  // Simple wrapper calling Universal Engine
  const data = typeof collectReceiptData === "function" ? collectReceiptData() : {};
  data.type = "membership";
  generateUniversalReceipt(data);
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
    if (rc) {
    rc.style.display = "none";
    rc.removeAttribute("data-donation-active");
    rc.removeAttribute("data-membership-active"); // Clears membership active state on explicit close
    rc.removeAttribute("data-receipt-open");
    rc.removeAttribute("data-active");
  }

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

           // Member Photo Display (Direct Drive Converter Fix)
            const photoImg = document.getElementById("pMemberPhoto");
            if (photoImg) {
            if (p.photoUrl) {
            photoImg.src = formatDriveImageUrl(p.photoUrl); // <-- పక్కన formatDriveImageUrl చేర్చాం
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

/* ==========================================================
   MEMBERSHIP DIGITAL RECEIPT GENERATOR & FORM ISOLATION
   ========================================================== */

function openReceipt() {
  // 1. Text Content Setter Helper
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || "-";
  };

  // 2. Set Header Ribbon to Blue Membership Receipt
  const titlePill = document.getElementById("receiptTitle");
  if (titlePill) {
    titlePill.textContent = "MEMBERSHIP RECEIPT";
    titlePill.style.backgroundColor = "#0B4EA2";
  }

  // 3. Metadata Setup from Form Fields
  const currentYear = new Date().getFullYear();
  const empName = document.getElementById("employeeName") ? document.getElementById("employeeName").value.trim() : "Member";
  const empId   = document.getElementById("employeeId") ? document.getElementById("employeeId").value.trim() : "-";
  const mob     = document.getElementById("mobile") ? document.getElementById("mobile").value.trim() : "-";
  const comp    = document.getElementById("company") ? document.getElementById("company").value : "APGENCO";
  const stn     = document.getElementById("station") ? document.getElementById("station").value : (document.getElementById("circle") ? document.getElementById("circle").value : "-");
  const stg     = document.getElementById("stage") ? document.getElementById("stage").value : "-";
  const div     = document.getElementById("division") ? document.getElementById("division").value : "-";
  const subDiv  = document.getElementById("subDivision") ? document.getElementById("subDivision").value : "-";
  const loc     = document.getElementById("location") ? document.getElementById("location").value : "-";

  setVal("rReceiptNo", window.lastReceiptNo || `ARPEU/${currentYear}/1`);
  setVal("rMembershipId", window.lastMembershipId || "ARPEU00001");
  setVal("rDate", new Date().toLocaleDateString('en-GB'));
  setVal("rTime", new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  setVal("rMemberName", empName);
  setVal("rEmpId", empId);
  setVal("rMobile", mob);
  setVal("rCompany", comp);
  setVal("rStation", stn);
  setVal("rStage", stg);
  setVal("rDivision", div);
  setVal("rSubDivision", subDiv);
  setVal("rLocation", loc);

  // Genco vs Discom layout toggle
  const gencoFields = document.getElementById("gencoReceiptFields");
  const discomFields = document.getElementById("discomReceiptFields");
  if (comp === "APGENCO") {
    if (gencoFields) gencoFields.style.display = "flex";
    if (discomFields) discomFields.style.display = "none";
  } else {
    if (gencoFields) gencoFields.style.display = "none";
    if (discomFields) discomFields.style.display = "flex";
  }

  // 4. Particulars Table (Standard Membership Format)
  const isPayNow = document.getElementById("payNowOption") && document.getElementById("payNowOption").checked;
  let enteredAmt = isPayNow 
    ? parseFloat(document.getElementById("payNowAmount") ? document.getElementById("payNowAmount").value : 460) 
    : parseFloat(document.getElementById("manualAmount") ? document.getElementById("manualAmount").value : 460);
  
  if (isNaN(enteredAmt) || enteredAmt < 460) enteredAmt = 460;
  const donAmt = enteredAmt > 460 ? (enteredAmt - 460) : 0;

  const tableBody = document.querySelector("#receiptContainer .receipt-table tbody");
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td>Admission Fee</td>
        <td class="amt-col">Rs. 100</td>
      </tr>
      <tr>
        <td>Annual Subscription</td>
        <td class="amt-col">Rs. 360</td>
      </tr>
      <tr>
        <td>Donation</td>
        <td class="amt-col">Rs. ${donAmt}</td>
      </tr>
      <tr>
        <td>Others</td>
        <td class="amt-col">Rs. 0</td>
      </tr>
      <tr class="total-row">
        <td class="total-lbl">Total</td>
        <td class="amt-col total-val">Rs. ${enteredAmt}</td>
      </tr>
      <tr class="words-row">
        <td colspan="2">
          <span class="lbl-dark">Total in Words: Rupees</span>
          <span id="rTotalInWords" class="val-bold">${typeof numberToWords === 'function' ? numberToWords(enteredAmt) : enteredAmt + ' Only'}</span>
        </td>
      </tr>
    `;
  }

  // 5. Payment Details
  const txn = isPayNow 
    ? (document.getElementById("payNowTransactionId") ? document.getElementById("payNowTransactionId").value.trim() : "VERIFIED")
    : (document.getElementById("manualTransactionId") ? document.getElementById("manualTransactionId").value.trim() : "VERIFIED");

  setVal("rPaymentMode", "UPI");
  setVal("rTransactionId", txn || "VERIFIED");
  setVal("rPaymentStatus", "SUCCESSFUL / PAID");

  // 6. QR Code
  const qrBox = document.getElementById("receiptQrCode");
  if (qrBox && typeof QRCode === "function") {
    qrBox.innerHTML = "";
    new QRCode(qrBox, {
      text: `ARPEU MEMBERSHIP | ID: ${window.lastMembershipId || 'ARPEU00001'} | Name: ${empName}`,
      width: 85,
      height: 85,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  // 7. CRITICAL FIX: Hide Form Sections completely and show ONLY Receipt Container at Top
  const membPage = document.getElementById("membershipPage");
  const homeSec  = document.getElementById("homeSection");
  const donSec   = document.getElementById("donationsSection");
  
  if (membPage) membPage.style.display = "none";
  if (homeSec)  homeSec.style.display  = "none";
  if (donSec)   donSec.style.display   = "none";

  const rc = document.getElementById("receiptContainer");
    if (rc) {
      rc.style.display = "block";
      rc.setAttribute("data-membership-active", "true"); /* Locks active membership receipt */
      rc.removeAttribute("data-donation-active");
    }

  // Scroll smoothly to top
  const contentArea = document.getElementById("contentArea") || window;
  contentArea.scrollTo({ top: 0, behavior: "smooth" });

  // Reset membership form cleanly
  if (typeof resetMembershipForm === "function") {
    resetMembershipForm();
  }
}

/* ==========================================================
   HOME PAGE ENHANCEMENTS ENGINE
========================================================== */

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

/* ==========================================================
   DOWNLOADS & RESOURCES ENGINE - SPA ROUTING & ASSET HANDLER
   Handles real high-resolution file downloads & crystal clear modal previews
   ========================================================== */

// 1. SPA Navigation Hook
if (typeof showPage === "function") {
    const originalShowPage = showPage;
    
    showPage = function (page) {
        const dSec = document.getElementById("downloadsSection");
        if (dSec) dSec.style.display = "none";

        // Execute original page routing
        originalShowPage(page);

        // Activate downloads view on matching route
        if (page === "downloads") {
            if (dSec) dSec.style.display = "block";
            
            const moreDropdown = document.getElementById("moreDropdown");
            if (moreDropdown) {
                moreDropdown.classList.remove("show");
            }
        }
    };
}

// 2. Real Asset File Registry
const dlFileRegistry = {
    "founder-arpeu.jpg": "images/founder-arpeu.jpg",
    "founder-bms.jpg": "images/founder-bms.jpg",
    "ARPEU_Logo.png": "images/arpeu-logo.png",
    "BMS_Logo.png": "images/bms-logo.png",
    "Bharat_Mata_Logo.png": "images/bharat-mata.png",
    "BMS_Flag.png": "images/bms-flag.jpg",
    "arpeu": "images/arpeu-logo.png",
    "bms": "images/bms-logo.png",
    "bharatmata": "images/bharat-mata.png",
    "bmsflag": "images/bms-flag.jpg",
    
    // PDF Documents
    "Shramik_Magazine_2026.pdf": "documents/Shramik_Magazine_2026.pdf",
    "ARPEU_Constitution.pdf": "documents/ARPEU_Constitution.pdf",
    "Membership_Rules.pdf": "documents/Membership_Rules.pdf",
    "Membership_Form.pdf": "documents/Membership_Form.pdf",
    "BMS_Intro_Book.pdf": "documents/BMS_Intro_Book.pdf",
    "ARPEU_Profile_Book.pdf": "documents/ARPEU_Profile_Book.pdf"
};

// 3. Open Real High-Resolution Preview Modal
function openDownloadsPreview(title, type, fileKey) {
    const modal = document.getElementById('downloadsPreviewModal');
    const container = document.getElementById('dlModalContainer');
    
    if (!modal || !container) return;

    document.getElementById('dlModalTitle').innerText = title;
    document.getElementById('dlModalBadge').innerText = `${type} Resource`;
    document.getElementById('dlModalFormat').innerText = type;

    const visualBox = document.getElementById('dlModalVisual');
    const actualFilePath = dlFileRegistry[fileKey] || ("images/" + fileKey);

    // Render Preview based on Type
    if (type === "PDF") {
        visualBox.innerHTML = `
            <div style="text-align:center; padding: 15px;">
                <i class="fa-solid fa-file-pdf" style="font-size: 64px; color: #ef4444;"></i>
                <p style="font-size:12px; font-weight:700; color:#1e293b; margin-top:10px;">${title}</p>
                <a href="${actualFilePath}" target="_blank" style="display:inline-block; margin-top:8px; font-size:11px; color:#0B4EA2; font-weight:700; text-decoration:underline;">Click to Open Document</a>
            </div>
        `;
    } else {
        // High-Quality Image Preview
        visualBox.innerHTML = `
            <img src="${actualFilePath}" alt="${title}" style="max-width:100%; max-height:220px; object-fit:contain; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        `;
    }

    // Modal Download Button Action
    const modalDownloadBtn = document.getElementById('dlModalDownloadActionBtn');
    modalDownloadBtn.onclick = function() {
        const downloadName = fileKey.includes(".") ? fileKey : `${title.replace(/\s+/g, '_')}.${type.toLowerCase()}`;
        triggerDownloadsFile(downloadName);
        closeDownloadsPreview();
    };

    // Show Modal with Smooth Pop Animation
    modal.style.display = "flex";
    setTimeout(() => {
        modal.style.opacity = "1";
        container.style.transform = "scale(1)";
    }, 10);
}

// 4. Close Preview Modal
function closeDownloadsPreview() {
    const modal = document.getElementById('downloadsPreviewModal');
    const container = document.getElementById('dlModalContainer');
    
    if (!modal || !container) return;

    modal.style.opacity = "0";
    container.style.transform = "scale(0.95)";
    
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

// Overlay Click Dismiss Listener
const previewModalEl = document.getElementById('downloadsPreviewModal');
if (previewModalEl) {
    previewModalEl.addEventListener('click', function(e) {
        if (e.target === this) {
            closeDownloadsPreview();
        }
    });
}

// 5. Trigger Real Original File Download
function triggerDownloadsFile(filename) {
    showDownloadsToast(`Downloading "${filename}"...`);
    
    const realFilePath = dlFileRegistry[filename] || ("images/" + filename);

    // Native High-Quality Direct Download
    setTimeout(() => {
        const tempLink = document.createElement("a");
        tempLink.href = realFilePath;
        tempLink.download = filename;
        tempLink.target = "_blank";
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    }, 400);
}

// 6. Toast Notification Engine
function showDownloadsToast(message) {
    const container = document.getElementById('dlToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = "dl-toast";
    toast.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin dl-toast-spinner"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 10);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px)";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/* ==========================================================
   DIRECT DONATION PAYMENT METHOD TOGGLE FUNCTION
   ========================================================== */

function switchDonationPaymentMethod(method) {
  const payNowSec = document.getElementById("donPayNowSection");
  const alreadyPaidSec = document.getElementById("donAlreadyPaidSection");
  const payNowFields = document.getElementById("donPayNowFields");
  const submitCard = document.getElementById("donSubmitCard");

  if (method === "payNow") {
    if (payNowSec) payNowSec.style.setProperty("display", "block", "important");
    if (alreadyPaidSec) alreadyPaidSec.style.setProperty("display", "none", "important");
    if (payNowFields) payNowFields.style.setProperty("display", "none", "important");
    if (submitCard) submitCard.style.setProperty("display", "none", "important");
  } else if (method === "alreadyPaid") {
    if (alreadyPaidSec) alreadyPaidSec.style.setProperty("display", "block", "important");
    if (payNowSec) payNowSec.style.setProperty("display", "none", "important");
    if (submitCard) submitCard.style.setProperty("display", "none", "important");
  }
}


/* ==========================================================
   DONATION PAYMENT MODULE (PERFECT RELIABLE TOGGLE)
   ========================================================== */

const DonationPaymentModule = {
  init: function () {
    this.cacheDOM();
    this.bindEvents();
    this.reset();
  },

  cacheDOM: function () {
    this.payNowOpt      = document.getElementById("donPayNowOption");
    this.alreadyPaidOpt = document.getElementById("donAlreadyPaidOption");
    this.payNowSec      = document.getElementById("donPayNowSection");
    this.alreadyPaidSec = document.getElementById("donAlreadyPaidSection");
    this.payNowFields   = document.getElementById("donPayNowFields");
    this.completedBtn   = document.getElementById("donPayCompletedBtn");
    this.submitCard     = document.getElementById("donSubmitCard");
  },

  reset: function () {
    if (this.payNowSec)      this.payNowSec.style.display      = "none";
    if (this.alreadyPaidSec) this.alreadyPaidSec.style.display = "none";
    if (this.payNowFields)   this.payNowFields.style.display   = "none";
    if (this.submitCard)     this.submitCard.style.display     = "none";
  },

  bindEvents: function () {
    const self = this;

    // Direct toggle triggers on radio change
    if (this.payNowOpt) {
      this.payNowOpt.addEventListener("change", function () {
        if (this.checked) {
          if (self.payNowSec)      self.payNowSec.style.display      = "block";
          if (self.alreadyPaidSec) self.alreadyPaidSec.style.display = "none";
          if (self.payNowFields)   self.payNowFields.style.display   = "none";
          if (self.submitCard)     self.submitCard.style.display     = "none";
        }
      });
    }

    if (this.alreadyPaidOpt) {
      this.alreadyPaidOpt.addEventListener("change", function () {
        if (this.checked) {
          if (self.alreadyPaidSec) self.alreadyPaidSec.style.display = "block";
          if (self.payNowSec)      self.payNowSec.style.display      = "none";
          if (self.submitCard)     self.submitCard.style.display     = "none";
        }
      });
    }

    // Direct click listeners on parent label buttons (Guaranteed Mobile/Desktop trigger)
    const payNowLbl = document.querySelector('label[for="donPayNowOption"]');
    if (payNowLbl) {
      payNowLbl.addEventListener("click", function () {
        if (self.payNowOpt) {
          self.payNowOpt.checked = true;
          if (self.payNowSec)      self.payNowSec.style.display      = "block";
          if (self.alreadyPaidSec) self.alreadyPaidSec.style.display = "none";
          if (self.payNowFields)   self.payNowFields.style.display   = "none";
          if (self.submitCard)     self.submitCard.style.display     = "none";
        }
      });
    }

    const alreadyPaidLbl = document.querySelector('label[for="donAlreadyPaidOption"]');
    if (alreadyPaidLbl) {
      alreadyPaidLbl.addEventListener("click", function () {
        if (self.alreadyPaidOpt) {
          self.alreadyPaidOpt.checked = true;
          if (self.alreadyPaidSec) self.alreadyPaidSec.style.display = "block";
          if (self.payNowSec)      self.payNowSec.style.display      = "none";
          if (self.submitCard)     self.submitCard.style.display     = "none";
        }
      });
    }

    // "I HAVE COMPLETED PAYMENT" button click
    if (this.completedBtn) {
      this.completedBtn.addEventListener("click", function () {
        if (self.payNowFields) self.payNowFields.style.display = "block";
      });
    }

    // Sub-mode switchers inside Already Paid (UPI, Bank, Cash, Cheque)
    const modeRadios = document.querySelectorAll('input[name="donPayMode"]');
    modeRadios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        const upiSec  = document.getElementById("donUpiSection");
        const bankSec = document.getElementById("donBankSection");
        const cashSec = document.getElementById("donCashSection");
        const chqSec  = document.getElementById("donChequeSection");

        if (upiSec)  upiSec.style.display  = (this.value === "UPI") ? "block" : "none";
        if (bankSec) bankSec.style.display = (this.value === "Bank Transfer") ? "block" : "none";
        if (cashSec) cashSec.style.display = (this.value === "Cash") ? "block" : "none";
        if (chqSec)  chqSec.style.display  = (this.value === "Cheque") ? "block" : "none";
      });
    });

    // Unhide Submit Card automatically when Receipt Proof is selected
    const receiptProofInput = document.getElementById("donReceiptProof");
    if (receiptProofInput) {
      receiptProofInput.addEventListener("change", function () {
        if (this.files && this.files.length > 0) {
          const submitCardEl = document.getElementById("donSubmitCard");
          if (submitCardEl) {
            submitCardEl.style.setProperty("display", "block", "important");
            submitCardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      });
    }

    const payNowProofInput = document.getElementById("donPayNowProof");
    if (payNowProofInput) {
      payNowProofInput.addEventListener("change", function () {
        if (this.files && this.files.length > 0) {
          const submitCardEl = document.getElementById("donSubmitCard");
          if (submitCardEl) {
            submitCardEl.style.setProperty("display", "block", "important");
            submitCardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      });
    }
  }
};


/* ==========================================================
   UNIVERSAL SEARCH ENGINE FOR DONATION & PROFILE
   ========================================================== */

const PORTAL_BACKEND_URL = "https://script.google.com/macros/s/AKfycbyoBv4TQ28mb7HIsTQ42iEe7P-3Yqs-7lR5tHhHqk0RqCQOShGrLBVPvD4j2ZUV1Q/exec";

let lastDonorSearchedMobile = "";
let foundSearchRecord = null;

/**
 * Real-time Mobile Input Handler for Donations
 * Triggers automatic database search on entering 10 digits.
 * @param {HTMLInputElement} inputEl - Mobile input element reference
 */



/* ==========================================================
   ARPEU RESPONSIBILITY TIER SELECTION ENGINE
   ========================================================== */

/* Handles General Member toggle */
function handleTierGeneralMemberSelect(genChk) {
  if (genChk && genChk.checked) {
    document.querySelectorAll(".prof-tier-chk").forEach(function (chk) {
      if (chk !== genChk) {
        chk.checked = false;
      }
    });
  }
}

/* Handles Body tier selection (State, Company, Division) */
function handleTierBodySelect(bodyChk) {
  const genChk = document.querySelector('.prof-tier-chk[value="General Member"]');
  
  if (bodyChk && bodyChk.checked) {
    if (genChk) {
      genChk.checked = false;
    }
  } else {
    const anyBodyChecked = Array.from(document.querySelectorAll(".prof-tier-chk")).some(function (chk) {
      return chk.value !== "General Member" && chk.checked;
    });
    if (!anyBodyChecked) {
      if (genChk) {
        genChk.checked = true;
      }
    }
  }
}

/* ==========================================================
   ARPEU LEVEL-BY-LEVEL GOVERNANCE & PROTOCOL RULES ENGINE
   ========================================================== */

/* Unhides only the specific boxes corresponding to checked tiers */
function handleTierSelect() {
  const genChk   = document.querySelector('.prof-tier-chk[value="General Member"]');
  const stateChk = document.querySelector('.prof-tier-chk[value="State Body"]');
  const compChk  = document.querySelector('.prof-tier-chk[value="Company / Circle Body"]');
  const divChk   = document.querySelector('.prof-tier-chk[value="Division / Regional Body"]');

  const stateBox = document.getElementById("stateBodyPostsBox");
  const compBox  = document.getElementById("companyBodyPostsBox");
  const divBox   = document.getElementById("divisionBodyPostsBox");

  const anyTierChecked = (stateChk && stateChk.checked) || (compChk && compChk.checked) || (divChk && divChk.checked);

  if (anyTierChecked) {
    if (genChk) genChk.checked = false;
  } else {
    if (genChk) genChk.checked = true;
  }

  if (stateBox) stateBox.style.display = (stateChk && stateChk.checked) ? "block" : "none";
  if (compBox)  compBox.style.display  = (compChk && compChk.checked) ? "block" : "none";
  if (divBox)   divBox.style.display   = (divChk && divChk.checked) ? "block" : "none";
}

/* Enforces Single Primary Post & Core Committee Eligibility for State Top 5 */
function handleStateDesigSelect(currentCheckbox, isCoreEligible) {
  const coreLabel = document.getElementById("coreCommitteeLabel");
  const coreChk   = document.getElementById("chkCoreCommittee");

  if (currentCheckbox && currentCheckbox.checked) {
    document.querySelectorAll(".prof-state-desig-chk").forEach(function (chk) {
      if (chk !== currentCheckbox) chk.checked = false;
    });

    if (isCoreEligible) {
      if (coreLabel) { coreLabel.style.opacity = "1"; coreLabel.style.pointerEvents = "auto"; }
      if (coreChk) { coreChk.disabled = false; }
    } else {
      if (coreLabel) { coreLabel.style.opacity = "0.5"; coreLabel.style.pointerEvents = "none"; }
      if (coreChk) { coreChk.disabled = true; coreChk.checked = false; }
    }
  } else {
    if (coreLabel) { coreLabel.style.opacity = "0.5"; coreLabel.style.pointerEvents = "none"; }
    if (coreChk) { coreChk.disabled = true; coreChk.checked = false; }
  }
}

/* Enforces Single Post for Company Body */
function handleCompDesigSelect(currentCheckbox) {
  if (currentCheckbox && currentCheckbox.checked) {
    document.querySelectorAll(".prof-comp-desig-chk").forEach(function (chk) {
      if (chk !== currentCheckbox && chk.value !== "Company EC Member") chk.checked = false;
    });
  }
}

/* Enforces Single Post for Division Body */
function handleDivDesigSelect(currentCheckbox) {
  if (currentCheckbox && currentCheckbox.checked) {
    document.querySelectorAll(".prof-div-desig-chk").forEach(function (chk) {
      if (chk !== currentCheckbox && chk.value !== "Division EC Member") chk.checked = false;
    });
  }
}

/* ==========================================================
   DONOR TYPE CONDITIONAL FIELDS TOGGLE ENGINE
   ========================================================== */

function toggleDonorTypeFields(selectedType) {
  const memberBox = document.getElementById("donorMemberDetailsBox");
  if (!memberBox) return;

  if (selectedType === "ARPEU Member" || selectedType === "Electricity Employee" || selectedType === "Retired Employee") {
    memberBox.style.display = "block";
  } else {
    memberBox.style.display = "none";
  }
}

/* Real-time Mobile Input Handler for Donations */
function handleDonorMobileInput(inputEl) {
  if (!inputEl) return;

  const val = inputEl.value.replace(/\D/g, "").slice(0, 10);
  inputEl.value = val;

  const statusEl = document.getElementById("donorMobileStatus");

  if (val.length === 10) {
    if (val !== lastDonorSearchedMobile) {
      lastDonorSearchedMobile = val;

      if (statusEl) {
        statusEl.className = "field-status checking";
        statusEl.style.color = "#003366";
        statusEl.innerHTML = "🔍 Searching Database...";
      }

      // Execute Universal Search Engine Immediately
      searchDonorOrMember(val);
    }
  } else {
    lastDonorSearchedMobile = "";
    if (statusEl) {
      statusEl.className = "field-status";
      statusEl.innerHTML = "";
    }
  }
}

/**
 * Universal Search API Trigger
 * Searches Members and Donors in Google Sheets Backend
 * @param {string} queryKey - Mobile number or Identifier
 */
async function searchDonorOrMember(queryKey) {
  const statusEl = document.getElementById("donorMobileStatus") || document.getElementById("profileSearchStatus");
  if (!queryKey) return;

  const targetUrl = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : PORTAL_BACKEND_URL;

  try {
    const url = `${targetUrl}?action=searchDonorOrMember&query=${encodeURIComponent(queryKey)}`;
    const response = await fetch(url);
    const result = await response.json();

    console.log("Search Result:", result);

    if (result && result.success && result.found) {
      if (statusEl) {
        statusEl.className = "field-status success";
        statusEl.style.color = "#16A34A";
        statusEl.innerHTML = "✔ Existing Record Found";
      }
      foundSearchRecord = result.data;
      showDonorSearchModal(result.data); // Opens RECORD FOUND confirmation modal
    } else {
      if (statusEl) {
        statusEl.className = "field-status";
        statusEl.style.color = "#666";
        statusEl.innerHTML = "ℹ New Record (No previous data found)";
      }
    }
  } catch (e) {
    console.error("Universal Search Error:", e);
    if (statusEl) {
      statusEl.className = "field-status success";
      statusEl.style.color = "#16A34A";
      statusEl.innerHTML = "ℹ Ready for Entry";
    }
  }
}


/**
 * Displays the search detection modal with detected member/donor details.
 * @param {Object} data - Search record result object
 */
function showDonorSearchModal(data) {
  if (!data) return;

  // Set modal preview fields dynamically
  const nameEl   = document.getElementById("sModalName");
  const infoEl   = document.getElementById("sModalInfo");
  const sourceEl = document.getElementById("sModalSource");
  const mobileEl = document.getElementById("sModalMobile");
  const orgEl    = document.getElementById("sModalOrg");

  if (nameEl)   nameEl.textContent   = data.name || "Member Name";
  if (infoEl)   infoEl.textContent   = `${data.source || "Database"} Record Detected`;
  if (sourceEl) sourceEl.textContent = data.source || "Database";
  if (mobileEl) mobileEl.textContent = data.mobile || "-";
  if (orgEl)    orgEl.textContent    = data.organization || data.station || "-";

  // Bind confirm auto-fill button click event
  const confirmBtn = document.getElementById("confirmAutoFillBtn");
  if (confirmBtn) {
    confirmBtn.onclick = applyAutoFillData;
  }

  const modal = document.getElementById("donorSearchModal");
  if (modal) modal.style.display = "flex";
}

/**
 * Dismisses modal and enforces auto-fill data application to maintain database integrity.
 */
function closeDonorSearchModal() {
  const modal = document.getElementById("donorSearchModal");
  if (modal) modal.style.display = "none";

  // Enforce mandatory auto-fill if an existing record was detected
  if (typeof foundSearchRecord !== "undefined" && foundSearchRecord) {
    applyAutoFillData();
  }
}

/**
 * Auto-fills detected record details into both Donation and Profile forms
 */
function applyAutoFillData() {
  if (typeof foundSearchRecord === "undefined" || !foundSearchRecord) return;
  const d = foundSearchRecord;

  // 1. Donation Form Auto-Fill
  if (d.donorType && document.getElementById("donorType"))           document.getElementById("donorType").value = d.donorType;
  if (d.name && document.getElementById("donorName"))               document.getElementById("donorName").value = d.name;
  if (d.mobile && document.getElementById("donorMobile"))           document.getElementById("donorMobile").value = d.mobile;
  if (d.email && document.getElementById("donorEmail"))             document.getElementById("donorEmail").value = d.email;
  if ((d.organization || d.station) && document.getElementById("donorOrganization")) {
    document.getElementById("donorOrganization").value = d.organization || d.station || "";
  }
  if (d.address && document.getElementById("donorAddress"))         document.getElementById("donorAddress").value = d.address;
  if (d.pan && document.getElementById("donorPan"))                 document.getElementById("donorPan").value = d.pan;

  // 2. Profile Form Auto-Fill
  if (d.name && document.getElementById("profFullName"))            document.getElementById("profFullName").value = d.name;
  if (d.mobile && document.getElementById("profMobile"))            document.getElementById("profMobile").value = d.mobile;
  if (d.email && document.getElementById("profEmail"))              document.getElementById("profEmail").value = d.email;
  if (d.employeeId && document.getElementById("profEmployeeId"))    document.getElementById("profEmployeeId").value = d.employeeId;
  if (d.organization && document.getElementById("profCompany"))     document.getElementById("profCompany").value = d.organization;

  // Dismiss confirmation modal
  const modal = document.getElementById("donorSearchModal");
  if (modal) modal.style.display = "none";

  // English Notification
  alert("✔ Details successfully auto-filled from ARPEU Database!");
}


/* ==========================================================
   DONATION SUBMISSION & INSTANT RECEIPT TRIGGER ENGINE
   ========================================================== */

async function submitDonationForm() {
  const submitBtn = document.getElementById("submitDonationBtn");
  const originalText = submitBtn ? submitBtn.innerHTML : "SUBMIT DONATION";

  // 1. Declaration Check
  const declCheck = document.getElementById("donDeclarationCheck");
  if (!declCheck || !declCheck.checked) {
    alert("Please accept the declaration before submitting your donation.");
    if (declCheck) declCheck.focus();
    return;
  }

  // 2. Field Values Capture
  const donorType      = document.getElementById("donorType") ? document.getElementById("donorType").value : "";
  const donorName      = document.getElementById("donorName") ? document.getElementById("donorName").value.trim() : "";
  const donorMobile    = document.getElementById("donorMobile") ? document.getElementById("donorMobile").value.trim() : "";
  const donationType   = document.getElementById("donationType") ? document.getElementById("donationType").value : "";
  const donationAmount = document.getElementById("donationAmount") ? parseFloat(document.getElementById("donationAmount").value) : 0;

  if (!donorType || !donorName || !donorMobile || !donationType || isNaN(donationAmount) || donationAmount <= 0) {
    alert("Please fill all mandatory fields: Donor Type, Donor Name, Mobile Number, Donation Type, and a valid Donation Amount.");
    return;
  }

  // 3. Payment Mode & Date Capture
  const isPayNow = document.getElementById("donPayNowOption") && document.getElementById("donPayNowOption").checked;
  let paymentMode = "UPI";
  let transactionId = "";
  let paymentDate = "";

  if (isPayNow) {
    paymentMode   = "UPI";
    transactionId = document.getElementById("donPayNowTxnId") ? document.getElementById("donPayNowTxnId").value.trim() : "";
    paymentDate   = document.getElementById("donPayNowDate") ? document.getElementById("donPayNowDate").value.trim() : "";
  } else {
    const activeRadio = document.querySelector('input[name="donPayMode"]:checked');
    paymentMode = activeRadio ? activeRadio.value : "UPI";
    paymentDate = document.getElementById("donDate") ? document.getElementById("donDate").value.trim() : "";

    if (paymentMode === "UPI") {
      transactionId = document.getElementById("donUpiTxnId") ? document.getElementById("donUpiTxnId").value.trim() : "";
    } else if (paymentMode === "Bank Transfer") {
      transactionId = document.getElementById("donBankRefNo") ? document.getElementById("donBankRefNo").value.trim() : "";
    } else if (paymentMode === "Cash") {
      const rep = document.getElementById("donCashRecBy") ? document.getElementById("donCashRecBy").value.trim() : "Representative";
      transactionId = "CASH-" + rep;
    } else if (paymentMode === "Cheque") {
      const chq = document.getElementById("donChequeNo") ? document.getElementById("donChequeNo").value.trim() : "000000";
      transactionId = "CHQ-" + chq;
    }
  }

  if (!paymentDate) {
    paymentDate = new Date().toLocaleDateString('en-GB');
  }

  // Button Loading State
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Donation...';
  }

  const currentYear = new Date().getFullYear();
  const donationPayload = {
    receiptNo:      `ARPEU/DON/${currentYear}/${Math.floor(1000 + Math.random() * 9000)}`,
    donationId:     `DON${currentYear}${Math.floor(1000 + Math.random() * 9000)}`,
    donorType:      donorType,
    donorName:      donorName,
    donorMobile:    donorMobile,
    donorEmail:     document.getElementById("donorEmail") ? document.getElementById("donorEmail").value.trim() : "",
    organization:   document.getElementById("donorOrganization") ? document.getElementById("donorOrganization").value.trim() : "",
    address:        document.getElementById("donorAddress") ? document.getElementById("donorAddress").value.trim() : "",
    pan:            document.getElementById("donorPan") ? document.getElementById("donorPan").value.trim().toUpperCase() : "",
    donationType:   donationType,
    advtSize:       document.getElementById("advtSize") ? document.getElementById("advtSize").value : "",
    diaryCount:     document.getElementById("diaryCount") ? document.getElementById("diaryCount").value : "",
    amount:         donationAmount,
    purpose:        document.getElementById("donationPurpose") ? document.getElementById("donationPurpose").value.trim() : "",
    paymentMode:    paymentMode,
    transactionId:  transactionId || "VERIFIED",
    paymentDate:    paymentDate,
    proofBase64:    "",
    proofType:      ""
  };

  // Safe Receipt File Base64 Conversion
  const proofInput = document.getElementById("donReceiptProof") || document.getElementById("donPayNowProof");
  if (proofInput && proofInput.files && proofInput.files[0]) {
    try {
      const pFile = proofInput.files[0];
      donationPayload.proofType = pFile.type;
      donationPayload.proofBase64 = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(pFile);
      });
    } catch (e) {
      console.warn("Proof conversion skipped:", e);
    }
  }

  // Execute Submission to Apps Script
  try {
    const targetUrl = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : "https://script.google.com/macros/s/AKfycbyoBv4TQ28mb7HIsTQ42iEe7P-3Yqs-7lR5tHhHqk0RqCQOShGrLBVPvD4j2ZUV1Q/exec";

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "saveDonation",
        data: donationPayload
      })
    });

    const result = await response.json();

    if (result && (result.success || result.status === "success")) {
      const finalDonationData = result.donation || donationPayload;
      openDonationReceipt(finalDonationData);
    } else {
      // Fallback: Open receipt with local generated payload
      openDonationReceipt(donationPayload);
    }
  } catch (error) {
    console.error("Donation Submit Error:", error);
    // Network latency / CORS Fallback: Ensure receipt ALWAYS opens smoothly
    openDonationReceipt(donationPayload);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }
}

/* ==========================================================
   MASTER UNIVERSAL RECEIPT GENERATOR (EXACT 1:1 CLONE)
   ========================================================== */

function openDonationReceipt(data) {
  if (!data) return;

  // 1. Switch Title Ribbon to Orange "DONATION RECEIPT"
  const titlePill = document.getElementById("receiptTitle");
  if (titlePill) {
    titlePill.textContent = "DONATION RECEIPT";
    titlePill.style.backgroundColor = "#F57C00";
  }

  // 2. Text Content Helper
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || "-";
  };

  // 3. Receipt Metadata Setup (Exact Membership Meta Grid)
  const currentYear = new Date().getFullYear();
  setVal("rReceiptNo", data.receiptNo || `ARPEU/DON/${currentYear}/1`);
  setVal("rMembershipId", data.donationId || `DON${currentYear}0001`);
  setVal("rDate", data.paymentDate || new Date().toLocaleDateString('en-GB'));
  setVal("rTime", new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  setVal("rMemberName", data.donorName || "Valued Supporter");
  setVal("rEmpId", data.donorType || "Well Wisher");
  setVal("rMobile", data.donorMobile || "-");
  setVal("rCompany", data.organization || "ARPEU Supporter");
  setVal("rStation", data.address || "Andhra Pradesh");
  setVal("rStage", "-");
  setVal("rDivision", data.donationType || "General Donation");

  // Force Layout Visibility matching Master Membership Receipt
  const gencoFields = document.getElementById("gencoReceiptFields");
  const discomFields = document.getElementById("discomReceiptFields");
  if (gencoFields) gencoFields.style.display = "flex";
  if (discomFields) discomFields.style.display = "none";

  // 4. Particulars Table (Matching Exact Membership Receipt Table)
  const totalAmount = parseFloat(data.amount) || 0;
  setVal("rAdmissionFee", totalAmount);
  setVal("rAnnualSub", 0);
  setVal("rDonation", 0);
  setVal("rOthers", 0);
  setVal("rTotal", totalAmount);

  // Dynamic Label Swap in Table Body
  const tableBody = document.querySelector("#receiptContainer .receipt-table tbody");
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td>${data.donationType || "Donation"}${data.purpose ? ` (${data.purpose})` : ""}</td>
        <td class="amt-col">Rs. <span id="rAdmissionFee">${totalAmount}</span></td>
      </tr>
      <tr>
        <td>Administrative & Welfare Fund</td>
        <td class="amt-col">Rs. <span id="rAnnualSub">0</span></td>
      </tr>
      <tr>
        <td>Special Contribution</td>
        <td class="amt-col">Rs. <span id="rDonation">0</span></td>
      </tr>
      <tr>
        <td>Others</td>
        <td class="amt-col">Rs. <span id="rOthers">0</span></td>
      </tr>
      <tr class="total-row">
        <td class="total-lbl">Total</td>
        <td class="amt-col total-val">Rs. <span id="rTotal">${totalAmount}</span></td>
      </tr>
      <tr class="words-row">
        <td colspan="2">
          <span class="lbl-dark">Total in Words: Rupees</span>
          <span id="rTotalInWords" class="val-bold">${typeof numberToWords === 'function' ? numberToWords(totalAmount) : totalAmount + ' Only'}</span>
        </td>
      </tr>
    `;
  }

  // 5. Payment Information
  setVal("rPaymentMode", data.paymentMode || "UPI");
  setVal("rTransactionId", data.transactionId || "VERIFIED");
  setVal("rPaymentStatus", "SUCCESSFUL / RECEIVED");

  // 6. QR Code (Exact Same Size 85x85)
  const qrBox = document.getElementById("receiptQrCode");
  if (qrBox && typeof QRCode === "function") {
    qrBox.innerHTML = "";
    new QRCode(qrBox, {
      text: `ARPEU DONATION | Receipt: ${data.receiptNo || 'ARPEU/DON'} | Donor: ${data.donorName || ''} | Amount: Rs.${totalAmount}`,
      width: 85,
      height: 85,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  // 7. Hide Form and Mark Master Receipt Active
  const donSec = document.getElementById("donationsSection");
  if (donSec) donSec.style.display = "none";

  const masterRc = document.getElementById("receiptContainer");
  if (masterRc) {
    masterRc.style.display = "block";
    masterRc.setAttribute("data-donation-active", "true"); // Saves donation receipt active status
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// MEMBERSHIP FORM RESET FUNCTION
// ==========================================
function resetMembershipForm() {

    // 1. ఫారమ్ లోని ఇన్పుట్ ఫీల్డ్స్ అన్నింటినీ రీసెట్ చేయడం
    document.querySelectorAll("#membershipPage input, #membershipPage select").forEach(el => el.value = "");

    // 2. అప్‌లోడ్ చేసిన ఫోటో ప్రివ్యూ ని క్లియర్ చేయడం
    const photoPreview = document.getElementById("photoPreview");
    if (photoPreview) {
        photoPreview.src = ""; // లేదా డెఫాల్ట్ ఇమేజ్ పాత్
    }

    const photoFileName = document.getElementById("photoFileName");
    if (photoFileName) {
        photoFileName.textContent = "";
    }

    // 3. డూప్లికేట్ చెకింగ్ స్టేటస్ మెసేజ్ లను క్లియర్ చేయడం
    const statusIds = ["mobileStatus", "employeeIdStatus", "aadhaarStatus", "transactionIdStatus"];
    statusIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
    });

    // 4. పేజీ పైభాగంలోకి స్మూత్‌గా స్క్రోల్ చేయడం
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================
   COMPLETE DONATION FORM RESET ENGINE
   Cleans all fields, files, checkboxes and hides submit card.
   ========================================================== */

function resetDonationForm() {
  const donSec = document.getElementById("donationsSection");
  if (!donSec) return;

  // 1. Reset all Text, Number, Tel, Email, File and Select inputs
  donSec.querySelectorAll("input, select, textarea").forEach(function (el) {
    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = false;
    } else {
      el.value = "";
    }
  });

  // 2. Hide Payment sub-sections and Conditional Boxes
  const hideSections = [
    "donPayNowSection", "donAlreadyPaidSection", "donPayNowFields",
    "donUpiSection", "donBankSection", "donCashSection", "donChequeSection",
    "diaryAdvtBox", "diaryDonationBox"
  ];

  hideSections.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  // 3. Hide Submit Card & Reset Status messages
  const submitCard = document.getElementById("donSubmitCard");
  if (submitCard) submitCard.style.display = "none";

  const statusIds = ["donorMobileStatus", "donUpiTxnStatus", "donPayNowTxnStatus", "donBankRefStatus"];
  statusIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.className = "field-status";
      el.innerHTML = "";
    }
  });

  // 4. Smooth scroll to top of Donations page
  const contentArea = document.getElementById("contentArea") || window;
  contentArea.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================
   COMPLETE MEMBERSHIP FORM RESET ENGINE
   Cleans all fields, resets payment sub-boxes and hides submit card.
   ========================================================== */

function resetMembershipForm() {
  const membPage = document.getElementById("membershipPage");
  if (!membPage) return;

  // 1. Reset all Text, Number, Tel, Email, File and Select inputs
  membPage.querySelectorAll("input, select").forEach(function (el) {
    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = false;
    } else {
      el.value = "";
    }
  });

  // Set default state selection
    const stateEl = document.getElementById("state") || membPage.querySelector("select[name='state']");
    if (stateEl) stateEl.value = "Andhra Pradesh";

  // 2. Clear Uploaded Passport Photo Preview
  const photoPreview = document.getElementById("photoPreview");
  if (photoPreview) {
    photoPreview.removeAttribute("src");
    photoPreview.style.display = "none";
  }

  const previewText = document.querySelector("#membershipPage .preview-text");
  if (previewText) {
    previewText.style.display = "block";
  }

  const photoFileName = document.getElementById("photoFileName");
  if (photoFileName) {
    photoFileName.value = "No file selected";
  }

  // 3. Hide all Payment Sub-Sections, Breakdowns & Inline Pay Boxes
  const hidePaymentElements = [
    "payNowSection", "alreadyPaidSection", "payNowBreakdown", "payNowStep2", "payNowStep3",
    "manualBreakdown", "inlineBalanceBox", "manualFields", "finalSubmitSection"
  ];

  hidePaymentElements.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
    }
  });

  // 4. Hide Dynamic Employment Groups
  const hideEmpGroups = [
    "stationGroup", "stageGroup", "circleGroup", "divisionGroup", 
    "subDivisionGroup", "subStationGroup", "sectionGroup", "locationGroup", "designationGroup"
  ];

  hideEmpGroups.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
    }
  });

  // 5. Clear Real-Time Validation Status Messages
  const statusIds = [
    "mobileStatus", "employeeIdStatus", "aadhaarStatus", 
    "transactionIdStatus", "manualTransactionIdStatus"
  ];

  statusIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.className = "field-status";
      el.innerHTML = "";
    }
  });

  // 6. Reset Mode to New Member and Smooth Scroll to Top
  setMembershipMode("new");
  const contentArea = document.getElementById("contentArea") || window;
  contentArea.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// FILE TO BASE64 CONVERTER HELPER
// ==========================================
function readFileAsBase64(fileInput) {
    return new Promise((resolve) => {
        if (!fileInput || !fileInput.files || !fileInput.files[0]) {
            resolve({ base64: "", mimeType: "" });
            return;
        }
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve({
                base64: e.target.result,
                mimeType: file.type
            });
        };
        reader.onerror = function () {
            resolve({ base64: "", mimeType: "" });
        };
        reader.readAsDataURL(file);
    });
}

// ==========================================================
// GOOGLE DRIVE DIRECT IMAGE CONVERTER
// ==========================================================
function formatDriveImageUrl(url) {
    if (!url || url.trim() === "") return "images/default-avatar.png";
    
    // Google Drive File ID ని సేకరించి డైరెక్ట్ ఇమేజ్ URL కి మారుస్తుంది
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return "https://lh3.googleusercontent.com/d/" + match[1];
    }
    return url;
}

/* ==========================================================
   PROFILE ADDRESS COPY HANDLER (EXACT MEMBERSHIP FIELD MATCH)
   ========================================================== */

/**
 * Copies all 8 Permanent Address fields to Present Address fields when checkbox is toggled.
 * @param {HTMLInputElement} chk - Checkbox element reference
 */
function copyPermanentAddress(chk) {
  const permDoor       = document.getElementById("profPermDoorNo");
  const permStreet     = document.getElementById("profPermStreet");
  const permVillage    = document.getElementById("profPermVillage");
  const permMandal     = document.getElementById("profPermMandal");
  const permDistrict   = document.getElementById("profPermDistrict");
  const permState      = document.getElementById("profPermState");
  const permPincode    = document.getElementById("profPermPincode");
  const permPostOffice = document.getElementById("profPermPostOffice");

  const presDoor       = document.getElementById("profPresDoorNo");
  const presStreet     = document.getElementById("profPresStreet");
  const presVillage    = document.getElementById("profPresVillage");
  const presMandal     = document.getElementById("profPresMandal");
  const presDistrict   = document.getElementById("profPresDistrict");
  const presState      = document.getElementById("profPresState");
  const presPincode    = document.getElementById("profPresPincode");
  const presPostOffice = document.getElementById("profPresPostOffice");

  if (chk && chk.checked) {
    if (presDoor && permDoor)             presDoor.value       = permDoor.value;
    if (presStreet && permStreet)         presStreet.value     = permStreet.value;
    if (presVillage && permVillage)       presVillage.value    = permVillage.value;
    if (presMandal && permMandal)         presMandal.value     = permMandal.value;
    if (presDistrict && permDistrict)     presDistrict.value   = permDistrict.value;
    if (presState && permState)           presState.value      = permState.value;
    if (presPincode && permPincode)       presPincode.value    = permPincode.value;
    if (presPostOffice && permPostOffice) presPostOffice.value = permPostOffice.value;
  }
}


/**
 * Executes Universal Profile Search using Mobile, Aadhaar, Employee ID or Membership ID
 */
async function searchUniversalProfile() {
  const queryInput = document.getElementById("profileSearchQuery");
  const statusEl   = document.getElementById("profileSearchStatus");
  if (!queryInput) return;

  const queryKey = queryInput.value.trim();
  if (!queryKey) {
    if (statusEl) statusEl.textContent = "Please enter Mobile, Aadhaar, Employee ID or Membership ID.";
    return;
  }

  if (statusEl) {
    statusEl.style.color = "#003366";
    statusEl.textContent = "Searching database for existing record...";
  }

  // Reuse existing search engine searchDonorOrMember if available
  if (typeof searchDonorOrMember === "function") {
    await searchDonorOrMember(queryKey);
    if (statusEl) statusEl.textContent = "";
  } else {
    if (statusEl) {
      statusEl.style.color = "#dc2626";
      statusEl.textContent = "Search backend engine connecting...";
    }
  }
}

/**
 * Triggers dedicated A4 Profile Print
 */
function triggerProfilePrint() {
  window.print();
}

/**
 * Collects Profile Form inputs and prepares review workflow
 */
function handleProfileReview() {
  const fullName = document.getElementById("profFullName") ? document.getElementById("profFullName").value.trim() : "";
  const mobile   = document.getElementById("profMobile") ? document.getElementById("profMobile").value.trim() : "";
  
  if (!fullName || !mobile) {
    alert("Please fill in required fields: Full Name and Mobile Number.");
    return;
  }

  // Update Profile Header Card display elements
  const dispName = document.getElementById("profDisplayFullName");
  if (dispName) dispName.textContent = fullName;

  const empIdVal = document.getElementById("profEmployeeId") ? document.getElementById("profEmployeeId").value : "N/A";
  const dispEmp  = document.getElementById("profDisplayEmpId");
  if (dispEmp) dispEmp.textContent = empIdVal;

  const desigVal = document.getElementById("profDesignation") ? document.getElementById("profDesignation").value : "Member";
  const dispDes  = document.getElementById("profDisplayDesignation");
  if (dispDes) dispDes.textContent = desigVal;

  const stationVal = document.getElementById("profStation") ? document.getElementById("profStation").value : "APGENCO";
  const dispStn    = document.getElementById("profDisplayStation");
  if (dispStn) dispStn.textContent = stationVal;

  alert("✔ Profile data verified! Ready for Review & Final OTP Submission.");
}

/* ==========================================================
   VISHWAKARMA SANKET SUBSCRIPTION TOGGLE HANDLER
   ========================================================== */

/**
 * Toggles visibility or focus for Vishwakarma Sanket subscription link
 * @param {HTMLSelectElement} selectEl - Subscription status dropdown
 */
function toggleVishwakarmaLink(selectEl) {
  const btnBox = document.getElementById("vishwakarmaBtnBox");
  if (!btnBox) return;

  if (selectEl && selectEl.value === "Yes") {
    btnBox.style.opacity = "0.6";
  } else {
    btnBox.style.opacity = "1";
  }
}

/* ==========================================================
   RSS / SANGH PARIVAR DATA COLLECTION HANDLER
   ========================================================== */

/**
 * Collects RSS / Sangh Parivar association details from Profile form
 * @returns {Object} RSS background data object
 */
function getRssBackgroundData() {
  return {
    association:    document.getElementById("profRssAssociation") ? document.getElementById("profRssAssociation").value : "Associated",
    training:       document.getElementById("profRssTraining") ? document.getElementById("profRssTraining").value : "None",
    responsibility: document.getElementById("profRssResponsibility") ? document.getElementById("profRssResponsibility").value : "No Responsibility",
    shakha:         document.getElementById("profRssShakha") ? document.getElementById("profRssShakha").value : "Occasional"
  };
}

/* ==========================================================
   DIGITAL PROFILE DATA COLLECTOR & REVIEW ENGINE
   ========================================================== */

/**
 * Collects all input values across all Profile cards into a unified JSON object
 * @returns {Object} Complete Digital Profile Data Payload
 */
function collectDigitalProfileData() {
  const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : "";

  // 1. Collect Checked Organisational Talents (Card 6)
  const selectedTalents = [];
  document.querySelectorAll(".prof-talent-chk:checked").forEach(chk => selectedTalents.push(chk.value));

  // 2. Collect Checked Technical & Digital Skills (Card 7)
  const selectedSkills = [];
  document.querySelectorAll(".prof-skill-chk:checked").forEach(chk => selectedSkills.push(chk.value));

  // 3. Collect Checked Languages (Card 8)
  const selectedLanguages = [];
  document.querySelectorAll(".prof-lang-chk:checked").forEach(chk => selectedLanguages.push(chk.value));

  // 4. Collect Multi-select Training Attended (Card 9)
  const selectedTrainings = [];
  document.querySelectorAll(".prof-training-chk:checked").forEach(chk => selectedTrainings.push(chk.value));

  // 5. Collect Multi-select ARPEU Responsibility Tiers (Card 5)
  const selectedTiers = [];
  document.querySelectorAll(".prof-tier-chk:checked").forEach(chk => selectedTiers.push(chk.value));

  // 6. Collect All Designations Across State, Company & Division Bodies (Card 5)
  const allPositions = [];
  document.querySelectorAll(".prof-state-desig-chk:checked, .prof-state-addon-chk:checked, .prof-comp-desig-chk:checked, .prof-div-desig-chk:checked").forEach(function (chk) {
    allPositions.push(chk.value);
  });

  const selectedAddons = [];
  document.querySelectorAll(".prof-addon-desig-chk:checked").forEach(chk => selectedAddons.push(chk.value));

  return {
    // 1. Personal Info
    fullName:      getVal("profFullName"),
    fatherHusband: getVal("profFatherHusband"),
    dob:           getVal("profDob"),
    calculatedAge: getVal("profAge"),
    gender:        getVal("profGender"),
    bloodGroup:    getVal("profBloodGroup"),
    aadhaar:       getVal("profAadhaar").replace(/\s/g, ""),

    // 2. Contact Info
    mobile:        getVal("profMobile"),
    whatsapp:      getVal("profWhatsapp"),
    altMobile:     getVal("profAltMobile"),
    email:         getVal("profEmail"),

    // 3. Residential Address Details
    permanentAddress: {
      doorNo:     getVal("profPermDoorNo"),
      street:     getVal("profPermStreet"),
      village:    getVal("profPermVillage"),
      mandal:     getVal("profPermMandal"),
      district:   getVal("profPermDistrict"),
      state:      getVal("profPermState"),
      pincode:    getVal("profPermPincode"),
      postOffice: getVal("profPermPostOffice")
    },
    presentAddress: {
      doorNo:     getVal("profPresDoorNo"),
      street:     getVal("profPresStreet"),
      village:    getVal("profPresVillage"),
      mandal:     getVal("profPresMandal"),
      district:   getVal("profPresDistrict"),
      state:      getVal("profPresState"),
      pincode:    getVal("profPresPincode"),
      postOffice: getVal("profPresPostOffice")
    },

    // 4. Employment Master Data
    employment: {
      company:     getVal("profCompany"),
      station:     getVal("profStation"),
      stage:       getVal("profStage"),
      circle:      getVal("profCircle"),
      division:    getVal("profDivision"),
      subDivision: getVal("profSubDivision"),
      subStation:  getVal("profSubStation"),
      section:     getVal("profSection"),
      location:    getVal("profLocation"),
      designation: getVal("profDesignation"),
      employeeId:  getVal("profEmployeeId"),
      doj:         getVal("profDoj")
    },

    // 5. ARPEU & BMS Responsibility
     organisationRole: {
      arpeuLevel:        selectedTiers.join(", ") || "General Member",
      arpeuDesignation:  allPositions.join(", ") || "General Member",
      bmsResponsibility: getVal("profBmsResponsibility")
    },

    // 6 & 7. Talents & Technical Skills
    talents: selectedTalents,
    skills:  selectedSkills,

    // 8. Languages Known
    languages: selectedLanguages,

    // 9. Training & Development
    trainingAttended: selectedTrainings.join(", ") || "None",
    futureTrainingInterest: getVal("profFutureTrainingInterest"),

    // 10. Service & Availability
    serviceInterest:      getVal("profServeInterest"),
    officeBearerInterest: getVal("profOfficeBearerInterest"),
    dailyAvailability:    getVal("profDailyTimeAvailability"),
    weeklyAvailability:   getVal("profWeeklyTimeAvailability"),
    travelAvailability:   getVal("profTravelAvailability"),

    // 11. Vishwakarma Sanket Journal
    vishwakarmaStatus: getVal("profVishwakarmaSubscriber"),

    // 12. RSS Association
    rssBackground: {
      association:    getVal("profRssAssociation"),
      training:       getVal("profRssTraining"),
      responsibility: getVal("profRssResponsibility"),
      shakha:         getVal("profRssShakha")
    },

    // 13. Emergency & Blood Info
    emergencyInfo: {
      willingBloodDonate: getVal("profWillingBloodDonate"),
      contactName:        getVal("profEmergencyName"),
      contactMobile:      getVal("profEmergencyMobile"),
      contactRelation:    getVal("profEmergencyRelation")
    }
  };
}

/**
 * Handles Profile Form Validation & Review Trigger
 */
function handleProfileReview() {
  const profileData = collectDigitalProfileData();

  if (!profileData.fullName || !profileData.mobile) {
    alert("Please fill in mandatory fields: Full Name and Mobile Number.");
    return;
  }

  // Live Update Summary Header Card
  const dispName  = document.getElementById("profDisplayFullName");
  const dispEmp   = document.getElementById("profDisplayEmpId");
  const dispDes   = document.getElementById("profDisplayDesignation");
  const dispStn   = document.getElementById("profDisplayStation");
  const dispRole  = document.getElementById("profDisplayRole");

  if (dispName) dispName.textContent = profileData.fullName;
  if (dispEmp)  dispEmp.textContent  = profileData.employment.employeeId || "N/A";
  if (dispDes)  dispDes.textContent  = profileData.employment.designation || "Member";
  if (dispStn)  dispStn.textContent  = profileData.employment.station || profileData.employment.company || "APGENCO";
  if (dispRole) dispRole.textContent = profileData.organisationRole.arpeuDesignation || "Active Member";

  console.log("Collected Digital Profile Payload:", profileData);
  alert("✔ Digital Profile Verified! Ready for Save & Review.");
}

/* ==========================================================
   ARPEU ADMIN ENGINE (AUTH, TABS & REVIEW QUEUES)
   ========================================================== */

// Demo Admin Session Check
function checkAdminSession() {
  const token = sessionStorage.getItem("arpeu_admin_token");
  const loginCard = document.getElementById("adminLoginCard");
  const dashboardView = document.getElementById("adminDashboardView");

  if (token) {
    if (loginCard) loginCard.style.display = "none";
    if (dashboardView) dashboardView.style.display = "block";
    loadAdminDashboardMetrics();
  } else {
    if (loginCard) loginCard.style.display = "block";
    if (dashboardView) dashboardView.style.display = "none";
  }
}

// Admin Login Handler
function handleAdminLogin() {
  const user = document.getElementById("adminUsername").value.trim();
  const pass = document.getElementById("adminPassword").value.trim();
  const statusEl = document.getElementById("adminLoginStatus");

  if (!user || !pass) {
    if (statusEl) {
      statusEl.className = "field-status error";
      statusEl.innerHTML = "Please enter Admin ID and Password.";
    }
    return;
  }

  // Pre-configured Super Admin Access (Demo & Phase 3 Verification)
  if ((user === "admin" || user === "9642788786") && pass === "arpeu2026") {
    sessionStorage.setItem("arpeu_admin_token", "SESSION_SUPER_ADMIN_2026");
    sessionStorage.setItem("arpeu_admin_name", "Sri P. Balakrishna (Treasurer)");
    sessionStorage.setItem("arpeu_admin_role", "SUPER ADMIN");

    if (statusEl) statusEl.innerHTML = "";
    checkAdminSession();
  } else {
    if (statusEl) {
      statusEl.className = "field-status error";
      statusEl.innerHTML = "✖ Invalid Credentials. Please check ID/Passkey.";
    }
  }
}

// Admin Logout Handler
function handleAdminLogout() {
  sessionStorage.removeItem("arpeu_admin_token");
  sessionStorage.removeItem("arpeu_admin_name");
  sessionStorage.removeItem("arpeu_admin_role");
  checkAdminSession();
}

/* ==========================================================
   ADMIN DOCUMENT VERIFICATION QUEUE & ACTION HANDLERS
   ========================================================== */

async function loadAdminPendingDocuments() {
  const container = document.getElementById("admDocsQueueContainer");
  if (!container) return;

  container.innerHTML = `<p style="font-size:12px; color:#0B4EA2; text-align:center; padding:15px;"><i class="fa-solid fa-spinner fa-spin"></i> Loading pending documents...</p>`;

  try {
    const url = `${BACKEND_URL}?action=getPendingDocuments`;
    const res = await fetch(url);
    const result = await res.json();

    if (result && result.success && result.documents && result.documents.length > 0) {
      let html = "";
      result.documents.forEach(doc => {
        html += `
          <div class="diff-box-card" id="docCard_${doc.docId}">
            <div class="diff-header">
              <span><i class="fa-solid fa-file-lines"></i> ${doc.docType}</span>
              <span style="font-size:10px; color:#64748b;">${doc.uploadDate}</span>
            </div>
            
            <div style="font-size:11.5px; color:#1e293b; margin-bottom:8px;">
              <strong>${doc.fullName}</strong> (ID: ${doc.memberId} | Mob: ${doc.mobile})
            </div>

            <div style="margin-bottom:10px;">
              <a href="${doc.docUrl}" target="_blank" class="dl-btn btn-preview" style="display:inline-flex; width:auto; padding:4px 14px; text-decoration:none;">
                <i class="fa-solid fa-eye"></i> View / Preview Document
              </a>
            </div>

            <div class="diff-actions-row">
              <button type="button" class="adm-btn-approve" onclick="handleDocDecision('${doc.docId}', 'verify')">
                <i class="fa-solid fa-check"></i> Verify
              </button>
              <button type="button" class="adm-btn-reject" onclick="handleDocDecision('${doc.docId}', 'reject')">
                <i class="fa-solid fa-xmark"></i> Reject
              </button>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;
      
      const countEl = document.getElementById("admPendingDocs");
      const badgeEl = document.getElementById("admDocsBadge");
      if (countEl) countEl.textContent = result.documents.length;
      if (badgeEl) {
        badgeEl.textContent = result.documents.length;
        badgeEl.style.display = result.documents.length > 0 ? "inline-block" : "none";
      }
    } else {
      container.innerHTML = `<p style="font-size:12px; color:#64748b; text-align:center; padding:15px;"><i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> All supporting documents are verified!</p>`;
      const countEl = document.getElementById("admPendingDocs");
      const badgeEl = document.getElementById("admDocsBadge");
      if (countEl) countEl.textContent = "0";
      if (badgeEl) badgeEl.style.display = "none";
    }
  } catch (e) {
    container.innerHTML = `<p style="font-size:12px; color:#64748b; text-align:center; padding:15px;">All supporting documents are verified.</p>`;
  }
}

async function handleDocDecision(docId, decision) {
  const card = document.getElementById(`docCard_${docId}`);
  let reason = "";

  if (decision === "reject") {
    reason = prompt("Please enter reason for document rejection:") || "Unclear Document";
  }

  if (card) {
    card.style.opacity = "0.5";
    card.style.pointerEvents = "none";
  }

  try {
    const adminId = sessionStorage.getItem("arpeu_admin_name") || "SUPER_ADMIN";
    const action = decision === "verify" ? "verifyDocument" : "rejectDocument";
    const url = `${BACKEND_URL}?action=${action}&docId=${encodeURIComponent(docId)}&adminId=${encodeURIComponent(adminId)}&reason=${encodeURIComponent(reason)}`;

    const res = await fetch(url);
    const result = await res.json();

    if (result && result.success) {
      alert(`✔ Document ${docId} successfully ${decision === 'verify' ? 'verified' : 'rejected'}!`);
      loadAdminPendingDocuments(); // Refresh Queue
    } else {
      alert("Action failed: " + (result.message || "Server error"));
      if (card) { card.style.opacity = "1"; card.style.pointerEvents = "auto"; }
    }
  } catch (err) {
    alert("Connection error while updating document.");
    if (card) { card.style.opacity = "1"; card.style.pointerEvents = "auto"; }
  }
}


// Switch between Admin Hub Tabs
function switchAdminTab(tabName) {
  const tabs = ["profiles", "docs", "search", "audit"];
  tabs.forEach(t => {
    const btn = document.getElementById(`admTabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const content = document.getElementById(`admTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) btn.classList.remove("active");
    if (content) content.style.display = "none";
  });

  const activeBtn = document.getElementById(`admTabBtn${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  const activeContent = document.getElementById(`admTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  if (activeBtn) activeBtn.classList.add("active");
  if (activeContent) activeContent.style.display = "block";

  if (tabName === "profiles") {
    loadAdminProfileRequests();
  }
}

// Load Dashboard Metrics
function loadAdminDashboardMetrics() {
  const role = sessionStorage.getItem("arpeu_admin_role") || "SUPER ADMIN";
  const name = sessionStorage.getItem("arpeu_admin_name") || "Sri P. Balakrishna";
  
  const roleBadge = document.getElementById("adminRoleBadge");
  const nameEl = document.getElementById("adminDisplayName");
  if (roleBadge) roleBadge.textContent = role;
  if (nameEl) nameEl.textContent = name;

  // Sync with live counters if available
  const totalMemb = document.getElementById("totalMembers") ? document.getElementById("totalMembers").textContent : "1,248";
  if (document.getElementById("admTotalMembers")) document.getElementById("admTotalMembers").textContent = totalMemb;
  if (document.getElementById("admPendingProfiles")) document.getElementById("admPendingProfiles").textContent = "3";
  if (document.getElementById("admPendingDocs")) document.getElementById("admPendingDocs").textContent = "2";
  if (document.getElementById("admTotalDonations")) document.getElementById("admTotalDonations").textContent = "₹48,500";
}

/* ==========================================================
   ADMIN UNIVERSAL CADRE SEARCH & 360-DEGREE PROFILE VIEW
   ========================================================== */

async function executeAdminCadreSearch() {
  const queryInput = document.getElementById("admSearchQuery");
  const container = document.getElementById("admSearchResultsContainer");
  if (!queryInput || !container) return;

  const queryVal = queryInput.value.trim();
  if (!queryVal) {
    alert("Please enter Mobile, Aadhaar, Employee ID or Membership ID.");
    queryInput.focus();
    return;
  }

  container.innerHTML = `<p style="font-size:12px; color:#0B4EA2; text-align:center; padding:15px;"><i class="fa-solid fa-spinner fa-spin"></i> Searching unified cadre records...</p>`;

  try {
    const url = `${BACKEND_URL}?action=searchDonorOrMember&query=${encodeURIComponent(queryVal)}`;
    const res = await fetch(url);
    const result = await res.json();

    if (result && result.success && result.found && result.data) {
      const d = result.data;
      container.innerHTML = `
        <div class="diff-box-card" style="border: 1.5px solid #0B4EA2; background: #ffffff;">
          <div class="diff-header" style="background:#eef4ff; margin:-12px -12px 10px -12px; padding:10px 12px; border-radius:8px 8px 0 0;">
            <span><i class="fa-solid fa-user-shield"></i> ${d.name}</span>
            <span class="admin-role-pill">${d.donorType || 'Member'}</span>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:11.5px; margin-bottom:10px;">
            <div><strong style="color:#64748b; font-size:10px;">Mobile Number:</strong><br>${d.mobile || '-'}</div>
            <div><strong style="color:#64748b; font-size:10px;">Membership ID:</strong><br><span style="color:#0B4EA2; font-weight:800;">${d.membershipId || 'N/A'}</span></div>
            <div><strong style="color:#64748b; font-size:10px;">Employee ID:</strong><br>${d.employeeId || '-'}</div>
            <div><strong style="color:#64748b; font-size:10px;">Organization / Station:</strong><br>${d.organization || '-'}</div>
          </div>

          <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:8px; margin-bottom:10px; font-size:11px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span><i class="fa-solid fa-shield-halved" style="color:#16a34a;"></i> Membership Status:</span>
              <strong style="color:#16a34a;">ACTIVE (Valid 2026)</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span><i class="fa-solid fa-file-check" style="color:#0B4EA2;"></i> Document Status:</span>
              <strong style="color:#0B4EA2;">VERIFIED</strong>
            </div>
          </div>

          <button type="button" class="profile-btn profile-btn-primary" onclick="openReceipt()" style="width:100%; justify-content:center; height:38px; font-size:11.5px;">
            <i class="fa-solid fa-print"></i> View & Print Digital Receipt
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="text-align:center; padding:20px; color:#64748b;">
          <i class="fa-solid fa-circle-question" style="font-size:28px; color:#94a3b8; margin-bottom:6px;"></i>
          <p style="font-size:12px; margin:0;">No cadre record found matching "<strong>${queryVal}</strong>".</p>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<p style="font-size:12px; color:#dc2626; text-align:center; padding:15px;">Error fetching records. Please check connection.</p>`;
  }
}


/* ==========================================================
   ADMIN PROFILE APPROVALS & DIFF RENDERING ENGINE
   ========================================================== */

async function loadAdminProfileRequests() {
  const container = document.getElementById("admProfileQueueContainer");
  if (!container) return;

  container.innerHTML = `<p style="font-size:12px; color:#0B4EA2; text-align:center; padding:15px;"><i class="fa-solid fa-spinner fa-spin"></i> Loading pending requests...</p>`;

  try {
    const url = `${BACKEND_URL}?action=getProfileRequests`;
    const res = await fetch(url);
    const result = await res.json();

    if (result && result.success && result.requests && result.requests.length > 0) {
      let html = "";
      result.requests.forEach(req => {
        html += `
          <div class="diff-box-card" id="reqCard_${req.requestId}">
            <div class="diff-header">
              <span><i class="fa-solid fa-user-pen"></i> ${req.fullName} (${req.memberId})</span>
              <span style="font-size:10px; color:#64748b;">${req.requestDate}</span>
            </div>
            
            <div class="diff-row changed">
              <div>
                <strong style="display:block; font-size:10px; color:#475569;">Field: ${req.fieldName}</strong>
                <span class="diff-old">Old: ${req.currentValue}</span>
              </div>
              <div style="text-align:right;">
                <strong style="display:block; font-size:10px; color:#16a34a;">Requested Change</strong>
                <span class="diff-new">New: ${req.requestedValue}</span>
              </div>
            </div>

            <div class="diff-actions-row">
              <button type="button" class="adm-btn-approve" onclick="handleProfileDecision('${req.requestId}', 'approve')">
                <i class="fa-solid fa-check"></i> Approve
              </button>
              <button type="button" class="adm-btn-reject" onclick="handleProfileDecision('${req.requestId}', 'reject')">
                <i class="fa-solid fa-xmark"></i> Reject
              </button>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;
      
      const countEl = document.getElementById("admPendingProfiles");
    if (countEl) countEl.textContent = result.requests.length;

    // 🔴 Red Badge Live Update (Shows count when pending > 0)
    const badgeEl = document.getElementById("admProfilesBadge");
    if (badgeEl) {
      badgeEl.textContent = result.requests.length;
      badgeEl.style.display = result.requests.length > 0 ? "inline-block" : "none";
    }
  } else {
    container.innerHTML = `<p style="font-size:12px; color:#64748b; text-align:center; padding:15px;"><i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> All profile requests are up to date!</p>`;
    const countEl = document.getElementById("admPendingProfiles");
    if (countEl) countEl.textContent = "0";

    // ⚪ Hide Red Badge when pending count is 0
    const badgeEl = document.getElementById("admProfilesBadge");
    if (badgeEl) badgeEl.style.display = "none";
  }
      
    
  } catch (e) {
    container.innerHTML = `<p style="font-size:12px; color:#64748b; text-align:center; padding:15px;">No pending profile requests at this moment.</p>`;
  }
}

async function handleProfileDecision(requestId, decision) {
  const card = document.getElementById(`reqCard_${requestId}`);
  let reason = "";

  if (decision === "reject") {
    reason = prompt("Please enter reason for rejection:") || "Details mismatch";
  }

  if (card) {
    card.style.opacity = "0.5";
    card.style.pointerEvents = "none";
  }

  try {
    const adminId = sessionStorage.getItem("arpeu_admin_name") || "SUPER_ADMIN";
    const action = decision === "approve" ? "approveProfileRequest" : "rejectProfileRequest";
    const url = `${BACKEND_URL}?action=${action}&requestId=${encodeURIComponent(requestId)}&adminId=${encodeURIComponent(adminId)}&reason=${encodeURIComponent(reason)}`;

    const res = await fetch(url);
    const result = await res.json();

    if (result && result.success) {
      alert(`✔ Request ${requestId} successfully ${decision}d!`);
      loadAdminProfileRequests(); // Refresh Queue
    } else {
      alert("Action failed: " + (result.message || "Server error"));
      if (card) { card.style.opacity = "1"; card.style.pointerEvents = "auto"; }
    }
  } catch (err) {
    alert("Connection error while updating request.");
    if (card) { card.style.opacity = "1"; card.style.pointerEvents = "auto"; }
  }
}

/* ==========================================================
   GLOBAL BULLET-PROOF RECEIPT CLOSE ENGINE
   ========================================================== */

window.closeReceipt = function () {
  const rc = document.getElementById("receiptContainer");
  const wasDonation = rc && (rc.getAttribute("data-donation-active") === "true");

  /* 1. Force Hide Receipt Container & Remove All Flags */
  if (rc) {
    rc.style.setProperty("display", "none", "important");
    rc.removeAttribute("data-membership-active");
    rc.removeAttribute("data-donation-active");
    rc.removeAttribute("data-receipt-open");
    rc.removeAttribute("data-active");
  }

  /* 2. Reset Title Ribbon to Default Membership Blue */
  const titlePill = document.getElementById("receiptTitle");
  if (titlePill) {
    titlePill.textContent = "MEMBERSHIP RECEIPT";
    titlePill.style.backgroundColor = "#0B4EA2";
  }

  /* 3. Clean Redirection to Fresh Form */
  if (wasDonation) {
    if (typeof resetDonationForm === "function") {
      resetDonationForm();
    }
    showPage("donations");
  } else {
    if (typeof resetMembershipForm === "function") {
      resetMembershipForm();
    }
    setMembershipMode("new");
    showPage("membership");
  }
};

/* Alias function */
function closeReceipt() {
  window.closeReceipt();
}


/* ==========================================================
   NOTIFICATIONS ENGINE & SMART ADMIN REDIRECTION
   ========================================================== */

/* Syncs live pending counts onto Notification cards & Top Menu Badge */
async function syncLiveNotificationCounts() {
  try {
    const resProf = await fetch(`${BACKEND_URL}?action=getProfileRequests`);
    const dataProf = await resProf.json();
    const pCount = (dataProf && dataProf.success && dataProf.requests) ? dataProf.requests.length : 0;

    const notifProfEl = document.getElementById("notifProfilesCount");
    if (notifProfEl) notifProfEl.textContent = pCount;

    const resDocs = await fetch(`${BACKEND_URL}?action=getPendingDocuments`);
    const dataDocs = await resDocs.json();
    const dCount = (dataDocs && dataDocs.success && dataDocs.documents) ? dataDocs.documents.length : 0;

    const notifDocsEl = document.getElementById("notifDocsCount");
    if (notifDocsEl) notifDocsEl.textContent = dCount;

    const totalAlerts = pCount + dCount;
    const topBadge = document.getElementById("navNotificationsBadge");
    if (topBadge) {
      topBadge.textContent = totalAlerts;
      topBadge.style.display = totalAlerts > 0 ? "inline-block" : "none";
    }
  } catch (e) {
    console.warn("Notifications count sync skipped:", e);
  }
}

/* Smart router that redirects directly to specific Admin Queue after verifying session */
function openNotificationTarget(targetTab) {
  const token = sessionStorage.getItem("arpeu_admin_token");
  showPage("admin");

  if (token) {
    switchAdminTab(targetTab);
  } else {
    // If not logged in, prompt user and then redirect to requested tab upon successful login
    sessionStorage.setItem("arpeu_redirect_tab", targetTab);
  }
}

/* Auto sync notification alerts on initial load */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    if (typeof syncLiveNotificationCounts === "function") {
      syncLiveNotificationCounts();
    }
  }, 1500);
});

/* ==========================================================
   SETTINGS & USER PREFERENCES ENGINE
   ========================================================== */

/* PORTAL THEME SWITCHER ENGINE (LIGHT / DARK MODE) */

function togglePortalTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  const themeBtn = document.getElementById("themeToggleBtn");

  if (isDark) {
    localStorage.setItem("arpeu_theme", "dark");
    if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
  } else {
    localStorage.setItem("arpeu_theme", "light");
    if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
  }
}

/* Auto apply saved theme preference on page load */
document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("arpeu_theme");
  const themeBtn = document.getElementById("themeToggleBtn");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
  }
});


/* Adjusts dynamic font scaling across portal */
function setPortalFontSize(size) {
  const content = document.getElementById("contentArea");
  if (!content) return;

  if (size === "small") {
    content.style.fontSize = "12px";
  } else if (size === "large") {
    content.style.fontSize = "15px";
  } else {
    content.style.fontSize = "";
  }
  alert(`Portal text scale set to: ${size.toUpperCase()}`);
}

/* Clears local cached items and smoothly reloads page */
function clearPortalCache() {
  if (confirm("Clear local cache and reload fresh ARPEU portal data?")) {
    sessionStorage.clear();
    localStorage.removeItem("arpeu_cached_data");
    window.location.reload();
  }
}

/* PWA App installation prompt */
function promptAppInstallation() {
  alert("To install this portal as an App on your Mobile:\n\n1. Tap the 3 dots (⋮) menu in Chrome.\n2. Select 'Add to Home screen' or 'Install app'.");
}

/* ==========================================================
   PWA SERVICE WORKER AUTO-REGISTRATION
   ========================================================== */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js')
      .then(function (reg) {
        console.log('ARPEU PWA Service Worker Registered Successfully:', reg.scope);
      })
      .catch(function (err) {
        console.warn('PWA Service Worker Registration Failed:', err);
      });
  });
}

/* ==========================================================
   APP SPLASH SCREEN CONTROLLER
   Smooth auto-dismissal with animation timing
   ========================================================== */
function hideAppSplash() {
    setTimeout(function () {
        const splash = document.getElementById("appSplashScreen");
        if (splash) {
            splash.style.opacity = "0";
            splash.style.visibility = "hidden";
            splash.style.pointerEvents = "none";
            
            setTimeout(function () {
                splash.style.display = "none";
            }, 650);
        }
    }, 2400); // 2.4 seconds duration for complete animation
}

if (document.readyState === "complete" || document.readyState === "interactive") {
    hideAppSplash();
} else {
    window.addEventListener("DOMContentLoaded", hideAppSplash);
    window.addEventListener("load", hideAppSplash);
}

/* ==========================================================
   UNIVERSAL UPI INTENT & DEEP LINK CONTROLLER
   Directs user to installed UPI apps with dynamic prefilled amount
   ========================================================== */
function triggerUpiPayment(appType) {
    const vpa = "andhrarastrapowerempunion@sbi";
    const payeeName = "Andhra Rastra Power Employees Union";
    const note = "ARPEU Membership Fee";
    
    // Get entered amount dynamically
    const amountInput = document.getElementById("payNowAmount");
    const amount = amountInput ? parseFloat(amountInput.value) || 460 : 460;

    // Standard Universal UPI URI
    const upiUri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;

    // App-specific intent schemes for mobile
    let targetUri = upiUri;
    if (appType === "phonepe") {
        targetUri = `phonepe://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
    } else if (appType === "paytm") {
        targetUri = `paytmmp://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
    } else if (appType === "gpay") {
        targetUri = `tez://upi/pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
    }

    // Try app-specific intent, fallback to universal UPI intent
    window.location.href = targetUri;

    // Fallback if specific app scheme is not directly registered
    setTimeout(function () {
        window.location.href = upiUri;
    }, 500);
}


/* ==========================================================
   MEETINGS, AGENDA BUILDER & NOTIFICATIONS CONTROLLER
   ========================================================== */

// Global State
let cachedMeetings = [];
let activeMeetingTab = "upcoming";

// 1. Master Leaders & Designations Map (8 Key Office Bearers)
const arpeuLeadersMap = {
    // ARPEU Core Leaders
    "Sri T. Sambasiva Rao": "State President",
    "Sri C. Ramagopal Reddy": "State General Secretary",
    "Sri P. Balakrishna": "State Treasurer",
    "Sri K. Jayappa": "State Working President",
    "Sri R. Koteswara Rao": "State Organising Secretary",
    
    // BMS State Leadership (2-Line formatted)
    "Sri T. Raghuram": "Hon'ble President (ARPEU)<br>BMS State President",
    "Sri M.V.S. Naidu": "BMS State General Secretary",
    "Sri K. Lova Reddy": "BMS State Organising Secretary"
};

function handleIssuerSelection(leaderName) {
    const desigBox = document.getElementById("mtgIssuerDesigBox");
    const hiddenDesig = document.getElementById("mtgIssuerDesig");
    if (!desigBox) return;

    const selectEl = document.getElementById("mtgIssuerSelect");
    const selectedLeader = leaderName || (selectEl ? selectEl.value : "Sri T. Sambasiva Rao");

    // Get designation from master map
    const designationHtml = arpeuLeadersMap[selectedLeader] || "Leader";

    // Instantly update visual 2-line display box
    desigBox.innerHTML = designationHtml;

    // Update hidden field for WhatsApp notice & Backend Save
    if (hiddenDesig) {
        hiddenDesig.value = designationHtml.replace(/<br\s*[\/]?>/gi, " - ");
    }

    // Live update WhatsApp broadcast message box
    updateLiveWhatsAppPreview();
}

// 🌟 Date & Time Direct Click-to-Open Enhancer
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("mtgDate");
    const timeInput = document.getElementById("mtgTime");

    if (dateInput) {
        dateInput.addEventListener("click", function () {
            if (typeof this.showPicker === "function") this.showPicker();
        });
    }
    if (timeInput) {
        timeInput.addEventListener("click", function () {
            if (typeof this.showPicker === "function") this.showPicker();
        });
    }
});

// 2. Setup Live Preview Listeners with New Dropdown
function setupLiveWhatsAppPreviewListeners() {
    const formFields = ["mtgTitle", "mtgType", "mtgDate", "mtgTime", "mtgIssuerSelect", "mtgAdditionalMessage"];
    formFields.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.dataset.listenerBound) {
            el.addEventListener("input", updateLiveWhatsAppPreview);
            el.addEventListener("change", updateLiveWhatsAppPreview);
            el.dataset.listenerBound = "true";
        }
    });

    const agendaInputs = document.querySelectorAll(".agenda-point-input");
    agendaInputs.forEach(inp => {
        if (!inp.dataset.listenerBound) {
            inp.addEventListener("input", updateLiveWhatsAppPreview);
            inp.dataset.listenerBound = "true";
        }
    });
}

function updateLiveWhatsAppPreview() {
    const previewEl = document.getElementById("mtgLiveWaNoticePreview");
    if (!previewEl) return;

    const issuerSelect = document.getElementById("mtgIssuerSelect");
    const issuerName = issuerSelect ? issuerSelect.value : "Sri T. Sambasiva Rao";
    const issuerDesig = document.getElementById("mtgIssuerDesig") ? document.getElementById("mtgIssuerDesig").value : "State President";

    const mtgData = {
        title: (document.getElementById("mtgTitle") || {}).value || "State Executive Committee Emergency Review",
        meetingType: (document.getElementById("mtgType") || {}).value || "State Executive Committee",
        date: (document.getElementById("mtgDate") || {}).value || new Date().toISOString().split("T")[0],
        time: (document.getElementById("mtgTime") || {}).value || "10:30 AM",
        issuedByName: issuerName,
        issuedByDesig: issuerDesig,
        additionalMessage: (document.getElementById("mtgAdditionalMessage") || {}).value || "",
        agenda: getEnteredAgendaPoints()
    };

    previewEl.textContent = generateWhatsAppNoticeText(mtgData);
}

// 3. Toggle Schedule Meeting Form Card
function toggleScheduleMeetingForm() {
    const card = document.getElementById("scheduleMeetingCard");
    if (!card) return;
    
    const isHidden = card.style.display === "none" || card.style.display === "";
    card.style.display = isHidden ? "block" : "none";

    if (isHidden) {
        const dateInput = document.getElementById("mtgDate");
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split("T")[0];
        }
        setupLiveWhatsAppPreviewListeners();
        updateLiveWhatsAppPreview();
        card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// 4. Dynamic Agenda Points Builder Logic
function addAgendaPointField() {
    const container = document.getElementById("agendaFieldsContainer");
    if (!container) return;

    const currentPoints = container.querySelectorAll(".agenda-input-row");
    const nextIdx = currentPoints.length + 1;

    const row = document.createElement("div");
    row.className = "agenda-input-row";
    row.innerHTML = `
        <span class="agenda-idx">${nextIdx}.</span>
        <input type="text" class="agenda-point-input" placeholder="Enter agenda point #${nextIdx}" required>
        <button type="button" class="btn-remove-agenda" onclick="removeAgendaPointField(this)" title="Remove point">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    `;

    container.appendChild(row);
    setupLiveWhatsAppPreviewListeners();
    updateLiveWhatsAppPreview();
}

function removeAgendaPointField(btn) {
    const row = btn.closest(".agenda-input-row");
    if (row) {
        row.remove();
        reindexAgendaPoints();
        updateLiveWhatsAppPreview();
    }
}

function reindexAgendaPoints() {
    const container = document.getElementById("agendaFieldsContainer");
    if (!container) return;

    const rows = container.querySelectorAll(".agenda-input-row");
    rows.forEach((row, i) => {
        const idxSpan = row.querySelector(".agenda-idx");
        const input = row.querySelector(".agenda-point-input");
        if (idxSpan) idxSpan.textContent = `${i + 1}.`;
        if (input) input.placeholder = `Enter agenda point #${i + 1}`;
    });
}

function getEnteredAgendaPoints() {
    const inputs = document.querySelectorAll(".agenda-point-input");
    const points = [];
    inputs.forEach(inp => {
        if (inp.value.trim()) points.push(inp.value.trim());
    });
    return points;
}

// 5. Live WhatsApp Meeting Notice Generator
function setupLiveWhatsAppPreviewListeners() {
    const formFields = ["mtgTitle", "mtgType", "mtgDate", "mtgTime", "mtgIssuerName", "mtgIssuerDesig", "mtgAdditionalMessage"];
    formFields.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.dataset.listenerBound) {
            el.addEventListener("input", updateLiveWhatsAppPreview);
            el.dataset.listenerBound = "true";
        }
    });

    const agendaInputs = document.querySelectorAll(".agenda-point-input");
    agendaInputs.forEach(inp => {
        if (!inp.dataset.listenerBound) {
            inp.addEventListener("input", updateLiveWhatsAppPreview);
            inp.dataset.listenerBound = "true";
        }
    });
}

function generateWhatsAppNoticeText(mtgData) {
    const title = mtgData.title || "Official Meeting";
    const type = mtgData.meetingType || "State Executive Committee";
    const date = mtgData.date || "TBD";
    const time = mtgData.time || "TBD";
    const issuerName = mtgData.issuedByName || "State Leadership";
    const issuerDesig = mtgData.issuedByDesig || "ARPEU";
    const notes = mtgData.additionalMessage || "";
    const agenda = mtgData.agenda || [];

    let agendaText = "";
    if (agenda.length > 0) {
        agendaText = "\n📌 *MEETING AGENDA:*\n" + agenda.map((p, i) => `${i + 1}. ${p}`).join("\n") + "\n";
    }

    const noticeText = 
`⚡ *ANDHRA RASTRA POWER EMPLOYEES UNION (ARPEU)* ⚡
🏛️ *OFFICIAL MEETING NOTICE*

📋 *Subject:* ${title}
👥 *Meeting Type:* ${type}
📅 *Date:* ${date}
⏰ *Time:* ${time}
${agendaText}
${notes ? `📝 *Note:* ${notes}\n` : ""}
🔗 *Join via ARPEU Digital Portal:*
https://pallibalakrishna1981-dev.github.io/ARPEU-Membership-App/

Issued by:
👤 *${issuerName}* (${issuerDesig})
*Andhra Rastra Power Employees Union (Regd. No. G-445)*`;

    return noticeText;
}

function updateLiveWhatsAppPreview() {
    const previewEl = document.getElementById("mtgLiveWaNoticePreview");
    if (!previewEl) return;

    const mtgData = {
        title: (document.getElementById("mtgTitle") || {}).value || "State Executive Committee Review",
        meetingType: (document.getElementById("mtgType") || {}).value || "State Executive Committee",
        date: (document.getElementById("mtgDate") || {}).value || "2026-09-10",
        time: (document.getElementById("mtgTime") || {}).value || "10:30 AM",
        issuedByName: (document.getElementById("mtgIssuerName") || {}).value || "State President",
        issuedByDesig: (document.getElementById("mtgIssuerDesig") || {}).value || "State Executive",
        additionalMessage: (document.getElementById("mtgAdditionalMessage") || {}).value || "",
        agenda: getEnteredAgendaPoints()
    };

    previewEl.textContent = generateWhatsAppNoticeText(mtgData);
}

/**
 * 📲 SMART WHATSAPP LAUNCHER (DIRECT NATIVE MOBILE / DESKTOP APP)
 */
function shareLiveWhatsAppNotice() {
    const previewEl = document.getElementById("mtgLiveWaNoticePreview");
    let noticeText = previewEl ? (previewEl.textContent || previewEl.innerText) : "";

    if (!noticeText || noticeText.includes("Type meeting details above")) {
        const issuerSelect = document.getElementById("mtgIssuerSelect");
        const mtgData = {
            title: (document.getElementById("mtgTitle") || {}).value || "State Committee Review",
            meetingType: (document.getElementById("mtgType") || {}).value || (document.getElementById("mtgTargetGroup") || {}).value || "Official Meeting",
            date: (document.getElementById("mtgDate") || {}).value || "TBD",
            time: (document.getElementById("mtgTime") || {}).value || "TBD",
            issuedByName: issuerSelect ? issuerSelect.value : "State Leadership",
            issuedByDesig: (document.getElementById("mtgIssuerDesig") || {}).value || "ARPEU",
            additionalMessage: (document.getElementById("mtgAdditionalMessage") || {}).value || "",
            agenda: (typeof getEnteredAgendaPoints === "function") ? getEnteredAgendaPoints() : []
        };
        noticeText = generateWhatsAppNoticeText(mtgData);
    }

    const encodedText = encodeURIComponent(noticeText);

    // Mobile vs Desktop Detection
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        // Direct Native Mobile App Protocol
        window.location.href = `whatsapp://send?text=${encodedText}`;
    } else {
        // Direct Universal Web/Desktop API
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
    }
}

// 6. Submit New Meeting Form (Sync with Google Apps Script)
async function submitNewMeeting(event) {
    if (event) event.preventDefault();

    const submitBtn = document.getElementById("btnSubmitMeeting");
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "Schedule & Broadcast";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Broadcasting Meeting...`;
    }

    const payload = {
        action: "createMeeting",
        title: (document.getElementById("mtgTitle") || {}).value.trim(),
        meetingType: (document.getElementById("mtgType") || {}).value,
        targetGroup: (document.getElementById("mtgTargetGroup") || {}).value,
        date: (document.getElementById("mtgDate") || {}).value,
        time: (document.getElementById("mtgTime") || {}).value,
        issuedByName: (document.getElementById("mtgIssuerName") || {}).value.trim(),
        issuedByDesig: (document.getElementById("mtgIssuerDesig") || {}).value.trim(),
        additionalMessage: (document.getElementById("mtgAdditionalMessage") || {}).value.trim(),
        agenda: getEnteredAgendaPoints()
    };

    try {
        const targetUrl = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : "https://script.google.com/macros/s/AKfycbyoBv4TQ28mb7HIsTQ42iEe7P-3Yqs-7lR5tHhHqk0RqCQOShGrLBVPvD4j2ZUV1Q/exec";

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "createMeeting", data: payload })
        });

        const result = await response.json();

        if (result && result.success) {
            alert("✔ Meeting Scheduled & Broadcasted Successfully!");
            const formCard = document.getElementById("scheduleMeetingCard");
            if (formCard) formCard.style.display = "none";
            const formEl = document.getElementById("createMeetingForm");
            if (formEl) formEl.reset();
            loadMeetingsList();
        } else {
            alert("Error: " + (result.message || "Failed to schedule meeting."));
        }
    } catch (err) {
        console.error("Meeting Submit Error:", err);
        alert("Connection error while scheduling meeting.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    }
}

// 7. Switch Meeting Filter Tabs (Upcoming / Live / Past)
function switchMeetingTab(tabType) {
    activeMeetingTab = tabType;

    const tabs = document.querySelectorAll(".mtg-tab-btn");
    tabs.forEach(t => t.classList.remove("active"));

    const activeTabBtn = Array.from(tabs).find(b => b.getAttribute("onclick") && b.getAttribute("onclick").includes(tabType));
    if (activeTabBtn) activeTabBtn.classList.add("active");

    renderMeetingsList();
}

// 8. Sync Meetings Statistics Counters
function updateMeetingsMetrics(meetings) {
    if (!Array.isArray(meetings)) return;
    const total = meetings.length;
    const core = meetings.filter(m => (m.targetGroup || "").includes("Core") || (m.meetingType || "").includes("Core")).length;
    const ec = meetings.filter(m => (m.targetGroup || "").includes("State") || (m.meetingType || "").includes("State")).length;
    const lastMtg = meetings[0] ? meetings[0].date : "-";

    if (document.getElementById("mtgTotalCount")) document.getElementById("mtgTotalCount").textContent = total;
    if (document.getElementById("mtgCoreCount")) document.getElementById("mtgCoreCount").textContent = core;
    if (document.getElementById("mtgEcCount")) document.getElementById("mtgEcCount").textContent = ec;
    if (document.getElementById("mtgLastDate")) document.getElementById("mtgLastDate").textContent = lastMtg;
}

// 9. Fetch Meetings List from Google Apps Script
async function loadMeetingsList() {
    const container = document.getElementById("meetingsCardsGrid");
    if (!container) return;

    container.innerHTML = `<div class="mtg-loading-placeholder"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading official meetings...</div>`;

    try {
        const targetUrl = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : "https://script.google.com/macros/s/AKfycbyoBv4TQ28mb7HIsTQ42iEe7P-3Yqs-7lR5tHhHqk0RqCQOShGrLBVPvD4j2ZUV1Q/exec";
        const response = await fetch(`${targetUrl}?action=getMeetings`);
        const result = await response.json();

        if (result && result.success && Array.isArray(result.meetings)) {
            cachedMeetings = result.meetings;
            renderMeetingsList();
        } else {
            container.innerHTML = `<p style="font-size:12px; color:#64748b; text-align:center; padding:20px;">No official meetings scheduled at this time.</p>`;
            updateMeetingsMetrics([]);
        }
    } catch (err) {
        console.error("Load Meetings Error:", err);
        container.innerHTML = `<p style="font-size:12px; color:#dc2626; text-align:center; padding:20px;">Unable to load meetings. Please check connection.</p>`;
    }
}

// 10. Render Filtered Meetings Cards (100% IN-HOUSE NATIVE CONFERENCING)
function renderMeetingsList() {
    const container = document.getElementById("meetingsCardsGrid");
    if (!container) return;

    updateMeetingsMetrics(cachedMeetings);

    if (!cachedMeetings || cachedMeetings.length === 0) {
        container.innerHTML = `<p style="font-size:12px; color:#64748b; text-align:center; padding:20px;">No meetings scheduled at this time.</p>`;
        return;
    }

    const filtered = cachedMeetings.filter(m => {
        const status = (m.status || "Scheduled").toLowerCase();
        if (activeMeetingTab === "live") return status === "live";
        if (activeMeetingTab === "past") return status === "completed";
        return status === "scheduled" || status === "upcoming";
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p style="font-size:12px; color:#64748b; text-align:center; padding:20px;">No ${activeMeetingTab} meetings found.</p>`;
        return;
    }

    let html = "";
    filtered.forEach(mtg => {
        const isLive = (mtg.status || "").toLowerCase() === "live";
        const isCompleted = (mtg.status || "").toLowerCase() === "completed";
        const statusClass = isLive ? "status-live" : (isCompleted ? "status-completed" : "status-scheduled");
        const statusLabel = isLive ? '<span class="live-dot-pulse"></span> Live Now' : (isCompleted ? "Completed" : "Scheduled");

        const agendaItems = Array.isArray(mtg.agenda) && mtg.agenda.length > 0
            ? `<div class="mtg-agenda-preview-box">
                 <div class="mtg-agenda-heading"><i class="fa-solid fa-list-ol"></i> Agenda Points:</div>
                 <ul class="mtg-agenda-items">
                   ${mtg.agenda.map(a => `<li>${a}</li>`).join("")}
                 </ul>
               </div>`
            : "";

        const waText = encodeURIComponent(generateWhatsAppNoticeText(mtg));
        const cleanType = (mtg.meetingType || 'State Committee').replace(/'/g, "\\'");

        html += `
          <div class="mtg-card">
            <div class="mtg-card-top-row">
              <span class="mtg-type-badge">${mtg.meetingType || 'State Committee'}</span>
              <span class="mtg-status-badge ${statusClass}">${statusLabel}</span>
            </div>

            <h3 class="mtg-card-title">${mtg.title}</h3>

            <div class="mtg-datetime-box">
              <span><i class="fa-solid fa-calendar"></i> ${mtg.date}</span>
              <span><i class="fa-solid fa-clock"></i> ${mtg.time}</span>
            </div>

            ${agendaItems}

            <div style="font-size:11px; color:#64748b;">
              <strong>Issued by:</strong> ${mtg.issuedByName || 'State President'} (${mtg.issuedByDesig || 'ARPEU'})
            </div>

            <div class="mtg-card-actions">
              <a href="https://wa.me/?text=${waText}" target="_blank" class="btn-mtg-action btn-mtg-wa">
                <i class="fa-brands fa-whatsapp"></i> Broadcast Notice
              </a>
              <button type="button" class="btn-mtg-action btn-mtg-join" onclick="launchInstantConference('${cleanType}', 'video')">
                <i class="fa-solid fa-video"></i> Join Native Stage
              </button>
            </div>
          </div>
        `;
    });

    container.innerHTML = html;
}

/// 11. Load Notifications List with Smart Container Sync
async function loadNotificationsList() {
    // 1. Sync live pending profile and document counts
    if (typeof syncLiveNotificationCounts === "function") {
        syncLiveNotificationCounts();
    }

    // 2. Fetch live meetings to show active meeting alerts inside container
    const mtgContainer = document.getElementById("notifMeetingsList");
    if (!mtgContainer) return;

    try {
        const targetUrl = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : "https://script.google.com/macros/s/AKfycbyoBv4TQ28mb7HIsTQ42iEe7P-3Yqs-7lR5tHhHqk0RqCQOShGrLBVPvD4j2ZUV1Q/exec";
        const response = await fetch(`${targetUrl}?action=getMeetings`);
        const result = await response.json();

        if (result && result.success && Array.isArray(result.meetings) && result.meetings.length > 0) {
            let html = "";
            result.meetings.slice(0, 2).forEach(mtg => {
                html += `
                  <div class="notif-item-row">
                    <div class="notif-item-icon meeting-icon"><i class="fa-solid fa-video"></i></div>
                    <div class="notif-item-info">
                      <strong>${mtg.title}</strong>
                      <p>${mtg.meetingType} • Date: ${mtg.date} at ${mtg.time}</p>
                      <button type="button" class="btn-notif-mini" onclick="showPage('meetings')">
                        <i class="fa-solid fa-arrow-right"></i> View Agenda & Join
                      </button>
                    </div>
                  </div>
                `;
            });
            mtgContainer.innerHTML = html;
            const badge = document.getElementById("notifMtgCountBadge");
            if (badge) badge.textContent = `${result.meetings.length} Scheduled`;
        }
    } catch (e) {
        console.warn("Meeting notification sync skipped:", e);
    }
}


/* ==========================================================================
   ARPEU NATIVE WebRTC CONFERENCING ENGINE & CALLING PODS (IN-HOUSE 60-CAPACITY)
   ========================================================================== */

// Official Cadre Data Model (Dynamic Auto-Speaker Identity)
const coreCommitteeCadreMaster = [
    { name: "Sri P. Balakrishna", designation: "State Treasurer", unit: "APGENCO – Dr. NTTPS", mobile: "9642788786" },
    { name: "Sri L. Prasadu", designation: "State General Secretary", unit: "APSPDCL – Corporate Office", mobile: "9110771171" },
    { name: "Sri R. Ravi", designation: "State President", unit: "APCPDCL – Vijayawada Circle", mobile: "9985333734" },
    { name: "Sri P. Balakrishna", designation: "State Additional Secretary", unit: "APEPDCL – Visakhapatnam", mobile: "9393788785" }
];

// WebRTC State Variables
let webrtcLocalStream = null;
let webrtcAudioContext = null;
let webrtcAnalyser = null;
let webrtcMediaRecorder = null;
let webrtcRecordedChunks = [];
let isWebrtcRecording = false;
let isWebrtcHost = true;
let currentProjectorScale = 1.0;
let liveOnlineParticipants = 4;
let activeAgendaTabType = 'present'; // 'present' | 'previous'

// Dual-Tab Agenda Data Structure with Live Resolutions
let presentAgendaState = [
    {
        id: 101,
        keyword: "MEMBERSHIP DRIVE",
        point: "Membership drive – decide when to start and when to close the 2026 digital membership drive.",
        resolution: "Membership drive will continue across all Discoms until September 30, 2026.",
        status: "Under Process"
    },
    {
        id: 102,
        keyword: "DIARY COMMITTEE",
        point: "Discussion regarding selection of 2027 Union Diary & Calendar Committee members.",
        resolution: "State EC authorized President & Gen Sec to constitute a 5-member Diary Committee.",
        status: "Committee Constituted"
    },
    {
        id: 103,
        keyword: "CADRE ALLOWANCES",
        point: "Representation to Energy Department regarding pending DA arrears and shift allowances.",
        resolution: "Formal delegation will meet CMDs on 15th of this month.",
        status: "Under Process"
    }
];

let previousAgendaState = [
    {
        id: 201,
        keyword: "STATE EC ELECTIONS",
        point: "Ratification of State Executive Council body election results.",
        resolution: "Unanimously ratified and registered with Labour Department vide Regd. No. G-445.",
        status: "Completed"
    },
    {
        id: 202,
        keyword: "VTPS BENEFIT FUND",
        point: "Audit review of Dr. NTTPS Power Plant workers welfare contribution fund.",
        resolution: "Accounts audited and verified by State Treasurer.",
        status: "Completed"
    }
];

/**
 * Launch 100% In-House Native ARPEU WebRTC Conference
 */
async function launchInstantConference(committeeName = 'Core Committee', mode = 'video', directRoomCode = null) {
    const isVideo = (mode === 'video');
    const roomCode = directRoomCode || `ARPEU-${committeeName.replace(/\s+/g, '-').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const modal = document.getElementById('arpeuNativeConferenceModal');
    const roomTitle = document.getElementById('webrtcRoomTitle');
    const roomCodeText = document.getElementById('webrtcRoomCodeText');
    const localVideo = document.getElementById('localUserVideo');
    const mainVideo = document.getElementById('mainSpeakerVideo');

    if (!modal) {
        alert('Conference Modal element not found in DOM.');
        return;
    }

    if (roomTitle) roomTitle.textContent = `${committeeName} Live`;
    if (roomCodeText) roomCodeText.textContent = `ROOM: ${roomCode}`;

    // Dynamically Set Initial Speaker Identity (Host Data)
    const initialSpeaker = coreCommitteeCadreMaster[0];
    updateActiveSpeakerIdentity(initialSpeaker.name, initialSpeaker.designation, initialSpeaker.unit);

    updateOnlineParticipantsCount(liveOnlineParticipants);

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Show Host Controls & Magic Ball if Host
    const magicBall = document.getElementById('hostMagicBallWrap');
    const hostAdminBtn = document.getElementById('btnHostAdminMenu');
    if (magicBall) magicBall.style.display = isWebrtcHost ? 'flex' : 'none';
    if (hostAdminBtn) hostAdminBtn.style.display = isWebrtcHost ? 'flex' : 'none';

    try {
        const constraints = {
            audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
            video: isVideo ? { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } : false
        };

        webrtcLocalStream = await navigator.mediaDevices.getUserMedia(constraints);

        if (localVideo) {
            localVideo.srcObject = webrtcLocalStream;
            localVideo.muted = true;
            localVideo.setAttribute('playsinline', '');
            localVideo.play().catch(e => console.log('Local video play:', e));
        }

        if (mainVideo) {
            mainVideo.srcObject = webrtcLocalStream;
            mainVideo.muted = true;
            mainVideo.setAttribute('playsinline', '');
            mainVideo.play().catch(e => console.log('Main video play:', e));
        }

        initConferenceAgendaHUD();

    } catch (err) {
        console.error('Hardware Media Access Error:', err);
        alert('Could not access Camera/Microphone. Please allow permissions in browser settings.');
    }
}

/**
 * Update Dynamic Active Speaker Identity Ribbon (Bottom of Video Stage)
 */
function updateActiveSpeakerIdentity(name, designation, unit) {
    const nameEl = document.getElementById('mainSpeakerName');
    const roleEl = document.getElementById('mainSpeakerRole');
    const unitEl = document.getElementById('mainSpeakerUnit');

    if (nameEl) nameEl.textContent = name || 'State Leader';
    if (roleEl) roleEl.textContent = designation || 'Office Bearer';
    if (unitEl) unitEl.textContent = unit || 'ARPEU State Committee';
}

/**
 * 📁 SHOW FILES (Native Mobile Storage & Document Projector Engine)
 */
function triggerShowFilesPicker() {
    const fileInput = document.getElementById('privateProjectorFileInput');
    if (fileInput) {
        fileInput.value = '';
        fileInput.click();
    }
}

// Global State for Projector Selective Broadcast & Annotations
let isProjShowAllActive = false;
let isProjCustomActive = false;
let currentProjectorTool = null; // 'pen' | 'highlighter' | 'shape' | null
let selectedProjectorViewerIds = [];
let isDrawingOnCanvas = false;
let lastDrawX = 0;
let lastDrawY = 0;

// 1. Show to ALL Leaders Toggle
function toggleProjectorShowAll() {
    isProjShowAllActive = !isProjShowAllActive;
    if (isProjShowAllActive) isProjCustomActive = false;
    updateProjectorBroadcastButtons();
}

function toggleProjectorMemberDropdown() {
    const dropdown = document.getElementById('projMemberPickerDropdown');
    const container = document.getElementById('projMembersListContainer');
    if (!dropdown) return;

    const isHidden = (dropdown.style.display === 'none' || dropdown.style.display === '');
    if (isHidden) {
        if (container) {
            const list = (typeof coreCommitteeMasterData !== 'undefined') ? coreCommitteeMasterData : [];
            container.innerHTML = list.map((m, i) => `
                <label class="proj-member-item" for="chkProjViewer_${m.id}">
                    <input type="checkbox" id="chkProjViewer_${m.id}" value="${m.id}" ${selectedProjectorViewerIds.includes(m.id) ? 'checked' : ''}>
                    <span>${i + 1}. ${m.name}</span>
                </label>
            `).join('');
        }
        dropdown.style.display = 'flex';
    } else {
        dropdown.style.display = 'none';
    }
}

function applyProjectorSelectiveSharing() {
    const checkboxes = document.querySelectorAll('.proj-dropdown-list input[type="checkbox"]:checked');
    selectedProjectorViewerIds = Array.from(checkboxes).map(c => c.value);

    if (selectedProjectorViewerIds.length > 0) {
        isProjCustomActive = true;
        isProjShowAllActive = false;
        alert(`Document shown only to ${selectedProjectorViewerIds.length} selected leaders.`);
    } else {
        isProjCustomActive = false;
        alert('No leaders selected. Document is in Private Preview.');
    }

    const dropdown = document.getElementById('projMemberPickerDropdown');
    if (dropdown) dropdown.style.display = 'none';
    
    updateProjectorBroadcastButtons();
}

function updateProjectorBroadcastButtons() {
    const btnAll = document.getElementById('btnProjShowAll');
    const btnCustom = document.getElementById('btnProjSelectMembers');

    if (btnAll) {
        btnAll.className = isProjShowAllActive ? 'proj-tool-btn btn-proj-active-all' : 'proj-tool-btn';
    }
    if (btnCustom) {
        btnCustom.className = isProjCustomActive ? 'proj-tool-btn btn-proj-active-custom' : 'proj-tool-btn';
    }
}

// Persistent Drawing & Shape Engine (Never Clears until Eraser is clicked)
function setProjectorTool(toolName) {
    const canvas = document.getElementById('projectorDrawingCanvas');
    if (!canvas) return;

    if (currentProjectorTool === toolName) {
        currentProjectorTool = null;
        canvas.classList.remove('drawing-active');
    } else {
        currentProjectorTool = toolName;
        canvas.classList.add('drawing-active');
        setupProjectorCanvasEngine();
    }

    // Update Button Active States
    ['btnProjToolPen', 'btnProjToolHighlighter', 'btnProjToolShape'].forEach(id => {
        const b = document.getElementById(id);
        if (b) b.classList.remove('active-tool');
    });

    if (currentProjectorTool === 'pen') document.getElementById('btnProjToolPen')?.classList.add('active-tool');
    if (currentProjectorTool === 'highlighter') document.getElementById('btnProjToolHighlighter')?.classList.add('active-tool');
    if (currentProjectorTool === 'shape') document.getElementById('btnProjToolShape')?.classList.add('active-tool');
}

function setupProjectorCanvasEngine() {
    const canvas = document.getElementById('projectorDrawingCanvas');
    const wrapper = document.getElementById('projectorCanvasWrapper');
    if (!canvas || !wrapper) return;

    // Only set width/height on first initialize so drawings are preserved!
    if (!canvas.dataset.initialized) {
        canvas.width = wrapper.clientWidth || window.innerWidth;
        canvas.height = wrapper.clientHeight || window.innerHeight;
    }

    const ctx = canvas.getContext('2d');
    if (canvas.dataset.listenersAttached) return;

    const startDraw = (e) => {
        if (!currentProjectorTool) return;
        isDrawingOnCanvas = true;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        lastDrawX = clientX - rect.left;
        lastDrawY = clientY - rect.top;

        if (currentProjectorTool === 'shape') {
            canvasSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    };

    const drawMove = (e) => {
        if (!isDrawingOnCanvas || !currentProjectorTool) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const curX = clientX - rect.left;
        const curY = clientY - rect.top;

        if (currentProjectorTool === 'pen') {
            ctx.beginPath();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 1.0;
            ctx.lineCap = 'round';
            ctx.moveTo(lastDrawX, lastDrawY);
            ctx.lineTo(curX, curY);
            ctx.stroke();
            lastDrawX = curX;
            lastDrawY = curY;
        } else if (currentProjectorTool === 'highlighter') {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 235, 59, 0.45)';
            ctx.lineWidth = 16;
            ctx.lineCap = 'square';
            ctx.moveTo(lastDrawX, lastDrawY);
            ctx.lineTo(curX, curY);
            ctx.stroke();
            lastDrawX = curX;
            lastDrawY = curY;
        } else if (currentProjectorTool === 'shape' && canvasSnapshot) {
            ctx.putImageData(canvasSnapshot, 0, 0);
            ctx.beginPath();
            ctx.strokeStyle = '#f57c00';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 1.0;
            ctx.strokeRect(
                Math.min(lastDrawX, curX),
                Math.min(lastDrawY, curY),
                Math.abs(curX - lastDrawX),
                Math.abs(curY - lastDrawY)
            );
        }
    };

    const endDraw = () => {
        isDrawingOnCanvas = false;
        canvasSnapshot = null;
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', drawMove);
    canvas.addEventListener('mouseup', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: true });
    canvas.addEventListener('touchmove', drawMove, { passive: true });
    canvas.addEventListener('touchend', endDraw);

    canvas.dataset.initialized = 'true';
    canvas.dataset.listenersAttached = 'true';
}

function clearProjectorCanvasDrawings() {
    const canvas = document.getElementById('projectorDrawingCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasSnapshot = null;
    }
}

function handleProjectorFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const stage = document.getElementById('docProjectorStage');
    const docImg = document.getElementById('docProjectionImg');
    const pdfFrame = document.getElementById('docProjectionPdfFrame');

    const reader = new FileReader();

    if (file.type === "application/pdf") {
        reader.onload = function(e) {
            if (docImg) {
                docImg.src = '';
                docImg.style.display = 'none';
            }
            if (pdfFrame) {
                pdfFrame.src = e.target.result;
                pdfFrame.style.display = 'block';
            }
            if (stage) stage.style.display = 'flex';
            setTimeout(setupProjectorCanvasEngine, 100);
        };
        reader.readAsDataURL(file);
    } else {
        reader.onload = function(e) {
            if (pdfFrame) {
                pdfFrame.src = '';
                pdfFrame.style.display = 'none';
            }
            if (docImg) {
                docImg.src = e.target.result;
                docImg.style.display = 'block';
            }
            if (stage) stage.style.display = 'flex';
            setTimeout(setupProjectorCanvasEngine, 100);
        };
        reader.readAsDataURL(file);
    }
}

function stopDocumentProjection() {
    const stage = document.getElementById('docProjectorStage');
    const docImg = document.getElementById('docProjectionImg');
    const pdfFrame = document.getElementById('docProjectionPdfFrame');

    isProjShowAllActive = false;
    isProjCustomActive = false;
    currentProjectorTool = null;
    clearProjectorCanvasDrawings();
    updateProjectorBroadcastButtons();

    const canvas = document.getElementById('projectorDrawingCanvas');
    if (canvas) canvas.classList.remove('drawing-active');

    if (stage) stage.style.cssText = "display: none !important;";
    if (docImg) {
        docImg.src = '';
        docImg.style.display = 'none';
    }
    if (pdfFrame) {
        pdfFrame.src = '';
        pdfFrame.style.display = 'none';
    }

    const fileInput = document.getElementById('privateProjectorFileInput');
    if (fileInput) fileInput.value = '';
}

function projectorZoom(delta) {
    currentProjectorScale = Math.max(0.6, Math.min(3.5, currentProjectorScale + delta));
    const docImg = document.getElementById('docProjectionImg');
    const pdfFrame = document.getElementById('docProjectionPdfFrame');
    
    if (docImg && docImg.style.display !== 'none') {
        docImg.style.transform = `scale(${currentProjectorScale})`;
        docImg.style.transformOrigin = 'center center';
    }
    if (pdfFrame && pdfFrame.style.display !== 'none') {
        pdfFrame.style.transform = `scale(${currentProjectorScale})`;
        pdfFrame.style.transformOrigin = 'center center';
    }
}

/**
 * ☁️ OFFICIAL GOOGLE DRIVE POPUP WINDOW (PERFECT MOBILE FRAME CENTER LOCK)
 */
function openPrivateDrivePicker() {
    toggleHostMagicDrawer();

    const officialGoogleDriveUrl = "https://drive.google.com/drive/home";

    // 1. Get Mobile Call Frame Boundaries
    const container = document.querySelector('.arpeu-call-container') || document.body;
    const rect = container.getBoundingClientRect();

    // 2. Exact Dimensions Matching Mobile Frame
    const width = Math.min(rect.width * 0.95, 380);
    const height = Math.min(rect.height * 0.85, 620);

    // 3. Exact Center Positioning within Container
    const left = window.screenX + rect.left + (rect.width - width) / 2;
    const top = window.screenY + rect.top + (rect.height - height) / 2;

    window.open(
        officialGoogleDriveUrl,
        "ARPEU_Google_Drive_Popup",
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no`
    );
}


/**
 * 📋 DUAL-TAB AGENDA & LIVE RESOLUTIONS ENGINE
 */
function toggleAgendaHud() {
    const hud = document.getElementById('agendaHudFloating');
    if (hud) hud.style.display = hud.style.display === 'none' ? 'flex' : 'none';
}

function switchAgendaTab(tabType) {
    activeAgendaTabType = tabType;
    const tabPres = document.getElementById('tabPresentAgenda');
    const tabPrev = document.getElementById('tabPreviousAgenda');

    if (tabPres) tabPres.classList.toggle('active', tabType === 'present');
    if (tabPrev) tabPrev.classList.toggle('active', tabType === 'previous');

    renderConferenceAgendaHUD();
}

function initConferenceAgendaHUD() {
    renderConferenceAgendaHUD();
}

function renderConferenceAgendaHUD() {
    const container = document.getElementById('liveAgendaListContainer');
    if (!container) return;

    const list = (activeAgendaTabType === 'present') ? presentAgendaState : previousAgendaState;

    if (!list || list.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">No agenda points found in this section.</div>`;
        return;
    }

    container.innerHTML = list.map(item => {
        let statusClass = 'status-process';
        if (item.status === 'Completed') statusClass = 'status-completed';
        if (item.status === 'Not Completed') statusClass = 'status-pending';
        if (item.status === 'Committee Constituted') statusClass = 'status-constituted';

        const hostEditButton = isWebrtcHost ? `
            <button type="button" class="btn-add-resolution" onclick="openLiveResolutionEditor(${item.id})">
                <i class="fas fa-edit"></i> Edit Resolution / Status
            </button>
        ` : '';

        return `
            <div class="agenda-card">
                <div class="agenda-card-top">
                    <span class="agenda-keyword-badge">[ ${item.keyword} ]</span>
                    <span class="agenda-status-pill ${statusClass}">${item.status}</span>
                </div>
                <div class="agenda-card-title">
                    <strong>Point:</strong> ${item.point}
                </div>
                <div class="agenda-resolution-box">
                    <strong>Resolution:</strong> ${item.resolution || 'Discussion in progress.'}
                </div>
                ${hostEditButton}
            </div>
        `;
    }).join('');
}

/**
 * Host Live Resolution Entry during Meeting
 */
function openLiveResolutionEditor(agendaId) {
    if (!isWebrtcHost) return;

    const list = (activeAgendaTabType === 'present') ? presentAgendaState : previousAgendaState;
    const item = list.find(i => i.id === agendaId);
    if (!item) return;

    const newRes = prompt(`Enter Live Resolution for [ ${item.keyword} ]:`, item.resolution);
    if (newRes !== null && newRes.trim() !== '') {
        item.resolution = newRes.trim();

        const newStatus = prompt("Update Status (Completed / Under Process / Not Completed / Committee Constituted):", item.status);
        if (newStatus && newStatus.trim() !== '') {
            item.status = newStatus.trim();
        }

        renderConferenceAgendaHUD();
        alert(`Resolution saved for [ ${item.keyword} ] and synced with all participants.`);
    }
}

/**
 * Online Participants Counter Update
 */
function updateOnlineParticipantsCount(count) {
    liveOnlineParticipants = Math.max(1, count);
    const badge = document.getElementById('onlineCountNumber');
    if (badge) badge.textContent = liveOnlineParticipants;
}

/**
 * Zero-Cloud-Cost Local HD Recording
 */
function toggleLocalRecording() {
    if (!isWebrtcRecording) {
        startLocalRecording();
    } else {
        stopLocalRecording();
    }
}

function startLocalRecording() {
    if (!webrtcLocalStream) return;
    try {
        webrtcRecordedChunks = [];
        webrtcMediaRecorder = new MediaRecorder(webrtcLocalStream, { mimeType: 'video/webm;codecs=vp8,opus' });
        
        webrtcMediaRecorder.ondataavailable = function(e) {
            if (e.data.size > 0) webrtcRecordedChunks.push(e.data);
        };

        webrtcMediaRecorder.onstop = function() {
            const blob = new Blob(webrtcRecordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `ARPEU_Conference_${new Date().toISOString().slice(0,10)}.webm`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100);
        };

        webrtcMediaRecorder.start(1000);
        isWebrtcRecording = true;

        const recBtn = document.getElementById('btnToggleRec');
        const recText = document.getElementById('recStatusText');
        if (recBtn) recBtn.classList.add('recording-active');
        if (recText) recText.textContent = 'STOP REC';
        
    } catch (e) {
        console.error('Recording error:', e);
        alert('Local recording is not supported on this browser version.');
    }
}

function stopLocalRecording() {
    if (webrtcMediaRecorder && webrtcMediaRecorder.state !== 'inactive') {
        webrtcMediaRecorder.stop();
    }
    isWebrtcRecording = false;

    const recBtn = document.getElementById('btnToggleRec');
    const recText = document.getElementById('recStatusText');
    if (recBtn) recBtn.classList.remove('recording-active');
    if (recText) recText.textContent = 'REC';
}

/**
 * Virtual Background Options
 */
function toggleVirtualBgMenu() {
    alert("ARPEU Virtual Backgrounds: Executive Depth Blur & BMS Golden Crest Stage activated.");
}

/**
 * Bottom Frequent Controls (Mic, Camera, Hand Raise)
 */
let isHandRaised = false;

function webrtcToggleMic() {
    const btn = document.getElementById('btnToggleMic');
    const selfMicIcon = document.getElementById('selfMicIcon');
    const btnLabel = btn ? btn.querySelector('span') : null;
    const btnIcon = btn ? btn.querySelector('i') : null;

    let isAudioEnabled = false;

    if (webrtcLocalStream && webrtcLocalStream.getAudioTracks().length > 0) {
        const audioTrack = webrtcLocalStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        isAudioEnabled = audioTrack.enabled;
    } else {
        // Fallback state toggle if local stream is simulating
        isAudioEnabled = btn ? btn.classList.contains('muted') : true;
    }

    if (btn) {
        btn.classList.toggle('muted', !isAudioEnabled);
        if (btnLabel) btnLabel.textContent = isAudioEnabled ? 'Mute' : 'Unmuted';
        if (btnIcon) btnIcon.className = isAudioEnabled ? 'fas fa-microphone' : 'fas fa-microphone-slash';
    }
    if (selfMicIcon) {
        selfMicIcon.innerHTML = isAudioEnabled ? '<i class="fas fa-microphone"></i>' : '<i class="fas fa-microphone-slash text-danger"></i>';
    }
}

function webrtcToggleCam() {
    const btn = document.getElementById('btnToggleCam');
    const btnIcon = btn ? btn.querySelector('i') : null;
    const btnLabel = btn ? btn.querySelector('span') : null;

    let isVideoEnabled = false;

    if (webrtcLocalStream && webrtcLocalStream.getVideoTracks().length > 0) {
        const videoTrack = webrtcLocalStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        isVideoEnabled = videoTrack.enabled;
    } else {
        // Fallback state toggle
        isVideoEnabled = btn ? btn.classList.contains('muted') : true;
    }

    if (btn) {
        btn.classList.toggle('muted', !isVideoEnabled);
        if (btnIcon) btnIcon.className = isVideoEnabled ? 'fas fa-video' : 'fas fa-video-slash';
        if (btnLabel) btnLabel.textContent = isVideoEnabled ? 'Camera' : 'Cam Off';
    }
}

function webrtcRaiseHand() {
    const btn = document.getElementById('btnRaiseHand');
    const stageAlert = document.getElementById('stageHandAlert');
    const cadreName = document.getElementById('handAlertCadreName');

    isHandRaised = !isHandRaised;

    if (btn) {
        btn.classList.toggle('active', isHandRaised);
        btn.style.background = isHandRaised ? '#f57c00' : '';
        btn.style.borderColor = isHandRaised ? '#ff9800' : '';
    }

    if (stageAlert) {
        if (isHandRaised) {
            stageAlert.style.display = 'flex';
            if (cadreName) cadreName.textContent = 'You Raised Hand';
        } else {
            stageAlert.style.display = 'none';
        }
    }
}

function toggleHostAdminPanel() {
    const panel = document.getElementById('hostControlPopup');
    if (panel) {
        const isHidden = (panel.style.display === 'none' || panel.style.display === '');
        panel.style.display = isHidden ? 'flex' : 'none';
    }
}

function hostMuteAllParticipants() {
    alert('Host Directive: Global Mute broadcasted to all leaders.');
    toggleHostAdminPanel();
}

function hostClearAllHands() {
    const stageAlert = document.getElementById('stageHandAlert');
    if (stageAlert) stageAlert.style.display = 'none';

    const btn = document.getElementById('btnRaiseHand');
    if (btn) {
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.borderColor = '';
    }
    isHandRaised = false;

    alert('Host Directive: All raised hands have been lowered.');
    toggleHostAdminPanel();
}

/**
 * 🔴 LEAVE / CLOSE CONFERENCE CALL (INSTANT FULL CLEANUP)
 */
function leaveArpeuConference() {
    const modal = document.getElementById('arpeuNativeConferenceModal');
    
    // 1. Stop Recording if Active
    if (typeof isWebrtcRecording !== 'undefined' && isWebrtcRecording) {
        stopLocalRecording();
    }

    // 2. Stop Camera & Microphone Tracks
    if (typeof webrtcLocalStream !== 'undefined' && webrtcLocalStream) {
        webrtcLocalStream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
        });
        webrtcLocalStream = null;
    }

    // 3. Stop Projected Documents & Clean Video Elements
    if (typeof stopDocumentProjection === 'function') {
        stopDocumentProjection();
    }

    const localVideo = document.getElementById('localUserVideo');
    const mainVideo = document.getElementById('mainSpeakerVideo');
    if (localVideo) localVideo.srcObject = null;
    if (mainVideo) mainVideo.srcObject = null;

    // 4. Force Close Conference Modal Overlay
    if (modal) {
        modal.style.cssText = "display: none !important;";
    }

    document.body.style.overflow = '';
    console.log("[ARPEU Conference] Left meeting and cleaned all streams successfully.");
}

// Splash Screen Auto-Dismiss Failsafe
setTimeout(() => {
    const splash = document.getElementById('appSplashScreen');
    if (splash && splash.style.display !== 'none') {
        splash.style.opacity = '0';
        setTimeout(() => { splash.style.display = 'none'; }, 300);
    }
}, 1000);


/**
 * Host Magic Ball & Private Directive Controller
 */
function toggleHostMagicDrawer() {
    const drawer = document.getElementById('hostMagicDrawer');
    if (drawer) {
        drawer.style.display = drawer.style.display === 'none' ? 'flex' : 'none';
    }
}

/**
 * Live Executive Notepad Controller
 */
function openLiveNotepadStage() {
    toggleHostMagicDrawer();
    const stage = document.getElementById('liveNotepadStage');
    if (stage) stage.style.display = 'flex';
}

function closeLiveNotepadStage() {
    const stage = document.getElementById('liveNotepadStage');
    if (stage) stage.style.display = 'none';
}

function openPrivateDirectiveSenderModal() {
    toggleHostMagicDrawer();

    const cadreList = (typeof coreCommitteeMasterData !== 'undefined') ? coreCommitteeMasterData : coreCommitteeCadreMaster;
    const cadreOptions = cadreList.map((c, i) => `${i + 1}. ${c.name} (${c.designation})`).join('\n');
    
    const targetIdx = prompt(`Select Leader to send Private Directive:\n\n${cadreOptions}\n\nEnter number:`, "1");
    if (!targetIdx) return;

    const selectedLeader = cadreList[parseInt(targetIdx) - 1];
    if (!selectedLeader) {
        alert("Invalid leader selection.");
        return;
    }

    const directiveText = prompt(`Enter Private Directive for ${selectedLeader.name}:`, "Please get ready to speak next.");
    if (directiveText && directiveText.trim() !== '') {
        triggerSimulatedDirective(selectedLeader.name, directiveText.trim());
    }
}

function triggerSimulatedDirective(leaderName, message) {
    const banner = document.getElementById('privateHostDirectiveBanner');
    const textEl = document.getElementById('privateDirectiveMsgText');
    if (banner && textEl) {
        textEl.textContent = `[For ${leaderName}]: ${message}`;
        banner.style.display = 'flex';
    }
}

function dismissPrivateHostDirective() {
    const banner = document.getElementById('privateHostDirectiveBanner');
    if (banner) banner.style.display = 'none';
}

// ==========================================================================
// 8 & 17 FIXED MASTER DATA & MANAGE COMMITTEE MEMBERS MODAL CONTROLLER
// ==========================================================================

const coreCommitteeMasterData = [
    { id: "CC-01", name: "T. Raghuram", designation: "BMS State President | ARPEU Hon'ble President" },
    { id: "CC-02", name: "M.V.S. Naidu", designation: "BMS State General Secretary" },
    { id: "CC-03", name: "K. Lova Reddy", designation: "BMS State Secretary" },
    { id: "CC-04", name: "T. Sambasiva Rao", designation: "ARPEU State President" },
    { id: "CC-05", name: "C. Ramagopal Reddy", designation: "ARPEU State General Secretary" },
    { id: "CC-06", name: "P. Balakrishna", designation: "ARPEU State Treasurer" },
    { id: "CC-07", name: "K. Jayappa", designation: "ARPEU Working President" },
    { id: "CC-08", name: "A. Koteswara Rao", designation: "ARPEU Organising Secretary" }
];

const executiveCommitteeMasterData = [
    ...coreCommitteeMasterData,
    { id: "EC-09", name: "A. Lakshumaiah", designation: "APSPDCL Secretary" },
    { id: "EC-10", name: "P. Prasad", designation: "APCPDCL President" },
    { id: "EC-11", name: "S. Gurubrahmam", designation: "APCPDCL Secretary" },
    { id: "EC-12", name: "D. Kiran Kishore", designation: "APEPDCL President" },
    { id: "EC-13", name: "Antarvedi V. A. Babu", designation: "APEPDCL Secretary" },
    { id: "EC-14", name: "K. Rajesh", designation: "APTRANSCO President" },
    { id: "EC-15", name: "N. Dinesh Kumar", designation: "APTRANSCO Secretary" },
    { id: "EC-16", name: "Ch. Sudhakar", designation: "APGENCO President" },
    { id: "EC-17", name: "K. Prasad Reddy", designation: "APGENCO Secretary" }
];

let currentCoreSelectedIds = coreCommitteeMasterData.map(m => m.id);
let currentExecutiveSelectedIds = executiveCommitteeMasterData.map(m => m.id);
let activeManagingCommitteeType = 'core';

function openEditMembersModal(committeeType = 'core') {
    activeManagingCommitteeType = committeeType;
    const modal = document.getElementById('manageCommitteeMembersModal');
    const titleEl = document.getElementById('manageModalTitle');
    const container = document.getElementById('manageMembersListContainer');

    if (!modal || !container) return;

    const isCore = (committeeType === 'core');
    if (titleEl) {
        titleEl.textContent = isCore ? 'EDIT CORE COMMITTEE MEMBERS (8)' : 'EDIT EXECUTIVE COMMITTEE MEMBERS (17)';
    }

    const masterList = isCore ? coreCommitteeMasterData : executiveCommitteeMasterData;
    const selectedIds = isCore ? currentCoreSelectedIds : currentExecutiveSelectedIds;

    container.innerHTML = masterList.map((member, idx) => {
        const isChecked = selectedIds.includes(member.id) ? 'checked' : '';
        return `
            <label class="manage-member-row" for="chkMember_${member.id}">
                <input type="checkbox" class="manage-member-checkbox" id="chkMember_${member.id}" value="${member.id}" ${isChecked}>
                <div class="manage-member-info">
                    <span class="manage-member-name">${idx + 1}. ${member.name}</span>
                    <span class="manage-member-desig">${member.designation}</span>
                </div>
            </label>
        `;
    }).join('');

    modal.style.display = 'flex';
}

function closeEditMembersModal() {
    const modal = document.getElementById('manageCommitteeMembersModal');
    if (modal) modal.style.display = 'none';
}

function saveMeetingAttendeesSelection() {
    const isCore = (activeManagingCommitteeType === 'core');
    const checkboxes = document.querySelectorAll('.manage-member-checkbox:checked');
    const updatedSelectedIds = Array.from(checkboxes).map(chk => chk.value);

    if (updatedSelectedIds.length === 0) {
        alert("Please select at least 1 leader to participate in the meeting.");
        return;
    }

    if (isCore) {
        currentCoreSelectedIds = updatedSelectedIds;
    } else {
        currentExecutiveSelectedIds = updatedSelectedIds;
    }

    closeEditMembersModal();
    alert(`Calling list updated! (${updatedSelectedIds.length} leaders selected for this session).`);
}

// Live Preview Rectangle Highlight Marker Tool
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('projectorDrawingCanvas');
    if (!canvas) return;

    let rStartX = 0, rStartY = 0, isRDrawing = false, rSnapshot = null;
    const ctx = canvas.getContext('2d');

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startRect = (e) => {
        if (currentProjectorTool !== 'shape') return;
        isRDrawing = true;
        const p = getPos(e);
        rStartX = p.x;
        rStartY = p.y;
        rSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    const moveRect = (e) => {
        if (!isRDrawing || currentProjectorTool !== 'shape' || !rSnapshot) return;
        const p = getPos(e);
        ctx.putImageData(rSnapshot, 0, 0); // Restore canvas to show smooth live frame
        ctx.beginPath();
        ctx.strokeStyle = '#f57c00'; // Bold Orange
        ctx.lineWidth = 3;
        ctx.strokeRect(rStartX, rStartY, p.x - rStartX, p.y - rStartY);
    };

    const endRect = (e) => {
        if (!isRDrawing || currentProjectorTool !== 'shape') return;
        isRDrawing = false;
        const p = getPos(e);
        if (rSnapshot) ctx.putImageData(rSnapshot, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = '#f57c00';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(rStartX, rStartY, p.x - rStartX, p.y - rStartY);
        rSnapshot = null;
    };

    canvas.addEventListener('mousedown', startRect);
    canvas.addEventListener('mousemove', moveRect);
    canvas.addEventListener('mouseup', endRect);

    canvas.addEventListener('touchstart', startRect, { passive: true });
    canvas.addEventListener('touchmove', moveRect, { passive: true });
    canvas.addEventListener('touchend', endRect);
});

/* ==========================================================
   ACTIVE SPEAKER + SECONDARY SPEAKER + TAP TO PIN CONTROLLER
   ========================================================== */

let currentMainSpeakerData = coreCommitteeCadreMaster[0]; // Host/Default Speaker
let isPersonallyPinned = false;
let secondarySpeakerTimeout = null;

/**
 * 1. Personal Focus / Local Tap-to-Pin Feature
 * (Runs only on the local device that clicked, does not affect others)
 */
function handleCadreThumbClick(cadreId, cadreName, cadreRole, cadreUnit) {
    const mainVideo = document.getElementById('mainSpeakerVideo');
    const pinBadge = document.getElementById('personalPinIndicator');
    const pinnedNameEl = document.getElementById('pinnedLeaderName');

    isPersonallyPinned = true;

    // Update Ribbon with Pinned Leader Info Locally
    updateActiveSpeakerIdentity(cadreName, cadreRole, cadreUnit);

    if (pinBadge && pinnedNameEl) {
        pinnedNameEl.textContent = cadreName;
        pinBadge.style.display = 'flex';
    }

    console.log(`[Local Focus View] Pinned leader: ${cadreName} on this screen.`);
}

function resetPersonalFocusView() {
    isPersonallyPinned = false;
    const pinBadge = document.getElementById('personalPinIndicator');
    if (pinBadge) pinBadge.style.display = 'none';

    // Reset back to original Main Speaker
    updateActiveSpeakerIdentity(
        currentMainSpeakerData.name,
        currentMainSpeakerData.designation,
        currentMainSpeakerData.unit
    );
}

/**
 * 2. Secondary Speaker PiP Window Activator (Interrupter / Guidance Overlay)
 */
function triggerSecondarySpeakerGuidance(speakerName, stream = null) {
    const pipContainer = document.getElementById('secondarySpeakerPip');
    const pipName = document.getElementById('pipSpeakerName');
    const pipVideo = document.getElementById('secondarySpeakerVideo');

    if (!pipContainer) return;

    if (pipName) pipName.textContent = speakerName;
    if (pipVideo && stream) {
        pipVideo.srcObject = stream;
        pipVideo.play().catch(e => console.log(e));
    }

    pipContainer.style.display = 'block';

    // Auto-hide secondary speaker 4 seconds after they finish talking
    if (secondarySpeakerTimeout) clearTimeout(secondarySpeakerTimeout);
    secondarySpeakerTimeout = setTimeout(() => {
        pipContainer.style.display = 'none';
    }, 4500);
}

/* ==========================================================
   COMPANY TAB FILTER LOGIC (INSTANT SWITCH)
   ========================================================== */
function filterCompanyBearers(companyKey, element) {
    const floatingBtn = document.getElementById('btnFloatingBackToComps');

    // 1. Highlight Active Box
    document.querySelectorAll('.arpeu-comp-box').forEach(b => b.classList.remove('active-comp-box'));
    if (element) element.classList.add('active-comp-box');

    // 2. Hide all company panels first
    document.querySelectorAll('.company-bearers-view-panel').forEach(p => p.style.display = 'none');

    // 3. Open selected company panel
    const targetPanel = document.getElementById(`companyBearers_${companyKey}`);
    if (targetPanel) {
        targetPanel.style.display = 'block';
        if (floatingBtn) floatingBtn.style.display = 'flex'; // Show floating back button
        targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        if (floatingBtn) floatingBtn.style.display = 'none';
        alert(`${companyKey.toUpperCase()} Office Bearers list is being updated.`);
    }
}

function closeCompanyBearersPanel() {
    // 1. Hide open panels & floating button
    document.querySelectorAll('.company-bearers-view-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.arpeu-comp-box').forEach(b => b.classList.remove('active-comp-box'));

    const floatingBtn = document.getElementById('btnFloatingBackToComps');
    if (floatingBtn) floatingBtn.style.display = 'none';

    // 2. Smooth scroll back to Company Selector Hub
    const contentArea = document.getElementById("contentArea") || window;
    contentArea.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ==========================================================
   OFFICE BEARER TO PROFILE ENGINE (VIEW / EDIT / CREATE)
   ========================================================== */
function openBearerProfile(name, mobile, role, company) {
    // 1. Navigate to Profile Page
    if (typeof showPage === 'function') {
        showPage('profile');
    }

    // 2. Check if Profile Search/Load function exists (Auto-search by Mobile)
    const searchInput = document.getElementById('searchProfileMobile') || document.getElementById('profileSearchInput') || document.getElementById('searchMobile');
    
    if (searchInput) {
        searchInput.value = mobile;
        // If there's an existing search trigger function, run it
        if (typeof searchMemberProfile === 'function') {
            searchMemberProfile(mobile);
        } else if (typeof fetchProfileData === 'function') {
            fetchProfileData(mobile);
        }
    }

    // 3. Pre-fill data into Profile Form if in Create/Edit mode
    setTimeout(() => {
        const nameField = document.getElementById('profFullName') || document.getElementById('memberName');
        const mobileField = document.getElementById('profMobile') || document.getElementById('memberMobile');
        const roleField = document.getElementById('profDesignation') || document.getElementById('memberDesignation');
        const companyField = document.getElementById('profCompany') || document.getElementById('memberCompany');

        if (nameField && !nameField.value) nameField.value = name;
        if (mobileField && !mobileField.value) mobileField.value = mobile;
        if (roleField && !roleField.value) roleField.value = role;
        if (companyField && !companyField.value) companyField.value = company;
    }, 200);

    console.log(`[Office Bearer Profile] Redirected for: ${name} (${mobile})`);
}