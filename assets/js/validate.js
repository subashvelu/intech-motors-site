/* Input limits and checks for the public forms. */
(function () {
  var IM = window.IM = { fields: {} };
  IM.clean = {
    name:  function (v) { return v.replace(/[^\p{L}\p{M} .'\-]/gu, "").replace(/\s{2,}/g, " ").slice(0, 40); },
    phone: function (v) { var d = String(v).replace(/\D/g, ""); if (d.length > 10 && d.slice(0, 2) === "91") d = d.slice(-10); return d.slice(0, 10); },
    veh:   function (v) { return v.replace(/[^\p{L}\p{M}\p{N} .\-\/]/gu, "").replace(/\s{2,}/g, " ").slice(0, 30); },
    vno:   function (v) { return v.toUpperCase().replace(/[^A-Z0-9 \-]/g, "").replace(/\s{2,}/g, " ").slice(0, 13); },
    km:    function (v) { return v.replace(/\D/g, "").slice(0, 7); },
    text:  function (v) { return v.slice(0, 300); }
  };
  IM.check = {
    name:  function (v) { return v.trim().length >= 2 ? "" : "Please enter your name (at least 2 letters)."; },
    phone: function (v) { return /^[6-9]\d{9}$/.test(v) ? "" : "Enter a valid 10-digit mobile number."; },
    vno:   function (v) { return /^[A-Z0-9][A-Z0-9 \-]{4,12}$/.test(v) ? "" : "Enter a valid vehicle number, e.g. TN 06 AC 1606."; },
    km:    function (v) { return Number(v) > 0 ? "" : "Enter the KMs driven as a number."; }
  };
  IM.bind = function (id, cleanFn, checkFn, required, maxLen) {
    var el = document.getElementById(id); if (!el) return;
    if (maxLen) el.maxLength = maxLen;
    var err = document.createElement("small"); err.className = "ferr"; err.setAttribute("role", "alert"); el.parentNode.insertBefore(err, el.nextSibling);
    var cnt = null;
    if (el.tagName === "TEXTAREA") { cnt = document.createElement("small"); cnt.className = "cnt"; el.parentNode.insertBefore(cnt, err.nextSibling); }
    function show(m) { err.textContent = m; if (m) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); return !m; }
    function run() { var v = el.value; if (!v.trim()) return show(required ? "This field is required." : ""); return show(checkFn ? checkFn(v) : ""); }
    el.addEventListener("input", function () {
      var n = cleanFn ? cleanFn(el.value) : el.value; if (n !== el.value) el.value = n;
      if (cnt) cnt.textContent = el.value.length + " / " + (maxLen || 300);
      if (el.getAttribute("aria-invalid")) run();
    });
    el.addEventListener("blur", run);
    if (cnt) cnt.textContent = "0 / " + (maxLen || 300);
    IM.fields[id] = { el: el, run: run };
  };
  IM.checkAll = function (ids) {
    var bad = null; ids.forEach(function (id) { var f = IM.fields[id]; if (f && !f.run() && !bad) bad = f.el; });
    if (bad) bad.focus(); return !bad;
  };
  // estimate form
  IM.bind("eName", IM.clean.name, IM.check.name, true, 40);
  IM.bind("ePhone", IM.clean.phone, IM.check.phone, true, 10);
  IM.bind("eVeh", IM.clean.veh, null, false, 30);
  IM.bind("eNo", IM.clean.vno, IM.check.vno, false, 13);
  IM.bind("eKm", IM.clean.km, IM.check.km, false, 7);
  IM.bind("eRem", IM.clean.text, null, false, 300);
  // booking form
  IM.bind("n", IM.clean.name, IM.check.name, true, 40);
  IM.bind("p", IM.clean.phone, IM.check.phone, true, 10);
  IM.bind("v", IM.clean.veh, null, false, 30);
  IM.bind("m", IM.clean.text, null, false, 300);
  var f = document.getElementById("f");
  if (f) {
    f.noValidate = true;
    f.addEventListener("submit", function (e) {
      if (!IM.checkAll(["n", "p", "v"])) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
  }
  ["ePhone", "p"].forEach(function (id) { var e = document.getElementById(id); if (e) { e.setAttribute("inputmode", "numeric"); e.setAttribute("autocomplete", "tel-national"); } });
  ["eKm"].forEach(function (id) { var e = document.getElementById(id); if (e) e.setAttribute("inputmode", "numeric"); });
})();
