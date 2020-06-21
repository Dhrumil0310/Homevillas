const index_top_h3 = document.getElementById("index_top_h3");
const index_top_h5 = document.getElementById("index_top_h5");
const index_top_p = document.getElementById("index_top_p");
const index_task_h5_1 = document.getElementById("index_task_h5_1");
const index_task_h5_2 = document.getElementById("index_task_h5_2");
const index_task_h5_3 = document.getElementById("index_task_h5_3");
const index_task_p_1 = document.getElementById("index_task_p_1");
const index_task_p_2 = document.getElementById("index_task_p_2");
const index_task_p_3 = document.getElementById("index_task_p_3");

const testimonial_target = document.getElementById("testimonial_target");
const test_indicator = document.getElementById("test_indicator");

async function getIndexData() {
    const res = await axios.get(`${url}index_data`);
    const data = res.data[0];
    index_top_h3.innerHTML = data.index_top_h3;
    index_top_h5.innerHTML = data.index_top_h5;
    index_top_p.innerHTML = data.index_top_p;
    index_task_h5_1.innerHTML = data.index_task_h5_1;
    index_task_h5_2.innerHTML = data.index_task_h5_2;
    index_task_h5_3.innerHTML = data.index_task_h5_3;
    index_task_p_1.innerHTML = data.index_task_p_1;
    index_task_p_2.innerHTML = data.index_task_p_2;
    index_task_p_3.innerHTML = data.index_task_p_3;
}

async function getTestimonialData() {
    const res = await axios.get(`${url}testimonials`);
    const data = res.data;
    let count = 0;
    testimonial_target.innerHTML = "";
    test_indicator.innerHTML = "";
    for (let test of data) {
        let image = "";
        if(test.image) {
            image = test.image;
        }
        if (count == 0) {
            testimonial_target.innerHTML += `
                <div class="item carousel-item active">
                    <div class="img-box">
                        <img
                            src="data:${image.contentType};base64,${image.file}"
                            alt=""
                        />
                    </div>
                    <p class="testimonial">
                        ${test.comment}
                    </p>
                    <p class="overview">
                        <b>${test.name}</b>, ${test.role}
                    </p>
                </div>
            `
            test_indicator.innerHTML += `
                <li
                    data-target="#myCarousel"
                    data-slide-to="${count}"
                    class="active"
                ></li>
            `
            count++;
        } else {
            testimonial_target.innerHTML += `
                <div class="item carousel-item">
                    <div class="img-box">
                        <img
                            src="data:${image.contentType};base64,${image.file}"
                            alt=""
                        />
                    </div>
                    <p class="testimonial">
                        ${test.comment}
                    </p>
                    <p class="overview">
                        <b>${test.name}</b>, ${test.role}
                    </p>
                </div>
            `
            test_indicator.innerHTML += `
                <li
                    data-target="#myCarousel"
                    data-slide-to="${count}"
                ></li>
            `
            count++;
        }
    }
}

async function getPropertyData() {
    const res = await axios.get(`${url}property/6`);
    const data = res.data;
    const property_target = document.getElementById("property_target");
    property_target.innerHTML = "";
    for(property of data) {
        let img = "";
        if(property.images && property.images.length > 0) {
            img = `data:${property.images[0].contentType};base64,${property.images[0].file}`;
        }
        property_target.innerHTML += `
            <div class="col-md-4">
                <div class="card" style="width: 100%;">
                    <img
                        class="card-img-top"
                        src="${img}"
                        alt="Card image cap"
                    />
                    <div class="card-body">
                        <h5 class="card-title">
                            Rs. ${property.price} &nbsp Guide price
                        </h5>
                        <p class="card-text">
                            ${property.title}
                        </p>
                        <p>${property.address}</p>
                        <p>Bedrooms: ${property.bedrooms} &nbsp; Bathrooms: ${property.bathrooms}</p>
                        <p>Floors: ${property.floors}  &nbsp; SqFt: ${property.feet}</p>
                    </div>
                </div>
            </div>
        `
    }
}

async function contactSend(evt) {
    evt.preventDefault();
    const form = document.getElementById("contact-form");
    const form_data = new FormData(form);
    const res = await axios.post(`${url}mail/contact`, form_data);
    const mail_msg = document.getElementById("mail_msg");
    mail_msg.innerHTML = res.data.title;
}