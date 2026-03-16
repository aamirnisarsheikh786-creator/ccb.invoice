const company = {

name:"CITY CHOICE BAKERS",

address:"Gulmarg Road Magam Branch Kunzer",

phone:"7006592704, 9622578770",

email:"citychoicebakers@gmail.com",

logo:"https://i.ibb.co/bM0rp66d/20260222-002732.png"

}

let items=[{name:"",qty:1,price:0}]

let customer={
name:"",
phone:"",
address:""
}

function render(){

const app=document.getElementById("app")

let rows=""

items.forEach((item,i)=>{

rows+=`

<div class="item-row">

<input value="${item.name}" placeholder="Item" oninput="items[${i}].name=this.value">

<input type="number" value="${item.qty}" oninput="items[${i}].qty=this.value">

<input type="number" value="${item.price}" placeholder="Rate" oninput="items[${i}].price=this.value">

</div>

`

})

app.innerHTML=`

<div class="header">${company.name}</div>

<input placeholder="Customer Name" oninput="customer.name=this.value">

<input placeholder="Customer Phone" oninput="customer.phone=this.value">

<input placeholder="Customer Address" oninput="customer.address=this.value">

${rows}

<button onclick="addItem()">Add Item</button>

<input id="paid" type="number" placeholder="Paid Amount">

<button onclick="showPreview()">Preview Invoice</button>

`

}

function addItem(){

items.push({name:"",qty:1,price:0})

render()

}

function calcTotal(){

let total=0

items.forEach(i=>{

total+=i.qty*i.price

})

return total

}

function showPreview(){

const paid=document.getElementById("paid").value||0

const total=calcTotal()

const balance=total-paid

let rows=""

items.forEach(i=>{

rows+=`

<tr>

<td>${i.name}</td>
<td>${i.qty}</td>
<td>${i.price}</td>
<td>${i.qty*i.price}</td>

</tr>

`

})

document.getElementById("app").innerHTML=`

<div class="preview">

<img src="${company.logo}" width="60">

<h2>${company.name}</h2>

<p>${company.address}</p>

<p>${company.phone}</p>

<p>${company.email}</p>

<hr>

<p><b>Customer:</b> ${customer.name}</p>
<p><b>Phone:</b> ${customer.phone}</p>
<p><b>Address:</b> ${customer.address}</p>

<table>

<tr>

<th>Item</th>
<th>Qty</th>
<th>Rate</th>
<th>Total</th>

</tr>

${rows}

</table>

<h3>Grand Total : ₹${total}</h3>
<h4>Paid : ₹${paid}</h4>
<h4 style="color:red">Due Balance : ₹${balance}</h4>

<button onclick="downloadPDF()">Download Invoice</button>

<button onclick="sendWhatsapp()">Send to WhatsApp</button>

<button onclick="render()">Back</button>

</div>

`

}

async function downloadPDF(){

const {jsPDF}=window.jspdf

const doc=new jsPDF()

const img=await loadImage(company.logo)

doc.addImage(img,"PNG",15,10,30,30)

doc.setFontSize(18)
doc.text(company.name,50,20)

doc.setFontSize(10)
doc.text(company.address,50,27)
doc.text(company.phone,50,32)
doc.text(company.email,50,37)

doc.line(10,45,200,45)

doc.text("Customer: "+customer.name,10,55)
doc.text("Phone: "+customer.phone,10,62)
doc.text("Address: "+customer.address,10,69)

const table=items.map(i=>[i.name,i.qty,i.price,i.qty*i.price])

doc.autoTable({

startY:80,

head:[["Item","Qty","Rate","Total"]],

body:table

})

doc.save("invoice.pdf")

}

function sendWhatsapp(){

let msg=`Invoice from CITY CHOICE BAKERS

Customer: ${customer.name}

Total: ₹${calcTotal()}

Thank you for your purchase!`

let url="https://wa.me/"+customer.phone+"?text="+encodeURIComponent(msg)

window.open(url)

}

function loadImage(url){

return new Promise(resolve=>{

const img=new Image()

img.crossOrigin="Anonymous"

img.onload=function(){

const canvas=document.createElement("canvas")

canvas.width=img.width

canvas.height=img.height

const ctx=canvas.getContext("2d")

ctx.drawImage(img,0,0)

resolve(canvas.toDataURL("image/png"))

}

img.src=url

})

}

render()
