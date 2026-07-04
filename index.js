const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const htmlContent = `
<!DOCTYPE html>
<html lang="ta">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>S.M.S Bill - Premium</title>
    <link rel="manifest" href="data:application/json;base64,eyJuYW1lIjoiUy5NLlMgQmlsbCBQcmVtaXVtIiwic2hvcnRfbmFtZSI6IlNNUyBCaWxsIiwic3RhcnRfdXJsIjoiLyIsImRpc3BsYXkiOiJzdGFuZGFsb25lIiwiYmFja2dyb3VuZF9jb2xvciI6IiMwZjE3MmEiLCJ0aGVtZV9jb2xvciI6IiNmNTliMGIifQ==">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; background: #0f172a; color: #e2e8f0; padding: 10px; }
        .container { max-width: 500px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { text-align: center; color: #f59e0b; margin-bottom: 5px; font-weight: 700; }
        h1 span { font-size: 12px; color: #64748b; display: block; }
        label { display: block; margin: 12px 0 5px; font-size: 14px; color: #94a3b8; }
        input { width: 100%; padding: 12px; border: 1px solid #334155; background: #0f172a; color: #fff; border-radius: 8px; font-size: 16px; }
        table { width: 100%; margin: 15px 0; border-collapse: collapse; }
        th { background: #334155; padding: 10px; font-size: 12px; text-align: left; }
        td { padding: 8px 4px; }
        td input { padding: 8px; font-size: 14px; }
        .btn { width: 100%; padding: 14px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 10px; }
        .btn-add { background: #334155; color: #fff; }
        .btn-wa { background: #25D366; color: #000; }
        .btn-sms { background: #3b82f6; color: #fff; }
        .total-box { background: #0f172a; padding: 15px; border-radius: 8px; margin-top: 15px; }
        .total-row { display: flex; justify-content: space-between; margin: 8px 0; align-items: center; }
        .grand { font-size: 20px; font-weight: 700; color: #f59e0b; }
        .del-btn { background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>S.M.S <span>Premium Bill</span></h1>
        
        <label>வாடிக்கையாளர் பெயர்</label>
        <input type="text" id="customerName" placeholder="பெயர்">
        
        <label>வாடிக்கையாளர் WhatsApp நம்பர்</label>
        <input type="tel" id="customerPhone" placeholder="9876543210">
        
        <table id="itemsTable">
            <thead>
                <tr><th>பொருள்</th><th>எண்</th><th>விலை</th><th></th></tr>
            </thead>
            <tbody></tbody>
        </table>
        
        <button class="btn btn-add" onclick="addItem()">+ பொருள் சேர்க்க</button>
        
        <div class="total-box">
            <div class="total-row">
                <span>Sub Total</span>
                <span id="subTotal">₹0.00</span>
            </div>
            <div class="total-row">
                <span>Advance</span>
                <input type="number" id="advance" value="0" oninput="calculateTotal()" style="width:100px; text-align:right; padding:6px;">
            </div>
            <div class="total-row grand">
                <span>Balance</span>
                <span id="grandTotal">₹0.00</span>
            </div>
        </div>
        
        <button class="btn btn-wa" onclick="sendToWhatsApp()">WhatsApp க்கு அனுப்பு</button>
        <button class="btn btn-sms" onclick="sendToSMS()">SMS அனுப்பு</button>
    </div>

<script>
    function addItem() {
        const tbody = document.querySelector('#itemsTable tbody');
        const row = document.createElement('tr');
        row.innerHTML = \`
            <td><input type="text" class="item-name" placeholder="பொருள் பெயர்" oninput="calculateTotal()"></td>
            <td><input type="number" class="item-qty" value="1" oninput="calculateTotal()"></td>
            <td><input type="number" class="item-rate" placeholder="0" oninput="calculateTotal()"></td>
            <td><button class="del-btn" onclick="this.parentElement.parentElement.remove(); calculateTotal();">X</button></td>
        \`;
        tbody.appendChild(row);
    }

    function calculateTotal() {
        let subTotal = 0;
        document.querySelectorAll('#itemsTable tbody tr').forEach(row => {
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
            subTotal += qty * rate;
        });
        const advance = parseFloat(document.getElementById('advance').value) || 0;
        document.getElementById('subTotal').innerText = '₹' + subTotal.toFixed(2);
        document.getElementById('grandTotal').innerText = '₹' + (subTotal - advance).toFixed(2);
    }

    function getBillMessage() {
        const name = document.getElementById('customerName').value || 'Customer';
        let itemList = '';
        let subTotal = 0;
        document.querySelectorAll('#itemsTable tbody tr').forEach((row, i) => {
            const itemName = row.querySelector('.item-name').value;
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
            const total = qty * rate;
            if(itemName && qty > 0) {
                itemList += \`\${i + 1}. \${itemName}\\n   \${qty} x ₹\${rate} = ₹\${total.toFixed(2)}\\n\`;
                subTotal += total;
            }
        });
        if (!itemList) { alert('குறைந்தது 1 Item சேர்க்கணும்'); return null; }
        
        const advance = parseFloat(document.getElementById('advance').value) || 0;
        const grandTotal = subTotal - advance;
        const date = new Date().toLocaleDateString('en-IN');
        
        return { text: \`*S.M.S Premium Bill* 🧾\\n\\n*Date:* \${date}\\n*Customer:* \${name}\\n\\n*Order Details:*\\n\${itemList}\\n*Sub Total:* ₹\${subTotal.toFixed(2)}\\n*Advance:* ₹\${advance.toFixed(2)}\\n*Balance Due:* ₹\${grandTotal.toFixed(2)}\\n\\nOrder க்கு நன்றி! 🙏\\nS.M.S\`, phone: document.getElementById('customerPhone').value };
    }

    function sendToWhatsApp() {
        const bill = getBillMessage();
        if (!bill) return;
        const waLink = bill.phone ? \`https://wa.me/91\${bill.phone}?text=\${encodeURIComponent(bill.text)}\` : \`https://wa.me/?text=\${encodeURIComponent(bill.text)}\`;
        window.location.href = waLink;
    }

    function sendToSMS() {
        const bill = getBillMessage();
        if (!bill) return;
        const smsLink = bill.phone ? \`sms:91\${bill.phone}?body=\${encodeURIComponent(bill.text)}\` : \`sms:?body=\${encodeURIComponent(bill.text)}\`;
        window.location.href = smsLink;
    }

    addItem(); calculateTotal();
</script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.listen(PORT, () => {
    console.log(`S.M.S சர்வர் ஓடுகிறது Port: ${PORT}`);
});
