function showAlert(message) {
  var alertDiv = document.getElementById("alert");
  alertDiv.innerHTML = message;
  alertDiv.style.display = "block";
  alertDiv.classList.add("animate__animated", "animate__fadeInUp");
  setTimeout(function () {
    alertDiv.classList.remove("animate__fadeInUp");
    alertDiv.classList.add("animate__fadeOutUp");
    setTimeout(function () {
      alertDiv.style.display = "none";
      alertDiv.classList.remove("animate__fadeOutUp");
    }, 1000);
  }, 5000);
}
// q1
const q1 = document.querySelectorAll("#q1 .answer");
const speclist = document.querySelectorAll("#q1 select");

q1.forEach((element) => {
  element.addEventListener("click", function () {
    q1.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    element.children[0].checked = true;
    courseName = element.children[0].getAttribute("value");
    speclist.forEach((element) => {
      element.hidden = true;
    });
    selector = "[name='" + courseName + "-Spec']";
    document.querySelector(selector).hidden = false;
  });
});
// q2
// q2
const q2 = document.querySelectorAll("#q2 .answer");

q2.forEach((element, index) => {
  element.addEventListener("click", function () {
    q2.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    element.children[0].checked = true;
    
    // Show or hide additional fields based on selected status
    const answerWrappers = document.querySelectorAll(".answerWrapper2-1");
    if (index === 0) { // Fresher
      answerWrappers[0].hidden = false; // Show expected salary and previous qualification percentage
      answerWrappers[1].hidden = true;  // Hide current salary and experience
    } else if (index === 1) { // Working Professional
      answerWrappers[0].hidden = true;  // Hide expected salary and previous qualification percentage
      answerWrappers[1].hidden = false; // Show current salary and experience
    }
  });
});


// q3
const q3 = document.querySelectorAll("#q3 .answer");

q3.forEach((element) => {
  element.addEventListener("click", function () {
    q3.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    element.children[0].checked = true;
  });
});

// q4
const q4 = document.querySelectorAll("#q4 .answer");

q4.forEach((element) => {
  element.addEventListener("click", function () {
    q4.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    element.children[0].checked = true;
  });
});

// q5

// q6

// q7
const q7 = document.querySelectorAll("#q7 .answerWrapper7 .answer");
const q7_1Wrapper = document.querySelectorAll("#q7 .answerWrapper7-1");
const q7_1 = document.querySelectorAll("#q7 .answerWrapper7-1 .answer");

q7.forEach((element, index) => {
  element.addEventListener("click", function () {
    q7.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    element.children[0].checked = true;

    q7_1Wrapper.forEach((element) => {
      element.hidden = true;
    });
    q7_1Wrapper[index].hidden = false;
  });
});

q7_1.forEach((element) => {
  element.addEventListener("click", function () {
    q7_1.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    element.children[0].checked = true;
  });
});


// q8 (Planning to join)
const q8 = document.querySelectorAll("#q8 .answer");

q8.forEach((element) => {
  element.addEventListener("click", function () {
    q8.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    element.children[0].checked = true;
  });
});

// q9 (How we help You)
const q9 = document.querySelectorAll("#q9 .answer");

q9.forEach((element) => {
  element.addEventListener("click", function () {
    q9.forEach((element) => {
      element.classList.remove("selected");
    });
    element.classList.add("selected");
    element.children[0].checked = true;
  });
});


// stepProgress
const steps = document.querySelectorAll(".steps");
const stepProgress = document.querySelectorAll(".circle");
const nextButtons = document.querySelectorAll(".nav .next");
const prevButtons = document.querySelectorAll(".nav .prev");
let nextValidate = false;
submitData = {};

// next button
nextButtons.forEach((element, index) => {
  element.addEventListener("click", function () {
    switch (index) {
      case 0:
        checkedRadio = document.querySelector("input[name = course]:checked");
        if (checkedRadio != null) {
          optionSelector = document.querySelector(
            'select[name="' + checkedRadio.value + '-Spec"]'
          );
          if (optionSelector.selectedIndex != 0) {
            nextValidate = true;
            submitData.course = checkedRadio.value;
            submitData.specialization = optionSelector.value;
          } else {
            nextValidate = false;
            showAlert("Please select any specialization");
          }
        } else {
          nextValidate = false;
          showAlert("Please select any course");
        }
        break;

      case 1:
        // Question 2 validation
        checkedRadio = document.querySelector("input[name = status]:checked");
        if (checkedRadio != null) {
          const fresherWrapper =
            document.querySelectorAll(".answerWrapper2-1")[0];
          const workingProfessionalWrapper =
            document.querySelectorAll(".answerWrapper2-1")[1];

          if (checkedRadio.value === "Fresher") {
            if (fresherWrapper.hidden) {
              nextValidate = true;
              submitData.status = checkedRadio.value;
              submitData.expSalary = "";
              submitData.currSalary = "";
              submitData.experience = "";
              submitData.currDomain = "";
            } else {
              const expSalary = document.querySelector(
                "input[name=expSalary]"
              ).value;

              if (expSalary === "") {
                nextValidate = false;
                showAlert("Please enter your expected salary");
              } else {
                nextValidate = true;
                submitData.status = checkedRadio.value;
                submitData.expSalary = expSalary;
                submitData.currSalary = "";
                submitData.experience = "";
                submitData.currDomain = "";
              }
            }
          } else if (checkedRadio.value === "Working Professional") {
            const currSalary = document.querySelector(
              "input[name=currSalary]"
            ).value;
            const experience = document.querySelector(
              "input[name=experience]"
            ).value;
            const currDomain = document.querySelector(
              "input[name=currDomian]"
            ).value;

            if (currSalary === "") {
              nextValidate = false;
              showAlert("Please enter your current salary");
            } else if (experience === "") {
              nextValidate = false;
              showAlert("Please enter your total years of experience");
            } else if (currDomain === "") {
              nextValidate = false;
              showAlert("Please enter your current domain");
            } else {
              nextValidate = true;
              submitData.status = checkedRadio.value;
              submitData.currSalary = currSalary;
              submitData.experience = experience;
              submitData.currDomain = currDomain;
              submitData.expSalary = "";
            }
          }
        } else {
          nextValidate = false;
          showAlert("Please select your current status");
        }
        break;
      case 2:
        checkedRadio = document.querySelector(
          "input[name = empLocation]:checked"
        );
        if (checkedRadio != null) {
          nextValidate = true;
          submitData.empLocation = checkedRadio.value;
        } else {
          nextValidate = false;
          showAlert("Please select a location");
        }
        break;

      case 3:
        checkedRadio = document.querySelector("input[name = sector]:checked");
        if (checkedRadio != null) {
          nextValidate = true;
          submitData.sector = checkedRadio.value;
        } else {
          nextValidate = false;
          showAlert("Please select a sector");
        }
        break;

      case 4:
        if (
          document.querySelector("input[name = prevUniversity]").value == ""
        ) {
          nextValidate = false;
          showAlert("Please enter your prev university");
        } else {
          nextValidate = true;
          submitData.prevUniversity = document.querySelector(
            "input[name = prevUniversity]"
          ).value;
        }
        break;

      case 5:
        const prevQualification = document.querySelector(
          "input[name=prevQualification]"
        ).value;
        let prevQualificationPercentage = document.querySelector(
          "input[name=prevQualificationPercentage]"
        ).value;

        // Remove % symbol if present
        if (prevQualificationPercentage.endsWith("%")) {
          prevQualificationPercentage = prevQualificationPercentage
            .slice(0, -1)
            .trim();
        }

        // Validate previous qualification
        if (prevQualification === "") {
          nextValidate = false;
          showAlert("Please enter your previous qualification");
        } else if (prevQualificationPercentage === "") {
          nextValidate = false;
          showAlert("Please enter your previous qualification percentage");
        } else if (
          isNaN(prevQualificationPercentage) ||
          prevQualificationPercentage < 0 ||
          prevQualificationPercentage > 100
        ) {
          nextValidate = false;
          showAlert("Please enter a valid percentage (0-100)");
        } else {
          nextValidate = true;
          submitData.prevQualification = prevQualification;
          submitData.prevQualificationPercentage = prevQualificationPercentage;
        }
        break;

      case 6:
        checkedRadio = document.querySelector("input[name = exposure]:checked");
        if (checkedRadio != null) {
          if (!document.querySelectorAll(".answerWrapper7-1")[0].hidden) {
            if (
              document.querySelector("input[name = budget1]:checked") != null
            ) {
              nextValidate = true;
              submitData.exposure = document.querySelector(
                "input[name = exposure]:checked"
              ).value;
              submitData.budget = document.querySelector(
                "input[name = budget1]:checked"
              ).value;
            } else {
              nextValidate = false;
              showAlert("Please select a budget");
            }
          } else if (
            !document.querySelectorAll(".answerWrapper7-1")[1].hidden
          ) {
            if (
              document.querySelector("input[name = budget2]:checked") != null
            ) {
              nextValidate = true;
              submitData.budget = document.querySelector(
                "input[name = budget2]:checked"
              ).value;
            } else {
              nextValidate = false;
              showAlert("Please select a budget");
            }
          } else if (
            !document.querySelectorAll(".answerWrapper7-1")[2].hidden
          ) {
            if (
              document.querySelector("input[name = budget3]:checked") != null
            ) {
              nextValidate = true;
              submitData.budget = document.querySelector(
                "input[name = budget3]:checked"
              ).value;
            } else {
              nextValidate = false;
              showAlert("Please select a budget");
            }
          }
        } else {
          nextValidate = false;
          showAlert("Please select an exposure");
        }
        break;

      // Update the switch case in nextButtons event listener:
      case 7:
        checkedRadio = document.querySelector(
          "input[name = planningToJoin]:checked"
        );
        if (checkedRadio != null) {
          nextValidate = true;
          submitData.planningToJoin = checkedRadio.value;
        } else {
          nextValidate = false;
          showAlert("Please select when you are planning to join");
        }
        break;

      case 8:
        checkedRadio = document.querySelector("input[name = help]:checked");
        if (checkedRadio != null) {
          nextValidate = true;
          submitData.help = checkedRadio.value;
        } else {
          nextValidate = false;
          showAlert("Please select how we can help you");
        }
        break;

      case 9:
        nextValidate = true;
        submitData.description = document.querySelector(
          "textarea[name = Description]"
        ).value;
        break;
    }

    // NextValidate
    if (nextValidate) {
      // reset stepprogress
      stepProgress.forEach((element) => {
        element.classList.remove("blue");
        element.classList.remove("yellow");
      });

      if (
        index == 2 &&
        document.querySelector("input[name = empLocation]:checked").value ==
          "Abroad"
      ) {
        // set stepprogress
        stepProgress[index + 2].classList.add("yellow");
        for (i = 0; i < index + 2; i++) {
          stepProgress[i].classList.add("blue");
        }
        // reset steps
        steps.forEach((element) => {
          element.hidden = true;
        });
        // set step
        steps[index + 2].hidden = false;
      } else {
        stepProgress[index + 1].classList.add("yellow");
        for (i = 0; i < index + 1; i++) {
          stepProgress[i].classList.add("blue");
        }
        // reset steps
        steps.forEach((element) => {
          element.hidden = true;
        });
        // set step
        steps[index + 1].hidden = false;
      }
    }
  });
});

// prev button
prevButtons.forEach((element, index) => {
  element.addEventListener("click", function () {
    // reset stepprogress
    stepProgress.forEach((element) => {
      element.classList.remove("blue");
      element.classList.remove("yellow");
    });
    if (
      index == 3 &&
      document.querySelector("input[name = empLocation]:checked").value ==
        "Abroad"
    ) {
      // default for sector
      submitData.sector = "";
      // set stepprogress
      stepProgress[index - 1].classList.add("yellow");
      for (i = 0; i < index - 1; i++) {
        stepProgress[i].classList.add("blue");
      }
      // reset steps
      steps.forEach((element) => {
        element.hidden = true;
      });
      // set step
      steps[index - 1].hidden = false;
    } else {
      // set stepprogress
      stepProgress[index].classList.add("yellow");
      for (i = 0; i < index; i++) {
        stepProgress[i].classList.add("blue");
      }
      // reset steps
      steps.forEach((element) => {
        element.hidden = true;
      });
      // set step
      steps[index].hidden = false;
    }
  });
});
// Function to show alerts using Alertify.js
function showAlerts(message) {
  alertify.error(message);

  // Clear email and mobile fields
  const emailField = document.querySelector("#q11 .answer input[name=email]");
  const mobileField = document.querySelector("#q11 .answer input[name=mobile]");
  const whatsappField = document.querySelector(
    "#q11 .answer input[name=whatsapp]"
  );

  if (emailField) {
    emailField.value = ""; // Clear email field
  } else {
    console.error("Email field not found");
  }

  if (whatsappField) {
    whatsappField.value = ""; // Clear whatsapp field
  } else {
    console.error("Whatsapp field not found");
  }

  if (mobileField) {
    mobileField.value = ""; // Clear mobile field
  } else {
    console.error("Mobile field not found");
  }

  // Enable the submit button again
  const submitButton = document.querySelector("#q11 .nav .submit");
  if (submitButton) {
    submitButton.disabled = false;
  } else {
    console.error("Submit button not found");
  }
}

// Function to get the value from a field or group of fields
function getValue(selector) {
  const element = document.querySelector(selector);
  if (element) {
    if (element.type === "radio" || element.type === "checkbox") {
      if (element.checked) {
        return element.value;
      }
    } else {
      return element.value;
    }
  }
  return "";
}

// Data Collection and Validation
function collectFormData() {
  let submitData = {};

  // Safely get values with null checks and optional chaining
  const safeGet = (selector, attribute = 'value') => {
    const element = document.querySelector(selector);
    return element ? element[attribute] : '';
  };

  // Collect data from multi-step form
  submitData.course = safeGet("input[name=course]:checked", "value");
  submitData.specialization = submitData.course ? 
    safeGet(`select[name="${submitData.course}-Spec"]`) : '';
  submitData.status = safeGet("input[name=status]:checked", "value");
  submitData.expSalary = safeGet("input[name=expSalary]");
  submitData.prevQualificationPercentage = safeGet("input[name=prevQualificationPercentage]");
  submitData.currSalary = safeGet("input[name=currSalary]");
  submitData.currDomain = safeGet("input[name=currDomian]");
  submitData.experience = safeGet("input[name=experience]");
  submitData.empLocation = safeGet("input[name=empLocation]:checked", "value");

  // Handle sector based on location
  submitData.sector = submitData.empLocation === "Abroad" ? 
    "Private Sector" : safeGet("input[name=sector]:checked", "value");

  submitData.prevUniversity = safeGet("input[name=prevUniversity]");
  submitData.prevQualification = safeGet("input[name=prevQualification]");
  submitData.exposure = safeGet("input[name=exposure]:checked", "value");

  // Handle budget from multiple possible sources
  submitData.budget = 
    safeGet("input[name=budget1]:checked", "value") ||
    safeGet("input[name=budget2]:checked", "value") ||
    safeGet("input[name=budget3]:checked", "value") ||
    "";

  // New fields
  submitData.planningToJoin = safeGet("input[name=planningToJoin]:checked", "value");
  submitData.help = safeGet("input[name=help]:checked", "value");
  submitData.description = safeGet("textarea[name=Description]");

  // Contact details
  submitData.name = safeGet("#q11 .answer input[name=name]");
  submitData.email = safeGet("#q11 .answer input[name=email]");
  submitData.whatsapp = safeGet("#q11 .answer input[name=whatsapp]");
  submitData.mobile = safeGet("#q11 .answer input[name=mobile]");
  submitData.state = safeGet("#q11 #stateSelect");
  submitData.city = safeGet("#q11 #citySelect");

  // Handle referral
  const queryParams = new URLSearchParams(window.location.search);
  const ReferredBy = queryParams.get("studentid");
  if (ReferredBy) {
    submitData.ReferredBy = ReferredBy;
  }

  return submitData;
}

function validateFinalForm(submitData) {
  // Validation messages
  const messages = {
    required: (field) => `Please fill in your ${field}`,
    whatsapp: "Please enter a valid 10-digit WhatsApp number",
    email: "Please enter a valid email address",
    mobile: "Please enter a valid 10-digit mobile number",
  };

  // Validate WhatsApp
  const whatsappPattern = /^\d{10}$/;
  if (!whatsappPattern.test(submitData.whatsapp)) {
    showAlert(messages.whatsapp);
    return false;
  }

  // Validate mobile
  if (!whatsappPattern.test(submitData.mobile)) {
    showAlert(messages.mobile);
    return false;
  }

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(submitData.email)) {
    showAlert(messages.email);
    return false;
  }

  // Required fields check
  const requiredFields = ["name", "email", "whatsapp", "mobile", "state", "city"];
  for (const field of requiredFields) {
    if (!submitData[field] || submitData[field].trim() === "") {
      showAlert(messages.required(field));
      return false;
    }
  }

  return true;
}
// Submit Button Handler
document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.querySelector("#q11 .nav .submit");
  
  if (!submitBtn) {
    console.error("Submit button not found");
    return;
  }

  submitBtn.addEventListener("click", async function() {
    try {
      const submitData = collectFormData();
      
      if (!validateFinalForm(submitData)) {
        return;
      }

      // Show loading state
      const buttonText = submitBtn.querySelector('.button-text');
      const spinner = submitBtn.querySelector('.loading-spinner');
      
      if (buttonText && spinner) {
        buttonText.textContent = 'Submitting...';
        spinner.style.display = 'inline-block';
        submitBtn.classList.add('loading');
      }

      // Disable submit button
      this.disabled = true;

      // First submit to your server
      const response = await fetch("/submit-form-sug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (response.status === 404 || responseData.success) {
        // On success, submit to Google Sheet
        try {
          await submitToGoogleSheet(submitData);
        } catch (sheetError) {
          console.error("Google Sheet submission error:", sheetError);
          // Continue with success flow even if sheet submission fails
        }

        // Show success message
        showAlert(response.status === 404 ? 
          "Form submitted successfully! We will analyze your requirements and get back to you." :
          "Form submitted successfully!");
        
        // Show success UI and redirect
        handleSuccessAndRedirect();
      } else {
        throw new Error(responseData.message || "Form submission failed");
      }

    } catch (error) {
      console.error("Form submission error:", error);
      showAlert(error.message || "An error occurred while submitting the form");
      resetButtonState();
    }
  });

  // Helper function to submit to Google Sheet
  async function submitToGoogleSheet(formData) {
    // Prepare data in the format expected by your Google Sheet
    const sheetData = new FormData();
    sheetData.append('Name', formData.name);
    sheetData.append('Email', formData.email);
    sheetData.append('WhatsApp', formData.whatsapp);
    sheetData.append('Mobile', formData.mobile);
    sheetData.append('State', formData.state);
    sheetData.append('City', formData.city);
    sheetData.append('Course', formData.course);
    sheetData.append('Specialization', formData.specialization);
    sheetData.append('Status', formData.status);
    sheetData.append('Expected Salary', formData.expSalary || '');
    sheetData.append('Current Salary', formData.currSalary || '');
    sheetData.append('Experience', formData.experience || '');
    sheetData.append('Current Domain', formData.currDomain || '');
    sheetData.append('Employment Location', formData.empLocation);
    sheetData.append('Sector', formData.sector);
    sheetData.append('Previous University', formData.prevUniversity);
    sheetData.append('Previous Qualification', formData.prevQualification);
    sheetData.append('Previous Qualification %', formData.prevQualificationPercentage);
    sheetData.append('Exposure', formData.exposure);
    sheetData.append('Budget', formData.budget);
    sheetData.append('Planning to Join', formData.planningToJoin);
    sheetData.append('Help Required', formData.help);
    sheetData.append('Description', formData.description || '');
    sheetData.append('Timestamp', new Date().toLocaleString());

    return $.ajax({
      url: "https://script.google.com/macros/s/AKfycbztb__IZgyugFPLAzT2zR-U-OHrHg1oPpUQvajZeuQ4lrDwu1F_p7Rq3y7EQ3joFq0I/exec",
      data: sheetData,
      method: "POST",
      processData: false,
      contentType: false,
    });
  }

  // Helper function to handle success UI and redirect
  function handleSuccessAndRedirect() {
    const grayBg = document.querySelector(".graybg");
    const grayBgDiv = document.querySelector(".graybg > div");
    
    if (grayBg && grayBgDiv) {
      grayBg.style.display = "flex";
      grayBgDiv.style.display = "flex";
      document.querySelector("html").style.overflow = "hidden";
      setTimeout(() => {
        window.location.href = "https://indianeduhub.in/end-to-end-service/";
      }, 8000);
    }
  }

  // Helper function to reset button state
  function resetButtonState() {
    const buttonText = submitBtn.querySelector('.button-text');
    const spinner = submitBtn.querySelector('.loading-spinner');
    
    if (buttonText && spinner) {
      buttonText.textContent = 'Submit';
      spinner.style.display = 'none';
      submitBtn.classList.remove('loading');
    }
    
    submitBtn.disabled = false;
  }
});

// Enhanced showAlert function (unchanged)
function showAlert(message) {
  try {
    const alertDiv = document.getElementById("alert");
    if (!alertDiv) {
      console.error("Alert div not found");
      return;
    }
    alertDiv.innerHTML = message;
    alertDiv.style.display = "block";
    alertDiv.classList.add("animate__animated", "animate__fadeInUp");
    setTimeout(() => {
      alertDiv.classList.remove("animate__fadeInUp");
      alertDiv.classList.add("animate__fadeOutUp");
      setTimeout(() => {
        alertDiv.style.display = "none";
        alertDiv.classList.remove("animate__fadeOutUp");
      }, 1000);
    }, 5000);
  } catch (error) {
    console.error("Error showing alert:", error);
  }
}