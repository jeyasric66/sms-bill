const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000; // Render க்கு இது Must

app.use(bodyParser.urlencoded({ extended: true }));

const items = [
    { id: 1, name: "50 படி வட்டகை" },
    { id: 2, name: "40 படி வட்டகை" },
    { id: 3, name: "35 படி வட்டகை" },
    { id: 4, name: "30 படி வட்டகை" },
    { id: 5, name: "25 படி வட்டகை" },
    { id: 6, name: "20 படி வட்டகை" },
    { id: 7, name: "15 படி வட்டகை" },
    { id: 8, name: "10 படி வட்டகை" },
    { id: 9, name: "7 படி வட்டகை" },
    { id: 10, name: "5 படி வட்டகை" },
    { id: 11, name: "அல்வா குருப்பி" },
    { id: 12, name: "இரும்புக்கரண்டி" },
    { id: 13, name: "பால் கரண்டி" },
    { id: 14, name: "சில்வர் வாளி" },
    { id: 15, name: "சில்வர் கரண்டி" },
    { id: 16, name: "அன்ன கரண்டி" },
    { id: 17, name: "அன்ன பேஷன்" },
    { id: 18, name: "அன்னகுண்டா" },
    { id: 19, name: "அன்னவெட்டி" },
    { id: 20, name: "தண்ணீர் கேத்தல்" },
    { id: 21, name: "கை கப்பு" },
    { id: 22, name: "வடைச்சட்டி" },
    { id: 23, name: "சாரணி" },
    { id: 24, name: "இட்லி கொப்பரை" },
    { id: 25, name: "அரிவாள்மனை" },
    { id: 26, name: "தேங்காய் துருவி" },
    { id: 27, name: "டீ, காபி & கேன்" },
    { id: 28, name: "கேஸ் அடுப்பு டபுள்" },
    { id: 29, name: "சிங்கிள் அடுப்பு" },
    { id: 30, name: "3 பர்னர் அடுப்பு" },
    { id: 31, name: "4 பர்னர் அடுப்பு" },
    { id: 32, name: "தோசைக்கல் அடுப்பு" },
    { id: 33, name: "சில்வர் அண்டா" },
    { id: 34, name: "தண்ணீர் டிரம்" },
    { id: 35, name: "பந்திப்பாய்" },
    { id: 36, name: "ஐமுக்காளம்" },
    { id: 37, name: "டேபிள், சேர்" },
    { id: 38, name: "கைப்பிடி சேர்" },
    { id: 39, name: "வி.ஐ.பி சேர்" },
    { id: 40, name: "பன்னீர் கைச்செம்பு" },
    { id: 41, name: "பனியார சட்டி" },
    { id: 42, name: "ஃபோன்" },
    { id: 43, name: "கிரைண்டர்" },
    { id: 44, name: "மிக்சி" },
    { id: 45, name: "தேங்காய் திருகி மிஷின்" },
    { id: 46, name: "சாமியானா பந்தல்" },
    { id: 47, name: "வண்டி வாடகை" },
    { id: 48, name: "ஏத்து கூலி, இறக்கு கூலி" }
];

// PWA manifest.json - Public folder தேவையில்ல
app.get("/manifest.json", (req, res) => {
    res.json({
        "name": "S.M.S பில் Software",
        "short_name": "SMS Bill",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
        "description": "S.M.S. பந்தல் & பாத்திர வாடகை பில்",
        "icons": [
            {
                "src": "https://cdn-icons-png.flaticon.com/512/2910/2910791.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "https://cdn-icons-png.flaticon.com/512/2910/2910791.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    });
});

app.get("/", (req, res) => {
    const billNo = Date.now().toString().slice(-6);
    const today = new Date().toLocaleDateString("ta-IN");

    let itemRows = "";
    for (let i = 0; i < items.length; i++) {
        itemRows += '<tr><td>' + items[i].id + '</td><td style="text-align: left; padding-left: 8px;">' + items[i].name + '</td><td><input type="number" name="qty_' + items[i].id + '" min="0" class="qty"></td><td><input type="number" name="rate_' + items[i].id + '" min="0" class="rate"></td><td><input type="number" name="total_' + items[i].id + '" class="total" readonly></td></tr>';
    }

    const html = '<!DOCTYPE html><html lang="ta"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>S.M.S. பந்தல் & சமையல் பாத்திர வாடகை கடை</title><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#000000"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><style>body{font-family:Latha,Noto Sans Tamil,sans-serif;padding:10px;font-size:14px}.bill-container{border:2px solid black;padding:10px;max-width:800px;margin:auto}.header{text-align:center;border-bottom:1px solid black;padding-bottom:5px}.header h1{margin:5px;font-size:18px}.header p{margin:2px;font-size:11px}.info{display:flex;justify-content:space-between;margin:8px 0;font-weight:bold}table{width:100%;border-collapse:collapse;margin-top:5px}th,td{border:1px solid black;padding:3px;text-align:center}th{background:#f2f2f2;font-size:12px}td{font-size:12px}input{width:95%;border:none;text-align:center;font-family:inherit;font-size:12px;background:transparent}input:focus{outline:1px solid blue;background:#ffffe0}.footer{margin-top:10px;display:flex;justify-content:space-between}.footer-left{width:50%}.footer-left input{border-bottom:1px dotted black;text-align:left}.total-box{width:45%;font-weight:bold}.total-box div{margin:5px 0;display:flex;justify-content:space-between;align-items:center}.total-box input{width:100px;border:1px solid black;font-weight:bold}.btn-group{text-align:center;margin-top:15px}.btn-group button{padding:10px 20px;font-size:16px;margin:5px;cursor:pointer}.whatsapp{background:#25D366;color:white;border:none}@media print{button,.no-print{display:none}body{padding:0}.bill-container{border:none}input{border:none}}</style></head><body><div class="bill-container"><form action="/bill" method="POST" id="billForm"><div class="header"><div style="display:flex;justify-content:space-between;font-size:11px;"><span>M.செல்வமணி</span><span>98655 53074<br>97517 53074</span></div><h1>S.M.S. பந்தல் & சமையல் பாத்திர வாடகை கடை</h1><p>தெற்கு தெரு. காளியம்மன் கோவில் அருகில், திருவேடகம் - 625 234, மதுரை மாவட்டம்</p></div><div class="info"><div>திரு. <input type="text" name="customer_name" id="customer_name" style="width:250px;" required></div><div>எண் : ' + billNo + ' <br> தேதி : ' + today + '</div></div><table><thead><tr><th>வ.எண்</th><th>பொருள் விபரம்</th><th>எண்ணிக்கை</th><th>ரூ.</th><th>மொத்தம்</th></tr></thead><tbody>' + itemRows + '</tbody></table><div class="footer"><div class="footer-left">பார்ட்டி பெயர் : <input type="text" name="party_name" id="party_name"><br><br>மண்டபம் வீடு : <input type="text" name="mandapam" id="mandapam"><br><br>செல் நம்பர் : <input type="text" name="phone" id="phone"><br><br></div><div class="total-box"><div>மொத்தம் : <input type="number" name="grand_total" id="grand_total" readonly></div><div>முன்பணம் : <input type="number" name="advance" id="advance"></div><div>பாக்கி : <input type="number" name="balance" id="balance" readonly></div><div style="margin-top:20px;text-align:center;font-weight:normal;">பார்ட்டி கையொப்பம்</div></div></div><div class="btn-group no-print"><button type="submit">பில் சேமிக்க & அச்சிடுக</button><button type="button" class="whatsapp" onclick="shareWhatsApp()">WhatsApp க்கு அனுப்பு</button></div><input type="hidden" name="bill_no" value="' + billNo + '"><input type="hidden" name="bill_date" value="' + today + '"></form></div><script>function calculateTotal(){let grandTotal=0;document.querySelectorAll(".qty").forEach((qtyInput,i)=>{let qty=parseFloat(qtyInput.value)||0;let rate=parseFloat(document.querySelectorAll(".rate")[i].value)||0;let total=qty*rate;document.querySelectorAll(".total")[i].value=total?total.toFixed(2):"";if(qty>0)grandTotal+=total});document.getElementById("grand_total").value=grandTotal?grandTotal.toFixed(2):"";let advance=parseFloat(document.getElementById("advance").value)||0;let balance=grandTotal-advance;document.getElementById("balance").value=balance?balance.toFixed(2):""}document.querySelectorAll(".qty,.rate, #advance").forEach(input=>{input.addEventListener("input",calculateTotal)});calculateTotal();function shareWhatsApp(){let customer=document.getElementById("customer_name").value||"வாடிக்கையாளர்";let phone=document.getElementById("phone").value;let party=document.getElementById("party_name").value;let mandapam=document.getElementById("mandapam").value;let grand=document.getElementById("grand_total").value||0;let advance=document.getElementById("advance").value||0;let balance=document.getElementById("balance").value||0;let billNo=document.querySelector(\'input[name="bill_no"]\').value;let billDate=document.querySelector(\'input[name="bill_date"]\').value;if(!customer){alert("திரு. பெயர் எழுதுங்க டா");return}let itemsText="";document.querySelectorAll(".qty").forEach((qtyInput,i)=>{let qty=parseFloat(qtyInput.value)||0;if(qty>0){let name=document.querySelectorAll("tbody tr")[i].children[1].innerText;let rate=document.querySelectorAll(".rate")[i].value;let total=document.querySelectorAll(".total")[i].value;itemsText+=name+" - "+qty+" x "+rate+" = ₹"+total+"%0A"}});if(!itemsText){alert("ஒரு Item க்காவது Qty போடு டா");return}let message="*S.M.S. பந்தல் & பாத்திர வாடகை கடை*%0A%0A*பில் எண்:* "+billNo+"%0A*தேதி:* "+billDate+"%0A*திரு:* "+customer+"%0A*பார்ட்டி:* "+party+"%0A*மண்டபம்:* "+mandapam+"%0A%0A*பொருட்கள்:*%0A"+itemsText+"%0A*மொத்தம்:* ₹"+grand+"%0A*முன்பணம்:* ₹"+advance+"%0A*பாக்கி:* ₹"+balance+"%0A%0Aநன்றி! 🙏%0A98655 53074";let waLink="https://web.whatsapp.com/send?phone=91"+phone+"&text="+message;if(phone){window.open(waLink,"_blank")}else{window.open("https://web.whatsapp.com/send?text="+message,"_blank")}}</script></body></html>';

    res.send(html);
});

app.post("/bill", (req, res) => {
    const billData = req.body;
    const billNo = req.body.bill_no;

    // Render ல File Save ஆகாது. Console ல Log பண்ணுறோம்.
    console.log("New Bill:", billNo, billData.customer_name);

    const successHtml = '<div style="font-family:Latha,sans-serif;text-align:center;padding:50px;"><h2>பில் Ready!</h2><p>பில் எண்: ' + billNo + '</p><button onclick="window.print()" style="padding:10px 20px;font-size:16px;cursor:pointer;">அச்சிடுக / PDF Save பண்ணு</button><br><br><a href="/" style="font-size:16px;">புதிய பில் போட</a></div>';

    res.send(successHtml);
});

app.listen(PORT, () => {
    console.log("S.M.S சர்வர் ஓடுகிறது Port: " + PORT);
});