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

      case 7:
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
  const emailField = document.querySelector("#q9 .answer input[name=email]");
  const mobileField = document.querySelector("#q9 .answer input[name=mobile]");
  const whatsappField = document.querySelector(
    "#q9 .answer input[name=whatsapp]"
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
  const submitButton = document.querySelector("#q9 .nav .submit");
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

  // Collect data from multi-step form
  submitData.course =
    document.querySelector("input[name=course]:checked")?.value || "";
  submitData.specialization =
    document.querySelector('select[name="' + submitData.course + '-Spec"]')
      ?.value || "";
  submitData.status =
    document.querySelector("input[name=status]:checked")?.value || "";
  submitData.expSalary =
    document.querySelector("input[name=expSalary]")?.value || "";
  submitData.prevQualificationPercentage =
    document.querySelector("input[name=prevQualificationPercentage]")?.value || "";
  submitData.currSalary =
    document.querySelector("input[name=currSalary]")?.value || "";
  submitData.currDomian =
    document.querySelector("input[name=currDomian]")?.value || "";
  submitData.experience =
    document.querySelector("input[name=experience]")?.value || "";
  submitData.empLocation =
    document.querySelector("input[name=empLocation]:checked")?.value || "";

  // If empLocation is "Abroad", set sector to "Private Sector"
  submitData.sector =
    submitData.empLocation === "Abroad"
      ? "Private Sector"
      : document.querySelector("input[name=sector]:checked")?.value || "";

  submitData.prevUniversity =
    document.querySelector("input[name=prevUniversity]")?.value || "";
  submitData.prevQualification =
    document.querySelector("input[name=prevQualification]")?.value || "";
  submitData.exposure =
    document.querySelector("input[name=exposure]:checked")?.value || "";
  submitData.budget =
    document.querySelector("input[name=budget1]:checked")?.value ||
    document.querySelector("input[name=budget2]:checked")?.value ||
    document.querySelector("input[name=budget3]:checked")?.value ||
    "";
  submitData.description =
    document.querySelector("textarea[name=Description]")?.value || "";

  // Collect data from the final step
  submitData.name =
    document.querySelector("#q9 .answer input[name=name]")?.value || "";
  submitData.email =
    document.querySelector("#q9 .answer input[name=email]")?.value || "";
  submitData.whatsapp =
    document.querySelector("#q9 .answer input[name=whatsapp]")?.value || "";
  submitData.mobile =
    document.querySelector("#q9 .answer input[name=mobile]")?.value || "";
  submitData.state = document.querySelector("#q9 #stateSelect")?.value || "";
  submitData.city = document.querySelector("#q9 #citySelect")?.value || "";

  // Add the current query parameter
  const queryParams = new URLSearchParams(window.location.search);
  const ReferredBy = queryParams.get("studentid");
  if (ReferredBy) {
    submitData.ReferredBy = ReferredBy;
  }

  return submitData;
}


function validateFinalForm(submitData) {
  let valid = true;

  // Mobile verification
  const whatsappPattern = /^\d{10}$/;
  if (!whatsappPattern.test(submitData.whatsapp)) {
    valid = false;
    showAlert("Please enter a valid WhatsApp number");
  }

  // Email verification
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(submitData.email)) {
    valid = false;
    showAlert("Please enter a valid email address");
  }

  // Empty field verification
  const requiredFields = [
    "name",
    "email",
    "whatsapp",
    "mobile",
    "state",
    "city",
  ];
  requiredFields.forEach((field) => {
    if (!submitData[field] || submitData[field].trim() === "") {
      valid = false;
      showAlert("Please fill all the required fields");
    }
  });

  return valid;
}

// Submit Button
const submitBtn = document.querySelector(".submit");

submitBtn.addEventListener("click", function () {
  const submitData = collectFormData();
  const submitValidate = validateFinalForm(submitData);

  if (submitValidate) {
    document.querySelector("#q9 .nav .submit").disabled = true;

    fetch("/submit-form-sug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response is not ok, throw an error to handle in catch
          return response.json().then((data) => {
            throw new Error(data.message || "Submission failed.");
          });
        }
        return response.blob(); // Get the response as a blob for PDF download
      })
      .then((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${submitData.name}_Detailed_Report.pdf`; // Set the download file name
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(downloadUrl); // Clean up the URL

        document.querySelector(".graybg").style.display = "flex";
        document.querySelector(".graybg > div").style.display = "flex";
        document.querySelector("html").style.overflow = "hidden";
        setTimeout(() => {
          window.location.href = "https://indianeduhub.in/end-to-end-service/";
        }, 8000);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        showAlerts(error.message); // Display the error message in an alert
      });
  }
});
