(function () {
  var S = window.SERVICES || [];
  var sel = {}, custom = [], logo = null;
  var $ = function (i) { return document.getElementById(i); };
  var inr = function (n) { return "Rs. " + Number(n).toLocaleString("en-IN"); };
  if (!$("svcList")) return;

  S.forEach(function (s, i) {
    var l = document.createElement("label"); l.className = "item";
    var c = document.createElement("input"); c.type = "checkbox";
    var box = document.createElement("span"); box.className = "meta";
    var nm = document.createElement("span"); nm.className = "nm"; nm.textContent = s.name;
    var pr = document.createElement("span"); pr.className = "pr"; pr.textContent = "Approx. " + inr(s.rate);
    box.appendChild(nm); box.appendChild(pr);
    var q = document.createElement("input"); q.type = "number"; q.min = 1; q.max = 20; q.value = 1;
    q.className = "qty"; q.setAttribute("aria-label", "Quantity for " + s.name);
    l.appendChild(c); l.appendChild(box); l.appendChild(q);
    c.addEventListener("change", function () {
      if (c.checked) sel[i] = Math.max(1, parseInt(q.value, 10) || 1); else delete sel[i];
      l.classList.toggle("on", c.checked); update();
    });
    q.addEventListener("input", function () { var v = Math.min(20, Math.max(1, parseInt(q.value, 10) || 1)); if (c.checked) { sel[i] = v; update(); } });
    $("svcList").appendChild(l);
  });

  function items() {
    var out = [];
    Object.keys(sel).sort(function (a, b) { return a - b; }).forEach(function (k) { out.push({ desc: S[k].name, qty: sel[k], rate: S[k].rate }); });
    custom.forEach(function (c) { out.push({ desc: c.desc, qty: 1, rate: c.amount }); });
    return out;
  }
  function update() {
    var its = items(), total = 0, box = $("sumList"); box.innerHTML = "";
    if (!its.length) { var e = document.createElement("li"); e.className = "empty"; e.textContent = "No services selected yet."; box.appendChild(e); }
    its.forEach(function (it) {
      var li = document.createElement("li"), a = document.createElement("span"), b = document.createElement("b");
      a.textContent = it.desc + (it.qty > 1 ? "  x" + it.qty : ""); b.textContent = inr(it.rate * it.qty); total += it.rate * it.qty;
      li.appendChild(a); li.appendChild(b); box.appendChild(li);
    });
    $("sumTotal").textContent = inr(total);
  }
  function msg(t) { $("eMsg").textContent = t; }

  function renderCustom() {
    var ul = $("cList"); ul.innerHTML = "";
    custom.forEach(function (c, i) {
      var li = document.createElement("li"), s = document.createElement("span"), x = document.createElement("button");
      s.textContent = c.desc + " - " + inr(c.amount);
      x.type = "button"; x.textContent = "\u00d7"; x.setAttribute("aria-label", "Remove");
      x.addEventListener("click", function () { custom.splice(i, 1); renderCustom(); update(); });
      li.appendChild(s); li.appendChild(x); ul.appendChild(li);
    });
  }
  $("cDesc").maxLength = 60; $("cAmt").max = 500000;
  $("cAdd").addEventListener("click", function () {
    var d = $("cDesc").value.replace(/\s{2,}/g, " ").trim(), a = $("cAmt").value.trim();
    if (d.length < 3) { $("cDesc").focus(); msg("Describe the extra work (at least 3 letters)."); return; }
    if (a === "" || isNaN(Number(a)) || Number(a) <= 0 || Number(a) > 500000) { $("cAmt").focus(); msg("Enter an amount between 1 and 5,00,000."); return; }
    if (custom.length >= 10) { msg("You can add up to 10 extra works."); return; }
    msg(""); custom.push({ desc: d, amount: Math.round(Number(a)) });
    $("cDesc").value = ""; $("cAmt").value = ""; renderCustom(); update();
  });

  function data() {
    var n = new Date(), p = function (x) { return String(x).padStart(2, "0"); };
    return {
      no: "EST-" + String(n.getFullYear()).slice(2) + p(n.getMonth() + 1) + p(n.getDate()) + "-" + p(n.getHours()) + p(n.getMinutes()),
      date: n.getFullYear() + "-" + p(n.getMonth() + 1) + "-" + p(n.getDate()),
      customer: $("eName").value.trim(), phone: $("ePhone").value.trim(),
      vehicle: $("eVeh").value.trim(), vehicleNo: $("eNo").value.trim(), kms: $("eKm").value.trim(),
      remarks: $("eRem").value, items: items()
    };
  }
  function ready() {
    msg("");
    if (!items().length) { msg("Please select at least one service."); return false; }
    if (!window.IM.checkAll(["eName", "ePhone", "eVeh", "eNo", "eKm"])) { msg("Please correct the highlighted fields."); return false; }
    return true;
  }
  function loadLogo(cb) {
    if (logo) return cb(logo);
    fetch("assets/img/logo-pdf.jpg").then(function (r) { return r.blob(); }).then(function (b) {
      var fr = new FileReader(); fr.onload = function () { logo = fr.result; cb(logo); }; fr.readAsDataURL(b);
    }).catch(function () { cb(null); });
  }
  $("eDl").addEventListener("click", function () {
    if (!ready()) return; var d = data();
    if (!window.jspdf || !window.buildEstimatePDF) { msg("PDF tool did not load. Please refresh and try again."); return; }
    loadLogo(function (lg) {
      try { window.buildEstimatePDF(window.jspdf.jsPDF, d, lg).save("Intech-Motors-" + d.no + ".pdf"); msg("Your estimate PDF is downloading."); }
      catch (e) { msg("Could not create the PDF. Please try again."); }
    });
  });
  $("eWa").addEventListener("click", function () {
    if (!ready()) return; var d = data();
    var t = "Hello Intech Motors, I would like a service estimate.\nName: " + d.customer + "\nPhone: " + d.phone + "\n";
    if (d.vehicle || d.vehicleNo) t += "Vehicle: " + d.vehicle + " " + d.vehicleNo + (d.kms ? " (" + d.kms + " km)" : "") + "\n";
    t += "\nServices:\n"; var tot = 0;
    d.items.forEach(function (it) { t += "- " + it.desc + (it.qty > 1 ? " x" + it.qty : "") + " : " + inr(it.rate * it.qty) + "\n"; tot += it.rate * it.qty; });
    t += "\nApprox. total: " + inr(tot); if (d.remarks.trim()) t += "\nRemarks: " + d.remarks.trim();
    window.open("https://wa.me/919500165968?text=" + encodeURIComponent(t), "_blank");
  });
  update();
})();
