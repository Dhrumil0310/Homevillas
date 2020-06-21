const about_top_p = document.getElementById("about_top_p");
const about_mid_title = document.getElementById("about_mid_title");
const about_mid_p = document.getElementById("about_mid_p");
const about_buy_h5 = document.getElementById("about_buy_h5");
const about_buy_p = document.getElementById("about_buy_p");
const about_rent_h5 = document.getElementById("about_rent_h5");
const about_rent_p = document.getElementById("about_rent_p");
const about_sell_p = document.getElementById("about_sell_p");
const about_sell_h5 = document.getElementById("about_sell_h5");
const about_residential_p = document.getElementById("about_residential_p");
const about_residential_h5 = document.getElementById("about_residential_h5");
const about_insider_p = document.getElementById("about_insider_p");
const about_appraisal_p = document.getElementById("about_appraisal_p");
const about_insider_h5 = document.getElementById("about_insider_h5");
const about_appraisal_h5 = document.getElementById("about_appraisal_h5");
const appraisal_img = document.getElementById("appraisal_img");
const insider_img = document.getElementById("insider_img");
const residential_img = document.getElementById("residential_img");
const location_target = document.getElementById("location_target");
const team_target = document.getElementById("team_target");

async function getAboutData() {
    const res = await axios.get(`${url}about_data`);
    const data = res.data[0];
    about_top_p.innerHTML = data.about_top_p;
    about_mid_p.innerHTML = data.about_mid_p;
    about_mid_title.innerHTML = data.about_mid_title;
    about_appraisal_h5.innerHTML = data.about_appraisal_h5;
    about_appraisal_p.innerHTML = data.about_appraisal_p;
    about_insider_h5.innerHTML = data.about_insider_h5;
    about_insider_p.innerHTML = data.about_insider_p;
    about_buy_h5.innerHTML = data.about_buy_h5;
    about_buy_p.innerHTML = data.about_buy_p;
    about_residential_h5.innerHTML = data.about_residential_h5;
    about_residential_p.innerHTML = data.about_residential_p;
    about_rent_h5.innerHTML = data.about_rent_h5;
    about_rent_p.innerHTML = data.about_rent_p;
    about_sell_h5.innerHTML = data.about_sell_h5;
    about_sell_p.innerHTML = data.about_sell_p;
    if(data.about_img) {
        if(data.about_img[0]){
            residential_img.src = `data:${data.about_img[0].contentType};base64,${data.about_img[0].file}`;
        }
         if(data.about_img[1]){
            appraisal_img.src = `data:${data.about_img[1].contentType};base64,${data.about_img[1].file}`;
        }
         if(data.about_img[2]){
            insider_img.src = `data:${data.about_img[2].contentType};base64,${data.about_img[2].file}`;
        }
    }
    location_target.innerHTML = "";
    for(let i = 0; i < data.address.length; i++) {
        location_target.innerHTML += `
            <div class="col-md-4">
                <div class="row">
                    <div class="col-md-3">
                        <i class="fas fa-map-marker-alt icon"></i>
                    </div>
                    <div class="col-md-9 text-left">
                        <p class="head">${data.location[i]}</p>
                        <p class="para">
                            ${data.address[i]}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    const team = await axios.get(`${url}team`);
    members = team.data;
    team_target.innerHTML = "";
    for(member of members) {
        if(member.image && member.image != "") {
            team_target.innerHTML += `
                <img
                    class="myimage"
                    src="data:${member.image.contentType};base64,${member.image.file}"
                    alt=""
                />
            `;
        }
    }
}




