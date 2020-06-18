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