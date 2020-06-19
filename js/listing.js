const price_min = document.getElementById("price_min");
const price_max = document.getElementById("price_max");
const bedrooms = document.getElementById("bedrooms");
const bathrooms = document.getElementById("bathrooms");
const floors = document.getElementById("floors");
const feet = document.getElementById("feet"); 
const feet_text = document.getElementById("feet_text");
const category = document.getElementsByName("category[]");


const property_target = document.getElementById("property_target");
let properties;

feet.addEventListener('mouseup', () => {
    const feet_min = (parseInt(feet.value) - 1) * 1000;
    const feet_max = parseInt(feet.value) * 1000;
    if(feet.value == "10"){
        feet_text.innerHTML = `SQFT: ${feet_min} and more`
    }else if(feet.value == "0"){
        feet_text.innerHTML = "SQFT: All";
    }else {
        feet_text.innerHTML = `SQFT: ${feet_min} - ${feet_max}`;
    }
})

async function getPropertyData() {
    const res = await axios.get(`${url}property`);
    properties = res.data;
    property_target.innerHTML = "";
    let img = "";
    for (property of properties) {
        if(property.images && property.images.length > 0) {
            img = `data:${property.images[0].contentType};base64,${property.images[0].file}`
        }
        property_target.innerHTML += `
            <div class="col-md-6">
                <div class="card" style="width: 100%;">
                    <img src="${img}" alt="..." />
                    <div class="card-body">
                        <h2 class="num">Rs. ${property.price} &nbsp <span class="guide">Guide Price</span></h2>
                        <h5 class="card-title">${property.title}</h5>
                        <p class="card-text">
                            <i class="fas fa-map-marker-alt mr-2"></i>${property.address}
                        </p>
                        <br>
                        <div class="row">
                            <div class="col-md-6 props">
                            <button class="buttonp" onclick="window.location.href = 'propertydetails.html?id=${property._id}'"><i class="fas fa-book mr-2"></i>View Property</button>
                            </div>
                            <div class="col-md-6 hide">
                            <button class="buttonp"><i class="fas fa-ban mr-2"></i>Unassigned</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}

function filterData() {
    let filtered_properties = properties;
    let feet_min = (parseInt(feet.value) - 1) * 1000;
    let feet_max = parseInt(feet.value) * 1000;
    if(feet_max == 10000) {
        feet_max = 999999;
    }
    let categories = [];
    for(ele of category) {
        if(ele.checked) {
            categories.push(ele.value);
        }
    }
    if(feet.value > 0) {
        filtered_properties = filtered_properties.filter(prop => {
            return (prop.feet > feet_min && prop.feet < feet_max)
        })
    }
    if(categories.length > 0) {
        filtered_properties = filtered_properties.filter(prop => {
            for (let category of categories) {
                console.log(prop.category);
                if(prop.category == category) return true;
            }
            return false;
        })
    }
    console.log(price_min.value);
    console.log(filtered_properties);
}
