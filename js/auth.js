/* =========================================================
   auth.js — Login & Register pages.
   Features: Email/mobile login, OTP verification on register,
   forgot password flow. Mock auth via localStorage.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("loginLogoIntro");
  const card = document.querySelector(".auth-card");

  if (intro && card) {
    card.classList.add("is-hidden");
    setTimeout(() => {
      intro.classList.add("is-hidden");
      card.classList.remove("is-hidden");
    }, 1200);
  }

  /* ---- Helper: generate 6-digit OTP ---- */
  function genOTP() { return String(Math.floor(100000 + Math.random() * 900000)); }

  /* ---- Helper: tab switching ---- */
  function switchTab(type) {
    if (type === "email") {
      emailTab?.classList.add("active");
      emailTab?.style.setProperty("background", "var(--white)");
      emailTab?.style.setProperty("color", "var(--gold-deep)");
      mobileTab?.classList.remove("active");
      mobileTab?.style.setProperty("background", "transparent");
      mobileTab?.style.setProperty("color", "var(--muted)");
      if (emailFields) emailFields.style.display = "block";
      if (mobileFields) mobileFields.style.display = "none";
    } else {
      mobileTab?.classList.add("active");
      mobileTab?.style.setProperty("background", "var(--white)");
      mobileTab?.style.setProperty("color", "var(--gold-deep)");
      emailTab?.classList.remove("active");
      emailTab?.style.setProperty("background", "transparent");
      emailTab?.style.setProperty("color", "var(--muted)");
      if (mobileFields) mobileFields.style.display = "block";
      if (emailFields) emailFields.style.display = "none";
    }
  }

  /* ---- Helper: countdown timer for resend OTP ---- */
  function startOTPTimer() {
    let seconds = 30;
    resendBtn.disabled = true;
    resendBtn.style.opacity = "0.5";
    const timer = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(timer);
        resendBtn.disabled = false;
        resendBtn.style.opacity = "1";
        resendBtn.textContent = "Resend OTP";
      } else {
        resendBtn.textContent = `Resend OTP (${seconds}s)`;
      }
    }, 1000);
  }

  /* ========================================================
     LOGIN PAGE
     ======================================================== */
  const loginForm = document.getElementById("loginForm");
  const emailTab = document.getElementById("loginEmailTab");
  const mobileTab = document.getElementById("loginMobileTab");
  const emailFields = document.getElementById("loginEmailFields");
  const mobileFields = document.getElementById("loginMobileFields");
  const forgotLink = document.getElementById("forgotPasswordLink");
  const resendBtn = document.getElementById("resendOtpBtn");

  // Tab switching
  emailTab?.addEventListener("click", (e) => { e.preventDefault(); switchTab("email"); });
  mobileTab?.addEventListener("click", (e) => { e.preventDefault(); switchTab("mobile"); });

  // Forgot password — professional modal
  const forgotModal = document.getElementById("forgotPwdModal");
  const forgotClose = document.getElementById("forgotPwdClose");
  const forgotSubmit = document.getElementById("forgotPwdSubmit");
  const forgotInput = document.getElementById("forgotPwdInput");
  const forgotStatus = document.getElementById("forgotPwdStatus");

  function openForgotModal() {
    if (!forgotModal) return;
    forgotModal.classList.remove("hidden");
    if (forgotStatus) { forgotStatus.style.display = "none"; }
    if (forgotInput) forgotInput.value = "";
    setTimeout(() => forgotInput?.focus(), 100);
  }
  function closeForgotModal() {
    if (forgotModal) forgotModal.classList.add("hidden");
  }

  forgotLink?.addEventListener("click", (e) => {
    e.preventDefault();
    openForgotModal();
  });
  forgotClose?.addEventListener("click", closeForgotModal);
  forgotModal?.addEventListener("click", (e) => {
    if (e.target === forgotModal) closeForgotModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && forgotModal && !forgotModal.classList.contains("hidden")) {
      closeForgotModal();
    }
  });

  forgotSubmit?.addEventListener("click", () => {
    const val = forgotInput?.value?.trim();
    if (!val) {
      if (forgotStatus) {
        forgotStatus.textContent = "Please enter your email or mobile number.";
        forgotStatus.style.color = "var(--ruby)";
        forgotStatus.style.display = "block";
      }
      return;
    }
    if (forgotSubmit) { forgotSubmit.textContent = "Sending…"; forgotSubmit.disabled = true; }
    setTimeout(() => {
      if (forgotStatus) {
        forgotStatus.textContent = "✓ Reset link sent! Check your email/SMS.";
        forgotStatus.style.color = "#2a8a3f";
        forgotStatus.style.display = "block";
      }
      if (forgotSubmit) { forgotSubmit.textContent = "Send Reset Link →"; forgotSubmit.disabled = false; }
      showToast("Password reset link sent to " + val, "success");
      setTimeout(closeForgotModal, 2000);
    }, 1200);
  });

  forgotInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); forgotSubmit?.click(); }
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const isMobileMode = mobileTab?.classList.contains("active");
      const btn = loginForm.querySelector("button[type='submit']");

      let name, emailVal, phoneVal;

      if (isMobileMode) {
        phoneVal = formData.get("mobile") || "";
        const otp = formData.get("mobileOtp") || "";
        if (!otp || otp.length < 4) {
          showToast("Please enter the OTP sent to your mobile", "error");
          return;
        }
        name = "User";
        emailVal = phoneVal + "@mobile.tatito";
      } else {
        emailVal = formData.get("email") || "";
        const password = formData.get("password") || "";
        if (!emailVal || !password) {
          showToast("Please enter email and password", "error");
          return;
        }
        name = emailVal.split("@")[0];
        phoneVal = "";
      }

      if (btn) { btn.textContent = "Signing in…"; btn.disabled = true; }

      TatitoStore.login({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: emailVal,
        phone: phoneVal,
        createdAt: new Date().toISOString()
      });

      showToast("Login successful! Welcome back.", "success");
      setTimeout(() => { window.location.href = "index.html"; }, 800);
    });
  }

  // Send mobile OTP
  const sendOtpBtn = document.getElementById("sendMobileOtpBtn");
  sendOtpBtn?.addEventListener("click", () => {
    const mobileInput = document.getElementById("loginMobile");
    const mobile = mobileInput?.value?.trim();
    if (!mobile || mobile.length < 10) {
      showToast("Please enter a valid mobile number", "error");
      return;
    }
    const otp = genOTP();
    sessionStorage.setItem("tatito_mobile_otp", otp);
    showToast(`OTP sent: ${otp} (demo)`, "success");
    const otpField = document.getElementById("mobileOtpField");
    if (otpField) otpField.style.display = "block";
    startOTPTimer();
  });

  // Resend OTP
  resendBtn?.addEventListener("click", () => {
    const otp = genOTP();
    sessionStorage.setItem("tatito_mobile_otp", otp);
    showToast(`OTP resent: ${otp} (demo)`, "success");
    startOTPTimer();
  });

  /* ========================================================
     REGISTER PAGE — Multi-step with OTP
     ======================================================== */
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    let regStep = 1; // 1=details, 2=OTP verify

    const stepDetails = document.getElementById("regStepDetails");
    const stepOtp = document.getElementById("regStepOtp");
    const regOtpDisplay = document.getElementById("regOtpDisplay");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const regResendBtn = document.getElementById("regResendOtp");
    const changeMobileBtn = document.getElementById("changeMobileBtn");

    function showStep(step) {
      if (step === 1) {
        stepDetails.style.display = "flex";
        stepOtp.style.display = "none";
      } else {
        stepDetails.style.display = "none";
        stepOtp.style.display = "flex";
      }
    }

    if (stepOtp) showStep(1);

    // Step 1 submit — send OTP
    registerForm.addEventListener("submit", (e) => {
      // If OTP step is visible, let verifyOtpBtn handle it
      if (regStep === 2) { e.preventDefault(); return; }
      e.preventDefault();
      const formData = new FormData(registerForm);
      const name = formData.get("name")?.trim();
      const email = formData.get("email")?.trim();
      const mobile = formData.get("mobile")?.trim();

      if (!name || !email || !mobile) {
        showToast("Please fill all fields", "error");
        return;
      }
      if (mobile.length < 10) {
        showToast("Please enter a valid mobile number", "error");
        return;
      }

      // Generate OTP
      const otp = genOTP();
      sessionStorage.setItem("tatito_reg_otp", otp);
      sessionStorage.setItem("tatito_reg_data", JSON.stringify({ name, email, mobile }));

      regStep = 2;
      if (regOtpDisplay) regOtpDisplay.textContent = `+91 ${mobile}`;
      showToast(`Verification code sent: ${otp} (demo)`, "success");
      showStep(2);
    });

    // Step 2 — verify OTP
    verifyOtpBtn?.addEventListener("click", () => {
      const otpInputs = document.querySelectorAll(".otp-digit");
      const enteredOtp = Array.from(otpInputs).map(i => i.value).join("");
      const storedOtp = sessionStorage.getItem("tatito_reg_otp");

      if (!enteredOtp || enteredOtp.length < 6) {
        showToast("Please enter the 6-digit code", "error");
        return;
      }
      if (enteredOtp !== storedOtp) {
        showToast("Incorrect OTP. Please try again.", "error");
        return;
      }

      // OTP verified — complete registration
      const regData = JSON.parse(sessionStorage.getItem("tatito_reg_data") || "{}");
      const btn = registerForm.querySelector("button[type='submit']");
      if (btn) { btn.textContent = "Creating account…"; btn.disabled = true; }

      TatitoStore.login({
        name: regData.name,
        email: regData.email,
        phone: regData.mobile,
        createdAt: new Date().toISOString()
      });

      sessionStorage.removeItem("tatito_reg_otp");
      sessionStorage.removeItem("tatito_reg_data");

      showToast("Account created successfully! Welcome to Tatito Fashions.", "success");
      setTimeout(() => { window.location.href = "index.html"; }, 1000);
    });

    // Resend registration OTP
    regResendBtn?.addEventListener("click", () => {
      const otp = genOTP();
      sessionStorage.setItem("tatito_reg_otp", otp);
      showToast(`New code sent: ${otp} (demo)`, "success");
      startOTPTimer2();
    });

    // Change mobile number — go back to step 1
    changeMobileBtn?.addEventListener("click", () => {
      regStep = 1;
      showStep(1);
    });

    // Resend timer for register page
    function startOTPTimer2() {
      let seconds = 30;
      if (regResendBtn) {
        regResendBtn.disabled = true;
        regResendBtn.style.opacity = "0.5";
      }
      const timer = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(timer);
          if (regResendBtn) { regResendBtn.disabled = false; regResendBtn.style.opacity = "1"; regResendBtn.textContent = "Resend Code"; }
        } else {
          if (regResendBtn) regResendBtn.textContent = `Resend Code (${seconds}s)`;
        }
      }, 1000);
    }

    // OTP input box auto-advance
    document.querySelectorAll(".otp-digit").forEach((input, idx, all) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 1);
        if (input.value && idx < all.length - 1) all[idx + 1].focus();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && idx > 0) all[idx - 1].focus();
      });
      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const digits = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6).split("");
        digits.forEach((d, i) => { if (all[i]) all[i].value = d; });
        if (digits.length > 0) all[Math.min(digits.length, all.length - 1)].focus();
      });
    });
  }
});
