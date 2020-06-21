// const url = "api/data/";
const url = "http://localhost:5000/api/data/";

const header_logo = document.getElementById("header_logo");
const partner_target = document.getElementById("partner_target");
const fb_link = document.getElementById("fb_link");
const insta_link = document.getElementById("insta_link");
const linked_link = document.getElementById("linked_link");
const twitter_link = document.getElementById("twitter_link");
const play_link = document.getElementById("play_link");
const app_link = document.getElementById("app_link");

async function getPageData() {
    const res = await axios.get(`${url}multi_data`);
    const data = res.data[0];
    fb_link.href = data.fb_link;
    insta_link.href = data.insta_link;
    linked_link.href = data.linked_link;
    twitter_link.href = data.twitter_link;
    play_link.href = data.play_link;
    app_link.href = data.app_link;
    if(data.header_logo) header_logo.src = `data:${data.header_logo.contentType};base64,${data.header_logo.file}`;
    partner_target.innerHTML = "";
    if(data.partner_img.length > 0) {
        for (let img of data.partner_img) {
            partner_target.innerHTML += `<img src ="data:${img.contentType};base64,${img.file}" alt="" />`;
        }
    }
    if(data.favicon) {
        const link = document.createElement("link");
        link.setAttribute("rel", "icon shortcut");
        link.setAttribute("type", data.favicon.contentType);
        link.setAttribute("href", `data:${data.favicon.contentType};base64,${data.favicon.file}`);
        document.getElementById("head_top").appendChild(link);
    }
}

async function getFaqData() {
    const res = await axios.get(`${url}faq_data`);
    const data = res.data[0];
    const gen_target = document.getElementById("general_target");
    const tech_target = document.getElementById("technical_target");
    const admin_target = document.getElementById("admin_target");
    const pricing_target = document.getElementById("pricing_target");
    let general = [], technical = [], pricing = [], admin = []; 
    for (let i = 0; i < data.type.length; i++) {
        if(data.type[i] == "General") {
            general.push(i);
        }
         if(data.type[i] == "Admin") {
            admin.push(i);
        }
         if(data.type[i] == "Technical") {
            technical.push(i);
        }
         if(data.type[i] == "Pricing") {
            pricing.push(i);
        }
    }
    if(general.length > 0) {
        gen_target.innerHTML = "<h3>General Questions</h3><br />";
        for(index of general) {
            gen_target.innerHTML += `
                <button class="accordion">
					${data.faq_q[index]}
				</button>
				<div class="panel">
					<p>
						${data.faq_ans[index]}
					</p>
				</div>
            `;
        }
    }
    if(pricing.length > 0) {
        pricing_target.innerHTML = "<h3>Pricing Questions</h3><br />";
        for(index of pricing) {
            pricing_target.innerHTML += `
                <button class="accordion">
					${data.faq_q[index]}
				</button>
				<div class="panel">
					<p>
						${data.faq_ans[index]}
					</p>
				</div>
            `;
        }
    }
    if(admin.length > 0) {
        admin_target.innerHTML = "<h3>Admin Management</h3><br />";
        for(index of admin) {
            admin_target.innerHTML += `
                <button class="accordion">
					${data.faq_q[index]}
				</button>
				<div class="panel">
					<p>
						${data.faq_ans[index]}
					</p>
				</div>
            `;
        }
    }
    if(technical.length > 0) {
        tech_target.innerHTML = "<h3>Technical Questions</h3><br />";
        for(index of technical) {
            tech_target.innerHTML += `
                <button class="accordion">
					${data.faq_q[index]}
				</button>
				<div class="panel">
					<p>
						${data.faq_ans[index]}
					</p>
				</div>
            `;
        }
    }
    var acc = document.getElementsByClassName('accordion');
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener('click', function () {
            this.classList.toggle('active');
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    }
}

