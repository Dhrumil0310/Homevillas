//Password stored locally

//Server Access
const express = require('express');
const router = express.Router();
const axios = require('axios');

//DB Plugin
const mongoose = require('mongoose');

//Blob upload dependencies
const multer = require('multer');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './server/uploads')
//   }
// }) 
// var upload = multer({ storage: storage });
var upload = multer({ dest:'./server/uploads' });
const fs = require('fs');

//Mail dependencies
const nodemailer = require('nodemailer');

//Authentication Dependency
const jwt = require('jsonwebtoken');

//Task Scheduler Dependency
const cron = require('node-cron');

//DB credentials
// const uri = 'mongodb://localhost:27017';
// const db_name = 'test_db';
const uri = 'mongodb+srv://efuel-admin:<password>@cluster0-wgynz.mongodb.net/homevillas?retryWrites=true&w=majority';
const db_name = 'homevillas';

//Mail credentials
let mail_username = "";
let mail_pw = "";

//Mongoose Models
const { Admin, User, Otp, Testimonial, Property, Faq, Blog, Team, Gallery, Index, Multi, About, companyMail } = require('../../models/models');

//Mongoose Connection
try {
   mongoose.connect(`${uri}/${db_name}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
   })
} catch (error) {
   console.log(error);
}

try {
   companyMail.find({}).then(res => {
      mail_username = res[0].email;
      mail_pw = res[0].password;
   });
} catch (error) {
   console.log(error);
}


//Scheduled functions
// cron.schedule("* * * * *", async function () {
//    console.log("scheduled hello");
// });

const secret = "6LdclKcZAAAAAH9_Fo3yDrW1sIlT1kzfQ_ykFHSA";

//Test requests
router.get('/', (_req, res) => {
    res.send("hello");
});

router.post('/', upload.none(), async (req, res) => {
   console.log(req.body.token);
   // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.token}`;
   // const new_res = await axios.post(url);
   // console.log(new_res.data);
   if(req.file) {
      console.log("file recvd");
      fs.unlinkSync(req.file.path);
   }
	// res.json(req.body);
});

//Page Data Get Requests
router.get('/admins', async (req, res) => {
   try {
      let data = await Admin.find({});
      res.status(200).send(data);      
   } catch (error) {
      console.log(error);
   }
})

router.get('/users', async (req, res) => {
   try {
      let data = await User.find({});
   	res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

router.get('/blogs', async (req, res) => {
   try {
      let data = await Blog.find({});
   	res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

router.get('/testimonials', async (req, res) => {
   try {
      let data = await Testimonial.find({});
   	res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

router.get('/team', async (req, res) => {
   try {
      let data = await Team.find({});
   	res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});


router.get('/property', async (req, res) => {
   try { 
      let data;
      if(req.query.tags) {
         let tags = [];
         for(let tag of req.query.tags) {
            tags.push(tag);
         }
         data = await Property.find({ tags: { $in: tags } });
      } else if(req.query.id) {
         data = await Property.find({ _id: mongoose.Types.ObjectId(req.query.id) })
      } else {
         data = await Property.find({});
      }
      res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

router.get('/property/:limit', async (req, res) => {
   try { 
      let data = await Property.find({}).sort({ $natural: -1 }).limit(parseInt(req.params.limit));
      res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

router.get('/gallery', async (req, res) => {
   try { 
      let data = await Gallery.find({});
      res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});


router.get('/faq_data', async (req, res) => {
   try {
      let data = await Faq.find({});
   	res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

router.get('/index_data', async (req, res) => {
   try {
      let data = await Index.find({});
   	res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

router.get('/multi_data', async (req, res) => {
   try {
      let data = await Multi.find({});
   	res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

router.get('/about_data', async (req, res) => {
   try {
      let data = await About.find({});
   	res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
});

router.get('/company_mail', async (req, res) => {
   try {
      let data = await companyMail.find({});
      res.status(200).send(data);
   } catch (error) {
      console.log(error);
   }
})

//Page Data Post Requests
router.post('/captcha', upload.none(), async (req, res) => {
   if(req.body.token) {
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.token}`;
      const new_res = await axios.post(url);
      if(new_res.data.success && new_res.data.score > 0.3) {
         res.status(200).json({ title: "success" });
      } else {
         res.status(200).json({ title: "failed" })
      }
   }
})

router.post('/company_mail', upload.none(), async (req, res) => {
   if(req.body.email && req.body.password) {
      mail_username = req.body.email;
      mail_pw = req.body.password;
   }
   const count = await companyMail.countDocuments();
   let new_data = {};
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   try {
      if(count == 0) {
         const new_mail = new companyMail(new_data);
         new_mail.save();
      } else {
         const data = await companyMail.find({});
         const mail_id = data[0]._id;
         await companyMail.updateOne({ _id: mongoose.Types.ObjectId(mail_id) }, new_data);
      }
      res.status(201).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
})

router.post('/admins', upload.none(), async (req, res) => {
   if(!req.body.id) {
      const new_admin = new Admin({
         username: req.body.username,
         password: req.body.password
      })
      new_admin.save();
   } else {
      Admin.updateOne({ _id: mongoose.Types.ObjectId(req.body.id) }, {
         username: req.body.username,
         password: req.body.password
      })
   }
   res.status(201).json({ title: "success" })
});

router.post('/property', upload.fields([
   { name: 'images', maxCount: 5 }, 
   { name: 'documents', maxCount: 2 },
   { name: 'plans', maxCount: 5 },
   { name: 'video', maxCount: 1}
   ]), 
   async (req, res) => {
   let final_img = [], final_doc = [], final_plan = [],  final_vid = [];
   if(req.files) {
      if(req.files.images){ 
         for(file of req.files.images) {
            let img = fs.readFileSync(file.path);
            let encode_image = img.toString('base64');
            new_img = {contentType: file.mimetype, file: Buffer.from(encode_image, 'base64')}
            final_img.push(new_img);
            fs.unlinkSync(file.path);
         }
      }
      if(req.files.documents) {
         for(file of req.files.documents) {
            let doc = fs.readFileSync(file.path);
            let encode_doc = doc.toString('base64');
            new_doc = {contentType: file.mimetype, file: Buffer.from(encode_doc, 'base64')}
            final_doc.push(new_doc);
	    fs.unlinkSync(file.path);
         }
      }
      if(req.files.plans) {
         for(file of req.files.plans) {
            let plan = fs.readFileSync(file.path);
            let encode_plan = plan.toString('base64');
            new_plan = {contentType: file.mimetype, file: Buffer.from(encode_plan, 'base64')}
            final_plan.push(new_plan);
	    fs.unlinkSync(file.path);
         }
      }
      if(req.files.video) {
         let vid = fs.readFileSync(req.files.video[0].path);
         let encode_vid = vid.toString('base64');
         new_vid = {contentType: req.files.video[0].mimetype, file: Buffer.from(encode_vid, 'base64')};
         final_vid.push(new_vid);
         fs.unlinkSync(req.files.video[0].path);
      }
   }
   let new_data = {}
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   if (final_img.length != 0) new_data["images"] = final_img;
   if (final_doc.length != 0) new_data["documents"] = final_doc;
   if (final_plan.length != 0) new_data["plans"] = final_plan;
   if (final_vid.length != 0) new_data["video"] = final_vid;
   try {
      if(req.body.id == "") {
         const new_property = new Property(new_data);
         new_property.save();

      } else {
         await Property.updateOne({ _id: mongoose.Types.ObjectId(req.body.id) }, new_data);
      }
      res.status(201).json({ title: "success" });
   } catch (err) {
      console.log(err);
   }
});

router.post('/testimonials', upload.single('testimonial_img'), async (req, res) => {
   let final_img = "";
   if(req.file) {
      let img = fs.readFileSync(req.file.path);
      let encode_image = img.toString('base64');
      final_img = {contentType: req.file.mimetype, file: Buffer.from(encode_image, 'base64')}
      fs.unlinkSync(req.file.path);
   }
   let new_data = {};
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   if (final_img != "") {
      new_data['image'] = final_img
   }
   try {
      if(!req.body.id) {
         const new_testimonial = new Testimonial(new_data);
         new_testimonial.save();
      } else {
         await Testimonial.updateOne({ _id: mongoose.Types.ObjectId(req.body.id) }, new_data);
      }
      res.status(201).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.post('/team', upload.single('team_img'), async (req, res) => {
   let final_img = "";
   if(req.file) {
      let img = fs.readFileSync(req.file.path);
      let encode_image = img.toString('base64');
      final_img = {contentType: req.file.mimetype, file: Buffer.from(encode_image, 'base64')}
      fs.unlinkSync(req.file.path);
   }
   let new_data = {};
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   if (final_img != "") {
      new_data['image'] = final_img
   }
   try {
      if(!req.body.id) {
         const new_team = new Team(new_data);
         new_team.save();
      } else {
         await Team.updateOne({ _id: mongoose.Types.ObjectId(req.body.id) }, new_data);
      }
      res.status(201).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.post('/gallery', upload.single('gallery_img'), async (req, res) => {
   let final_img = "";
   if(req.file) {
      let img = fs.readFileSync(req.file.path);
      let encode_image = img.toString('base64');
      final_img = {contentType: req.file.mimetype, file: Buffer.from(encode_image, 'base64')}
      fs.unlinkSync(req.file.path);
   }
   let new_data = {};
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   if (final_img != "") {
      new_data['image'] = final_img
   }
   try {
      if(!req.body.id) {
         const new_gallery = new Gallery(new_data);
         new_gallery.save();
      } else {
         await Gallery.updateOne({ _id: mongoose.Types.ObjectId(req.body.id) }, new_data);
      }
      res.status(201).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.post('/faq_data', upload.none(), async (req, res) => {
   const count = await Faq.countDocuments();
   let new_data = {};
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   try {
      if(count == 0) {
         const new_faq = new Faq(new_data);
         new_faq.save();
      } else {
         const data = await Faq.find({});
         const faq_id = data[0]._id;
         await Faq.updateOne({ _id: mongoose.Types.ObjectId(faq_id) }, new_data);
      }
      res.status(201).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.post('/index_data', upload.none(), async (req, res) => {
   const count = await Index.countDocuments();
   let new_data = {};
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   try {
      if(count == 0) {
         const new_index = new Index(new_data);
         new_index.save();
      } else {
         const data = await Index.find({});
         const index_id = data[0]._id;
         await Index.updateOne({ _id: mongoose.Types.ObjectId(index_id) }, new_data);
      }
      res.status(201).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.post('/multi_data', upload.fields([
   { name: "header_logo", maxCount: 1 },
   { name: "partner_img", maxCount: 10 },
   { name: "favicon", maxCount: 1 }
]), async (req, res) => {
   let partner_img = [], header_logo = "", favicon = "";
   if(req.files) {
      if(req.files.partner_img){ 
         for(file of req.files.partner_img) {
            let img = fs.readFileSync(file.path);
            let encode_image = img.toString('base64');
            new_img = {contentType: file.mimetype, file: Buffer.from(encode_image, 'base64')}
            partner_img.push(new_img);
            fs.unlinkSync(file.path);
         }
      }
      if(req.files.header_logo) {
         let img = fs.readFileSync(req.files.header_logo[0].path);
         let encode_image = img.toString('base64');
         header_logo = {contentType: req.files.header_logo[0].mimetype, file: Buffer.from(encode_image, 'base64')};
	 fs.unlinkSync(req.files.header_logo[0].path);
      }
      if(req.files.favicon) {
         let img = fs.readFileSync(req.files.favicon[0].path);
         let encode_image = img.toString('base64');
         favicon = {contentType: req.files.favicon[0].mimetype, file: Buffer.from(encode_image, 'base64')};
	 fs.unlinkSync(req.files.favicon[0].path);
      }
   }
   const count = await Multi.countDocuments();
   let new_data = {};
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   if(header_logo != "") {
      new_data.header_logo = header_logo;
   }
   if(favicon != "") {
      new_data.favicon = favicon;
   }
   if(partner_img.length != 0) {
      new_data.partner_img = partner_img;
   }
   try {
      if(count == 0) {
         const new_multi = new Multi(new_data);
         new_multi.save();
      } else {
         const data = await Multi.find({});
         const multi_id = data[0]._id;
         await Multi.updateOne({ _id: mongoose.Types.ObjectId(multi_id) }, new_data);
      }
      res.status(201).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.post('/about_data', upload.array('about_img', 3) ,async (req, res) => {
   let about_img = [];
   if(req.files) {
      for(file of req.files) {
            let img = fs.readFileSync(file.path);
            let encode_image = img.toString('base64');
            new_img = {contentType: file.mimetype, file: Buffer.from(encode_image, 'base64')}
            about_img.push(new_img);
            fs.unlinkSync(file.path);
         }
   }
   const count = await About.countDocuments();
   let new_data = {};
   for(let key of Object.keys(req.body)) {
      if(req.body[`${key}`] != ""){
         new_data[`${key}`] = req.body[`${key}`];
      }
   }
   if(about_img.length != 0) {
      new_data.about_img = about_img;
   }
   try {
      if(count == 0) {
         const new_about = new About(new_data);
         new_about.save();
      } else {
         const data = await About.find({});
         const about_id = data[0]._id;
         await About.updateOne({ _id: mongoose.Types.ObjectId(about_id) }, new_data);
      }
      res.status(201).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

//Unique Mail check
router.post('/mailcheck', async (req, res) => {
	try {
		let user = await User.findOne({email: req.body.email});
		if(user === null) {
			return res.status(200).json({
				title: "valid"
			})
		} else {
			return res.status(404).json({
				title: "invalid"
			})
		}
	} catch (error) {
		console.log(error);
	}
})

//Signup
router.post('/signup', upload.none(), async (req, res) => {
   try {
      const required_otp = await Otp.findOne({ _id: mongoose.Types.ObjectId(req.body.otp_id) });
      if(req.body.otp == required_otp.otp) {
         await Otp.deleteMany(
            { email: required_otp.email }, 
            { writeConcern: { w: "majority", wtimeout: 5000 } }
         );
         const new_user = new User({
            username: req.body.name,
            email: req.body.email,
            password: req.body.password,
            contact: req.body.contact
         });
         new_user.save((err) => {
            if(err) {
               return console.log("Save Error: " + err);
            }
            return res.status(201).json({ title: "Signup successful!" });
         });
      } else {
         res.status(401).json({ title: "Incorrect OTP entered" });
      }
   } catch (error) {
      console.log(error);      
   }   
})

//Login
router.post('/login', upload.none(), async (req, res) => {
   try {
      const user_auth = await User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }]});
      if(user_auth !== null) {
         const token = jwt.sign({ userID: user_auth._id }, "dhananjaysecretkey");
         res.status(200).json({ title: "success", token: token });
      } else {
         res.status(401).json({
            title: "invalid credentials"
         })
      }
   } catch (error) {
      console.log(error);
   }
})

router.post('/postlogin', upload.none(), async (req, res) => {
   try{
      if(req.body.token) {
         const data = jwt.verify(req.body.token, "dhananjaysecretkey");
         const user = await User.findOne({ _id: mongoose.Types.ObjectId(data.userID) });
         if(user !== null) {
            res.status(200).json({ username: user.email, id: user._id });
         } else {
            res.status(200).json({ title: "user deleted" });
         }
      } else {
         res.status(200).json({ title: "No token received" })
      }
   } catch (error) {
      console.log(error);
      res.status(200).json({ title: "invalid token" })
   }
})

router.post('/admin_login', upload.none(), async (req, res) => {
   try {
      const user_auth = await Admin.findOne({ $or: [{ email: req.body.username }, { username: req.body.username }], password: req.body.password });
      if(user_auth !== null) {
         const token = jwt.sign({ userID: user_auth._id }, "dhananjaysecretkey");
         res.status(200).json({ title: "success", token: token });
      } else {
         res.status(401).json({
            title: "invalid credentials"
         })
      }
   } catch (error) {
      console.log(error);
   }
})


//Delete Requests
router.delete('/admins/:id', async (req, res) => {
   try {
      await Admin.findByIdAndDelete(req.params.id);
      res.status(200).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.delete('/users/:id', async (req, res) => {
   try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.delete('/property/:id', async (req, res) => {
   try {
      await Property.findByIdAndDelete(req.params.id);
      res.status(200).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.delete('/testimonials/:id', async (req, res) => {
   try {
      await Testimonial.findByIdAndDelete(req.params.id);
      res.status(200).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.delete('/team/:id', async (req, res) => {
   try {
      await Team.findByIdAndDelete(req.params.id);
      res.status(200).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});

router.delete('/gallery/:id', async (req, res) => {
   try {
      await Gallery.findByIdAndDelete(req.params.id);
      res.status(200).json({ title: "success" });
   } catch (error) {
      console.log(error);
   }
});


//OTP Generation via SMS
router.post('/sms/otpgen', async (req, res) => {
   let is_error = false;
   try {
      const exists = await Otp.find({ email: req.body.email });
      if(exists.length > 0){
         let current_date = Date.now();
         let len = exists.length;
         let date_add = new Date(exists[len-1].dateadd).getTime();
         if(exists.length > 4) {
            if(((current_date - date_add)/(1000 * 3600 * 24)) > 1) {
               return;
            } else {
               is_error = true;
               return res.status(401).json({ title: "You've sent too many requests.<br>Please try again in a day." });
            }
         }
      }
   } catch (error) {
      is_error = true;
      console.log(error);
   }
   let otp = Math.floor((Math.random() * 10000) + 1);
   let temp = otp;
   let digits = 0;
   while(temp !== 0) {
      temp = Math.floor(temp/10);
      digits += 1;
   }
   if(digits < 4) {
      let multiplier = 1;
      while(digits < 4){
         digits += 1;
         multiplier *= 10;
      }
      otp *= multiplier;
   }
   if(!is_error) {
      try {
         const new_res = await axios.get("https://api.textlocal.in/send", {
            params: {
               apikey: "/u1mQsMJ0Tw-K12Nr45lxDO9kcmShF2RD2ZU3mJKbL",
               sender: "TXTLCL",
               numbers: parseInt("91" + req.body.contact),
               message: `Your OTP for registration to India Housing is ${otp}`,
               test: true
            }
         })
         console.log(new_res.data);
         if(new_res.data.errors) {
            is_error = true;
            for(error of new_res.data.errors) {
               if(error.code == 7) {
                  res.status(401).json({ title: "We are facing some difficulties.<br>Please try again later" })
               }
               if(error.code == 51) {
                  res.status(401).json({title: "Please enter a valid existing phone number"});
                  return;
               }
               if(error.code == 192) {
                  res.status(401).json({ title: "We cannot send OTP outside business hours. Please try again between 9am and 9pm" });
                  return;
               }
            }
         } 
      } catch (error) {
         is_error = true;
         console.log(error);
      }
   }
   
   if(!is_error) {
      try {
         const after_insert = await new Otp({ otp: otp, email: req.body.email}).save();
         res.status(201).json({
            otp_id: after_insert._id
         })
      } catch (error) {
         console.log(error);
         res.status(500).send();
      }
   }
})


//Mail Requests

//OTP Generation via Mail
router.post('/mail/otpgen', async (req, res) => {
   let is_error = false;
   let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
         user: mail_username, // generated ethereal user
         pass: mail_pw // generated ethereal password
      },
      tls: {
         rejectUnauthorized: false
      }
   });
   //Check if user spamming otp generation
   try {
      const exists = await Otp.find({ email: req.body.email }).toArray();
      if(exists !== null){
         if(exists.length > 4) {
            return res.status(401).json({ title: "otp spam" });
         }
      }
   } catch (error) {
      console.log(error);
   }

   //Generate 4 digit random otp
   let otp = Math.floor((Math.random() * 10000) + 1);
   let temp = otp;
   let digits = 0;
   while(temp !== 0) {
      temp = Math.floor(temp/10);
      digits += 1;
   }
   if(digits < 4) {
      let multiplier = 1;
      while(digits < 4){
         digits += 1;
         multiplier *= 10;
      }
      otp *= multiplier;
   }

   //Prepare mail payload
// 	const user_out = `
// 		<h2>Your OTP for signup to < Company Name >: </h2>
// 		<h1>${otp}</h1>
// 		<p>You can delete this code after use. </p>
// 	`;
	  
// 	let mailOptions = {
//       from: '"Company Name" <dhananjay.shettigar2252000@gmail.com>', // sender address
//       to: req.body.email, // list of receivers
//       subject: "Company Name Email Verification", // Subject line
//       text: "Use this code to create your account", // plain text body
//       html: user_out, // html body
//    }

//   // send mail with defined transporter object
//   transporter.sendMail(mailOptions, (error, info) => {
// 	  if(error) {
//         is_error = true;
// 		  return console.log(error);
// 	  }
// 	  console.log(`Message sent: ${info}`);
//   });
   if(is_error) {
      return res.status(200).json({ title: "error" });
   }

  try {
      const after_insert = await Otp.insertOne(
         {
            otp: otp,
            email: req.body.email
         },
         { writeConcern: { w: "majority" , wtimeout: 5000 } }
      );
      res.status(201).json({
         otp_id: after_insert.insertedId
      })
  } catch (error) {
     console.log(error);
     res.status(500).send();
  }
})

router.post('/mail/contact', upload.none(), async (req, res) => {

   let is_error = false;
   let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
         user: mail_username, // generated ethereal user
         pass: mail_pw // generated ethereal password
      },
      tls: {
         rejectUnauthorized: false
      }
   });
   // Prepare mail payload
	let user_out;
   let company_out;
   if(req.body.realtor) {
      company_out = `
         <p>A user has requested to contact ${req.body.realtor}</p>
         <p>Realtor Email: ${req.body.realtor_mail}</p>
         <h3>User Details</h3>
         <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Number: ${req.body.number}</li> 
            <li>Subject: ${req.body.subject}</li>
         </ul>
         <h3>Message: </h3>
         <p>${req.body.message}</p>
      `;
      user_out = `
         <h2>Company Name</h2>
         <p>Your contact request for "${req.body.realtor}" has been received. They will be in touch shortly.</p>
      `;
   } else {
      company_out = `
         <p>You have a new contact request</p>
         <h3>Contact Details</h3>
         <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Number: ${req.body.number}</li> 
            <li>Subject: ${req.body.subject}</li>
         </ul>
         <h3>Message: </h3>
         <p>${req.body.message}</p>
      `;
      user_out = `
         <h2>Company Name</h2>
         <p>Your mail has been received. We will get back to you as soon as possible.</p>
      `;
   }
   
   //Mail Headers
	let mailOptions = {
      from: `"Company Name" ${mail_username}`, // sender address
      to: req.body.email, // list of receivers
      subject: "Contact Request Follow Up", // Subject line
      text: "Thanks for reaching out", // plain text body
      html: user_out, // html body
   }

   // transporter.sendMail(mailOptions, (error) => {
   //    if(error) {
   //       is_error = true;
   //       return console.log(error);
   //    }
   // });
   try {
      await transporter.sendMail(mailOptions);
   } catch (error) {
      is_error = true;
   }

   if(is_error) {
      return res.status(200).json({ title: "Please try again in a while<br>Mail ID not yet set up" })
   }

   mailOptions = {
      from: `${req.body.email}`, // sender address
      to: mail_username, // list of receivers
      subject: "Contact Request", // Subject line
      text: "", // plain text body
      html: company_out, // html body
   }
   // transporter.sendMail(mailOptions, (error) => {
   //    if(error) {
   //       is_error = true;
   //       return console.log(error);
   //    }
   // });
   try {
      await transporter.sendMail(mailOptions);
   } catch (error) {
      is_error = true;
   }
  
   if(is_error) {
      return res.status(200).json({ title: "Invalid Email" });
   }

   if(!is_error) {
      res.status(200).json({ title: "Mail Sent!" })
   }
});


router.post('/mail/enquiry', async (req, res) => {
   if(req.body.email && req.body.email != "") {
      let is_error = false;
      let transporter = nodemailer.createTransport({
         host: "smtp.gmail.com",
         port: 587,
         secure: false, // true for 465, false for other ports
         auth: {
            user: mail_username, // generated ethereal user
            pass: mail_pw // generated ethereal password
         },
         tls: {
            rejectUnauthorized: false
         }
      });
      const user_out = `
         <h2>Company Name</h2>
         <p>Your Enquiry regarding "${req.body.product}" has been received. We will get back to you as soon as possible.</p>
      `;
      const company_out = `
         <p>A user has enquired about Property titled "${req.body.product}"</p>
         <h3>User Details</h3>
         <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Contact: ${req.body.contact}</li> 
         </ul>
      `;
      console.log(req.body.email);
      let mailOptions = {
         from: `${req.body.email}`, // sender address
         to: mail_username, // list of receivers
         subject: "New Property Enquiry", // Subject line
         text: "India Housing Property Enquiry Details", // plain text body
         html: company_out, // html body
      }
      transporter.sendMail(mailOptions, (error) => {
         if(error) {
            is_error = true;
            return console.log(error);
         }
      });
      if(is_error) {
         return res.status(200).json({ title: "Please Try again in a while" });
      }

      mailOptions = {
         from: `"Company Name" ${mail_username}`, // sender address
         to: req.body.email, // list of receivers
         subject: "Property Enquiry Follow Up", // Subject line
         text: "Thank You for choosing India Housing", // plain text body
         html: user_out, // html body
      }
      transporter.sendMail(mailOptions, (error) => {
         if(error) {
            is_error = true;
            return console.log(error);
         }
      });
      if(is_error) {
         return res.status(200).json({ title: "Invalid email" });
      }
      res.status(200).json({ title: "Enquiry Sent!" });
   }
})

// Access required DB collection

// async function loadData(coll_name) {
// 	const mongo_link = await mongoose.connect(`${uri}/${db_name}`, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 	});
// 	mongo_link.connection.on(
// 		'error',
// 		console.log.bind(console, 'Connection error: ')
// 	);
// 	return mongo_link.connection.db.collection(coll_name);
// }

module.exports = router;