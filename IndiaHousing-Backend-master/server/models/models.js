const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*  
To get defined collection name: 
const randomSchema = new Schema({
    field: Type,
    ...
}, { collection: "collection_name" })
*/

const adminSchema = new Schema({
    username: String,
    password: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});
const Admin = mongoose.model('admins', adminSchema);

const companySchema = new Schema({
  email: String,
  password: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});
const companyMail = mongoose.model('company_mail', companySchema);

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true,
    },
    contact: String,
    password: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});
const User = mongoose.model('users', userSchema);

const otpSchema = new Schema({
    email: String,
    otp: Number,
    dateadd: {
      type: Date,
      default: Date.now
    }
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});
const Otp = mongoose.model('otps', otpSchema);

const testimonialSchema = new Schema({
    image: "",
    comment: String,
    name: String,
    role: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});
const Testimonial = mongoose.model('testimonials', testimonialSchema);

const teamSchema = new Schema({
    name: String,
    image: "",
    role: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});
const Team = mongoose.model('teams', teamSchema);

const blogSchema = new Schema({
    title: String,
    description: String,
    author: String,
    date: {
        type: Date,
        default: Date.now
    },
    comments: []
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});
const Blog = mongoose.model('blogs', blogSchema);

const propertySchema = new Schema({
    sold: Boolean,
    title: String,
    price: Number,
    duration: String,
    address: String,
    details: String,
    description: String,
    bedrooms: Number,
    bathrooms: Number,
    floors: Number,
    feet: Number,
    category: String,
    type: String,
    sale_type: String,
    features: [],
    dateadd: {
        type: Date,
        default: Date.now
    },
    dateavail: Date,
    contact: String,
    tags: [String],
    images:[],
    documents: [],
    plans: [],
    video: "",
    questions: [String],
    answers: [String],
    realtor: String,
    email: String,
    gmap: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});
const Property = mongoose.model('properties', propertySchema);

const gallerySchema = new Schema({
    title: String,
    image: ""
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
})
const Gallery = mongoose.model('gallery', gallerySchema)

const faqSchema = new Schema({
    type: [String],
    faq_q: [String],
    faq_ans: [String]
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
})
const Faq = mongoose.model('faq_data', faqSchema);

const indexSchema = new Schema({
    contact_target: String,
    index_top_h3: String,
    index_top_h5: String,
    index_top_p: String,
    index_task_h5_1: String,
    index_task_h5_2: String,
    index_task_h5_3: String,
    index_task_p_1: String,
    index_task_p_2: String,
    index_task_p_3: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
})
const Index = mongoose.model('index_data', indexSchema);

const multiSchema = new Schema({
    header_logo: "",
    favicon: "",
    partner_img: [],
    fb_link: String,
    twitter_link: String,
    linked_link: String,
    insta_link: String,
    play_link: String,
    app_link: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
})
const Multi = mongoose.model('multi_data', multiSchema);

const aboutSchema = new Schema({
    about_top_p: String,
    about_buy_h5: String,
    about_rent_h5: String,
    about_sell_h5: String,
    about_buy_p: String,
    about_rent_p: String,
    about_sell_p: String,
    about_mid_title: String,
    about_mid_p: String,
    about_residential_h5: String,
    about_residential_p: String,
    about_appraisal_h5: String,
    about_appraisal_p: String,
    about_insider_h5: String,
    about_insider_p: String, 
    about_img: [],
    address: [],
    location: []
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
})
const About = mongoose.model('about_data', aboutSchema);

module.exports = { Admin, User, Otp, Testimonial, Blog, Property, Faq, Team, Gallery, Index, Multi, About, companyMail };