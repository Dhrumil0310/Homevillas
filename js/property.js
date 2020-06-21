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
const plan_num = document.getElementById("plan_num");
const plan_img = document.getElementById("plan_img");
const similar_target = document.getElementById("similar_target");
let data;

const form = document.getElementById("contact_form");
const params = new URLSearchParams(window.location.search);

var slideIndex = 1;

var x = window.matchMedia("(min-width:1024px)");
thisFunction(x);
x.addListener(thisFunction);

function thisFunction(x) {
  if (x.matches) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 2500) {
        form.style.display = "none";
      } else {
        form.style.display = "";
      }
    });
  } else {
    form.style.display = "none";
  }
}

async function getPropertyData() {
  let res = await axios.get(`${url}property`, {
    params: {
      id: params.get("id"),
    },
  });
  data = res.data[0];
  let price_frame = "Rs. " + data.price;
  if (data.duration && data.duration != "") {
    price_frame = "Rs. " + data.price + " per " + data.duration;
  }
  price.innerHTML = price_frame;
  address.innerHTML =
    '<i class="fas fa-map-marker-alt mr-2"></i>' + data.address;
  title.innerHTML = data.title;
  contact.innerHTML = '<i class="fas fa-phone-alt mr-2"></i>' + data.contact;
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
  img_frame += "</div>";
  image_target.innerHTML += img_frame;
  res = await axios.get(`${url}property`, {
    params: {
      tags: data.tags,
    },
  });
  showSlides(slideIndex);
  let num_amenities = data.features.length;
  if (num_amenities % 3 == 1) {
    num_amenities = Math.floor(num_amenities / 3);
  } else {
    num_amenities = Math.ceil(num_amenities / 3);
  }
  count = 0;
  amenities.innerHTML = "";
  let amenities_frame = "";
  for (feature of data.features) {
    if (count % num_amenities == 0) {
      amenities_frame += "<div class='col-md-4'>";
    }
    count++;
    amenities_frame += `
            <p>
                <i class="fas fa-check-circle mr-3"></i>
                ${feature}
            </p>
        `;
    if (count % num_amenities == 0) {
      amenities_frame += "</div>";
    }
  }
  amenities.innerHTML = amenities_frame;
  if (data.documents[0]) {
    doc1.href = `data:${data.documents[0].contentType};base64,${data.documents[0].file}`;
    doc1.download = "New Document 1";
  }
  if (data.documents[1]) {
    doc2.href = `data:${data.documents[1].contentType};base64,${data.documents[1].file}`;
    doc2.download = "New Document 2";
  }
  count = 0;
  plan_num.innerHTML = "Plans: &nbsp;";
  if (data.plans && data.plans.length > 0) {
    for (image of data.plans) {
      count++;
      plan_num.innerHTML += `<button class="but3" onclick="planImg(${
        count - 1
      })">${count}</button>&nbsp;`;
    }
    plan_img.src = `data:${data.plans[0].contentType};base64,${data.plans[0].file}`;
  } else {
    plan_num.innerHTML += "None";
  }

  let similar = res.data;
  similar = similar.filter((prop) => prop._id != data._id);
  similar_target.innerHTML = "";
  for (prop of similar) {
    let img = "";
    if (prop.images && prop.images.length > 0) {
      img = `data:${prop.images[0].contentType};base64,${prop.images[0].file}`;
    }
    let sim_price = "Rs. " + prop.price;
    if (prop.duration && prop.duration != "") {
      sim_price = "Rs. " + prop.price + " per " + prop.duration;
    }
    similar_target.innerHTML += `
            <div class="col-lg-3">
                <div class="card" style="width: 15rem;">
                    <img
                        class="card-img-top"
                        src="${img}"
                        alt="Card image cap"
                    />
                    <div class="card-body">
                        <h5 class="card-title">${sim_price}</h5>
                        <h5 id="card-text" onclick="window.location.href='propertydetails.html?id=${prop._id}'" style="cursor: pointer">
                            ${prop.title}
                        </h5>
                        <p><i class="fas fa-bed mr-2"></i>Bedrooms: ${prop.bedrooms}</p>
                        <p>
                            <i class="fas fa-restroom mr-2"></i>Bathrooms: ${prop.bathrooms}
                        </p>
                        <p><i class="fas fa-car mr-2"></i>Floors: ${prop.floors}</p>
                    </div>
                </div>
            </div>        
        `;
  }
}

//Change Plan Image on Click
function planImg(num) {
  plan_img.src = `data:${data.plans[num].contentType};base64,${data.plans[num].file}`;
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
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  // var captionText = document.getElementById('caption');
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  // captionText.innerHTML = dots[slideIndex - 1].alt;
}
