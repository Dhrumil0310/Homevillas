// const url = "api/data/";
const url = "http://localhost:5000/api/data/";

const header_logo = document.getElementById("header_logo");
const partner_target = document.getElementById("partner_target");
const fb_link = document.getElementById("fb_link");
const insta_link = document.getElementById("insta_link");
const linked_link = document.getElementById("linked_link");
const twitter_link = document.getElementById("twitter_link");

async function getPageData() {
    const res = await axios.get(`${url}multi_data`);
    const data = res.data[0];
    console.log(data);
    fb_link.href = data.fb_link;
    insta_link.href = data.insta_link;
    linked_link.href = data.linked_link;
    twitter_link.href = data.twitter_link;
    if(data.header_logo) header_logo.src = `data:${data.header_logo.contentType};base64,${data.header_logo.file}`;
    partner_target.innerHTML = "";
    if(data.partner_img.length > 0) {
        for (let img of data.partner_img) {
            partner_target.innerHTML += `<img src ="data:${img.contentType};base64,${img.file}" alt="" />`;
        }
    }
}