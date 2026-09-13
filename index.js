
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import User from "./views/user.js"

const app = express();

//===== fix __dirname ========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// ================== PRODUCT PAGES ==================
app.get('/apple', (req, res) => res.render('apple'));
app.get('/infinix', (req, res) => res.render('infinix'));
app.get('/AINova', (req, res) => res.render('AINova'));
app.get('/nothing', (req, res) => res.render('nothing'));
app.get('/samsung', (req, res) => res.render('samsung'));
app.get('/vivo', (req, res) => res.render('vivo'));


app.get('/samsunglaptop', (req, res) => res.render('samsunglaptop'));
app.get('/Lenovolaptop', (req, res) => res.render('Lenovolaptop'));
app.get('/HPlaptop', (req, res) => res.render('HPlaptop'));
app.get('/Acerlaptop', (req, res) => res.render('Acerlaptop'));
app.get('/Lenovo1', (req, res) => res.render('Lenovo1'));
app.get('/Lenovo2', (req, res) => res.render('Lenovo2'));




// ===== GLOBAL DATA (FIXED) =====
const products = [
  { name: "iPhone 17 Pro", category: "mobile", image: "/images/iphone17.jpg", link: "/apple" },
  { name: "Samsung Ultra", category: "mobile", image: "/images/SamsungUltra.jpg", link: "/samsung" },
  { name: "Infinix Zore", category: "mobile", image: "/images/InfinixZero.jpg", link: "/infinix" },
  { name: "Nothing Phone", category: "mobile", image: "/images/NothingPhone.jpg", link: "/nothing" },
  { name: "vivo X200", category: "mobile", image: "/images/vivo.jpg", link: "/vivo" },
  { name: "AI+ Nova 5G", category: "mobile", image: "/images/AI+Nova.jpg", link: "/AINova " }
];

const products1 = [
  { name: "Samsung Galaxy Book4 Metal Intel Core i5 13th Gen 1335U - (16 GB/512 GB SSD/Windows 11 Home) NP750XGJ Thin and Light Laptop (15.6 Inch, Gray, 1.55 Kg, With MS Office)", category: "laptop", image: "/images/l1.jpg" },
  { name: "Lenovo LOQ Essential Intel Core i7 12650HX - (16 GB/512 GB SSD/Windows 11 Home/6 GB Graphics/NVIDIA GeForce RTX 4050) LOQ 15IAX9E Gaming Laptop (15.6 Inch, Luna Grey, With MS Office)", category: "laptop", image: "/images/l2.jpg" },
  { name: "HP Victus (i7 14th Gen) Intel Core 7 240H - (24 GB/1 TB SSD/Windows 11 Home/8 GB Graphics/NVIDIA GeForce RTX 5060) 15-fa2405TX Gaming Laptop (15.6 Inch, Mica Silver, 2.29 Kg, With MS Office)", category: "laptop", image: "/images/l3.jpg" },
  { name: "Acer Predator Helios Neo 16 Intel Core i7 14th Gen 14700HX - (16 GB/1 TB SSD/Windows 11 Home/6 GB Graphics/NVIDIA GeForce RTX 4050) PHN16-72-77GZ Gaming Laptop (16 Inch, Abyssal Black, 2.8 Kg)", category: "laptop", image: "/images/l4.jpg" },
  { name: "Lenovo IdeaPad Pro 5 Intel Core Ultra 9 285H - (32 GB/1 TB SSD/Windows 11 Home) 14IAH10 Thin and Light Laptop (14 Inch, Luna Grey, 1.39 Kg, With MS Office)", category: "laptop", image: "/images/l5.jpg" },
  { name: "Lenovo Yoga 7 WUXGA-OLED Intel Core i7 13th Gen 1360P - (16 GB/1 TB SSD/Windows 11 Home) 14IRL8 2 in 1 Laptop (14 Inch, Tidal Teal, 1.49 Kg, With MS Office)", category: "laptop", image: "/images/l6.jpg" }
];

const ads = [
  { image: "/images/a1.jpg" },
  { image: "/images/a2.jpg" },
  { image: "/images/a3.jpg" },
  { image: "/images/a4.jpg" },
  { image: "/images/a5.jpg" },
  { image: "/images/a6.jpg" }
];


//  EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



// ================== HOME ==================
app.get('/', (req, res) => {
  res.render("index", { products, ads });
});


// ===============items funtions =============

// ================== MOBILE ==================
app.get('/mobile', (req, res) => {
  const mobileProducts = products.filter(p => p.category === "mobile");
  res.render("mobile", { products: mobileProducts });
});

// ================== LAPTOP ==================
app.get('/laptop', (req, res) => {
  const laptopProducts = products1.filter(p1 => p1.category === "laptop");
  res.render("laptop", { products1: laptopProducts });
});






// ================== SEARCH ==================
app.get("/search", (req, res) => {

  const query = req.query.q.toLowerCase();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  res.render("index", { products: filteredProducts, ads ,query});

});







// ================== CART ==================
let cart = [];

app.get('/cart', (req, res) => {
  res.render('cart', { cart });
});

// ADD TO CART========functions========
app.post("/cart", (req, res) => {
  const { name, image } = req.body;

  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, image, quantity: 1 });
  }
 
  res.redirect("/");
});

// INCREASE
app.post("/cart/increase", (req, res) => {
  const item = cart.find(i => i.name === req.body.name);
  if (item) item.quantity++;
  res.redirect("/cart");
});

// DECREASE
app.post("/cart/decrease", (req, res) => {
  const item = cart.find(i => i.name === req.body.name);
  if (item && item.quantity > 1) item.quantity--;
  res.redirect("/cart");
});

// REMOVE
app.post("/cart/remove", (req, res) => {
  cart = cart.filter(i => i.name !== req.body.name);
  res.redirect("/cart");
});




// ==========telegram confingering==========//bot id connection==
const TOKEN = "8235443510:AAFOwrss_rNp3fyQXWBFjZ9pRGTlw5ws3Cc";   
const CHAT_ID = "8363575839"



//========= Payment============functions=====
// ================== CHECKOUT ==================
app.get("/checkout", (req, res) => {
  if (cart.length === 0) return res.redirect("/checkout");
  res.render("checkout", { cart });
});



// 👉 ORDER + TELEGRAM
app.post("/pay", async (req, res) => {
  try {
    const data = req.body;

    console.log("🔥 ORDER:", data);

    // ✅ FIX 1: DEFINE cartItems
    const cartItems = JSON.parse(data.cartData);

    let itemsList = "";

    // ✅ FIX 2: USE BACKTICKS
    cartItems.forEach(item => {
      itemsList += `\n📦 ${item.name} (x${item.quantity})`;
    });

    const message = `
------- 🛒 New Order -------

╰┈➤👤 Name: ${data.fullname}

╰┈➤📞 Phone: ${data.phone}

╰┈➤📍 Address: ${data.address}
${data.city}, ${data.state} - ${data.pincode}

${itemsList}

╰┈➤💳 Payment: ${data.payment}

--------------------------

📦 Please process this order quickly

╰┈➤ 𝗪𝗲𝗯 𝗕𝘆 ⇾ TEAM 4 BOYS
`;

    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    const result = await response.json();
    console.log("📩 Telegram:", result);

    res.send("✅ Order Placed Successfully 🚀");

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.send("❌ Error sending order");
  }
});

// ================== LOGIN ==================
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, userpassword } = req.body;

  const foundUser = await User.findOne({ username, userpassword });

  if (foundUser) {
    res.redirect("/");
  } else {
    res.send("Invalid username or password");
  }
});

// ================== SIGNUP ==================
app.get('/sign', (req, res) => {
  res.render('sign');
});

app.post('/sign', async (req, res) => {
  try {
    const { username, userpassword } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.send("User already exists");
    }

    const newUser = new User({
      username,
      userpassword
    });

    await newUser.save();
    res.redirect('/login');

  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});

// ================== DATABASE ==================
const dburl = "mongodb://sagar:123@ac-w5jgluf-shard-00-00.jyflgo8.mongodb.net:27017,ac-w5jgluf-shard-00-01.jyflgo8.mongodb.net:27017,ac-w5jgluf-shard-00-02.jyflgo8.mongodb.net:27017/?ssl=true&replicaSet=atlas-vhe2x9-shard-0&authSource=admin&appName=myapp";

mongoose.connect(dburl)
.then(() => {
  console.log("connect to database");
})
.catch((err) => {
  console.log("connection failed", err.message);
});

// ================== SERVER ==================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});