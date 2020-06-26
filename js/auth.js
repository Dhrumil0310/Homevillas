const sign_email = document.getElementById("sign_email");
const otp_id = document.getElementById("otp_id");
const sign_msg = document.getElementById("sign_msg");
const log_msg = document.getElementById("log_msg");
const sign_contact = document.getElementById("sign_contact");
const sign_pw = document.getElementById("sign_pw");

let is_valid_email = false;

sign_email.addEventListener("blur", async () => {
    if(sign_email.value !== "" && sign_email.validity.valid) {
        try {
            const res = await axios.post(`${url}mailcheck`, { email: sign_email.value });
            if(res.data.title === "valid") {
                is_valid_email = true;
                sign_msg.innerHTML = "";
            } 
        } catch (error) {
            is_valid_email = false;
            sign_msg.innerHTML = "Email already in use";
        }
    } else {
        sign_msg.innerHTML = "Please enter a valid email address";
    }
});

async function genOtp(evt) {
    evt.preventDefault();
    if(is_valid_email) {
        if(sign_contact.value.length == 10) {
            try {
                const res = await axios.post(`${url}sms/otpgen`, {
                    email: sign_email.value,
                    contact: sign_contact.value
                });
                otp_id.value = res.data.otp_id;
                sign_msg.innerHTML = "OTP sent to entered phone number";
            } catch (error) {
                console.log(error.response.data);
                sign_msg.innerHTML = error.response.data.title;   
            }
        } else {
            sign_msg.innerHTML = "Please Enter a valid 10 digit Phone Number"
        }
    } else {
        sign_msg.innerHTML = "Invalid Email";
    }
}

async function signUp(evt) {
    evt.preventDefault();
    if(otp_id.value === "") {
        sign_msg.innerHTML = "OTP Generation Error. Please try again in a while.";
        return;
    }
    if(!is_valid_email) {
        sign_msg.innerHTML = "Invalid Email";
        return;
    }
    if(sign_pw.value == "" || sign_pw.value.length < 8) {
        sign_msg.innerHTML = "Please enter a password with 8 or more characters";
        return;
    }
    const form = document.getElementById('signup-form');
    let form_data = new FormData(form);
    try {
        const res = await axios.post(`${url}signup`, form_data);
        sign_msg.innerHTML = res.data.title;  
        form.reset();  
    } catch (error) {
        sign_msg.innerHTML = error.response.data.title;
    }    
}

async function logIn(evt) {
    evt.preventDefault();
    const mail = document.getElementById("log_email");
    const pw = document.getElementById("log_pw");
    try {
        const res = await axios.post(`${url}login`, {
            email: mail.value,
            password: pw.value
        })
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        window.location.href = "index.html";
    } catch (error) {
        console.log(error.response.data);
        log_msg.innerHTML = error.response.data.title;
    }
    
}
