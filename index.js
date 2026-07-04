const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Bill Counter - Server Start ஆனா 1 ல இருந்து
let billCounter = 1;

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

app.get("/manifest.json", (req, res) => {
    res.json({
        "name": "S.M.S பில் Software",
        "short_name": "SMS Bill",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
        "description": "S.M.S. பந்தல் & பாத்திர வாடகை பில்",
        "icons": [{
            "src": "https://cdn-icons-png.flaticon.com/512/2910/2910791.png",
            "sizes": "192x192",
            "type": "image/png"
        }]
    });
});

app.get("/", (req, res) => {
    const billNo = billCounter;
    billCounter++; // அடுத்த பில் +1

    const today = new Date().toLocaleDateString("ta-IN");

    let itemRows = "";
    for (let i = 0; i < items.length; i++) {
        itemRows += '<tr><td>' + items[i].id + '</td><td style="text-align:left;padding-left:8px;">' + items[i].name + '</td><td><input type="number" class="qty" data-idx="' + i + '" min="0"></td><td><input type="number" class="rate" data-idx="' + i + '" min="0"></td><td><input type="number" class="total" data-idx="' + i + '" readonly></td></tr>';
    }

    const itemsJSON = JSON.stringify(items);

    const html = `<!DOCTYPE html><html lang="ta"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>S.M.S Bill</title><link rel="manifest" href="/manifest.json"><style>body{font-family:Latha,Noto Sans Tamil,sans-serif;padding:10px;font-size:14px}.bill-container{border:2px solid black;padding:10px;max-width:800px;margin:auto}.header{text-align:center;border-bottom:1px solid black;padding-bottom:5px}.header h1{margin:5px;font-size:18px}.header p{margin:2px;font-size:11px}.info{display:flex;justify-content:space-between;margin:8px 0;font-weight:bold}table{width:100%;border-collapse:collapse;margin-top:5px}th,td{border:1px solid black;padding:3px;text-align:center}th{background:#f2f2f2;font-size:12px}td{font-size:12px}input{width:95%;border:none;text-align:center;font-family:inherit;font-size:12px;background:transparent}input:focus{outline:1px solid blue;background:#ffffe0}.footer{margin-top:10px;display:flex;justify-content:space-between}.footer-left{width:50%}.footer-left input{border-bottom:1px dotted black;text-align:left}.total-box{width:45%;font-weight:bold}.total-box div{margin:5px 0;display:flex;justify-content:space-between;align-items:center}.total-box input{width:100px;border:1px solid black;font-weight:bold}.btn-group{text-align:center;margin-top:15px}.btn-group button{padding:10px 20px;font-size:16px;margin:5px;cursor:pointer;border:none;border-radius:4px}.whatsapp{background:#25D366;color:white}.sms{background:#3b82f6;color:white}@media print{button,.no-print{display:none}body{padding:0}.bill-container{border:none}input{border:none}}</style></head><body><div class="bill-container"><div class="header"><div style="display:flex;justify-content:space-between;font-size:11px;"><span>M.செல்வமணி</span><span>98655 53074<br>97517 53074</span></div><h1>S.M.S. பந்தல் & சமையல் பாத்திர வாடகை கடை</h1><p>தெற்கு தெரு. காளியம்மன் கோவில் அருகில், திருவேடகம் - 625 234, மதுரை மாவட்டம்</p></div><div class="info"><div>திரு. <input type="text" id="customer_name" style="width:250px;" required></div><div>எண் : ${billNo} <br> தேதி : ${today}</div></div><table><thead><tr><th>வ.எண்</th><th>பொருள் விபரம்</th><th>எண்ணிக்கை</th><th>ரூ.</th><th>மொத்தம்</th></tr></thead><tbody>${itemRows}</tbody></table><div class="footer"><div class="footer-left">பார்ட்டி பெயர் : <input type="text" id="party_name"><br><br>மண்டபம் வீடு : <input type="text" id="mandapam"><br><br>செல் நம்பர் : <input type="text" id="phone" placeholder="9876543210" maxlength="10"><br><br></div><div class="total-box"><div>மொத்தம் : <input type="number" id="grand_total" readonly></div><div>முன்பணம் : <input type="number" id="advance"></div><div>பாக்கி : <input type="number" id="balance" readonly></div><div style="margin-top:20px;text-align:center;font-weight:normal;">பார்ட்டி கையொப்பம்</div></div></div><div class="btn-group no-print"><button type="button" class="whatsapp" onclick="shareWhatsApp()">WhatsApp க்கு அனுப்பு</button><button type="button" class="sms" onclick="sendSMS()">SMS அனுப்பு</button></div></div><script>const ITEMS=${itemsJSON};const BILL_NO="${billNo}";const BILL_DATE="${today}";function calculateTotal(){let grandTotal=0;document.querySelectorAll(".qty").forEach((qtyInput)=>{let idx=parseInt(qtyInput.dataset.idx);let qty=parseFloat(qtyInput.value)||0;let rate=parseFloat(document.querySelector('.rate[data-idx="'+idx+'"]').value)||0;let total=qty*rate;document.querySelector('.total[data-idx="'+idx+'"]').value=total?total.toFixed(2):"";if(qty>0)grandTotal+=total});document.getElementById("grand_total").value=grandTotal?grandTotal.toFixed(2):"";let advance=parseFloat(document.getElementById("advance").value)||0;let balance=grandTotal-advance;document.getElementById("balance").value=balance?balance.toFixed(2):""}document.querySelectorAll(".qty,.rate, #advance").forEach(input=>{input.addEventListener("input",calculateTotal)});function getBillData(){let customer=document.getElementById("customer_name").value.trim();if(!customer){alert("திரு. பெயர் எழுதுங்க டா");return null}let phone=document.getElementById("phone").value.trim().replace(/[^0-9]/g,"");let party=document.getElementById("party_name").value;let mandapam=document.getElementById("mandapam").value;let grand=document.getElementById("grand_total").value||0;let advance=document.getElementById("advance").value||0;let balance=document.getElementById("balance").value||0;let itemsText="";let count=0;ITEMS.forEach((item,idx)=>{let qty=parseFloat(document.querySelector('.qty[data-idx="'+idx+'"]').value)||0;if(qty>0){let rate=document.querySelector('.rate[data-idx="'+idx+'"]').value||0;let total=document.querySelector('.total[data-idx="'+idx+'"]').value||0;count++;itemsText+=count+". "+item.name+" - "+qty+" x ₹"+rate+" = ₹"+total+"\\n"}});if(count==0){alert("ஒரு Item க்காவது Qty + Rate போடு டா");return null}return{customer,phone,party,mandapam,grand,advance,balance,itemsText}}function shareWhatsApp(){let data=getBillData();if(!data)return;let msg="*S.M.S. பந்தல் & பாத்திர வாடகை கடை*\\n\\n*பில் எண்:* "+BILL_NO+"\\n*தேதி:* "+BILL_DATE+"\\n*திரு:* "+data.customer+"\\n*பார்ட்டி:* "+data.party+"\\n*மண்டபம்:* "+data.mandapam+"\\n\\n*பொருட்கள்:*\\n"+data.itemsText+"\\n*மொத்தம்:* ₹"+data.grand+"\\n*முன்பணம்:* ₹"+data.advance+"\\n*பாக்கி:* ₹"+data.balance+"\\n\\nநன்றி! 🙏\\n98655 53074";let waLink=data.phone&&data.phone.length===10?"https://wa.me/91"+data.phone+"?text="+encodeURIComponent(msg):"https://wa.me/?text="+encodeURIComponent(msg);window.location.href=waLink}function sendSMS(){let data=getBillData();if(!data)return;if(!data.phone||data.phone.length!==10){alert("Customer Phone Number சரியா 10 Digit போடு டா");return}let smsText="S.M.S Bill No:"+BILL_NO+"\\nCustomer: "+data.customer+"\\nBill Amt: Rs."+data.grand+"\\nBalance: Rs."+data.balance+"\\nThank you! 9865553074";let smsLink="sms:+91"+data.phone+"?body="+encodeURIComponent(smsText);window.location.href=smsLink}</script></body></html>`;

    res.send(html);
});

app.listen(PORT, () => {
    console.log("S.M.S சர்வர் ஓடுகிறது Port: " + PORT);
});
