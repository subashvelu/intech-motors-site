(function(){
  // Convenience PIN only. For real owner-only access, replace with server-side authentication.
  var ADMIN_PIN = "2580"; // Replace this value before deployment; this is not secure authentication.
  var $ = function(id){ return document.getElementById(id); };
  $("loginBtn").addEventListener("click",function(){
    if($("pin").value === ADMIN_PIN){ $("login").classList.add("hidden"); $("desk").classList.remove("hidden"); }
    else $("loginMsg").textContent="Incorrect PIN. Please try again.";
  });
  $("pin").addEventListener("keydown",function(e){if(e.key==="Enter")$("loginBtn").click();});
  var now=new Date(), pad=function(n){return String(n).padStart(2,"0");};
  $("invoiceDate").value=now.getFullYear()+"-"+pad(now.getMonth()+1)+"-"+pad(now.getDate());
  var rows=$("rows");
  function addRow(desc,qty,rate){
    var row=document.createElement("div");row.className="invoice-row";
    var d=document.createElement("input");d.placeholder="Work / spare part description";d.value=desc||"";
    var q=document.createElement("input");q.type="number";q.min="1";q.value=qty||1;q.placeholder="Qty";
    var r=document.createElement("input");r.type="number";r.min="0";r.step="0.01";r.value=rate||"";r.placeholder="Rate (Rs.)";
    var x=document.createElement("button");x.type="button";x.textContent="Remove";x.addEventListener("click",function(){row.remove();});
    row.append(d,q,r,x);rows.appendChild(row);
  }
  addRow();$("addRow").addEventListener("click",function(){addRow();});
  $("phone").addEventListener("input",function(){this.value=this.value.replace(/\D/g,"").slice(0,10);});
  $("makePdf").addEventListener("click",function(){
    var name=$("customer").value.trim(),phone=$("phone").value.trim();
    if(!name||name.length>40){$("invoiceMsg").textContent="Enter customer name (maximum 40 characters).";$("customer").focus();return;}
    if(!/^[0-9]{10}$/.test(phone)){$("invoiceMsg").textContent="Enter a valid 10-digit mobile number.";$("phone").focus();return;}
    var items=[],bad=false;
    Array.prototype.forEach.call(rows.children,function(row){
      var f=row.querySelectorAll("input"),desc=f[0].value.trim(),qty=Number(f[1].value),rate=Number(f[2].value);
      if(!desc&&!f[2].value)return;
      if(!desc||!Number.isFinite(qty)||qty<1||!Number.isFinite(rate)||rate<0){bad=true;return;}
      items.push({desc:desc,qty:qty,rate:rate});
    });
    if(bad||!items.length){$("invoiceMsg").textContent="Complete each work description, quantity and rate. Add at least one line.";return;}
    var date=$("invoiceDate").value||now.getFullYear()+"-"+pad(now.getMonth()+1)+"-"+pad(now.getDate());
    var stamp=new Date();
    var compact=date.replace(/-/g,"");
    var data={documentType:"INVOICE",no:"INV-"+compact+"-"+pad(stamp.getHours())+pad(stamp.getMinutes())+pad(stamp.getSeconds()),date:date,
      customer:name,phone:phone,vehicle:$("vehicle").value.trim(),vehicleNo:$("vehicleNo").value.trim().toUpperCase(),
      kms:$("kms").value.trim(),remarks:$("remarks").value.trim(),items:items};
    if(!window.jspdf||!window.buildEstimatePDF){$("invoiceMsg").textContent="PDF library failed to load. Refresh and retry.";return;}
    fetch("assets/img/logo-pdf.jpg").then(function(r){return r.blob();}).then(function(blob){
      var fr=new FileReader();fr.onload=function(){
        try{window.buildEstimatePDF(window.jspdf.jsPDF,data,fr.result).save("Intech-Motors-"+data.no+".pdf");$("invoiceMsg").textContent="Final invoice PDF generated.";}
        catch(e){$("invoiceMsg").textContent="Could not create PDF. Check the entered details and retry.";}
      };fr.readAsDataURL(blob);
    }).catch(function(){
      try{window.buildEstimatePDF(window.jspdf.jsPDF,data,null).save("Intech-Motors-"+data.no+".pdf");$("invoiceMsg").textContent="Final invoice PDF generated (logo could not load).";}
      catch(e){$("invoiceMsg").textContent="Could not create PDF.";}
    });
  });
})();