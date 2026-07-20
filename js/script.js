/* =========================================================
   ARPEU DIGITAL MEMBERSHIP PORTAL
   FILE        : script.js
   VERSION     : 1.0
   DEVELOPER   : P. Balakrishna
   DESCRIPTION : Core JavaScript Engine
========================================================= */

"use strict";

/* =========================================================
   GLOBAL VARIABLES
========================================================= */

const navHome=document.getElementById("navHome");
const navMembership=document.getElementById("navMembership");
const navStatistics=document.getElementById("navStatistics");

const homePage=document.getElementById("homePage");
const membershipPage=document.getElementById("membershipPage");
const statisticsPage=document.getElementById("statisticsPage");

const newMemberBtn=document.getElementById("newMemberBtn");
const renewalBtn=document.getElementById("renewalBtn");

const membershipTitle=document.getElementById("membershipTitle");
const submitMembershipBtn=document.getElementById("submitMembershipBtn");

const memberPhoto=document.getElementById("memberPhoto");
const photoPreview=document.getElementById("photoPreview");

const mobile=document.getElementById("mobile");
const aadhaar=document.getElementById("aadhaar");

const paymentOptions=document.querySelectorAll('input[name="paymentOption"]');
const upiPaymentSection=document.getElementById("upiPaymentSection");
const alreadyPaidSection=document.getElementById("alreadyPaidSection");

let membershipMode="new";

/* =========================================================
   INITIALIZE APPLICATION
========================================================= */

document.addEventListener("DOMContentLoaded",function(){

    initializeNavigation();

    initializeMembershipMode();
    
    initializeDistrictDropdown();

    initializePhotoPreview();

    initializePaymentOptions();

    initializeValidations();

    showPage("home");

});


/* =========================================================
   DISTRICT DROPDOWN
========================================================= */

const districtSelect=document.getElementById("district");

const districts=[
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

function initializeDistrictDropdown(){

    if(!districtSelect){
        return;
    }

    districts.forEach(function(district){

        const option=document.createElement("option");

        option.value=district;

        option.textContent=district;

        districtSelect.appendChild(option);

    });

}




/* =========================================================
   NAVIGATION ENGINE
========================================================= */

function showPage(page){

    if(homePage){
        homePage.style.display="none";
    }

    if(membershipPage){
        membershipPage.style.display="none";
    }

    if(statisticsPage){
        statisticsPage.style.display="none";
    }

    if(navHome){
        navHome.classList.remove("active");
    }

    if(navMembership){
        navMembership.classList.remove("active");
    }

    if(navStatistics){
        navStatistics.classList.remove("active");
    }

    switch(page){

        case "home":

            if(homePage){
                homePage.style.display="block";
            }

            if(navHome){
                navHome.classList.add("active");
            }

        break;

        case "membership":

            if(membershipPage){
                membershipPage.style.display="block";
            }

            if(navMembership){
                navMembership.classList.add("active");
            }

        break;

        case "statistics":

            if(statisticsPage){
                statisticsPage.style.display="block";
            }

            if(navStatistics){
                navStatistics.classList.add("active");
            }

        break;

    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

/* =========================================================
   INITIALIZE NAVIGATION
========================================================= */

function initializeNavigation(){

    if(navHome){

        navHome.addEventListener("click",function(e){

            e.preventDefault();

            showPage("home");

        });

    }

    if(navMembership){

        navMembership.addEventListener("click",function(e){

            e.preventDefault();

            setMembershipMode("new");

            showPage("membership");

        });

    }

    if(navStatistics){

        navStatistics.addEventListener("click",function(e){

            e.preventDefault();

            showPage("statistics");

        });

    }

}

/* =========================================================
   HOME PAGE MEMBERSHIP BUTTONS
========================================================= */

function initializeMembershipMode(){

    if(newMemberBtn){

        newMemberBtn.addEventListener("click",function(e){

            e.preventDefault();

            setMembershipMode("new");

            showPage("membership");

        });

    }

    if(renewalBtn){

        renewalBtn.addEventListener("click",function(e){

            e.preventDefault();

            setMembershipMode("renewal");

            showPage("membership");

        });

    }

}

/* =========================================================
   MEMBERSHIP MODE TOGGLE
========================================================= */

const toggleNewMember=document.getElementById("toggleNewMember");
const toggleRenewal=document.getElementById("toggleRenewal");
const membershipToggle=document.getElementById("membershipToggle");
const membershipDescription=document.getElementById("membershipDescription");

if(toggleNewMember&&toggleRenewal){

    toggleNewMember.addEventListener("click",function(){

        setMembershipMode("new");

    });

    toggleRenewal.addEventListener("click",function(){

        setMembershipMode("renewal");

    });

}

function setMembershipMode(mode){

    membershipMode=mode;

    if(!membershipTitle||!submitMembershipBtn){
        return;
    }

    if(mode==="renewal"){

        membershipTitle.textContent="MEMBERSHIP RENEWAL";

        membershipDescription.textContent="Renew your existing ARPEU membership.";

        submitMembershipBtn.textContent="SUBMIT RENEWAL";

        membershipToggle.classList.add("renewal");

        toggleRenewal.classList.add("active");
        toggleNewMember.classList.remove("active");

        membershipTitle.style.color="#FF6600";

    }else{

        membershipTitle.textContent="NEW MEMBER";

        membershipDescription.textContent="Join ARPEU and become a registered member.";

        submitMembershipBtn.textContent="SUBMIT MEMBERSHIP";

        membershipToggle.classList.remove("renewal");

        toggleNewMember.classList.add("active");
        toggleRenewal.classList.remove("active");

        membershipTitle.style.color="#0B4EA2";

    }

}


/* =========================================================
   PHOTO PREVIEW
========================================================= */
function initializePhotoPreview(){
    if(!memberPhoto||!photoPreview){
        return;
    }
    memberPhoto.addEventListener("change",function(){
        const file=this.files[0];
        if(!file){
            photoPreview.removeAttribute("src");
            photoPreview.style.display="none";
            return;
        }
        const reader=new FileReader();
        reader.onload=function(e){
            photoPreview.src=e.target.result;
            photoPreview.style.display="block";
        };
        reader.readAsDataURL(file);
    });
}
/* =========================================================
   PAYMENT OPTION
========================================================= */
function initializePaymentOptions(){
    if(paymentOptions.length===0){
        return;
    }
    paymentOptions.forEach(function(option){
        option.addEventListener("change",function(){
            if(this.value==="payNow"){
                showUpiSection();
            }else if(this.value==="alreadyPaid"){
                showAlreadyPaidSection();
            }
        });
    });
}
function showUpiSection(){
    if(upiPaymentSection){
        upiPaymentSection.style.display="block";
    }
    if(alreadyPaidSection){
        alreadyPaidSection.style.display="none";
    }
}
function showAlreadyPaidSection(){
    if(upiPaymentSection){
        upiPaymentSection.style.display="none";
    }
    if(alreadyPaidSection){
        alreadyPaidSection.style.display="block";
    }
}
/* =========================================================
   INPUT VALIDATIONS
========================================================= */
function initializeValidations(){
    initializeMobileValidation();
    initializeAadhaarValidation();
}
/* =========================================================
   MOBILE VALIDATION
========================================================= */
function initializeMobileValidation(){
    if(!mobile){
        return;
    }
    mobile.addEventListener("input",function(){
        this.value=this.value.replace(/\D/g,"");
        if(this.value.length>10){
            this.value=this.value.substring(0,10);
        }
    });
}
/* =========================================================
   AADHAAR VALIDATION
========================================================= */
function initializeAadhaarValidation(){
    if(!aadhaar){
        return;
    }
    aadhaar.addEventListener("input",function(){
        this.value=this.value.replace(/\D/g,"");
        if(this.value.length>12){
            this.value=this.value.substring(0,12);
        }
    });
}
/* =========================================================
   COMMON UTILITIES
========================================================= */
function showElement(element){
    if(element){
        element.style.display="block";
    }
}
function hideElement(element){
    if(element){
        element.style.display="none";
    }
}
function enableElement(element){
    if(element){
        element.disabled=false;
    }
}
function disableElement(element){
    if(element){
        element.disabled=true;
    }
}
function clearInput(element){
    if(element){
        element.value="";
    }
}
function getValue(element){
    if(!element){
        return"";
    }
    return element.value.trim();
}
function setValue(element,value){
    if(element){
        element.value=value;
    }
}
/* =========================================================
   MESSAGE HELPERS
========================================================= */
function showSuccess(message){
    alert(message);
}
function showError(message){
    alert(message);
}
/* =========================================================
   PART 2 END
========================================================= */



/* =========================================================
   FORM VALIDATION
========================================================= */
function validateMembershipForm(){
    const fullName=document.getElementById("fullName");
    const fatherName=document.getElementById("fatherName");
    const gender=document.getElementById("gender");
    const dob=document.getElementById("dob");
    const company=document.getElementById("company");
    const employeeId=document.getElementById("employeeId");
    const declaration=document.getElementById("declaration");
    if(fullName&&getValue(fullName)===""){
        showError("Please Enter Full Name");
        fullName.focus();
        return false;
    }
    if(fatherName&&getValue(fatherName)===""){
        showError("Please Enter Father / Husband Name");
        fatherName.focus();
        return false;
    }
    if(gender&&getValue(gender)===""){
        showError("Please Select Gender");
        gender.focus();
        return false;
    }
    if(dob&&getValue(dob)===""){
        showError("Please Select Date Of Birth");
        dob.focus();
        return false;
    }
    if(mobile&&mobile.value.length!==10){
        showError("Please Enter Valid Mobile Number");
        mobile.focus();
        return false;
    }
    if(aadhaar&&aadhaar.value.length!==12){
        showError("Please Enter Valid Aadhaar Number");
        aadhaar.focus();
        return false;
    }
    if(company&&getValue(company)===""){
        showError("Please Select Company");
        company.focus();
        return false;
    }
    if(employeeId&&getValue(employeeId)===""){
        showError("Please Enter Employee ID");
        employeeId.focus();
        return false;
    }
    if(declaration&&!declaration.checked){
        showError("Please Accept Declaration");
        declaration.focus();
        return false;
    }
    return true;
}
/* =========================================================
   MEMBER DATA
========================================================= */
function collectMembershipData(){
    return{
        membershipMode:membershipMode,
        fullName:getValue(document.getElementById("fullName")),
        fatherName:getValue(document.getElementById("fatherName")),
        gender:getValue(document.getElementById("gender")),
        dob:getValue(document.getElementById("dob")),
        mobile:getValue(document.getElementById("mobile")),
        email:getValue(document.getElementById("email")),
        aadhaar:getValue(document.getElementById("aadhaar")),
        company:getValue(document.getElementById("company")),
        circle:getValue(document.getElementById("circle")),
        division:getValue(document.getElementById("division")),
        subDivision:getValue(document.getElementById("subDivision")),
        section:getValue(document.getElementById("section")),
        employeeId:getValue(document.getElementById("employeeId")),
        designation:getValue(document.getElementById("designation")),
        joiningDate:getValue(document.getElementById("joiningDate")),
        regionalUnit:getValue(document.getElementById("regionalUnit")),
        membershipType:getValue(document.getElementById("membershipType")),
        transactionId:getValue(document.getElementById("transactionId")),
        createdDate:new Date().toISOString()
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
        const memberData=collectMembershipData();
        console.log(memberData);
        showSuccess("Membership Details Collected Successfully");
    });
}
document.addEventListener("DOMContentLoaded",function(){
    initializeFormSubmit();
});
/* =========================================================
   RESET FORM
========================================================= */
function resetMembershipForm(){
    const formElements=document.querySelectorAll("input,select,textarea");
    formElements.forEach(function(element){
        if(element.type==="checkbox"||element.type==="radio"){
            element.checked=false;
        }else if(element.type!=="button"&&element.type!=="submit"){
            element.value="";
        }
    });
    if(photoPreview){
        photoPreview.removeAttribute("src");
        photoPreview.style.display="none";
    }
    hideElement(upiPaymentSection);
    hideElement(alreadyPaidSection);
}
/* =========================================================
   GOOGLE SHEETS PLACEHOLDER
========================================================= */
function saveToGoogleSheets(data){
    console.log("Google Sheets Integration Ready");
    console.log(data);
}
/* =========================================================
   STATISTICS PLACEHOLDER
========================================================= */
function loadStatistics(){
    console.log("Statistics Module Ready");
}
/* =========================================================
   END OF FILE
========================================================= */
