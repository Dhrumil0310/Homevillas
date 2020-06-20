const price = document.getElementById("price");
const address = document.getElementById("address");
const title = document.getElementById("title");
const contact = document.getElementById("contact");
const image_target = document.getElementById("image_target");
const key = document.getElementById("key_target");
const description = document.getElementById("description_target");
const amenities = document.getElementById("amenities_target");
const doc1 = document.getElementById("doc1");
const doc2 = document.getElementById("doc2");

const params = new URLSearchParams(window.location.search);

var slideIndex = 1;


async function getPropertyData() {
    let res = await axios.get(`${url}property`, {
        params: {
            id: params.get("id")
        }
    });
    const data = res.data[0];
    price.innerHTML = "Rs. "+data.price;
    address.innerHTML = data.address;
    title.innerHTML = data.title;
    contact.innerHTML = data.contact;
    key.innerHTML = data.details;
    description.innerHTML = data.description;
    image_target.innerHTML = "";
    for (image of data.images) {
        image_target.innerHTML += `
            <div class="mySlides">
                <div class="numbertext"></div>
                <img
                    src="data:${image.contentType};base64,${image.file}"
                    style="width: 100%;"
                />
            </div>
        `;
    }
    image_target.innerHTML += `
        <a class="prev" onclick="plusSlides(-1)"> &#10094; </a>
        <a class="next" onclick="plusSlides(1)"> &#10095; </a>
    `;
    let count = 0;
    let img_frame = `<div class="row container">`;
    for (image of data.images) {
        count++;
        img_frame += `
            <div class="column">
                <img
                    class="demo cursor"
                    src="data:${image.contentType};base64,${image.file}"
                    style="width: 100%;"
                    onclick="currentSlide(${count})"
                    alt="The Woods"
                />
            </div>
        `;
    }
    img_frame.innerHTML += "</div>"
    image_target.innerHTML += img_frame;
    res = await axios.get(`${url}property`, {
        params: {
            tags: data.tags
        }
    });
	showSlides(slideIndex);
    let similar = res.data;
    similar = similar.filter(prop => prop._id != data._id);

}

// Next/previous controls
function plusSlides(n) {
    slideIndex += n;
    showSlides(slideIndex);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides((slideIndex = n));
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName('mySlides');
    var dots = document.getElementsByClassName('demo');
    // var captionText = document.getElementById('caption');
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(
            ' active',
            ''
        );
    }
    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += ' active';
    // captionText.innerHTML = dots[slideIndex - 1].alt;
}