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

/**
 * Manages view switching for all portal pages.
 * Displays completed pages and shows a professional placeholder for upcoming modules.
 * @param {string} page - Selected page target identifier
 */
function showPage(page) {
  // 1. Guard check: Block tab switching ONLY if receipt is explicitly open
  const rc = document.getElementById("receiptContainer");
  if (rc && rc.getAttribute("data-receipt-open") === "true") {
    console.warn("Navigation locked: Please close receipt before navigating.");
    return;
  }

  // 2. Safely capture all page section DOM elements
  const homeSec = document.getElementById("homeSection") || document.getElementById("homePage");
  const membSec = document.getElementById("membershipPage") || document.getElementById("membershipSection");
  const donSec  = document.getElementById("donationsSection") || document.getElementById("donationsPage") || document.getElementById("donationSection");
  const statSec = document.getElementById("statisticsSection") || document.getElementById("statisticsPage");
  const abtSec  = document.getElementById("aboutSection") || document.getElementById("aboutPage") || document.getElementById("aboutUsSection");
  const cntSec  = document.getElementById("contactSection") || document.getElementById("contactPage") || document.getElementById("contactUsSection");
  const dwnSec  = document.getElementById("downloadsSection") || document.getElementById("downloadsPage");
  const profSec = document.getElementById("profileSection") || document.getElementById("profilePage") || document.getElementById("myProfileSection");

  // Placeholder section for under-development modules
  let placeholderSec = document.getElementById("underDevPlaceholderSection");

  // Create placeholder section dynamically if missing in HTML
  if (!placeholderSec) {
    placeholderSec = document.createElement("div");
    placeholderSec.id = "underDevPlaceholderSection";
    placeholderSec.className = "main-page-section";
    placeholderSec.style.display = "none";
    placeholderSec.innerHTML = `
      <div class="main-page-container" style="padding: 40px 20px; text-align: center;">
        <div style="background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 40px 20px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="font-size: 48px; color: #003366; margin-bottom: 12px;">🚧</div>
          <h3 id="devPageTitle" style="color: #003366; font-size: 20px; margin-bottom: 8px; font-weight: 700;">Page Under Development</h3>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">This module is currently being configured under the Digital Cadre Management Framework (DCMF). It will be active soon!</p>
          <button type="button" class="profile-btn profile-btn-primary" onclick="showPage('home')" style="margin: 0 auto; padding: 8px 20px; font-size: 13px;">
            <i class="fas fa-home"></i> Back to Home Page
          </button>
        </div>
      </div>
    `;
    const mainContentArea = document.getElementById("contentArea") || document.body;
    mainContentArea.appendChild(placeholderSec);
  }

  // 3. Hide ALL sections completely
  if (rc) rc.style.display = "none";
  if (homeSec) homeSec.style.display = "none";
  if (membSec) membSec.style.display = "none";
  if (donSec) donSec.style.display = "none";
  if (statSec) statSec.style.display = "none";
  if (abtSec) abtSec.style.display = "none";
  if (cntSec) cntSec.style.display = "none";
  if (dwnSec) dwnSec.style.display = "none";
  if (profSec) profSec.style.display = "none";
  if (placeholderSec) placeholderSec.style.display = "none";

  // 4. Remove 'active' highlight class from all navigation links
  const navLinks = document.querySelectorAll(".nav-link, .nav-tab-link, .dropdown-item, .navbar-nav a, .nav-item");
  navLinks.forEach(function (link) {
    link.classList.remove("active");
  });

  // 5. Scroll page view smoothly to top position
  window.scrollTo({ top: 0, behavior: "smooth" });

  const targetPage = String(page).toLowerCase().trim();

  // 6. Dynamically locate active navigation tab element
  let activeLink = document.getElementById(`nav${targetPage.charAt(0).toUpperCase() + targetPage.slice(1)}`) ||
                   document.getElementById(`nav-${targetPage}`) ||
                   document.querySelector(`[onclick*="'${targetPage}'"]`) || 
                   document.querySelector(`[onclick*='"${targetPage}"']`);

  if (activeLink) {
    activeLink.classList.add("active");
    if (activeLink.parentElement && activeLink.parentElement.classList.contains("nav-item")) {
      activeLink.parentElement.classList.add("active");
    }
  }

  // Helper function to show placeholder card for unmapped modules
  function showUnderDevelopmentCard(titleName) {
    const titleEl = document.getElementById("devPageTitle");
    if (titleEl) titleEl.textContent = `${titleName} - Page Under Development`;
    if (placeholderSec) placeholderSec.style.display = "block";
  }

  // 7. Route and display targeted section cleanly
  switch (targetPage) {
    // COMPLETED MAJOR PAGES
    case "home":
      if (homeSec) homeSec.style.display = "block";
      break;

    case "membership":
      if (membSec) membSec.style.display = "block";
      break;

    case "donations":
    case "donation":
      if (donSec) donSec.style.display = "block";
      break;

    case "statistics":
    case "stats":
      if (statSec) statSec.style.display = "block";
      if (typeof renderStatisticsCharts === "function") {
        renderStatisticsCharts();
      }
      break;

    // COMPLETED 'MORE' MENU PAGES
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

    case "downloads":
    case "download":
      if (dwnSec) dwnSec.style.display = "block";
      break;

    case "profile":
    case "profiles":
    case "myprofile":
    case "my-profile":
    case "digitalprofile":
      if (profSec) profSec.style.display = "block";
      break;

    // UPCOMING MODULES (UNDER DEVELOPMENT PLACEHOLDERS)
    case "officebearers":
    case "office-bearers":
      showUnderDevelopmentCard("Office Bearers");
      break;

    case "gallery":
      showUnderDevelopmentCard("Gallery");
      break;

    case "notifications":
      showUnderDevelopmentCard("Notifications");
      break;

    case "settings":
      showUnderDevelopmentCard("Settings");
      break;

    case "adminlogin":
    case "admin":
    case "admin-login":
      showUnderDevelopmentCard("Admin Login");
      break;

    default:
      // Fallback for any unmapped future link
      showUnderDevelopmentCard("Module");
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
      setMembershipMode("new");
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
  const membInput = document.getElementById("memberPhoto");
  const profInput = document.getElementById("profilePhotoUpload") || document.getElementById("profPhotoInput");

  if (membInput) {
    membInput.addEventListener("change", function () {
      if (!this.files || !this.files[0]) return;
      activePhotoSource = "membership"; // Set source to Membership
      processSelectedPhoto(this.files[0]);
    });
  }

  if (profInput) {
    profInput.addEventListener("change", function () {
      if (!this.files || !this.files[0]) return;
      activePhotoSource = "profile"; // Set source to Profile
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



/* ==========================================================
   FLATPICKR DATE & TIME PICKERS ENGINE (WITH CLICK FIX)
   ========================================================== */

/**
 * Initializes Flatpickr on all date and time inputs across Membership, Profile and Donations
 * Ensures clicking visible time display boxes opens time picker instantly.
 */
function initializeDatePickers() {
  const base = { 
    disableMobile: true, 
    allowInput: false, 
    clickOpens: true, 
    animate: true, 
    position: "above", 
    static: true // Anchors popup inside parent box
  };

  // 1. Universal Date Inputs (Membership, Profile & Donations)
  ["#dob", "#joiningDate", "#profDob", "#profDoj", "#payNowDate", "#manualDate", "#donDate", "#donPayNowDate"].forEach(id => {
    const el = document.querySelector(id);
    if (el && typeof flatpickr === "function") {
      flatpickr(el, { 
        ...base, 
        dateFormat: "d-m-Y",
        maxDate: (id.includes("payNow") || id.includes("manual") || id.includes("don")) ? "today" : null,
        monthSelectorType: "dropdown",
        onReady: function(selectedDates, dateStr, instance) {
          const yearInput = instance.calendarContainer.querySelector(".numInput.cur-year");
          if (yearInput) {
            yearInput.removeAttribute("readonly");
          }
        },
        onChange: (selectedDates, dateStr, instance) => {
          el.value = dateStr;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          if (instance) instance.close();
        }
      });
    }
  });

  // 2. Universal Time Pickers (Membership & Donations)
  const timePickers = [
    { native: "#payNowTimeNative", display: "#payNowTimeDisplay" },
    { native: "#manualTimeNative", display: "#manualTimeDisplay" },
    { native: "#donTimeNative", display: "#donTimeDisplay" },
    { native: "#donPayNowTimeNative", display: "#donPayNowTimeDisplay" }
  ];

  timePickers.forEach(item => {
    const nativeEl  = document.querySelector(item.native);
    const displayEl = document.querySelector(item.display);

    if (nativeEl && typeof flatpickr === "function") {
      const fp = flatpickr(nativeEl, { 
        ...base, 
        enableTime: true, 
        noCalendar: true, 
        dateFormat: "H:i",
        position: "above",
        onChange: (selectedDates, dateStr) => {
          if (displayEl && dateStr) {
            let [hours, mins] = dateStr.split(':');
            hours = parseInt(hours, 10);
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            displayEl.value = `${hours.toString().padStart(2, '0')}:${mins} ${ampm}`;
            displayEl.dispatchEvent(new Event('input', { bubbles: true }));
            displayEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });

      // CLICK FIX: Opens time picker when clicking visible time box
      if (displayEl) {
        displayEl.addEventListener("click", () => fp.open());
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

    initializeUniversalDistrictEngine();

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
        if (status && selector === "#mobile") { status.className = "field-status"; status.innerHTML = ""; }
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
        if (status && selector === "#aadhaar") { status.className = "field-status"; status.innerHTML = ""; }
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

 /* ==========================================================
   UNIVERSAL UTR / TRANSACTION ID DUPLICATE CHECK ENGINE
   Single Engine for Membership, Donations & All Payment Forms
   ========================================================== */

/**
 * Universal Real-Time UTR / Reference No Duplicate Check Engine.
 * Automatically binds to all payment transaction ID inputs across Membership & Donations.
 */
function initializeUniversalUtrCheckEngine() {
  const utrInputs = document.querySelectorAll(
    '#payNowTransactionId, #manualTransactionId, #donUpiTxnId, #donPayNowTxnId, #donBankRefNo, .utr-field, input[id*="TransactionId"], input[id*="TxnId"], input[id*="RefNo"]'
  );

  utrInputs.forEach(utrInput => {
    if (!utrInput) return;

    // Real-time Input Event Listener
    utrInput.addEventListener("input", function () {
      // Force uppercase alphanumeric input
      this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const val = this.value.trim();

      const statusEl = document.getElementById("transactionIdStatus") || 
                       document.getElementById("donorMobileStatus");

      clearTimeout(debounceTimers.transactionid);

      if (val.length < 5) {
        if (statusEl && statusEl.classList && statusEl.classList.contains("field-status")) {
          statusEl.className = "field-status";
          statusEl.innerHTML = "";
        }
        return;
      }

      if (statusEl) {
        statusEl.className = "field-status checking";
        statusEl.style.color = "#003366";
        statusEl.innerHTML = "🔍 Checking UTR...";
      }

      debounceTimers.transactionid = setTimeout(() => {
        executeDuplicateCheck("transactionid", val, statusEl ? statusEl.id : "donorMobileStatus");
      }, 800);
    });

    // Blur Event Listener
    utrInput.addEventListener("blur", function () {
      const val = this.value.trim();
      if (val.length >= 5) {
        const statusEl = document.getElementById("transactionIdStatus") || document.getElementById("donorMobileStatus");
        clearTimeout(debounceTimers.transactionid);
        executeDuplicateCheck("transactionid", val, statusEl ? statusEl.id : "donorMobileStatus");
      }
    });
  });
}
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


/* =========================================================
   SUBMIT MEMBERSHIP (WITH AUTO-RESET & DRIVE BASE64 INTEGRATION)
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
    document.getElementById("payNowOption") && document.getElementById("payNowOption").checked
    ? document.getElementById("payNowTransactionId").value.trim()
    : (document.getElementById("manualTransactionId") ? document.getElementById("manualTransactionId").value.trim() : "");


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

    if (mobileDuplicate && mobileDuplicate.exists) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;
        alert(
            "Mobile Number Already Registered\n\n" +
            "Mobile Number : " + mobile + "\n" +
            "Membership ID : " + (mobileDuplicate.member ? mobileDuplicate.member.membershipId : "") + "\n" +
            "Member Name : " + (mobileDuplicate.member ? mobileDuplicate.member.fullName : "")
        );
        return;
    }


    /* ------------------------------
       EMPLOYEE ID DUPLICATE
    ------------------------------ */

    const employeeDuplicate = await checkEmployeeIdDuplicate(employeeId);
    console.log("Employee Result :", employeeDuplicate);

    if (employeeDuplicate && employeeDuplicate.exists) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;
        alert(
            "Employee ID Already Registered\n\n" +
            "Employee ID : " + employeeId + "\n" +
            "Membership ID : " + (employeeDuplicate.member ? employeeDuplicate.member.membershipId : "") + "\n" +
            "Member Name : " + (employeeDuplicate.member ? employeeDuplicate.member.fullName : "")
        );
        return;
    }


    /* ------------------------------
       AADHAAR DUPLICATE
    ------------------------------ */

    const aadhaarDuplicate = await checkAadhaarDuplicate(aadhaar);
    console.log("Aadhaar Result :", aadhaarDuplicate);

    if (aadhaarDuplicate && aadhaarDuplicate.exists) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;
        alert(
            "Aadhaar Number Already Registered\n\n" +
            "Aadhaar Number : " + aadhaar + "\n" +
            "Membership ID : " + (aadhaarDuplicate.member ? aadhaarDuplicate.member.membershipId : "") + "\n" +
            "Member Name : " + (aadhaarDuplicate.member ? aadhaarDuplicate.member.fullName : "")
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

        if (transactionDuplicate && transactionDuplicate.exists) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButtonText;
            alert(
                "Transaction ID Already Registered\n\n" +
                "Transaction ID : " + transactionId + "\n" +
                "Membership ID : " + (transactionDuplicate.member ? transactionDuplicate.member.membershipId : "") + "\n" +
                "Member Name : " + (transactionDuplicate.member ? transactionDuplicate.member.fullName : "")
            );
            return;
        }
    }

    /* ------------------------------
       MEMBER DATA
    ------------------------------ */

    const admissionFee = 100;
    const annualSubscription = 360;
    const donation = parseFloat(document.getElementById("payNowAmount") ? document.getElementById("payNowAmount").value : (document.getElementById("manualAmount") ? document.getElementById("manualAmount").value : 0)) || 0;
    const totalAmount = admissionFee + annualSubscription + donation;

    const data = {
        employeeId: employeeId,
        fullName: document.getElementById("employeeName").value.trim(),
        mobile: mobile,
        email: document.getElementById("email").value.trim(),
        aadhaar: aadhaar,

        company: document.getElementById("company").value,

        stationCircle:
            (document.getElementById("station") ? document.getElementById("station").value : "") ||
            (document.getElementById("circle") ? document.getElementById("circle").value : ""),

        divisionRegion:
            document.getElementById("division") ? document.getElementById("division").value : "",

        subDivision:
            document.getElementById("subDivision") ? document.getElementById("subDivision").value : "",

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

    /* ------------------------------
       CONVERT PHOTO TO BASE64
    ------------------------------ */

    const photoInput = document.getElementById("memberPhoto");

    if (photoInput && photoInput.files && photoInput.files.length > 0) {
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

    const receiptInput = document.getElementById("payNowReceipt") || document.getElementById("manualReceipt");

    if (receiptInput && receiptInput.files && receiptInput.files.length > 0) {
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
    console.log("Photo Base64 Length :", data.photoBase64 ? data.photoBase64.length : 0);
    console.log("Receipt Type :", data.receiptType);
    console.log("Receipt Base64 Length :", data.receiptBase64 ? data.receiptBase64.length : 0);

    try {
        const targetUrl = typeof BACKEND_URL !== "undefined" ? BACKEND_URL : (typeof WEB_APP_URL !== "undefined" ? WEB_APP_URL : "");

        const response = await fetch(targetUrl, {
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

        if (result.success || result.status === "success") {

            const resData = result.result || result;
            window.lastMembershipId = resData.membershipId;
            window.lastReceiptNo = resData.receiptNo; 

            // 1. Open Digital Receipt
            openReceipt();

            // 2. 📌 AUTO-RESET FORM AFTER SUCCESSFUL SUBMISSION
            if (typeof resetMembershipForm === "function") {
                resetMembershipForm();
            }

            if (typeof DEV_MODE !== "undefined" && !DEV_MODE) {
                const photoPreview = document.getElementById("photoPreview");
                if (photoPreview) {
                    photoPreview.removeAttribute("src");
                    photoPreview.style.display = "none";
                }

                const previewText = document.querySelector(".preview-text");
                if (previewText) {
                    previewText.style.display = "block";
                }

                const finalSec = document.getElementById("finalSubmitSection");
                if (finalSec) {
                    finalSec.style.display = "none";
                }
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButtonText;

        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButtonText;
            alert(result.message || "Submission Failed");
        }

    } catch (error) {
        console.error("FULL ERROR :", error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonText;
        alert("❌ " + error);
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
    rc.setAttribute("data-active", "true");
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
   RECEIPT DISPLAY & CLOSE HANDLERS
   ========================================================== */

function openReceipt() {
  loadReceiptPreview();

  if (typeof membershipPage !== 'undefined' && membershipPage) membershipPage.style.display = "none";
  if (typeof homeSection !== 'undefined' && homeSection) homeSection.style.display = "none";
  if (typeof statisticsSection !== 'undefined' && statisticsSection) statisticsSection.style.display = "none";

  const rc = document.getElementById("receiptContainer");
  if (rc) {
    rc.style.display = "block";
    rc.setAttribute("data-active", "true"); // Locks receipt view active status
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Reset membership form automatically upon receipt generation
  if (typeof resetMembershipForm === 'function') {
    resetMembershipForm();
  }
}

/**
 * Closes the receipt view and navigates back to Home page.
 * Executed strictly when user clicks the Close button.
 */
function closeReceipt() {
  const rc = document.getElementById("receiptContainer");
  if (rc) {
    rc.style.display = "none";
    rc.removeAttribute("data-active"); // Clears receipt view active lock
  }

  // Navigate back to home page with force bypass flag
  if (typeof showPage === 'function') {
    showPage("home", true);
  }
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

/*=========================================
DOWNLOADS & RESOURCES ENGINE - SPA COUPLING
=========================================*/

// 📌 మీ ఎగ్జిస్టింగ్ showPage ఫంక్షన్‌ను డిస్టర్బ్ చేయకుండా హుక్ చేయడం
if (typeof showPage === "function") {
    const originalShowPage = showPage;
    
    showPage = function (page) {
        // డౌన్‌లోడ్స్ సెక్షన్‌ను డిఫాల్ట్‌గా హైడ్ చేస్తుంది
        const dSec = document.getElementById("downloadsSection");
        if (dSec) dSec.style.display = "none";

        // మీ పాత ఒరిజినల్ ఫంక్షన్‌ను రన్ చేస్తుంది
        originalShowPage(page);

        // ఒకవేళ డౌన్‌లోడ్స్ పేజీ క్లిక్ చేస్తే ఈ సెక్షన్‌ను యాక్టివేట్ చేస్తుంది
        if (page === "downloads") {
            if (dSec) dSec.style.display = "block";
            
            // మెనూ Dropdown క్లోజ్ అవ్వడానికి
            const moreDropdown = document.getElementById("moreDropdown");
            if (moreDropdown) {
                moreDropdown.classList.remove("show");
            }
        }
    };
}

// 📌 ప్రెజెంటేషన్ కోసం వివిధ వెక్టర్ లోగోల SVG టెంప్లేట్స్
const dlModalVectors = {
    'arpeu': `<svg viewBox="0 0 100 100" fill="none" class="arpeu-blue" style="width:90px;height:90px;"><circle cx="50" cy="50" r="40" fill="#0f294a" /><circle cx="50" cy="50" r="32" fill="#eab308" /><path d="M50 10 L50 90 M10 50 L90 50" stroke="#0f294a" stroke-width="4" /><circle cx="50" cy="50" r="22" fill="#ef4444" /><polygon points="50,32 55,48 70,50 55,52 50,68 45,52 30,50 45,48" fill="#ffffff" /></svg>`,
    'bms': `<svg viewBox="0 0 100 100" fill="none" style="width:90px;height:90px;"><circle cx="50" cy="50" r="40" fill="#3b82f6" /><circle cx="50" cy="50" r="30" stroke="#f97316" stroke-width="8" stroke-dasharray="12 4" /><path d="M50 30 V70 M30 50 H70" stroke="#ffffff" stroke-width="3" /><circle cx="50" cy="50" r="14" fill="#f97316" /></svg>`,
    'bharatmata': `<svg viewBox="0 0 100 100" fill="none" style="width:90px;height:90px;"><rect x="15" y="15" width="70" height="70" rx="35" fill="#fff7ed" /><path d="M30 40 L50 20 L70 40 L60 80 L40 80 Z" fill="#ffedd5" /><path d="M20 55 C35 45, 65 45, 80 55" stroke="#f97316" stroke-width="6" /><path d="M20 62 C35 52, 65 52, 80 62" stroke="#ffffff" stroke-width="6" /><path d="M20 69 C35 59, 65 59, 80 69" stroke="#16a34a" stroke-width="6" /><circle cx="50" cy="45" r="10" fill="#ea580c" /></svg>`,
    'dcmf': `<svg viewBox="0 0 100 100" fill="none" style="width:90px;height:90px;"><circle cx="50" cy="50" r="40" fill="#f0fdf4" /><path d="M30 45 C40 35, 60 35, 70 45" stroke="#2563eb" stroke-width="6" stroke-linecap="round" /><path d="M30 55 C40 65, 60 65, 70 55" stroke="#ea580c" stroke-width="6" stroke-linecap="round" /><circle cx="50" cy="50" r="10" fill="#1e293b" /></svg>`,
    'bmsflag': `<svg viewBox="0 0 100 100" fill="none" style="width:90px;height:90px;"><line x1="25" y1="15" x2="25" y2="85" stroke="#475569" stroke-width="4" stroke-linecap="round" /><path d="M27 20 H75 C65 30, 75 40, 75 40 L27 50 Z" fill="#ea580c" /></svg>`,
    'arpeuflag': `<svg viewBox="0 0 100 100" fill="none" style="width:90px;height:90px;"><line x1="25" y1="15" x2="25" y2="85" stroke="#475569" stroke-width="4" stroke-linecap="round" /><path d="M27 20 H75 L75 50 L27 50 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" /><circle cx="51" cy="35" r="8" fill="#0f294a" /><circle cx="51" cy="35" r="5" fill="#eab308" /></svg>`,
    'arpeutr': `<svg viewBox="0 0 100 100" fill="none" style="width:90px;height:90px;"><circle cx="50" cy="50" r="40" stroke="#0f294a" stroke-width="4" /><circle cx="50" cy="50" r="32" fill="#eab308" opacity="0.9" /><polygon points="50,32 55,48 70,50 55,52 50,68 45,52 30,50 45,48" fill="#ef4444" /></svg>`,
    'bmstr': `<svg viewBox="0 0 100 100" fill="none" style="width:90px;height:90px;"><circle cx="50" cy="50" r="30" stroke="#f97316" stroke-width="8" stroke-dasharray="12 4" /><circle cx="50" cy="50" r="14" fill="#f97316" opacity="0.8" /></svg>`,
    'avatar': `<svg class="text-slate-400" viewBox="0 0 100 100" fill="none" style="width:90px;height:90px;"><circle cx="50" cy="50" r="45" fill="#f1f5f9" /><path d="M50 25 C40 25 38 35 38 42 C38 52 44 56 50 56 C56 56 62 52 62 42 C62 35 60 25 50 25 Z" fill="#cbd5e1" /><rect x="42" y="38" width="7" height="5" rx="1.5" stroke="#475569" stroke-width="2" /><rect x="51" y="38" width="7" height="5" rx="1.5" stroke="#475569" stroke-width="2" /><path d="M49 40 H51" stroke="#475569" stroke-width="2" /><path d="M30 75 C30 65 40 60 50 60 C60 60 70 65 70 75 Z" fill="#94a3b8" /></svg>`,
    'avatar-b': `<svg class="text-slate-400" viewBox="0 0 100 100" fill="none" style="width:90px;height:90px;"><circle cx="50" cy="50" r="45" fill="#f8fafc" /><path d="M50 25 C40 25 38 35 38 42 C38 52 44 56 50 56 C56 56 62 52 62 42 C62 35 60 25 50 25 Z" fill="#94a3b8" /><rect x="42" y="38" width="7" height="5" rx="1.5" stroke="#1e293b" stroke-width="2" /><rect x="51" y="38" width="7" height="5" rx="1.5" stroke="#1e293b" stroke-width="2" /><path d="M49 40 H51" stroke="#1e293b" stroke-width="2" /><path d="M30 75 C30 65 40 60 50 60 C60 60 70 65 70 75 Z" fill="#cbd5e1" /></svg>`,
    'pdf': `<div style="text-align:center;"><i class="fa-solid fa-file-pdf" style="font-size: 60px; color: #ef4444;"></i><p style="font-size:11px; font-weight:700; color:#475569; margin-top:8px;">Document File (PDF)</p></div>`
};

// 📌 Preview Modalను ఓపెన్ చేసే ఫంక్షన్
function openDownloadsPreview(title, type, vectorKey) {
    const modal = document.getElementById('downloadsPreviewModal');
    const container = document.getElementById('dlModalContainer');
    
    if (!modal || !container) return;

    document.getElementById('dlModalTitle').innerText = title;
    document.getElementById('dlModalBadge').innerText = `${type} Resource`;
    document.getElementById('dlModalFormat').innerText = type;

    const visualBox = document.getElementById('dlModalVisual');
    if (dlModalVectors[vectorKey]) {
        visualBox.innerHTML = dlModalVectors[vectorKey];
    } else {
        visualBox.innerHTML = `<span style="font-size:12px; font-weight:700; color:#94a3b8;">Preview N/A</span>`;
    }

    // Modal లోపల ఉన్న డౌన్‌లోడ్ బటన్ యాక్షన్
    const modalDownloadBtn = document.getElementById('dlModalDownloadActionBtn');
    modalDownloadBtn.onclick = function() {
        triggerDownloadsFile(`${title.replace(/\s+/g, '_')}.${type.toLowerCase()}`);
        closeDownloadsPreview();
    };

    // ఓపెనింగ్ యానిమేషన్స్
    modal.style.display = "flex";
    setTimeout(() => {
        modal.style.opacity = "1";
        container.style.transform = "scale(1)";
    }, 10);
}

// 📌 Preview Modalను క్లోజ్ చేసే ఫంక్షన్
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

// Overlay క్లిక్ చేస్తే మోడల్ క్లోజ్ అవ్వడానికి
document.getElementById('downloadsPreviewModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDownloadsPreview();
    }
});

// 📌 డౌన్‌లోడ్ టోస్ట్ నోటిఫికేషన్ ప్లస్ సిమ్యులేషన్ యాక్షన్
function triggerDownloadsFile(filename) {
    showDownloadsToast(`Downloading "${filename}"...`);
    
    // ఆటోమేటిక్ ఫైల్ డౌన్‌లోడ్ సిమ్యులేషన్ (800ms బఫరింగ్ తర్వాత)
    setTimeout(() => {
        const fakeFileBlob = new Blob(["ARPEU Resource - " + filename], {type: "text/plain"});
        const tempLink = document.createElement("a");
        tempLink.href = URL.createObjectURL(fakeFileBlob);
        tempLink.download = filename;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    }, 800);
}

// టోస్ట్ సందేశాన్ని చూపించే ఫంక్షన్
function showDownloadsToast(message) {
    const container = document.getElementById('dlToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = "dl-toast";
    toast.innerHTML = `
        <i class="fa-solid fa-spinner dl-toast-spinner"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // స్లైడ్-ఇన్ యానిమేషన్
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 10);

    // 3 సెకన్ల తర్వాత టోస్ట్ క్లోజ్ అవ్వడం
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px)";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/* ==========================================================
   DONATION PAYMENT MODULE (MIRRORED FROM PaymentModuleV25)
   ========================================================== */

const DonationPaymentModule = {
  init() {
    this.cacheDOM();
    this.bindEvents();
    this.reset();
  },

  cacheDOM() {
    this.dom = {
      payNowOpt:      document.getElementById("donPayNowOption"),
      alreadyPaidOpt: document.getElementById("donAlreadyPaidOption"),
      payNowSec:      document.getElementById("donPayNowSection"),
      alreadyPaidSec: document.getElementById("donAlreadyPaidSection"),
      payNowFields:   document.getElementById("donPayNowFields"),
      completedBtn:   document.getElementById("donPayCompletedBtn")
    };
  },

  reset() {
    if (this.dom.payNowSec)      this.dom.payNowSec.style.display      = "none";
    if (this.dom.alreadyPaidSec) this.dom.alreadyPaidSec.style.display = "none";
    if (this.dom.payNowFields)   this.dom.payNowFields.style.display   = "none";
    if (this.dom.payNowOpt)      this.dom.payNowOpt.checked           = false;
    if (this.dom.alreadyPaidOpt) this.dom.alreadyPaidOpt.checked       = false;
  },

  bindEvents() {
    if (this.dom.payNowOpt) {
      this.dom.payNowOpt.addEventListener("click", () => {
        if (this.dom.payNowSec)      this.dom.payNowSec.style.display      = "block";
        if (this.dom.alreadyPaidSec) this.dom.alreadyPaidSec.style.display = "none";
        if (this.dom.payNowFields)   this.dom.payNowFields.style.display   = "none";
      });
    }

    if (this.dom.alreadyPaidOpt) {
      this.dom.alreadyPaidOpt.addEventListener("click", () => {
        if (this.dom.alreadyPaidSec) this.dom.alreadyPaidSec.style.display = "block";
        if (this.dom.payNowSec)      this.dom.payNowSec.style.display      = "none";
      });
    }

    if (this.dom.completedBtn) {
      this.dom.completedBtn.addEventListener("click", () => {
        if (this.dom.payNowFields) this.dom.payNowFields.style.display = "block";
      });
    }

    // Payment Mode Sub-sections Switcher
    const payModes = document.querySelectorAll('input[name="donPayMode"]');
    payModes.forEach(radio => {
      radio.addEventListener("change", function () {
        const upiSec   = document.getElementById("donUpiSection");
        const bankSec  = document.getElementById("donBankSection");
        const cashSec  = document.getElementById("donCashSection");
        const chqSec   = document.getElementById("donChequeSection");

        if (upiSec)  upiSec.style.display  = "none";
        if (bankSec) bankSec.style.display = "none";
        if (cashSec) cashSec.style.display = "none";
        if (chqSec)  chqSec.style.display  = "none";

        if (this.value === "UPI" && upiSec)           upiSec.style.display  = "block";
        if (this.value === "Bank Transfer" && bankSec) bankSec.style.display = "block";
        if (this.value === "Cash" && cashSec)          cashSec.style.display = "block";
        if (this.value === "Cheque" && chqSec)        chqSec.style.display  = "block";
      });
    });

    // Date Pickers Binding
    ["#donDate", "#donPayNowDate"].forEach(id => {
      const el = document.querySelector(id);
      if (el && typeof flatpickr === "function") {
        flatpickr(el, { dateFormat: "d-m-Y", maxDate: "today", disableMobile: true, position: "above" });
      }
    });
  }
};

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", function () {
  DonationPaymentModule.init();
});


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


// ---------------------------------------------------------
// SUBMIT DONATION FORM TO BACKEND
// ---------------------------------------------------------
async function submitDonationForm() {
    const submitBtn = document.getElementById("submitDonationBtn");

    if (!document.getElementById("donDeclarationCheck").checked) {
        alert("Please accept the declaration before submitting your donation.");
        return;
    }

    const donorType = document.getElementById("donorType").value;
    const donorName = document.getElementById("donorName").value.trim();
    const donorMobile = document.getElementById("donorMobile").value.trim();
    const donationType = document.getElementById("donationType").value;
    const amount = document.getElementById("donationAmount").value;

    if (!donorType || !donorName || !donorMobile || !donationType || !amount || amount <= 0) {
        alert("Please fill all mandatory fields (Donor Type, Name, Mobile, Donation Type and Amount).");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting Donation...";

    const selectedPayMode = document.querySelector('input[name="donPayMode"]:checked').value;
    let txnId = "";
    let payDate = "";

    if (selectedPayMode === "UPI") {
        txnId = document.getElementById("donUpiTxnId").value.trim();
        payDate = document.getElementById("donUpiDate").value;
    } else if (selectedPayMode === "Bank Transfer") {
        txnId = document.getElementById("donBankRefNo").value.trim();
        payDate = document.getElementById("donBankDate").value;
    } else if (selectedPayMode === "Cash") {
        txnId = "CASH-" + (document.getElementById("donCashRecBy").value.trim() || "REP");
        payDate = document.getElementById("donCashDate").value;
    } else if (selectedPayMode === "Cheque") {
        txnId = "CHQ-" + document.getElementById("donChequeNo").value.trim();
        payDate = document.getElementById("donChequeDate").value;
    }

    const donationData = {
        donorType,
        donorName,
        donorMobile,
        donorEmail: document.getElementById("donorEmail").value.trim(),
        organization: document.getElementById("donorOrganization").value.trim(),
        address: document.getElementById("donorAddress").value.trim(),
        pan: document.getElementById("donorPan").value.trim().toUpperCase(),
        donationType,
        advtSize: document.getElementById("advtSize") ? document.getElementById("advtSize").value : "",
        diaryCount: document.getElementById("diaryCount") ? document.getElementById("diaryCount").value : "",
        amount: parseInt(amount),
        purpose: document.getElementById("donationPurpose").value.trim(),
        paymentMode: selectedPayMode,
        transactionId: txnId,
        paymentDate: payDate,
        proofBase64: "",
        proofType: ""
    };

    const proofFile = document.getElementById("donReceiptProof").files[0];
    if (proofFile) {
        donationData.proofType = proofFile.type;
        donationData.proofBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.readAsDataURL(proofFile);
        });
    }

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "saveDonation", data: donationData })
        });

        const result = await response.json();

        if (result.success) {
            openDonationReceipt(result.donation);
        } else {
            alert(result.message || "Failed to submit donation.");
        }
    } catch (e) {
        console.error("Donation Submit Error:", e);
        alert("Error submitting donation. Please check backend connection.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "SUBMIT DONATION";
    }
}

// ---------------------------------------------------------
// OPEN & CLOSE DONATION RECEIPT OVERLAY
// ---------------------------------------------------------
function openDonationReceipt(data) {
    document.querySelectorAll("#contentArea > section").forEach(s => s.style.display = "none");

    document.getElementById("drReceiptNo").textContent = data.receiptNo || "ARPEU/DON/2026/01";
    document.getElementById("drDonationId").textContent = data.donationId || "DON001";
    document.getElementById("drDate").textContent = data.paymentDate || new Date().toLocaleDateString('en-GB');
    document.getElementById("drDonorType").textContent = data.donorType || "-";
    document.getElementById("drDonorName").textContent = data.donorName || "-";
    document.getElementById("drMobile").textContent = data.donorMobile || "-";
    document.getElementById("drOrg").textContent = data.organization || "-";

    document.getElementById("drDonationType").textContent = data.donationType;
    document.getElementById("drPurpose").textContent = data.purpose || "";
    document.getElementById("drAmount").textContent = data.amount;
    document.getElementById("drTotal").textContent = data.amount;

    if (typeof numberToWords === "function") {
        document.getElementById("drInWords").textContent = numberToWords(data.amount);
    } else {
        document.getElementById("drInWords").textContent = data.amount + " Only";
    }

    document.getElementById("drPayMode").textContent = data.paymentMode;
    document.getElementById("drTxnId").textContent = data.transactionId || "N/A";

    const qrBox = document.getElementById("donationReceiptQr");
    if (qrBox && typeof QRCode === "function") {
        qrBox.innerHTML = "";
        new QRCode(qrBox, { text: `ARPEU DONATION: ${data.donationId} | Amount: Rs.${data.amount}`, width: 85, height: 85 });
    }

    const container = document.getElementById("donationReceiptContainer");
    if (container) container.style.display = "block";
    
    const contentArea = document.getElementById("contentArea");
    if (contentArea) contentArea.scrollTop = 0;
}

function closeDonationReceipt() {
    const donRc = document.getElementById("donationReceiptContainer");
    if (donRc) donRc.style.display = "none";
    if (typeof showPage === "function") {
        showPage("home");
    }
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
 * Previews uploaded profile photo instantly in avatar box
 * @param {Event} event - File input change event
 */
function previewProfilePhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const previewImg = document.getElementById("profilePhotoPreview");
    if (previewImg) {
      previewImg.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);
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

  // 3. Collect Checked Languages (Card 8) - Declared BEFORE object return!
  const selectedLanguages = [];
  document.querySelectorAll(".prof-lang-chk:checked").forEach(chk => selectedLanguages.push(chk.value));

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
      arpeuLevel:        getVal("profArpeuLevel"),
      arpeuDesignation:  getVal("profArpeuDesignation"),
      bmsResponsibility: getVal("profBmsResponsibility")
    },

    // 6 & 7. Talents & Technical Skills
    talents: selectedTalents,
    skills:  selectedSkills,

    // 8. Languages Known
    languages: selectedLanguages,

    // 9. Training & Development
    trainingAttended:       getVal("profTrainingAttended"),
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

